
import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Activity,
  RefreshCw,
} from "lucide-react";

import ReadingFormModal from "./ReadingFormModal";
import { useToast } from "../ui/ToastProvider";

import {
  useGetReadingsQuery,
  useCreateReadingMutation,
  useUpdateReadingMutation,
  useDeleteReadingMutation,
} from "../../features/readings/readingApi";

import { getApiErrorMessage } from "../../utils/apiError";

function getPayload(response) {
  return response?.data ?? response;
}

function getReadingsFromResponse(response) {
  const payload = getPayload(response);

  if (Array.isArray(payload)) return payload;

  return payload?.readings ?? payload?.items ?? [];
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const datePart =
    typeof dateString === "string"
      ? dateString.slice(0, 10)
      : new Date(dateString).toISOString().slice(0, 10);

  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSlot(slotName) {
  if (!slotName) return "—";

  return slotName
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getReadingDate(reading) {
  return typeof reading.readingDate === "string"
    ? reading.readingDate.slice(0, 10)
    : new Date(reading.readingDate).toISOString().slice(0, 10);
}

export default function ReadingManager() {
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [formError, setFormError] = useState("");

  // Fetch readings
  const readingsQuery = useGetReadingsQuery({
    page: 1,
    limit: 100,
  });

  // CRUD mutations
  const [createReading, createState] = useCreateReadingMutation();
  const [updateReading, updateState] = useUpdateReadingMutation();
  const [deleteReading, deleteState] = useDeleteReadingMutation();

  // Sort readings by date and slot order
  const readings = useMemo(
    () =>
      getReadingsFromResponse(readingsQuery.data)
        .slice()
        .sort((a, b) => {
          const dateDifference = getReadingDate(b).localeCompare(
            getReadingDate(a)
          );

          if (dateDifference !== 0) return dateDifference;

          return (
            (b.slot?.displayOrder ?? b.slotId ?? 0) -
            (a.slot?.displayOrder ?? a.slotId ?? 0)
          );
        }),
    [readingsQuery.data]
  );

  const isSaving = createState.isLoading || updateState.isLoading;
  const isDeleting = deleteState.isLoading;

  // Open create modal
  function openCreateModal() {
    setSelectedReading(null);
    setFormError("");
    setIsModalOpen(true);
  }

  // Open edit modal
  function openEditModal(reading) {
    setSelectedReading(reading);
    setFormError("");
    setIsModalOpen(true);
  }

  // Close modal
  function closeModal() {
    if (isSaving) return;

    setIsModalOpen(false);
    setSelectedReading(null);
    setFormError("");
  }

  // Create or update reading
  async function handleSave(formData) {
    setFormError("");

    try {
      if (selectedReading) {
        await updateReading({
          id: selectedReading.id,
          ...formData,
        }).unwrap();

        showToast("Glucose reading updated successfully.");
      } else {
        await createReading(formData).unwrap();

        showToast("Glucose reading added successfully.");
      }

      setIsModalOpen(false);
      setSelectedReading(null);
    } catch (error) {
      const message = getApiErrorMessage(error);

      setFormError(message);
      showToast(message, "error");
    }
  }

  // Delete reading
  async function handleDelete(reading) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this glucose reading?"
    );

    if (!confirmed) return;

    try {
      await deleteReading(reading.id).unwrap();

      showToast("Glucose reading deleted successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  }

  const loading = readingsQuery.isLoading;
  const queryError = readingsQuery.error;

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Glucose readings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add and manage your daily measurements.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Add reading
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : queryError ? (

          /* Error */
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-red-600">
              {getApiErrorMessage(queryError)}
            </p>

            <button
              type="button"
              onClick={() => readingsQuery.refetch()}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>

        ) : readings.length === 0 ? (

          /* Empty state */
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Activity size={26} />
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              No readings yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first glucose reading to start tracking.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add your first reading
            </button>
          </div>

        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Reading slot
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Glucose level
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {readings.map((reading) => (
                    <tr
                      key={reading.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                        {formatDate(reading.readingDate)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatSlot(reading.slot?.slotName)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-bold text-slate-900">
                          {reading.value}
                        </span>

                        <span className="ml-1 text-xs text-slate-500">
                          mg/dL
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(reading)}
                            aria-label="Edit reading"
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(reading)}
                            disabled={isDeleting}
                            aria-label="Delete reading"
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatDate(reading.readingDate)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatSlot(reading.slot?.slotName)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {reading.value}{" "}
                        <span className="text-xs font-medium text-slate-500">
                          mg/dL
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(reading)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(reading)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Reading modal */}
      {isModalOpen && (
        <ReadingFormModal
          reading={selectedReading}
          isSaving={isSaving}
          error={formError}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}
