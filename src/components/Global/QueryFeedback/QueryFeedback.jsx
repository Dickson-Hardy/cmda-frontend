import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

export default function QueryFeedback({ loading, error, empty, onRetry, label = "items" }) {
  if (error)
    return (
      <div role="alert" className="my-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p>{getApiErrorMessage(error, `We couldn’t load ${label}. Please try again.`)}</p>
        <button type="button" className="mt-2 min-h-11 px-3 font-semibold underline" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  if (loading)
    return (
      <p role="status" className="py-10 text-center text-sm text-gray-600">
        Loading {label}…
      </p>
    );
  if (empty)
    return (
      <p role="status" className="py-10 text-center text-sm text-gray-600">
        No matching {label} to display.
      </p>
    );
  return null;
}
