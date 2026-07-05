import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Lacteos from "../pages/Lacteos";
import Huerta from "../pages/Huerta";
import AlimentosProcesados from "../pages/AlimentosProcesados";
import Administracion from "../pages/Administracion";

export default function AppRoutes() {

    return (

        <Routes>

            <Route element={<MainLayout />}>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/lacteos"
                    element={<Lacteos />}
                />

                <Route
                    path="/huerta"
                    element={<Huerta />}
                />

                <Route
                    path="/alimentos-procesados"
                    element={<AlimentosProcesados />}
                />

                <Route
                    path="/administracion"
                    element={<Administracion />}
                />

            </Route>

        </Routes>

    );

}