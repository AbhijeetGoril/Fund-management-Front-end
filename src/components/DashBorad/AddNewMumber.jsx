import React, { useEffect, useRef, useState } from 'react'
import { UserIcon,PlusIcon } from '@heroicons/react/20/solid';
const AddNewMumber = ({members,setMembers,setShowModal}) => {
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [errors,setErrors]=useState({})
  const showModel=useRef(null)
  useEffect(()=>{
    const handleOutSide=(event)=>{
      if(showModel.current && !showModel.current.contains(event.target)){
        setShowModal(false)
      }
    }
    document.addEventListener("mousedown",handleOutSide)
  return () => {
    document.removeEventListener("mousedown", handleOutSide);
  };
  },[])

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
  return (
    <div   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={showModel} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
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
                  placeholder="Enter names"
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
  )
}

export default AddNewMumber

