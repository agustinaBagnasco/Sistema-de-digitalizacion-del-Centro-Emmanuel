import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Huerta from "../pages/huerta";
import Produccion from "../pages/administracion/Produccion";
import Ventas from "../pages/administracion/Ventas";
import ManoDeObra from "../pages/administracion/ManoDeObra";
import Insumos from "../pages/administracion/Insumos";
import Stocks from "../pages/administracion/Stocks";

import Leche from "../pages/Lacteos/Leche";
import Quesos from "../pages/Lacteos/Quesos";
import DulceDeLeche from "../pages/Lacteos/DulceDeLeche";
import Quark from "../pages/Lacteos/Quark";

import Mermeladas from "../pages/Alimentos-procesados/Mermeladas";
import Molienda from "../pages/Alimentos-procesados/Molienda";

import Usuarios from "../pages/administracion/Usuarios";
import Login from "../pages/Login";
//import Roles from "../pages/administracion/Roles";

export default function AppRoutes() {

   const autenticado = !!localStorage.getItem("usuario");

    return (

        <Routes>

            {/* Login SIN MainLayout */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<MainLayout />}>

                <Route path="/" element={
                    autenticado ? <Dashboard /> : <Navigate to="/login" replace />
                } />

                <Route path="/huerta/cosecha" element={<Huerta />} />

                <Route path="/lacteos/Leche" element={<Leche />} />
                <Route path="/lacteos/Quesos" element={<Quesos />} />
                <Route path="/lacteos/DulceDeLeche" element={<DulceDeLeche />} />
                <Route path="/lacteos/Quark" element={<Quark />} />

                <Route path="/alimentos-procesados/Mermeladas" element={<Mermeladas />} />
                <Route path="/alimentos-procesados/Molienda" element={<Molienda />} />


                <Route path="/administracion/usuarios" element={<Usuarios />} />
               {/* <Route path="/administracion/usuarios/roles" element={<Roles />} /> */}
                <Route path="/administracion/Produccion" element={<Produccion />} />
                <Route path="/administracion/ManoDeObra" element={<ManoDeObra />} />
                <Route path="/administracion/Insumos" element={<Insumos />} />
                <Route path="/administracion/Stocks" element={<Stocks />} />
                <Route path="/administracion/Ventas" element={<Ventas />} />

            </Route> 

            {/* Cualquier otra URL */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

    );
}