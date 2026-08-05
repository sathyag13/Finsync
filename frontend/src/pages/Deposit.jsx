import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../services/accountService";
import { deposit } from "../services/transactionService";
import {
  FaArrowCircleDown,
  FaWallet,
  FaRupeeSign,
} from "react-icons/fa";

function Deposit() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
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
        setAccountId(data[0].id);
      }
    } catch {
      setError("Unable to load accounts.");
    }
  }

  const selectedAccount = accounts.find(
    (a) => a.id == accountId
  );

  const handleDeposit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!accountId) {
      return setError("Please select an account.");
    }

    if (!amount || Number(amount) <= 0) {
      return setError("Enter a valid amount.");
    }

    setLoading(true);

    try {
      await deposit({
        accountId,
        amount: Number(amount),
      });

      setSuccess("Deposit Successful");

      setAmount("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || "Deposit Failed"
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
          Deposit Money
        </h1>

        <p className="text-slate-500 mt-2">
          Add money to your account securely.
        </p>

      </div>

      <div className="max-w-3xl mx-auto">

        {/* Selected Account */}

        {selectedAccount && (

          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl text-white p-8 shadow-lg mb-8">

            <div className="flex justify-between">

              <div>

                <p className="text-white/70">
                  Selected Account
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
                Current Balance
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
            Deposit Details
          </h2>

          <form
            onSubmit={handleDeposit}
            className="space-y-6"
          >

            <div>

              <label className="font-semibold text-slate-600">
                Select Account
              </label>

              <select
                value={accountId}
                onChange={(e) =>
                  setAccountId(e.target.value)
                }
                className="w-full mt-2 border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 outline-none"
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

            <div>

              <label className="font-semibold text-slate-600">
                Deposit Amount
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
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-green-500 outline-none"
                />

              </div>

            </div>

            {error && (

              <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                {error}
              </div>

            )}

            {success && (

              <div className="bg-green-50 text-green-700 p-4 rounded-xl">
                {success}
              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading
                ? "Processing..."
                : "Deposit Money"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Deposit;