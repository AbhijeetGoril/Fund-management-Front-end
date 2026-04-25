import { useState } from 'react';

import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import CreateEventForm from '../components/Addmin-Panel/CreateEventForm';
import EventDetail from '../components/Addmin-Panel/EventDetail';

import Navbar from "../components/Navbar/Navbar";
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
  const events = useSelector(state => state.events);

  // Form state
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 font-sans antialiased">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4 flex items-center justify-center gap-3 tracking-tight">
            <CurrencyDollarIcon className="h-10 w-10 text-primary" />
            Fund Event Management
          </h1>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Create fund events, track contributions, and manage society finances efficiently
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-4 bg-base-100/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm border border-base-200">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <UserGroupIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-base-content/60 uppercase tracking-wide">Total Members</h3>
              <p className="text-3xl font-bold text-base-content">{members.length}</p>
            </div>
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-base-content tracking-tight">Active Fund Events</h2>
            <p className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
              {events.length} active events
            </p>
          </div>

          {events.length === 0 ? (
            <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-md p-12 text-center border border-base-200">
              <div className="bg-primary/10 rounded-full p-4 inline-block mb-5">
                <CurrencyDollarIcon className="h-14 w-14 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Active Fund Events</h3>
              <p className="text-base-content/60 mb-8 max-w-md mx-auto">
                Create your first fund event to start collecting contributions from society members.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-primary text-primary-content font-medium rounded-xl hover:bg-primary/90 transition flex items-center mx-auto shadow-sm hover:shadow"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Fund Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <EventDetail events={events} members={members} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-base-content/40 text-sm pt-8 border-t border-base-200">
          <p>© {new Date().getFullYear()} Society Fund Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FundEventPanel;