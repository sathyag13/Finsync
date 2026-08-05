import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function buildRunningBalance(transactions, currentTotal) {
  if (!transactions || transactions.length === 0) {
    return { labels: ["Now"], values: [currentTotal] };
  }

  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let runningBalance = currentTotal;
  const points = [{ label: "Now", value: runningBalance }];

  for (let i = sorted.length - 1; i >= 0; i--) {
    const tx = sorted[i];
    const signedAmount = tx.type === "WITHDRAW" ? tx.amount : -tx.amount;
    runningBalance += signedAmount;
    points.push({
      label: new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      value: runningBalance,
    });
  }

  points.reverse();
  return {
    labels: points.map((p) => p.label),
    values: points.map((p) => Math.max(p.value, 0)),
  };
}

function BalanceChart({ accounts, transactions = [] }) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const { labels, values } = useMemo(
    () => buildRunningBalance(transactions, totalBalance),
    [transactions, totalBalance]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Balance",
        data: values,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#16a34a",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { color: "#9ca3af", font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
    },
  };

  if (transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No transaction history yet
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}

export default BalanceChart;