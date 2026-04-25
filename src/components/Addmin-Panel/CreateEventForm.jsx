import { useState } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { addEvent } from "../../redux/slices/eventsSlice";
import { useDispatch } from 'react-redux';
import { Loader } from '../Loader';

const CreateEventForm = ({ setShowForm, members = [] }) => {
  const dispatch = useDispatch();
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    venue: "",
    totalMembers: members.length,
    amount: "",
    description: "",
    category: "Maintenance",
    color: "blue"
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payments = members.map(member => ({
        memberId: member.id,
        amount: parseFloat(newEvent.amount),
        status: "pending",
        paidAmount: 0,
        date: ""
      }));

      const eventData = {
        id: Date.now(),
        name: newEvent.name,
        date: newEvent.date,
        venue: newEvent.venue,
        totalMembers: members.length,
        paidMembers: 0,
        totalCollected: 0,
        pendingPayments: members.length,
        status: "active",
        progress: 0,
        category: newEvent.category,
        color: newEvent.color,
        amount: parseFloat(newEvent.amount),
        description: newEvent.description,
        payments
      };

      dispatch(addEvent(eventData));
      toast.success("🎉 Event created successfully!");
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to create event", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "Maintenance", label: "Maintenance", color: "success" },
    { value: "Cultural", label: "Cultural", color: "primary" },
    { value: "Security", label: "Security", color: "secondary" },
    { value: "Development", label: "Development", color: "accent" },
    { value: "Emergency", label: "Emergency", color: "error" }
  ];

  return (
    <div className="fixed inset-0 bg-base-content/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-content/20 rounded-xl backdrop-blur-sm">
                <CalendarIcon className="h-6 w-6 text-primary-content" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary-content tracking-tight">Create New Event</h2>
                <p className="text-primary-content/80 text-sm">Add a new event for your society</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-primary-content/20 rounded-xl transition-all duration-200"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-primary-content" />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleCreateEvent} className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-2">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Monthly Maintenance, Annual Function, Security Upgrade"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Due Date *
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

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Amount per Member *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={newEvent.amount}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pl-12 text-base-content placeholder:text-base-content/50"
                  required
                  min="0"
                  step="0.01"
                />
                <CurrencyRupeeIcon className="h-5 w-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Venue */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                placeholder="e.g., Community Hall, Society Office"
                value={newEvent.venue}
                onChange={handleInputChange}
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Category *
              </label>
              <select
                name="category"
                value={newEvent.category}
                onChange={handleInputChange}
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none text-base-content cursor-pointer"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Info - Styled with theme colors */}
          <div className="bg-base-200/80 border border-base-300 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <UserGroupIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base-content">Members Information</span>
            </div>
            <p className="text-sm text-base-content/70">
              This event will be automatically assigned to all {members.length} society members. 
              Each member will be required to pay ₹{newEvent.amount || '0'}.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                placeholder="Describe the purpose and details of this event..."
                value={newEvent.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 bg-base-100 border border-base-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-base-content placeholder:text-base-content/50"
              ></textarea>
              <DocumentTextIcon className="h-5 w-5 text-base-content/40 absolute top-4 right-4 pointer-events-none" />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-base-200/50 backdrop-blur-sm border-t border-base-300 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
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