import  { useState } from 'react';


import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
  
} from '@heroicons/react/24/outline';
import CreateEventForm from '../components/Addmin-Panel/CreateEventForm';
import EventDetail from '../components/Addmin-Panel/EventDetail';

import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';

const FundEventPanel = () => {
  // Dummy members data
  const [members] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com" },
    { id: 3, name: "Amit Patel", email: "amit@example.com" },
    { id: 4, name: "Sneha Gupta", email: "sneha@example.com" },
    { id: 5, name: "Vikram Singh", email: "vikram@example.com" },
    { id: 6, name: "Anjali Desai", email: "anjali@example.com" },
    { id: 7, name: "Rahul Verma", email: "rahul@example.com" },
    { id: 8, name: "Neha Joshi", email: "neha@example.com" },
  ]);

  // Fund events state
  const events=useSelector(state=>state.events)
  

  // Form state
  const [showForm, setShowForm] = useState(false);
 

  // Event details view
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <Navbar/>
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center">
            <CurrencyDollarIcon className="h-10 w-10 text-blue-600 mr-3" />
            Fund Event Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create fund events, track contributions, and manage society finances efficiently
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Members</h3>
              <p className="text-2xl font-bold text-blue-600">{members.length}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Fund Event
          </button>
        </div>

        {/* Create Event Form */}
        {showForm && (
          <CreateEventForm setShowForm={setShowForm} members={members} events={events} />
        )}

        {/* Fund Events List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Active Fund Events</h2>
            <p className="text-gray-600">{events.length} active events</p>
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <div className="bg-blue-50 rounded-full p-4 inline-block mb-4">
                <CurrencyDollarIcon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Active Fund Events</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first fund event to start collecting contributions from society members.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Fund Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
                <EventDetail events={events}  members={members} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-6">
          <p>© {new Date().getFullYear()} Society Fund Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FundEventPanel;