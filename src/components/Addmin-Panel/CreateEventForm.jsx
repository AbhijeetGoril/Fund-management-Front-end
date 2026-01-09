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

const CreateEventForm = ({ setShowModal, members = [] }) => {
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Create new event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create payment records for all members
      const payments = members.map(member => ({
        memberId: member.id,
        amount: parseFloat(newEvent.amount),
        status: "pending",
        paidAmount: 0,
        date: ""
      }));

      const eventData = {
        id: Date.now(), // Temporary ID, in real app this would come from backend
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
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to create event",error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "Maintenance", label: "Maintenance", color: "green" },
    { value: "Cultural", label: "Cultural", color: "blue" },
    { value: "Security", label: "Security", color: "purple" },
    { value: "Development", label: "Development", color: "emerald" },
    { value: "Emergency", label: "Emergency", color: "red" }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                <p className="text-blue-100 text-sm">Add a new event for your society</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateEvent} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Monthly Maintenance, Annual Function, Security Upgrade"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-12"
                  required
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount per Member *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={newEvent.amount}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-12"
                  required
                  min="0"
                  step="0.01"
                />
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Venue */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                placeholder="e.g., Community Hall, Society Office"
                value={newEvent.venue}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={newEvent.category}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
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

          {/* Members Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Members Information</span>
            </div>
            <p className="text-sm text-blue-700">
              This event will be automatically assigned to all {members.length} society members. 
              Each member will be required to pay ₹{newEvent.amount || '0'}.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                placeholder="Describe the purpose and details of this event..."
                value={newEvent.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              ></textarea>
              <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute top-4 right-4" />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-3 text-gray-700 font-medium rounded-2xl hover:bg-gray-100 transition-all duration-200 border border-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleCreateEvent}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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