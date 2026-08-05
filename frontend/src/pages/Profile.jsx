import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaUserShield,
} from "react-icons/fa";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            View your personal information.
          </p>

        </div>

        {/* Profile Card */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl text-white p-10 shadow-lg">

          <div className="flex items-center gap-6">

            <div className="h-28 w-28 rounded-full bg-white text-green-600 flex items-center justify-center text-5xl font-bold">

              {user?.fullName?.charAt(0) || "U"}

            </div>

            <div>

              <h2 className="text-4xl font-bold">

                {user?.fullName}

              </h2>

              <p className="text-white/80 mt-2">

                FinSync Premium Customer

              </p>

            </div>

          </div>

        </div>

        {/* Details */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center gap-4">

              <FaEnvelope className="text-green-600 text-2xl" />

              <div>

                <p className="text-slate-400 text-sm">
                  Email
                </p>

                <h3 className="font-semibold">
                  {user?.email}
                </h3>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center gap-4">

              <FaPhone className="text-green-600 text-2xl" />

              <div>

                <p className="text-slate-400 text-sm">
                  Mobile
                </p>

                <h3 className="font-semibold">
                  {user?.mobileNumber}
                </h3>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center gap-4">

              <FaUniversity className="text-green-600 text-2xl" />

              <div>

                <p className="text-slate-400 text-sm">
                  Bank
                </p>

                <h3 className="font-semibold">
                  FinSync Digital Bank
                </h3>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center gap-4">

              <FaUserShield className="text-green-600 text-2xl" />

              <div>

                <p className="text-slate-400 text-sm">
                  Status
                </p>

                <h3 className="font-semibold text-green-600">
                  Active
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Profile;