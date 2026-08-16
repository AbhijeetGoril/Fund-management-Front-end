import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";

const addMemberApi = async (payload) => {
  const { data } = await axiosInstance.post("/societies/addMember", payload);
  return data;
};

const AddSocietyMemberModal = ({ societyId, members = [], setShowModal, onSuccess }) => {
  const [mode, setMode] = useState(null); // null | "invite" | "offline"
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (mode) firstFieldRef.current?.focus();
    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setShowModal(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [setShowModal, mode]);

  const { mutateAsync: addMember, isPending } = useMutation({
    mutationFn: addMemberApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Success!", { position: "top-right" });
      onSuccess?.();
      setShowModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong.", {
        position: "top-right",
      });
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (mode === "invite") {
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(form.email))
        errs.email = "Please enter a valid email address";
      else if (members.some((m) => (m.user?.email ?? m.email ?? "").toLowerCase() === form.email.toLowerCase()))
        errs.email = "A member with this email already exists";
    } else if (mode === "offline") {
      if (!form.name.trim()) errs.name = "Name is required";
      if (form.email.trim() && !/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(form.email))
        errs.email = "Please enter a valid email address";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await addMember({
      societyId,
      name: form.name.trim() || undefined,
      email: form.email.trim() ? form.email.trim().toLowerCase() : undefined,
      phone: form.phone.trim() || undefined,
    });
  };

  const FieldError = ({ msg }) =>
    msg ? (
      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
        <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" />
        {msg}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content">
              <UserPlusIcon className="h-5 w-5" />
            </div>
            Add Member
          </h3>
          <button
            onClick={() => setShowModal(false)}
            disabled={isPending}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        {!mode && (
          <div className="space-y-2.5 pt-1">
            <p className="text-sm text-base-content/60 mb-1">How would you like to add this member?</p>

            <button
              type="button"
              onClick={() => setMode("invite")}
              className="group w-full flex items-center gap-3 p-4 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <PaperAirplaneIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base-content">Send Invitation</p>
                <p className="text-xs text-base-content/60 mt-0.5">They'll get an in-app invite to join.</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
            </button>

            <button
              type="button"
              onClick={() => setMode("offline")}
              className="group w-full flex items-center gap-3 p-4 rounded-xl border border-base-300 hover:border-secondary hover:bg-secondary/5 transition-all duration-200 text-left"
            >
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base-content">Add Offline Member</p>
                <p className="text-xs text-base-content/60 mt-0.5">No account needed — just their name.</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-base-content/30 group-hover:text-secondary group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          </div>
        )}

        {mode && (
          <>
            <button
              type="button"
              onClick={() => { setMode(null); setErrors({}); }}
              disabled={isPending}
              className="text-xs font-medium text-base-content/50 hover:text-base-content flex items-center gap-1 -mt-1"
            >
              <ArrowLeftIcon className="h-3 w-3" />
              Choose a different method
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "offline" && (
                <div>
                  <label className="block text-sm font-semibold text-base-content/80 mb-1">
                    Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      ref={firstFieldRef}
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={isPending}
                      className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                        errors.name ? "border-error" : "border-base-300"
                      } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                    />
                  </div>
                  <FieldError msg={errors.name} />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-base-content/80 mb-1">
                  Email {mode === "invite" ? <span className="text-error">*</span> : (
                    <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
                  )}
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  <input
                    ref={mode === "invite" ? firstFieldRef : undefined}
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={isPending}
                    className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                      errors.email ? "border-error" : "border-base-300"
                    } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
                  />
                </div>
                <FieldError msg={errors.email} />
              </div>

              {mode === "offline" && (
                <div>
                  <label className="block text-sm font-semibold text-base-content/80 mb-1">
                    Phone <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={isPending}
                      className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
                >
                  {isPending ? "Adding..." : mode === "invite" ? "Send Invite" : "Add Member"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSocietyMemberModal;