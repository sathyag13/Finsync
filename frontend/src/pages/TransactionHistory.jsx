import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "../services/transactionService";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaExchangeAlt,
  FaSearch,
} from "react-icons/fa";

const typeStyles = {
  DEPOSIT: {
    icon: FaArrowCircleDown,
    color: "bg-green-100 text-green-600",
  },
  WITHDRAW: {
    icon: FaArrowCircleUp,
    color: "bg-red-100 text-red-500",
  },
  TRANSFER: {
    icon: FaExchangeAlt,
    color: "bg-purple-100 text-purple-600",
  },
};

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <p className="text-slate-500 text-sm">{title}</p>

      <h2 className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("ALL");

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch {
      setError("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {

      const matchesType =
        filter === "ALL" || tx.type === filter;

      const matchesSearch =
        tx.type
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [transactions, filter, search]);

  const deposits = transactions.filter(
    (t) => t.type === "DEPOSIT"
  ).length;

  const withdrawals = transactions.filter(
    (t) => t.type === "WITHDRAW"
  ).length;

  const transfers = transactions.filter(
    (t) => t.type === "TRANSFER"
  ).length;

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Transactions
          </h1>

          <p className="text-slate-500 mt-2">
            Complete history of all banking activity.
          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

        <SummaryCard
          title="Total"
          value={transactions.length}
          color="text-slate-800"
        />

        <SummaryCard
          title="Deposits"
          value={deposits}
          color="text-green-600"
        />

        <SummaryCard
          title="Withdrawals"
          value={withdrawals}
          color="text-red-500"
        />

        <SummaryCard
          title="Transfers"
          value={transfers}
          color="text-purple-600"
        />

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <FaSearch className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search transaction type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-12 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >

            <option value="ALL">All</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
            <option value="TRANSFER">Transfer</option>

          </select>

        </div>

      </div>
            {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        {loading ? (

          <div className="space-y-4">

            {[1,2,3,4,5].map((item) => (

              <div
                key={item}
                className="h-20 rounded-2xl bg-slate-200 animate-pulse"
              />

            ))}

          </div>

        ) : filteredTransactions.length === 0 ? (

          <div className="text-center py-16">

            <div className="text-6xl mb-4">
              📄
            </div>

            <h2 className="text-2xl font-bold text-slate-700">

              No Transactions Found

            </h2>

            <p className="text-slate-500 mt-2">

              Try changing the filter or search keyword.

            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredTransactions.map((tx) => {

              const style =
                typeStyles[tx.type] || typeStyles.TRANSFER;

              const Icon = style.icon;

              return (

                <div
                  key={tx.id}
                  className="flex justify-between items-center border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex items-center gap-5">

                    <div
                      className={`h-14 w-14 rounded-2xl flex justify-center items-center text-xl ${style.color}`}
                    >

                      <Icon />

                    </div>

                    <div>

                      <h3 className="font-bold text-lg text-slate-800">

                        {tx.type}

                      </h3>

                      <p className="text-sm text-slate-500">

                        {new Date(tx.createdAt).toLocaleString(
                          "en-IN"
                        )}

                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <h3
                      className={`text-2xl font-bold ${
                        tx.type === "WITHDRAW"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >

                      {tx.type === "WITHDRAW" ? "-" : "+"}

                      ₹{tx.amount.toLocaleString()}

                    </h3>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {tx.status}

                    </span>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}

export default TransactionHistory;