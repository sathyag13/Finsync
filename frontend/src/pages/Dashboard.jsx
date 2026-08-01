import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get("/dashboard");

                setDashboard(response.data);

            } catch (error) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            }

        };

        loadDashboard();

    }, [navigate]);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (!dashboard) {

        return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;

    }

    return (

        <div className="dashboard-container">

            <div className="dashboard-card">

                <h1>{dashboard.message}</h1>

                <hr />

                <h2>User Details</h2>

                <p><strong>Name :</strong> {dashboard.fullName}</p>

                <p><strong>Email :</strong> {dashboard.email}</p>

                <p><strong>Role :</strong> {dashboard.role}</p>

                <button onClick={logout}>Logout</button>

            </div>

        </div>

    );

}

export default Dashboard;