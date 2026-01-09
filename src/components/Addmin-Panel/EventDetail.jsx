import { useState } from "react";
import AdminNumberDetail from "./AdminNumberDetail";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch} from "react-redux";
import { deleteEvent,updatePaidAmount,fullPayMember} from "../../redux/slices/eventsSlice";

const EventDetail = ({events,members}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const dispatch= useDispatch();
 
  // delete Event
  const handleDeleteEvent = (eventId) => {
    console.log(eventId);
    dispatch(deleteEvent(eventId))
    toast.success("Event delete successfully");
  };

  // partial Paid 
  const handlePartialPaid = (eventId, memberId,amountPaid) => {
    dispatch(updatePaidAmount({
    eventId, 
    memberId, 
    paidAmount: amountPaid,
}));
  }

  // Mark payment as paid
  const markPaymentAsPaid = (eventId, memberId) => {
    dispatch(fullPayMember({ eventId, memberId: memberId }));
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
  return (events.map(event => {
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
                    <AdminNumberDetail markPaymentAsPaid={markPaymentAsPaid} members={members} formatCurrency={formatCurrency} event={event} handleDeleteEvent={handleDeleteEvent} handlePartialPaid={handlePartialPaid} />
                    )}
                  </div>
                 
                );
              })
  )
}

export default EventDetail