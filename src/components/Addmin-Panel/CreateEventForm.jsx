import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  XMarkIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Loader } from '../Loader';
import { axiosInstance } from '../../lib/axois';

const CreateEventForm = ({
  setShowModal,
  societyId = null,
  societies = [],
  onEventCreated,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading]         = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    date:         '',
    location:     '',
    societyId:    societyId || '',   // ← matches backend field name
    budgetTarget: '',
    status:       'active',
  });

  // ── Field change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.title.trim()) {
      toast.error('Event title is required'); return false;
    }
    if (!form.date) {
      toast.error('Event date is required'); return false;
    }
    if (!form.location.trim()) {
      toast.error('Location is required'); return false;
    }
    if (form.budgetTarget === '') {
      toast.error('Budget target is required'); return false;
    }
    if (parseFloat(form.budgetTarget) < 0) {
      toast.error('Budget target cannot be negative'); return false;
    }
    if (!form.description.trim()) {
      toast.error('Description is required'); return false;
    }
    if (societies.length > 0 && !form.societyId) {
      toast.error('Please select a society'); return false;
    }
    return true;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload matching your backend exactly
    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      date:        new Date(form.date + 'T00:00:00Z').toISOString(),
      location:    form.location.trim(),
      budget:      parseFloat(form.budgetTarget) || 0,
      // only send societyId if it exists
      ...(form.societyId && { societyId: form.societyId }),
    };

    setLoading(true);
    const toastId = toast.loading('Creating event...');

    try {
      const { data } = await axiosInstance.post('/societies/events/createEvent', payload);

      // Backend returns the event object directly (not { success, event })
      toast.update(toastId, {
        render:    `🎉 "${data.title}" created successfully!`,
        type:      'success',
        isLoading: false,
        autoClose: 3000,
      });

      onEventCreated?.(data); // pass new event back to parent if needed
      setShowModal(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to create event. Please try again.';

      toast.update(toastId, {
        render:    msg,
        type:      'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  Create New Event
                </h2>
                <p className="text-primary-content/80 text-sm">All fields are required</p>
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

        {/* ── Form body ── */}
        <form
          id="create-event-form"
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
          noValidate
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-2">
              Event Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Annual Cultural Fest, Maintenance Campaign"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50 disabled:opacity-60"
            />
          </div>

          {/* Date + Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="e.g., Community Hall, Online, Main Building"
                value={form.location}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 pl-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Society (conditional) */}
          {societies.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Society <span className="text-error">*</span>
              </label>
              <div className="relative">
                <BuildingOfficeIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="societyId"
                  value={form.societyId}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-4 pl-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none text-base-content cursor-pointer disabled:opacity-60"
                >
                  <option value="">Select a society</option>
                  {societies.map((soc) => (
                    <option key={soc._id} value={soc._id}>{soc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

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
                placeholder="Describe the purpose, agenda, and other details of the event..."
                value={form.description}
                onChange={handleChange}
                disabled={loading || isSuggesting}
                rows="4"
                className="w-full p-4 pr-12 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-base-content placeholder:text-base-content/50 disabled:opacity-60"
              />
              <DocumentTextIcon className="h-5 w-5 text-base-content/40 absolute top-4 right-4 pointer-events-none" />
            </div>
            <p className="text-xs text-base-content/50 mt-1">
              Click "Suggest with AI" to auto-generate a description from the event title.
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
            form="create-event-form"
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
  );
};

export default CreateEventForm;