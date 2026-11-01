
import { useEffect, useState } from "react";
import { X, Activity } from "lucide-react";

function getToday() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getDateValue(value) {
  if (!value) return getToday();

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

const READING_SLOTS = [
  { id: 1, name: "Morning (fasting)" },
  { id: 2, name: "After breakfast" },
  { id: 3, name: "After lunch" },
  { id: 4, name: "After dinner" },
];

export default function ReadingFormModal({
  reading,
  isSaving,
  error,
  onClose,
  onSave,
}) {
  const [readingDate, setReadingDate] = useState(getToday());
  const [slotId, setSlotId] = useState("");
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const isEditing = Boolean(reading);

  useEffect(() => {
    setReadingDate(getDateValue(reading?.readingDate));
    setSlotId(
      reading?.slotId != null ? String(reading.slotId) : ""
    );
    setValue(reading ? String(reading.value) : "");
    setValidationError("");
  }, [reading]);

  function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!readingDate || !slotId || value === "") {
      setValidationError("Please complete all fields.");
      return;
    }

    if (readingDate > getToday()) {
      setValidationError("Future dates are not allowed.");
      return;
    }

    const numericSlotId = Number(slotId);
    const numericValue = Number(value);

    if (![1, 2, 3, 4].includes(numericSlotId)) {
      setValidationError("Please select a valid reading slot.");
      return;
    }

    if (!Number.isInteger(numericValue)) {
      setValidationError("Glucose value must be a whole number.");
      return;
    }

    if (numericValue < 40 || numericValue > 600) {
      setValidationError(
        "Glucose value must be between 40 and 600 mg/dL."
      );
      return;
    }

    const formData = {
      readingDate,
      slotId: numericSlotId,
      value: numericValue,
    };

    console.log("Form data to save:", formData);
    console.log("slotId type:", typeof formData.slotId);
    console.log("value type:", typeof formData.value);

    onSave(formData);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={22} />
            </div>

            <div>
              <h2
                id="reading-modal-title"
                className="text-lg font-bold text-slate-900"
              >
                {isEditing ? "Edit reading" : "Add glucose reading"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your glucose measurement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {/* Reading date */}
          <div>
            <label
              htmlFor="readingDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Reading date
            </label>

            <input
              id="readingDate"
              type="date"
              value={readingDate}
              max={getToday()}
              onChange={(event) =>
                setReadingDate(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          {/* Reading slot */}
          <div>
            <label
              htmlFor="readingSlot"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Reading slot
            </label>

            <select
              id="readingSlot"
              value={slotId}
              onChange={(event) => setSlotId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            >
              <option value="">Select a reading slot</option>

              {READING_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.name}
                </option>
              ))}
            </select>
          </div>

          {/* Glucose value */}
          <div>
            <label
              htmlFor="glucoseValue"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Glucose level
            </label>

            <div className="relative">
              <input
                id="glucoseValue"
                type="number"
                min="40"
                max="600"
                step="1"
                inputMode="numeric"
                placeholder="Enter value (40–600)"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                mg/dL
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Accepted range: 40–600 mg/dL. Whole numbers only.
            </p>
          </div>

          {/* Error message */}
          {(validationError || error) && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError || error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update reading"
                  : "Save reading"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
