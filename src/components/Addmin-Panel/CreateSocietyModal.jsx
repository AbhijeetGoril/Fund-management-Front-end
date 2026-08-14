import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  XMarkIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  PhotoIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Residential",
  "Apartment Complex",
  "Gated Community",
  "Housing Society",
  "Cooperative Society",
  "Other",
];

const createSocietyApi = async (fd) => {
  const { data } = await axiosInstance.post("/societies/createSociety", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const CreateSocietyModal = ({ setShowModal, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    privacy: "public",
    membershipPolicy: "approval_required",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    firstFieldRef.current?.focus();
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
  }, [setShowModal]);

  const { mutate: createSociety } = useMutation({
    mutationFn: createSocietyApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mySocieties"] });
      toast.success(data?.message || "Society created!", { position: "top-right" });
      onCreated?.(data.society);
      setShowModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not create society.", {
        position: "top-right",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, logo: "Please select an image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: "Image must be under 5MB." }));
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, logo: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Society name is required";
    else if (form.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    if (!form.category) errs.category = "Please select a category";
    if (!form.location.trim()) errs.location = "Location is required";
    if (form.description.length > 500) errs.description = "Description must be under 500 characters";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("category", form.category);
    fd.append("description", form.description.trim());
    fd.append("location", form.location.trim());
    fd.append("privacy", form.privacy);
    fd.append("membershipPolicy", form.membershipPolicy);
    if (logoFile) fd.append("logo", logoFile);

    setIsSubmitting(true);
    createSociety(fd);
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
      <div
        ref={modalRef}
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content">
              <BuildingLibraryIcon className="h-5 w-5" />
            </div>
            Create Society
          </h3>
          <button
            onClick={() => setShowModal(false)}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg hover:bg-base-200 transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-base-content/60" />
          </button>
        </div>

        <p className="text-sm text-base-content/60 -mt-1">
          You'll automatically become the admin of this society.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">
              Society Name <span className="text-error">*</span>
            </label>
            <input
              ref={firstFieldRef}
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Green Valley Residents"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-base-100 border ${
                errors.name ? "border-error" : "border-base-300"
              } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
            />
            <FieldError msg={errors.name} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">
              Category <span className="text-error">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-base-100 border ${
                errors.category ? "border-error" : "border-base-300"
              } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError msg={errors.category} />
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="block text-sm font-semibold text-base-content/80">
                Description <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
              </label>
              <span className={`text-[11px] ${form.description.length > 500 ? "text-error" : "text-base-content/35"}`}>
                {form.description.length}/500
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Briefly describe your society..."
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-base-100 border ${
                errors.description ? "border-error" : "border-base-300"
              } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none`}
            />
            <FieldError msg={errors.description} />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">
              Location <span className="text-error">*</span>
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Sector 62, Noida"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-base-100 border ${
                  errors.location ? "border-error" : "border-base-300"
                } rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200`}
              />
            </div>
            <FieldError msg={errors.location} />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-1">
              Society Logo <span className="text-base-content/40 text-xs font-normal">(Optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isSubmitting}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="w-full flex items-center gap-3 p-3 border border-dashed border-base-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-12 w-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                  <PhotoIcon className="h-6 w-6 text-base-content/40" />
                </div>
              )}
              <span className="text-sm text-base-content/60">
                {logoPreview ? "Change logo" : "Upload Logo"}
              </span>
            </button>
            <FieldError msg={errors.logo} />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-2">Privacy</label>
            <div className="flex gap-4">
              {[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value={opt.value}
                    checked={form.privacy === opt.value}
                    onChange={(e) => handleChange("privacy", e.target.value)}
                    disabled={isSubmitting}
                    className="radio radio-primary radio-sm"
                  />
                  <span className="text-sm text-base-content">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Membership */}
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-2">Membership</label>
            <div className="flex flex-col gap-2">
              {[
                { value: "open", label: "Anyone can join" },
                { value: "approval_required", label: "Admin approval required" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="membershipPolicy"
                    value={opt.value}
                    checked={form.membershipPolicy === opt.value}
                    onChange={(e) => handleChange("membershipPolicy", e.target.value)}
                    disabled={isSubmitting}
                    className="radio radio-primary radio-sm"
                  />
                  <span className="text-sm text-base-content">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-base-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-base-content bg-base-200 rounded-xl hover:bg-base-300 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-primary-content bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Society"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSocietyModal;