import React, { useEffect, useRef, useState } from 'react';
import { UserIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AddNewMember = ({ members, setMembers, setShowModal }) => {
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setShowModal]);

  const validate = () => {
    const newErrors = {};
    if (!newMember.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!newMember.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newMember.email)) {
      newErrors.email = "Email is not valid";
    }
    return newErrors;
  };

  const handleAddMember = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const newMemberData = {
        id: members.length + 1,
        name: newMember.name,
        email: newMember.email,
        hasPaid: false,
        amount: 0,
        avatar: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        joinDate: new Date().toISOString().split('T')[0],
      };
      setMembers([...members, newMemberData]);
      setNewMember({ name: "", email: "" });
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-content/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            Add New Member
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 rounded-lg hover:bg-base-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50"
              placeholder="Enter full name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Email *</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50"
              placeholder="Enter email address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
            {errors.email && <p className="text-sm text-error mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            className="px-4 py-2 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMember;