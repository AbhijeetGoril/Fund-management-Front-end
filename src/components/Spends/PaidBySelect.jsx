// PaidBySelect.jsx
// Standalone "Paid By" dropdown — lists event/society members (payers)
// and lets the user pick one. Sends the member's _id as the value,
// since Spend.paidBy is a User ObjectId ref on the backend.
import React from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

const PaidBySelect = ({
  value,
  onChange,
  payers = [],
  error,
  disabled = false,
  inputBase = "",
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-1">
        Paid By <span className="text-error">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputBase} appearance-none cursor-pointer ${
          error ? "border-error bg-error/5" : "border-base-300 hover:border-base-400"
        }`}
      >
        <option value="">
          {payers.length ? "Select who paid" : "No members found"}
        </option>
        {payers.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-error flex items-center gap-1">
          <XCircleIcon className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default PaidBySelect;