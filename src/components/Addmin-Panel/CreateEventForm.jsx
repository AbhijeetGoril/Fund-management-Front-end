import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  XMarkIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { addEvent } from '../../redux/slices/eventsSlice';
import { Loader } from '../Loader';

const CreateEventForm = ({ setShowModal, societyId = null, societies = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    society: societyId || '',
    budgetTarget: '',
    status: 'active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- Client-side required field validations ---
    if (!newEvent.title.trim()) {
      toast.error('Event title is required');
      setLoading(false);
      return;
    }

    if (!newEvent.date) {
      toast.error('Event date is required');
      setLoading(false);
      return;
    }

    if (!newEvent.location.trim()) {
      toast.error('Location is required');
      setLoading(false);
      return;
    }

    if (newEvent.budgetTarget === '' || newEvent.budgetTarget === null) {
      toast.error('Budget target is required');
      setLoading(false);
      return;
    }

    if (parseFloat(newEvent.budgetTarget) < 0) {
      toast.error('Budget target cannot be negative');
      setLoading(false);
      return;
    }

    if (!newEvent.description.trim()) {
      toast.error('Description is required');
      setLoading(false);
      return;
    }

    if (societies.length > 0 && !newEvent.society) {
      toast.error('Please select a society');
      setLoading(false);
      return;
    }

    // Build event object matching Mongoose schema
    let eventDate;
    if (newEvent.date) {
      eventDate = new Date(newEvent.date + 'T00:00:00Z').toISOString();
    } else {
      eventDate = new Date().toISOString();
    }

    const eventData = {
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      date: eventDate,
      location: newEvent.location.trim(),
      society: newEvent.society || null,
      createdBy: user?._id,
      budget: {
        target: parseFloat(newEvent.budgetTarget) || 0,
      },
      status: newEvent.status,
    };

    try {
      await dispatch(addEvent(eventData)).unwrap();
      toast.success('🎉 Event created successfully!');
      setShowModal(false);
    } catch (error) {
      toast.error(error?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-content/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">

        {/* Header */}
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
                <p className="text-primary-content/80 text-sm">
                  All fields are required
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-primary-content/20 rounded-xl transition-all duration-200"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-primary-content" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCreateEvent}
          className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar"
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
              value={newEvent.title}
              onChange={handleInputChange}
              className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Event Date <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pl-12 text-base-content"
                  required
                />
                <CalendarIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Budget Target */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Budget Target (₹) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="budgetTarget"
                  placeholder="0.00"
                  value={newEvent.budgetTarget}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pl-12 text-base-content placeholder:text-base-content/50"
                  min="0"
                  step="0.01"
                  required
                />
                <CurrencyRupeeIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-2">
              Location <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                placeholder="e.g., Community Hall, Online, Main Building"
                value={newEvent.location}
                onChange={handleInputChange}
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pl-12 text-base-content placeholder:text-base-content/50"
                required
              />
              <MapPinIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Society Selection */}
          {societies.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Society <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="society"
                  value={newEvent.society}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none text-base-content cursor-pointer pl-12"
                  required
                >
                  <option value="">Select a society</option>
                  {societies.map((soc) => (
                    <option key={soc._id} value={soc._id}>
                      {soc.name}
                    </option>
                  ))}
                </select>
                <BuildingOfficeIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-2">
              Description <span className="text-error">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                placeholder="Describe the purpose, agenda, and other details of the event..."
                value={newEvent.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-base-content placeholder:text-base-content/50"
                required
              />
              <DocumentTextIcon className="h-5 w-5 text-base-content/40 absolute top-4 right-4 pointer-events-none" />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-base-200/50 backdrop-blur-sm border-t border-base-300 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-3 text-base-content font-medium rounded-2xl hover:bg-base-300 transition-all duration-200 border border-base-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleCreateEvent}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 min-w-[140px] justify-center"
          >
            {loading ? (
              <>
                <Loader size="sm" color="primary-content" variant="spinner" />
                <span>Creating...</span>
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
