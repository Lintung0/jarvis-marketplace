"use client"

import { useState } from "react";
import { requestPayout } from "@/app/actions/payouts";

export function PayoutRequestForm({ maxAmount }: { maxAmount: number }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
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

    try {
      const formData = new FormData();
      formData.set("amount", amount);
      formData.set("method", method);
      formData.set("account_details", accountDetails);
      await requestPayout(formData);
      setSuccess(true);
      setAmount("");
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
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 block mb-1">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="go_pay">GoPay</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 block mb-1">Account Details</label>
        <input
          type="text"
          value={accountDetails}
          onChange={(e) => setAccountDetails(e.target.value)}
          placeholder="Bank name / Account number / Email"
          required
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 text-sm focus:border-orange-400 outline-none"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
      >
        Request Payout
      </button>
    </form>
  );
}
