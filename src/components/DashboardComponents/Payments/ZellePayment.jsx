import { useState } from "react";
import Button from "~/components/Global/Button/Button";
import {
  useCreateZellePaymentMutation,
  useGetMyZellePaymentsQuery,
  useGetZelleSettingsQuery,
  useUploadZelleProofMutation,
} from "~/redux/api/payments/zelleApi";

const message = (e) => e?.data?.message || e?.message || "Unable to process this request. Please try again.";
const statusLabel = (s) =>
  ({
    PENDING: "Awaiting your transfer",
    AWAITING_REVIEW: "Awaiting review",
    REVIEWING: "Under review",
    SUCCESSFUL: "Confirmed",
    FAILED: "Rejected",
  })[s] || s;

function ZelleReceipt({ intent, onSubmitted }) {
  const [reference, setReference] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [upload, { isLoading }] = useUploadZelleProofMutation();
  const account = intent.contextData?.account;
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (reference.trim().length < 3) {
      setError("Enter the Zelle transaction reference (at least three characters).");
      return;
    }
    if (!file || !["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choose a JPEG or PNG receipt up to 5 MB.");
      return;
    }
    try {
      const body = new FormData();
      body.append("proof", file);
      body.append("transferReference", reference.trim());
      await upload({ id: intent._id, body }).unwrap();
      onSubmitted();
    } catch (e) {
      setError(message(e));
    }
  };
  return (
    <div role="group" aria-label="Zelle receipt submission" className="space-y-3 rounded-lg border bg-gray-50 p-4">
      <p className="font-semibold">Send USD {Number(intent.amount).toFixed(2)} using Zelle</p>
      <dl className="text-sm space-y-2 break-words">
        <div>
          <dt>Recipient</dt>
          <dd className="font-semibold">{account?.accountName}</dd>
        </div>
        <div>
          <dt>Zelle email / phone</dt>
          <dd className="font-semibold select-all">{account?.recipient}</dd>
        </div>
        <div>
          <dt>Payment memo</dt>
          <dd className="select-all">{intent.intentCode}</dd>
        </div>
      </dl>
      <p className="text-sm whitespace-pre-wrap">{account?.instructions}</p>
      <p className="text-sm">After sending, upload your receipt. Only confirmed transfers count toward your balance.</p>
      <p className="text-sm text-gray-600">
        Each Zelle transfer is sent manually. This does not set up automatic payments.
      </p>
      <label className="block text-sm">
        Zelle transaction reference
        <input
          required
          minLength={3}
          maxLength={120}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="mt-1 w-full border rounded p-3"
        />
      </label>
      <label className="block text-sm">
        Receipt (JPEG or PNG, up to 5 MB)
        <input
          required
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="block mt-2 w-full text-sm"
        />
      </label>
      {error && (
        <p role="alert" className="text-red-700 text-sm">
          {error}
        </p>
      )}
      <Button type="button" onClick={submit} label="Submit receipt for review" loading={isLoading} className="w-full" />
    </div>
  );
}

export default function ZellePayment({ getRequest }) {
  const { data: settings } = useGetZelleSettingsQuery();
  const [create, { isLoading }] = useCreateZellePaymentMutation();
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!settings?.enabled) return <p className="text-sm text-gray-600">Zelle is not currently available.</p>;
  if (submitted)
    return (
      <p role="status" className="p-4 rounded bg-green-50 text-green-800">
        Receipt submitted. Your balance updates after finance confirms the transfer.
      </p>
    );
  if (intent) return <ZelleReceipt intent={intent} onSubmitted={() => setSubmitted(true)} />;
  return (
    <div className="space-y-2">
      <Button
        loading={isLoading}
        label="Continue with Zelle"
        className="w-full"
        onClick={async () => {
          setError("");
          try {
            setIntent(await create(await getRequest()).unwrap());
          } catch (e) {
            setError(message(e));
          }
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function ZelleTransfers() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetMyZellePaymentsQuery(page);
  const [selected, setSelected] = useState(null);
  if (isLoading) return <p>Loading Zelle transfers...</p>;
  if (isError) return <p className="text-sm text-red-700">Unable to load Zelle transfers. Refresh to try again.</p>;
  if (!data?.items?.length) return null;
  return (
    <section className="bg-white rounded-lg border p-4 space-y-4 my-4">
      <h3 className="font-semibold">Zelle transfers</h3>
      {data.items.map((intent) => (
        <div key={intent._id} className="border-t pt-3 space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <span>
              {intent.context === "SUBSCRIPTION" ? "Membership payment" : "Donation"} · USD{" "}
              {Number(intent.amount).toFixed(2)}
            </span>
            <span>{statusLabel(intent.status)}</span>
          </div>
          <p className="break-all">{intent.intentCode}</p>
          {intent.reviewNote && <p>{intent.reviewNote}</p>}
          {["PENDING", "FAILED"].includes(intent.status) && (
            <Button
              small
              variant="outlined"
              label="View details / upload receipt"
              onClick={() => setSelected(selected === intent._id ? null : intent._id)}
            />
          )}
          {selected === intent._id && ["PENDING", "FAILED"].includes(intent.status) && (
            <ZelleReceipt intent={intent} onSubmitted={() => setSelected(null)} />
          )}
        </div>
      ))}
      <div className="flex justify-between gap-3">
        <Button small label="Previous" disabled={page === 1} onClick={() => setPage(page - 1)} />
        <span>Page {page}</span>
        <Button small label="Next" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)} />
      </div>
    </section>
  );
}
