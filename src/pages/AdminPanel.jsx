import React, { useState } from 'react';
import PaymentTable from '../components/PaymentTable';

import { 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  UserIcon
} from '@heroicons/react/24/outline';

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
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Building Maintenance Fund",
      date: "2023-10-15",
      amount: 5000,
      description: "Funds for building painting and repairs",
      payments: [
        { memberId: 1, amount: 5000, status: "paid", date: "2023-10-10" },
        { memberId: 2, amount: 5000, status: "paid", date: "2023-10-12" },
        { memberId: 3, amount: 5000, status: "pending", date: "" },
        { memberId: 4, amount: 5000, status: "paid", date: "2023-10-14" },
        { memberId: 5, amount: 5000, status: "pending", date: "" },
        { memberId: 6, amount: 5000, status: "paid", date: "2023-10-11" },
        { memberId: 7, amount: 5000, status: "pending", date: "" },
        { memberId: 8, amount: 5000, status: "paid", date: "2023-10-13" },
      ]
    },
    {
      id: 2,
      title: "Festival Celebration Fund",
      date: "2023-12-01",
      amount: 3000,
      description: "Funds for Diwali celebration and decorations",
      payments: [
        { memberId: 1, amount: 3000, status: "paid", date: "2023-11-25" },
        { memberId: 2, amount: 3000, status: "pending", date: "" },
        { memberId: 3, amount: 3000, status: "paid", date: "2023-11-28" },
        { memberId: 4, amount: 3000, status: "paid", date: "2023-11-27" },
        { memberId: 5, amount: 3000, status: "pending", date: "" },
        { memberId: 6, amount: 3000, status: "paid", date: "2023-11-29" },
        { memberId: 7, amount: 3000, status: "paid", date: "2023-11-26" },
        { memberId: 8, amount: 3000, status: "pending", date: "" },
      ]
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    amount: "",
    description: ""
  });

  // Event details view
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      date: ""
    }));
    
    const event = {
      id: events.length + 1,
      ...newEvent,
      amount: parseFloat(newEvent.amount),
      payments
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: "", date: "", amount: "", description: "" });
    setShowForm(false);
  };

  // Mark payment as paid
  const markPaymentAsPaid = (eventId, memberId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedPayments = event.payments.map(payment => {
          if (payment.memberId === memberId) {
            return { ...payment, status: "paid", date: new Date().toISOString().split('T')[0] };
          }
          return payment;
        });
        return { ...event, payments: updatedPayments };
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate event statistics
  const calculateEventStats = (event) => {
    const totalMembers = event.payments.length;
    const paidMembers = event.payments.filter(p => p.status === "paid").length;
    const pendingMembers = totalMembers - paidMembers;
    const amountCollected = paidMembers * event.amount;
    const totalAmount = totalMembers * event.amount;
    const percentageCollected = (amountCollected / totalAmount) * 100;
    
    return {
      totalMembers,
      paidMembers,
      pendingMembers,
      amountCollected,
      totalAmount,
      percentageCollected
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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
              {events.map(event => {
                const stats = calculateEventStats(event);
                
                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                            Due: {formatDate(event.date)}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Amount per member</div>
                          <div className="text-xl font-bold text-blue-600">{formatCurrency(event.amount)}</div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Collection Progress</span>
                          <span>{stats.percentageCollected.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${stats.percentageCollected}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatCurrency(stats.amountCollected)} collected</span>
                          <span>{formatCurrency(stats.totalAmount)} total</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-5 text-center">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{stats.paidMembers}</div>
                          <div className="text-sm text-gray-600">Paid</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-yellow-700">{stats.pendingMembers}</div>
                          <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{stats.totalMembers}</div>
                          <div className="text-sm text-gray-600">Total</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="bg-gray-50 px-5 py-3 border-t">
                      <button 
                        className="w-full text-center text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center"
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                      >
                        {selectedEvent?.id === event.id ? "Hide Details" : "View Payment Details"}
                        <svg 
                          className={`ml-2 w-4 h-4 transition-transform ${selectedEvent?.id === event.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Payment Details */}
                    {selectedEvent?.id === event.id && (
                      <div className="border-t">
                        <div className="p-5">
                          <h4 className="font-semibold text-gray-800 mb-4">Member Payment Status</h4>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-3 text-sm font-medium text-gray-600">Member</th>
                                  <th className="p-3 text-sm font-medium text-gray-600">Amount</th>
                                  <th className="p-3 text-sm font-medium text-gray-600">Status</th>
                                  <th className="p-3 text-sm font-medium text-gray-600">Payment Date</th>
                                  <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {event.payments.map(payment => {
                                  const member = members.find(m => m.id === payment.memberId);
                                  return (
                                    <tr key={payment.memberId} className="border-t hover:bg-gray-50">
                                      <td className="p-3">
                                        <div className="flex items-center">
                                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-gray-500" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-800">{member?.name}</div>
                                            <div className="text-xs text-gray-500">{member?.email}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 font-medium text-gray-700">{formatCurrency(payment.amount)}</td>
                                      <td className="p-3">
                                        {payment.status === "paid" ? (
                                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center w-fit">
                                            <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                                          </span>
                                        ) : (
                                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center w-fit">
                                            <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3 text-sm text-gray-600">{payment.date || "-"}</td>
                                      <td className="p-3">
                                        {payment.status === "pending" && (
                                          <button
                                            onClick={() => markPaymentAsPaid(event.id, payment.memberId)}
                                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                                          >
                                            Mark as Paid
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 px-5 py-3 border-t flex justify-between">
                          <button className="text-gray-600 hover:text-gray-800 flex items-center">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Export Report
                          </button>
                          <div className="flex space-x-2">
                            <button className="text-gray-600 hover:text-gray-800 flex items-center">
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 flex items-center">
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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