// Dashboard.jsx
import  { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/20/solid";
import SummaryCard from "../components/SummaryCard";
import AddNewMumber from "../components/DashBorad/AddNewMumber";
import { Loader } from "../components/Loader";
import NumbersDetail from "../components/NumbersDetail";
import Navbar from "../components/NavBar";
import { useSelector } from "react-redux";

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
  const event=useSelector((state)=>state.events)
  console.log(event)

  useEffect(() => {
    setTimeout(() => {
      setMembers(dummyMembers);
      setLoading(false);
    }, 800);
  }, []);


  

  

  const totalDonations = members.reduce((sum, member) => sum + member.amount, 0);
  const pendingPayments = members.filter(member => !member.hasPaid).length;
  const paidMembers = members.filter(member => member.hasPaid).length;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Add Member Modal */}
      <Navbar/>
      {showModal && (<AddNewMumber members={members} setMembers ={setMembers} setShowModal={setShowModal}/>
      )}

      <div className="max-w-7xl mx-auto mt-2">
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
            // Add Loading components
            <Loader/>
          ) : (
            <NumbersDetail members={members} setMembers={setMembers} />
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