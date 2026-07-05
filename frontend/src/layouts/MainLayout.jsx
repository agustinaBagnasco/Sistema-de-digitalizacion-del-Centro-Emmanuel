import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Navbar from "../components/layout/navbar/Navbar";

import "./MainLayout.css";

export default function MainLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="layout">

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="layout__content">

                <Navbar
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="layout__page">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}