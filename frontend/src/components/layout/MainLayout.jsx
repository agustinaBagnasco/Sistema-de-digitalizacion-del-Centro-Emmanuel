import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import Breadcrumbs from "../ui/Breadcrumbs";

import "../layout/MainLayout.css";

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

                    <Breadcrumbs />

                    <Outlet />

                </main>

            </div>

        </div>

    );

}