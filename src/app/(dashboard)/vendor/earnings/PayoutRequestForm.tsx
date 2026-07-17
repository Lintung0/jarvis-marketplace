"use client"

import { useState } from "react";
import { requestPayout } from "@/app/actions/payouts";

export function PayoutRequestForm({ maxAmount }: { maxAmount: number }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [accountBank, setAccountBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) { setError("Invalid amount"); return; }
    if (numAmount > maxAmount) { setError(`Maximum payout is ${maxAmount}`); return; }
    if (method === "bank_transfer" && (!accountBank || !accountName || !accountNumber)) {
      setError("Lengkapi data bank");
      return;
    }
    if (method === "ewallet" && !accountDetails) {
      setError("Lengkapi detail e-wallet");
      return;
    }

    try {
      const payload = {
        amount: numAmount,
        bank_name: method === "bank_transfer" ? accountBank : "E-Wallet",
        account_number: method === "bank_transfer" ? accountNumber : accountDetails,
        account_holder: method === "bank_transfer" ? accountName : "E-Wallet",
      };
      await requestPayout(payload);
      setSuccess(true);
      setAmount("");
      setAccountBank("");
      setAccountName("");
      setAccountNumber("");
      setAccountDetails("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-sm">
          Payout requested successfully!
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-300 block mb-1">Amount (IDR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Max ${maxAmount}`}
          max={maxAmount}
          required
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="manual">Transfer Manual</option>
        </select>
      </div>

      {method === "bank_transfer" ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Bank Name</label>
            <input
              type="text"
              value={accountBank}
              onChange={(e) => setAccountBank(e.target.value)}
              placeholder="BCA / Mandiri / BRI..."
              required
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1234567890"
              required
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Account Details</label>
          <input
            type="text"
            value={accountDetails}
            onChange={(e) => setAccountDetails(e.target.value)}
            placeholder="Email / No. HP / ID"
            required
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-teal-400 outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        className="px-6 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all"
      >
        Request Payout
      </button>
    </form>
  );
}
