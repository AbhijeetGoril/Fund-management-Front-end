import  { useState } from 'react'
import { CalendarIcon,PlusIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { addEvent } from "../../redux/eventsSlice";
import { useDispatch } from 'react-redux';
const CreateEventForm = ({setShowForm,members}) => {
    const dispatch = useDispatch()
   const [newEvent, setNewEvent] = useState({
      title: "",
      date: "",
      amount: "",
      description: ""
    });
   // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Create new fund event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    // Create payment records for all members
    const payments = members.map(member => ({
      memberId: member.id,
      amount: parseFloat(newEvent.amount),
      status: "pending",
      paidAmount:0,
      date: ""
    }));
    
    const event = {
      ...newEvent,
      amount: parseFloat(newEvent.amount),
      payments
    };
    
    dispatch(addEvent(event))
    setNewEvent({ title: "", date: "", amount: "", description: "" });
    setShowForm(false);
    toast.success("New event created");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Fund Event</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Building Maintenance, Festival Fund, etc."
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount per Member</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount in ₹"
                      value={newEvent.amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                      required
                    />
                    <span className="absolute left-3 top-3.5 text-gray-500">₹</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the purpose of this fund..."
                  value={newEvent.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Fund Event
              </button>
            </form>
          </div>
  )
}

export default CreateEventForm
