import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/accountService";
import {
  FaUniversity,
  FaPiggyBank,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";

function CreateAccount() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("SAVINGS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createAccount({
        accountType,
      });

      navigate("/accounts");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Unable to create account."
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
          Open New Account
        </h1>

        <p className="text-slate-500 mt-2">
          Choose the account that best suits your banking needs.
        </p>

      </div>

      <div className="max-w-5xl mx-auto">

        {/* Account Options */}

        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Savings */}

          <button
            type="button"
            onClick={() => setAccountType("SAVINGS")}
            className={`rounded-3xl p-8 text-left border-2 transition ${
              accountType === "SAVINGS"
                ? "border-green-600 bg-green-50"
                : "border-slate-200 bg-white hover:border-green-300"
            }`}
          >

            <div className="flex justify-between items-center">

              <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">

                <FaPiggyBank size={28} />

              </div>

              {accountType === "SAVINGS" && (
                <FaCheckCircle className="text-green-600 text-2xl" />
              )}

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Savings Account
            </h2>

            <p className="text-slate-500 mt-4 leading-7">
              Perfect for daily banking, savings,
              deposits and secure money management.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-600">

              <li>✔ Interest on balance</li>
              <li>✔ Online banking</li>
              <li>✔ UPI enabled</li>
              <li>✔ ATM & Debit Card</li>

            </ul>

          </button>

          {/* Current */}

          <button
            type="button"
            onClick={() => setAccountType("CURRENT")}
            className={`rounded-3xl p-8 text-left border-2 transition ${
              accountType === "CURRENT"
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >

            <div className="flex justify-between items-center">

              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">

                <FaBriefcase size={28} />

              </div>

              {accountType === "CURRENT" && (
                <FaCheckCircle className="text-blue-600 text-2xl" />
              )}

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Current Account
            </h2>

            <p className="text-slate-500 mt-4 leading-7">
              Best for businesses and customers
              with frequent transactions.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-600">

              <li>✔ Unlimited Transactions</li>
              <li>✔ Business Banking</li>
              <li>✔ High Transaction Limit</li>
              <li>✔ Instant Transfers</li>

            </ul>

          </button>

        </div>

        {/* Create Form */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

          <div className="flex items-center gap-4 mb-6">

            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">

              <FaUniversity size={24} />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Confirm Account
              </h2>

              <p className="text-slate-500">
                Selected Account Type:
                <span className="font-semibold text-green-600 ml-2">
                  {accountType}
                </span>
              </p>

            </div>

          </div>

          {error && (

            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">

              {error}

            </div>

          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CreateAccount;