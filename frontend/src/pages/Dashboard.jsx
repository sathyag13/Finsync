import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";

import BalanceChart from "../components/BalanceChart";

import {
  FaWallet,
  FaUniversity,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaPlusCircle,
} from "react-icons/fa";

function isToday(dateString) {
  const d = new Date(dateString);
  const now = new Date();

  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function Dashboard() {

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    setLoading(true);

    try {

      const [accountData, transactionData] =
        await Promise.all([
          getAccounts(),
          getTransactions(),
        ]);

      setAccounts(accountData);

      setTransactions(transactionData);

      const balance = accountData.reduce(
        (sum, acc) => sum + acc.balance,
        0
      );

      setTotalBalance(balance);

    } catch {

      setError("Unable to load dashboard.");

    } finally {

      setLoading(false);

    }

  }

  const todayTransactions = transactions.filter((t) =>
    isToday(t.createdAt)
  );

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Financial Dashboard

          </h1>

          <p className="text-slate-500 mt-2">

            Welcome back! Here's an overview of your finances.

          </p>

        </div>

        <button
          onClick={() => navigate("/create-account")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow transition"
        >
          + New Account
        </button>

      </div>

      {error && (

        <div className="mb-6 bg-red-50 text-red-600 rounded-xl p-4">

          {error}

        </div>

      )}      {loading ? (

        <div className="flex justify-center items-center h-72">

          <div className="h-16 w-16 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>

        </div>

      ) : (

        <>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Total Balance */}

            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-7 text-white shadow-lg">

              <div className="flex justify-between">

                <div>

                  <p className="text-white/80">

                    Total Balance

                  </p>

                  <h2 className="text-4xl font-bold mt-5">

                    ₹{totalBalance.toLocaleString()}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">

                  <FaWallet />

                </div>

              </div>

            </div>

            {/* Accounts */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-500">

                    Accounts

                  </p>

                  <h2 className="text-4xl font-bold mt-5">

                    {accounts.length}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">

                  <FaUniversity />

                </div>

              </div>

            </div>

            {/* Transactions */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-500">

                    Transactions

                  </p>

                  <h2 className="text-4xl font-bold mt-5">

                    {transactions.length}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">

                  <FaExchangeAlt />

                </div>

              </div>

            </div>

            {/* Today's Activity */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-500">

                    Today's Activity

                  </p>

                  <h2 className="text-4xl font-bold mt-5">

                    {todayTransactions.length}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">

                  <FaMoneyBillWave />

                </div>

              </div>

            </div>

          </div>
                    {/* Chart + Quick Actions */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Balance Chart */}

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">

                    Balance Overview

                  </h2>

                  <p className="text-slate-500 text-sm mt-1">

                    Overall balance and transaction trend

                  </p>

                </div>

              </div>

              <BalanceChart
                accounts={accounts}
                transactions={transactions}
              />

            </div>

            {/* Quick Actions */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <h2 className="text-2xl font-bold text-slate-800 mb-6">

                Quick Actions

              </h2>

              <div className="grid grid-cols-2 gap-4">

                <button
                  onClick={() => navigate("/deposit")}
                  className="rounded-2xl bg-green-50 hover:bg-green-100 transition p-6 flex flex-col items-center"
                >

                  <FaArrowCircleDown className="text-4xl text-green-600" />

                  <span className="mt-3 font-semibold">

                    Deposit

                  </span>

                </button>

                <button
                  onClick={() => navigate("/withdraw")}
                  className="rounded-2xl bg-red-50 hover:bg-red-100 transition p-6 flex flex-col items-center"
                >

                  <FaArrowCircleUp className="text-4xl text-red-500" />

                  <span className="mt-3 font-semibold">

                    Withdraw

                  </span>

                </button>

                <button
                  onClick={() => navigate("/transfer")}
                  className="rounded-2xl bg-purple-50 hover:bg-purple-100 transition p-6 flex flex-col items-center"
                >

                  <FaExchangeAlt className="text-4xl text-purple-600" />

                  <span className="mt-3 font-semibold">

                    Transfer

                  </span>

                </button>

                <button
                  onClick={() => navigate("/create-account")}
                  className="rounded-2xl bg-blue-50 hover:bg-blue-100 transition p-6 flex flex-col items-center"
                >

                  <FaPlusCircle className="text-4xl text-blue-600" />

                  <span className="mt-3 font-semibold">

                    New Account

                  </span>

                </button>

              </div>

            </div>

          </div>
                    {/* Accounts & Transactions */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Accounts */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">

                    My Accounts

                  </h2>

                  <p className="text-slate-500 text-sm">

                    Your active bank accounts

                  </p>

                </div>

                <button
                  onClick={() => navigate("/accounts")}
                  className="text-green-600 font-semibold hover:underline"
                >
                  View All
                </button>

              </div>

              {accounts.length === 0 ? (

                <div className="text-center py-12 text-slate-400">

                  No accounts available

                </div>

              ) : (

                <div className="space-y-4">

                  {accounts.slice(0, 5).map((account) => (

                    <div
                      key={account.id}
                      className="rounded-2xl border border-slate-200 hover:border-green-500 transition p-5"
                    >

                      <div className="flex justify-between items-center">

                        <div>

                          <p className="text-sm text-slate-500">

                            {account.accountType}

                          </p>

                          <h3 className="font-bold text-lg mt-1">

                            {account.accountNumber}

                          </h3>

                        </div>

                        <div className="text-right">

                          <p className="text-xs text-slate-500">

                            Balance

                          </p>

                          <h3 className="text-green-600 font-bold text-xl">

                            ₹{account.balance.toLocaleString()}

                          </h3>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* Transactions */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">

                    Recent Transactions

                  </h2>

                  <p className="text-slate-500 text-sm">

                    Latest banking activity

                  </p>

                </div>

                <button
                  onClick={() => navigate("/transactions")}
                  className="text-green-600 font-semibold hover:underline"
                >
                  View All
                </button>

              </div>

              {transactions.length === 0 ? (

                <div className="text-center py-12 text-slate-400">

                  No transactions available

                </div>

              ) : (

                <div className="space-y-4">

                  {transactions.slice(0, 5).map((tx) => (

                    <div
                      key={tx.id}
                      className="flex justify-between items-center border-b border-slate-100 pb-4"
                    >

                      <div>

                        <h3 className="font-semibold text-slate-800">

                          {tx.type}

                        </h3>

                        <p className="text-sm text-slate-500">

                          {new Date(tx.createdAt).toLocaleString("en-IN")}

                        </p>

                      </div>

                      <div className="text-right">

                        <h3
                          className={`font-bold text-lg ${
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
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {tx.status}

                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </>

      )}

    </DashboardLayout>

  );

}

export default Dashboard;