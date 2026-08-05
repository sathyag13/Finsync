import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../services/accountService";
import {
  FaUniversity,
  FaPlusCircle,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";

function MyAccounts() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            My Accounts
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all your FinSync accounts
          </p>

        </div>

        <button
          onClick={() => navigate("/create-account")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
        >
          <FaPlusCircle />
          New Account
        </button>

      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 rounded-3xl bg-slate-200 animate-pulse"
            />
          ))}

        </div>

      ) : accounts.length === 0 ? (

        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">

          <FaUniversity className="text-6xl text-slate-300 mx-auto mb-6" />

          <h2 className="text-2xl font-bold">
            No Accounts Found
          </h2>

          <p className="text-slate-500 mt-3">
            Create your first account to begin banking.
          </p>

          <button
            onClick={() => navigate("/create-account")}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Create Account
          </button>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {accounts.map((account, index) => (

            <div
              key={account.id}
              className={`rounded-3xl p-7 shadow-lg transition hover:-translate-y-2 cursor-pointer ${
                index % 2 === 0
                  ? "bg-gradient-to-br from-green-600 to-emerald-700 text-white"
                  : "bg-white border border-slate-200"
              }`}
            >

              <div className="flex justify-between items-start">

                <div>

                  <p
                    className={`text-sm ${
                      index % 2 === 0
                        ? "text-white/70"
                        : "text-slate-400"
                    }`}
                  >
                    {account.accountType}
                  </p>

                  <h2 className="text-xl font-bold mt-2 tracking-widest">
                    {account.accountNumber}
                  </h2>

                </div>

                <div
                  className={`h-14 w-14 rounded-2xl flex justify-center items-center ${
                    index % 2 === 0
                      ? "bg-white/20"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <FaWallet size={22} />
                </div>

              </div>

              <div className="mt-10">

                <p
                  className={`text-sm ${
                    index % 2 === 0
                      ? "text-white/70"
                      : "text-slate-400"
                  }`}
                >
                  Available Balance
                </p>

                <h1 className="text-4xl font-bold mt-2">
                  ₹{account.balance.toLocaleString()}
                </h1>

              </div>

              <div className="flex justify-between items-center mt-10">

                <span
                  className={`text-sm font-medium ${
                    index % 2 === 0
                      ? "text-white/80"
                      : "text-green-600"
                  }`}
                >
                  Active Account
                </span>

                <FaArrowRight />

              </div>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}

export default MyAccounts;