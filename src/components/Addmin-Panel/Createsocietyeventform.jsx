import { useState, useRef, useMemo } from 'react';
import {
  XMarkIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  MapPinIcon,
  SparklesIcon,
  PhotoIcon,
  TrashIcon,
  UsersIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Loader } from '../Loader';
import { axiosInstance } from '../../lib/axois';
import ModalPortal from '../ModalPortal';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';

/**
 * CreateSocietyEventForm
 *
 * Same base event-creation form as CreateEventForm, but always used
 * from inside a society context. Adds a required step for choosing
 * which society members should be added as event members:
 *   - "Add all members"        -> every current SocietyMember becomes an EventMember
 *   - "Choose specific members" -> admin picks individuals from a searchable list
 *
 * Backend contract (multipart/form-data to /societies/events/createEvent):
 *   societyId   -> string, the society this event belongs to
 *   memberMode  -> "all" | "select"
 *   memberIds   -> JSON stringified array of SocietyMember _ids (only when memberMode === "select")
 */
const CreateSocietyEventForm = ({
  societyId,
  societyMembers = [], // array of SocietyMember docs: { _id, user, name, email, role, ... }
  setShowModal,
  onEventCreated,
}) => {
  const [loading, setLoading]           = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile]       = useState(null);
  const fileInputRef                    = useRef(null);

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    date:         '',
    location:     '',
    budgetTarget: '',
  });

  // ── Society member inclusion ──────────────────────────────────────
  const [memberMode, setMemberMode]         = useState('all'); // "all" | "select"
  const [selectedMemberIds, setSelectedIds] = useState([]);
  const [memberSearch, setMemberSearch]     = useState('');

  const filteredMembers = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    if (!q) return societyMembers;
    return societyMembers.filter(
      (m) =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || m.user?.email || '').toLowerCase().includes(q)
    );
  }, [memberSearch, societyMembers]);

  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredMembers.map((m) => m._id);
    const allSelected = filteredIds.every((id) => selectedMemberIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !filteredIds.includes(id))
        : [...new Set([...prev, ...filteredIds])]
    );
  };

  // ── Field change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Cover photo ───────────────────────────────────────────────────
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── AI description ────────────────────────────────────────────────
  const handleAISuggest = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter an event title first');
      return;
    }
    setIsSuggesting(true);
    const toastId = toast.loading('✨ Generating description...');
    try {
      const { data } = await axiosInstance.post('/ai/suggest-description', {
        title: form.title.trim(),
      });
      if (!data.description) throw new Error('Invalid response from server');
      setForm((prev) => ({ ...prev, description: data.description }));
      toast.update(toastId, {
        render:    '✨ AI description generated!',
        type:      'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render:    err.response?.data?.message || err.message || 'Could not generate description',
        type:      'error',
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    if (!form.title.trim())                { toast.error('Event title is required');   return false; }
    if (!form.date)                        { toast.error('Event date is required');     return false; }
    if (!form.location.trim())             { toast.error('Location is required');       return false; }
    if (form.budgetTarget === '')          { toast.error('Budget target is required');  return false; }
    if (parseFloat(form.budgetTarget) < 0) { toast.error('Budget cannot be negative'); return false; }
    if (!form.description.trim())          { toast.error('Description is required');   return false; }
    if (memberMode === 'select' && selectedMemberIds.length === 0) {
      toast.error('Select at least one member, or choose "Add all members"');
      return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('title',       form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('date',        new Date(form.date + 'T00:00:00Z').toISOString());
    formData.append('location',    form.location.trim());
    formData.append('budget',      parseFloat(form.budgetTarget) || 0);
    if (coverFile) formData.append('coverPhoto', coverFile);

    formData.append('societyId', societyId);
    formData.append('memberMode', memberMode); // "all" | "select"
    if (memberMode === 'select') {
      formData.append('memberIds', JSON.stringify(selectedMemberIds));
    }

    setLoading(true);
    const toastId = toast.loading('Creating event...');

    try {
      const { data } = await axiosInstance.post(
        '/societies/events/createEvent',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.update(toastId, {
        render:    `🎉 "${data.title}" created successfully!`,
        type:      'success',
        isLoading: false,
        autoClose: 3000,
      });

      onEventCreated?.(data);
      setShowModal(false);
    } catch (err) {
      toast.update(toastId, {
        render:    err.response?.data?.message || err.message || 'Failed to create event',
        type:      'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-base-content/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-content/20 rounded-xl backdrop-blur-sm">
                  <CalendarIcon className="h-6 w-6 text-primary-content" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-content tracking-tight">
                    Create Society Event
                  </h2>
                  <p className="text-primary-content/80 text-sm">
                    Fill in the details below
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="p-2 hover:bg-primary-content/20 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6 text-primary-content" />
              </button>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <form
            id="create-society-event-form"
            onSubmit={handleSubmit}
            className="p-6 space-y-5 overflow-y-auto max-h-[60vh]"
            noValidate
          >
            {/* Cover photo */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Cover Photo{' '}
                <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>

              {coverPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-base-300 h-40">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-xl hover:bg-error/80 transition-colors"
                    aria-label="Remove cover photo"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-lg text-white text-xs truncate max-w-[80%]">
                    {coverFile?.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full h-32 border-2 border-dashed border-base-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <PhotoIcon className="h-8 w-8 text-base-content/30" />
                  <span className="text-sm text-base-content/50">
                    Click to upload a cover photo
                  </span>
                  <span className="text-xs text-base-content/30">
                    PNG, JPG, WEBP — max 5 MB
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Event Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Annual Cultural Fest"
                value={form.title}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50 disabled:opacity-60"
              />
            </div>

            {/* Date + Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Event Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <CalendarIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-4 pl-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Budget Target (₹) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <CurrencyRupeeIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    name="budgetTarget"
                    placeholder="0.00"
                    value={form.budgetTarget}
                    onChange={handleChange}
                    disabled={loading}
                    min="0"
                    step="0.01"
                    className="w-full p-4 pl-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Location <span className="text-error">*</span>
              </label>
              <div className="relative">
                <MapPinIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Community Hall, Online"
                  value={form.location}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-4 pl-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50 disabled:opacity-60"
                />
              </div>
            </div>

            {/* ── Society member inclusion — always shown, this form is society-only ── */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2 flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4" />
                Add Society Members to this Event
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                <button
                  type="button"
                  onClick={() => setMemberMode('all')}
                  disabled={loading}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    memberMode === 'all'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-base-300 hover:border-primary/40'
                  }`}
                >
                  <p className="font-semibold text-sm text-base-content">Add all members</p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {societyMembers.length} society member{societyMembers.length !== 1 ? 's' : ''} will be added
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMemberMode('select')}
                  disabled={loading}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    memberMode === 'select'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-base-300 hover:border-primary/40'
                  }`}
                >
                  <p className="font-semibold text-sm text-base-content">Choose specific members</p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    Pick who should be added
                  </p>
                </button>
              </div>

              {memberMode === 'select' && (
                <div className="border border-base-300 rounded-2xl overflow-hidden">
                  <div className="p-2.5 border-b border-base-200 bg-base-200/40 flex items-center gap-2">
                    <div className="relative flex-1">
                      <MagnifyingGlassIcon className="h-4 w-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Search members..."
                        disabled={loading}
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={toggleSelectAllFiltered}
                      disabled={loading || filteredMembers.length === 0}
                      className="text-xs font-medium text-primary hover:underline whitespace-nowrap disabled:opacity-40"
                    >
                      Select all
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-base-200">
                    {filteredMembers.length === 0 ? (
                      <p className="text-sm text-base-content/40 text-center py-6">
                        No members found
                      </p>
                    ) : (
                      filteredMembers.map((m) => {
                        const checked = selectedMemberIds.includes(m._id);
                        const email = m.email || m.user?.email || '';
                        return (
                          <button
                            type="button"
                            key={m._id}
                            onClick={() => toggleMember(m._id)}
                            disabled={loading}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-base-200/50 transition-colors text-left"
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-bold flex items-center justify-center shrink-0">
                              {initials(m.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-base-content truncate">
                                {m.name}
                              </p>
                              {email && (
                                <p className="text-xs text-base-content/45 truncate">{email}</p>
                              )}
                            </div>
                            <div
                              className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                checked ? 'bg-primary border-primary' : 'border-base-300'
                              }`}
                            >
                              {checked && <CheckIcon className="h-3.5 w-3.5 text-primary-content" />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {selectedMemberIds.length > 0 && (
                    <div className="px-3 py-2 bg-base-200/40 border-t border-base-200 text-xs text-base-content/60">
                      {selectedMemberIds.length} member{selectedMemberIds.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description + AI */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-base-content">
                  Description <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isSuggesting || loading}
                  className="h-9 px-3 bg-gradient-to-r from-accent to-secondary text-white text-sm font-medium rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {isSuggesting ? (
                    <>
                      <Loader size="sm" color="white" variant="spinner" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      Suggest with AI
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="Describe the purpose, agenda, and other details..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading || isSuggesting}
                  rows="4"
                  className="w-full p-4 pr-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-base-content placeholder:text-base-content/50 disabled:opacity-60"
                />
                <DocumentTextIcon className="h-5 w-5 text-base-content/40 absolute top-4 right-4 pointer-events-none" />
              </div>
              <p className="text-xs text-base-content/50 mt-1">
                Click "Suggest with AI" to auto-generate a description from the title.
              </p>
            </div>
          </form>

          {/* ── Footer ── */}
          <div className="px-6 py-4 bg-base-200/50 border-t border-base-300 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="h-11 px-6 text-base-content font-medium rounded-2xl hover:bg-base-300 transition-all duration-200 border border-base-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-society-event-form"
              disabled={loading || isSuggesting}
              className="h-11 px-6 bg-gradient-to-r from-primary to-secondary text-primary-content font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              style={{ minWidth: '140px' }}
            >
              {loading ? (
                <>
                  <Loader size="sm" color="primary-content" variant="spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-5 w-5" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default CreateSocietyEventForm;