import React, { useEffect, useRef, useState } from 'react';
import { UserIcon, PlusIcon, XMarkIcon, CurrencyRupeeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AddNewMember = ({ members, setMembers, setShowModal, eventTotalBudget, existingMembersCount }) => {
  const [newMember, setNewMember] = useState({ 
    name: "", 
    email: "",
    expectedAmount: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  // Auto-calculate expected amount based on total budget and members count
  const calculateExpectedAmount = () => {
    if (eventTotalBudget && existingMembersCount !== undefined) {
      const newTotalMembers = existingMembersCount + 1;
      const calculatedAmount = Math.floor(eventTotalBudget / newTotalMembers);
      return calculatedAmount;
    }
    return "";
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setShowModal(false);
    });
    nameInputRef.current?.focus();
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") setShowModal(false);
      });
    };
  }, [setShowModal]);

  const validate = () => {
    const newErrors = {};
    
    if (!newMember.name.trim()) {
      newErrors.name = "Name is required";
    } else if (newMember.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (newMember.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }
    
    if (!newMember.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(newMember.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (members.some(m => m.email.toLowerCase() === newMember.email.toLowerCase())) {
      newErrors.email = "A member with this email already exists";
    }
    
    if (newMember.phone && !/^[0-9]{10}$/.test(newMember.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (newMember.expectedAmount) {
      const amount = parseFloat(newMember.expectedAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.expectedAmount = "Please enter a valid amount";
      } else if (amount > eventTotalBudget) {
        newErrors.expectedAmount = `Expected amount cannot exceed total budget (₹${eventTotalBudget.toLocaleString()})`;
      }
    }
    
    return newErrors;
  };

  const handleAddMember = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const expectedAmount = newMember.expectedAmount 
      ? parseFloat(newMember.expectedAmount) 
      : calculateExpectedAmount();
    
    const newMemberData = {
      id: Date.now(), // Better than members.length + 1
      name: newMember.name.trim(),
      email: newMember.email.trim().toLowerCase(),
      phone: newMember.phone || "",
      hasPaid: false,
      amount: 0,
      expectedAmount: expectedAmount,
      remainingAmount: expectedAmount,
      avatar: newMember.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      joinDate: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    
    setMembers([...members, newMemberData]);
    setNewMember({ name: "", email: "", expectedAmount: "", phone: "" });
    setShowModal(false);
    setIsSubmitting(false);
  };

  const suggestedAmount = calculateExpectedAmount();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content">
              <UserIcon className="h-5 w-5" />
            </div>
            Add New Member
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200 active:scale-95"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Full Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  ref={nameInputRef}
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.name ? 'border-error' : 'border-base-300'
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50`}
                  placeholder="Enter full name"
                  value={newMember.name}
                  onChange={(e) => {
                    setNewMember({ ...newMember, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                />
              </div>
              {errors.name && <p className="text-sm text-error mt-1 flex items-center gap-1"><XMarkIcon className="h-3 w-3" />{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.email ? 'border-error' : 'border-base-300'
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50`}
                  placeholder="member@example.com"
                  value={newMember.email}
                  onChange={(e) => {
                    setNewMember({ ...newMember, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                />
              </div>
              {errors.email && <p className="text-sm text-error mt-1 flex items-center gap-1"><XMarkIcon className="h-3 w-3" />{errors.email}</p>}
            </div>

            {/* Phone Input (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Phone Number <span className="text-base-content/40 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                className={`w-full px-4 py-2.5 bg-base-100 border ${
                  errors.phone ? 'border-error' : 'border-base-300'
                } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50`}
                placeholder="Enter 10-digit mobile number"
                value={newMember.phone}
                onChange={(e) => {
                  setNewMember({ ...newMember, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
              />
              {errors.phone && <p className="text-sm text-error mt-1 flex items-center gap-1"><XMarkIcon className="h-3 w-3" />{errors.phone}</p>}
            </div>

            {/* Expected Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-base-content/80 mb-1">
                Expected Contribution <span className="text-base-content/40 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="number"
                  className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                    errors.expectedAmount ? 'border-error' : 'border-base-300'
                  } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base-content placeholder:text-base-content/50`}
                  placeholder={`Suggested: ₹${suggestedAmount.toLocaleString()}`}
                  value={newMember.expectedAmount}
                  onChange={(e) => {
                    setNewMember({ ...newMember, expectedAmount: e.target.value });
                    if (errors.expectedAmount) setErrors({ ...errors, expectedAmount: null });
                  }}
                />
              </div>
              {suggestedAmount > 0 && !newMember.expectedAmount && (
                <p className="text-xs text-info mt-1 flex items-center gap-1">
                  💡 Suggested amount based on equal distribution: ₹{suggestedAmount.toLocaleString()}
                </p>
              )}
              {errors.expectedAmount && <p className="text-sm text-error mt-1">{errors.expectedAmount}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-base-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200 active:scale-95"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewMember;