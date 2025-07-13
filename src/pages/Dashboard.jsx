// Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/20/solid";
import SummaryCard from "../components/SummaryCard";

const dummyMembers = [
  { id: 1, name: "Abhijeet", email: "abhijeet@gmail.com", hasPaid: true, amount: 500 },
  { id: 2, name: "Anjali", email: "anjali@gmail.com", hasPaid: false, amount: 0 },
  { id: 3, name: "Rohit", email: "rohit@gmail.com", hasPaid: true, amount: 800 },
  { id: 4, name: "Share", email: "share@gmail.com", hasPaid: false, amount: 0 },
  { id: 5, name: "Kavita", email: "kavita@gmail.com", hasPaid: true, amount: 600 },
  { id: 6, name: "Rahul", email: "rahul@gmail.com", hasPaid: false, amount: 0 },
];

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [errors,setErrors]=useState({})
  useEffect(() => {
    setTimeout(() => {
      setMembers(dummyMembers);
      setLoading(false);
    }, 800);
  }, []);


  const validation =()=>{
      const newErrors={}
      if(!newMember.name.trim()){ newErrors.name="Name is required"}
      else if (!newMember.email.trim()){ newErrors.email="Email is required"}
      else if (!/\S+@\S+\.\S+/.test(newMember.email)) {
      newErrors.email = "Email is not valid";
    }
    return newErrors
  }
  const handleAddMember = () => {
   
    const error =validation()
    
    if(!Object.keys(error).length==0){
  
      setErrors(error)
    }else{
    const newMemberData = {
      id: members.length + 1,
      name: newMember.name,
      email: newMember.email,
      hasPaid: false,
      amount: 0
    };
    
    setMembers([...members, newMemberData]);
    setNewMember({ name: "", email: "" });
    setShowModal(false);
  }
  };

  const markAsPaid = (id) => {
    const updatedMembers = members.map(member => 
      member.id === id ? { ...member, hasPaid: true, amount: 500 } : member
    );
    setMembers(updatedMembers);
  };

  const totalDonations = members.reduce((sum, member) => sum + member.amount, 0);
  const pendingPayments = members.filter(member => !member.hasPaid).length;
  const paidMembers = members.filter(member => member.hasPaid).length;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
              Add New Member
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
                          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}

              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
                          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}

              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">🏡</span>
              Society Management Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Manage society members, donations, and finances
            </p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm flex items-center border border-green-200">
            <div className="bg-green-500 w-3 h-3 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 font-medium">Active Society</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <SummaryCard 
            label="Total Members" 
            value={members.length} 
            icon={<UserIcon className="h-6 w-6 text-blue-500" />}
            color="blue"
          />
          <SummaryCard 
            label="Paid Members" 
            value={paidMembers} 
            icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
            color="green"
          />
          <SummaryCard 
            label="Total Donations" 
            value={`₹${totalDonations}`} 
            icon={<CurrencyRupeeIcon className="h-6 w-6 text-amber-500" />}
            color="amber"
          />
          <SummaryCard 
            label="Pending Payments" 
            value={pendingPayments} 
            icon={<XCircleIcon className="h-6 w-6 text-red-500" />}
            color="red"
          />
        </div>

        {/* Member List Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-4 border-b gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
              Society Members
            </h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Member
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center">
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Member</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600 hidden md:table-cell">Email</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition border-t">
                      <td className="p-3 md:p-4 font-medium text-gray-800">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500 md:hidden">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:p-4 text-gray-700 hidden md:table-cell">{member.email}</td>
                      <td className="p-3 md:p-4">
                        {member.hasPaid ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center w-fit">
                            <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center w-fit">
                            <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 font-medium text-gray-700">₹{member.amount}</td>
                      <td className="p-3 md:p-4">
                        {!member.hasPaid && (
                          <button
                            onClick={() => markAsPaid(member.id)}
                            className="px-3 py-1.5 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
                          >
                            <CheckIcon className="h-4 w-4 mr-1" /> Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 md:px-6 py-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {members.length} of {members.length} members
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Society Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;