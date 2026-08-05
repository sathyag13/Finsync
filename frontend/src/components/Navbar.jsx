import {
  FaBell,
  FaSearch,
  FaPlus,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200">

      <div className="flex justify-between items-center px-8 py-5">

        {/* LEFT */}

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {greeting},
            <span className="text-green-600 ml-2">
              {user?.fullName?.split(" ")[0] || "User"}
            </span>
            👋
          </h2>

          <p className="text-slate-500 mt-1">
            Welcome back to your banking dashboard
          </p>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="hidden lg:flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 w-80 shadow-sm">

            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search..."
              className="ml-3 flex-1 outline-none text-sm bg-transparent"
            />

          </div>

          {/* Add Account */}

          <button
            onClick={() => navigate("/create-account")}
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold transition shadow"
          >

            <FaPlus />

            New Account

          </button>

          {/* Notification */}

          <button className="relative h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-green-50 transition">

            <FaBell className="text-slate-600" />

            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full"></span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">

            <div className="h-11 w-11 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">

              {user?.fullName?.charAt(0) || "U"}

            </div>

            <div className="hidden md:block">

              <h3 className="font-semibold text-slate-800">

                {user?.fullName || "User"}

              </h3>

              <p className="text-xs text-slate-500">

                Premium Customer

              </p>

            </div>

            <FaChevronDown className="text-slate-400 text-sm" />

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;