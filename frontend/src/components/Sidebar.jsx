import {
  FaHome,
  FaWallet,
  FaMoneyCheckAlt,
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaExchangeAlt,
  FaPlusCircle,
  FaSignOutAlt,
  FaUniversity,
  FaUser,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const bankingMenu = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      title: "My Accounts",
      icon: <FaWallet />,
      path: "/accounts",
    },
    {
      title: "Create Account",
      icon: <FaPlusCircle />,
      path: "/create-account",
    },
    {
      title: "Deposit",
      icon: <FaArrowCircleDown />,
      path: "/deposit",
    },
    {
      title: "Withdraw",
      icon: <FaArrowCircleUp />,
      path: "/withdraw",
    },
    {
      title: "Transfer",
      icon: <FaExchangeAlt />,
      path: "/transfer",
    },
    {
      title: "Transactions",
      icon: <FaMoneyCheckAlt />,
      path: "/transactions",
    },
  ];

  const managementMenu = [
    {
      title: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white border-r border-slate-200 shadow-xl flex flex-col">

      {/* Logo */}

      <div className="px-8 py-7 border-b border-slate-200">

        <div className="flex items-center gap-4">

          <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 flex items-center justify-center text-white text-2xl shadow">

            <FaUniversity />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-800">
              FinSync
            </h1>

            <p className="text-sm text-slate-500">
              Digital Banking
            </p>

          </div>

        </div>

      </div>

      {/* User */}

      <div className="p-6">

        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-5 text-white">

          <div className="flex items-center gap-4">

            <div className="h-14 w-14 rounded-full bg-white text-green-600 flex items-center justify-center text-xl font-bold">

              {user?.fullName?.charAt(0) || "U"}

            </div>

            <div>

              <h3 className="font-bold">

                {user?.fullName || "User"}

              </h3>

              <p className="text-sm text-white/80">

                Premium Customer

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Banking */}

      <div className="px-6">

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">

          Banking

        </p>

        <div className="space-y-2">

          {bankingMenu.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-4 px-5 py-3 rounded-2xl transition-all font-medium ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white"></span>
                  )}

                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {item.title}
                </>
              )}
            </NavLink>

          ))}

        </div>

      </div>

      {/* Management */}

      <div className="px-6 mt-8">

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">

          Management

        </p>

        <div className="space-y-2">

          {managementMenu.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-4 px-5 py-3 rounded-2xl transition-all font-medium ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              {item.title}

            </NavLink>

          ))}

        </div>

      </div>

      <div className="flex-1"></div>

      {/* Footer */}

      <div className="border-t border-slate-200 p-6">

        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

        <p className="text-center text-xs text-slate-400 mt-5">

          FinSync v1.0.0

        </p>

      </div>

    </aside>
  );
}

export default Sidebar;