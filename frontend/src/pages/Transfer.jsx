import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../services/accountService";
import { transfer } from "../services/transactionService";
import {
  FaExchangeAlt,
  FaWallet,
  FaUniversity,
  FaRupeeSign,
} from "react-icons/fa";

function Transfer() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const data = await getAccounts();
      setAccounts(data);

      if (data.length > 0) {
        setFromAccountId(data[0].id);
      }
    } catch {
      setError("Unable to load accounts.");
    }
  }

  const selectedAccount = accounts.find(
    (a) => a.id == fromAccountId
  );

  const handleTransfer = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fromAccountId)
      return setError("Please select an account.");

    if (!toAccountNumber.trim())
      return setError("Enter recipient account number.");

    if (!amount || Number(amount) <= 0)
      return setError("Enter a valid amount.");

    if (
      selectedAccount &&
      Number(amount) > selectedAccount.balance
    )
      return setError("Insufficient Balance.");

    setLoading(true);

    try {
      await transfer({
        fromAccountId,
        toAccountNumber: toAccountNumber.trim(),
        amount: Number(amount),
      });

      setSuccess("Transfer Successful");

      setAmount("");
      setToAccountNumber("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || "Transfer Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Transfer Money
        </h1>

        <p className="text-slate-500 mt-2">
          Send money securely to another account.
        </p>

      </div>

      <div className="max-w-3xl mx-auto">

        {/* Account Card */}

        {selectedAccount && (

          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl text-white p-8 shadow-lg mb-8">

            <div className="flex justify-between">

              <div>

                <p className="text-white/70">
                  Transfer From
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {selectedAccount.accountNumber}
                </h2>

                <p className="mt-2">
                  {selectedAccount.accountType}
                </p>

              </div>

              <div className="bg-white/20 h-16 w-16 rounded-2xl flex items-center justify-center">
                <FaWallet size={28} />
              </div>

            </div>

            <div className="mt-8">

              <p className="text-white/70">
                Available Balance
              </p>

              <h1 className="text-4xl font-bold mt-2">
                ₹{selectedAccount.balance.toLocaleString()}
              </h1>

            </div>

          </div>

        )}

        {/* Form */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Transfer Details
          </h2>

          <form
            onSubmit={handleTransfer}
            className="space-y-6"
          >

            {/* From Account */}

            <div>

              <label className="font-semibold text-slate-600">
                From Account
              </label>

              <select
                value={fromAccountId}
                onChange={(e) =>
                  setFromAccountId(e.target.value)
                }
                className="w-full mt-2 border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none"
              >

                {accounts.map((acc) => (

                  <option
                    key={acc.id}
                    value={acc.id}
                  >
                    {acc.accountType} • {acc.accountNumber}
                  </option>

                ))}

              </select>

            </div>

            {/* Recipient */}

            <div>

              <label className="font-semibold text-slate-600">
                Recipient Account Number
              </label>

              <div className="relative mt-2">

                <FaUniversity className="absolute left-5 top-5 text-slate-400" />

                <input
                  type="text"
                  value={toAccountNumber}
                  onChange={(e) =>
                    setToAccountNumber(e.target.value)
                  }
                  placeholder="Enter recipient account number"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500 outline-none"
                />

              </div>

            </div>

            {/* Amount */}

            <div>

              <label className="font-semibold text-slate-600">
                Amount
              </label>

              <div className="relative mt-2">

                <FaRupeeSign className="absolute left-5 top-5 text-slate-400" />

                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="Enter amount"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500 outline-none"
                />

              </div>

            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 rounded-xl p-4">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading
                ? "Processing..."
                : "Transfer Money"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Transfer;