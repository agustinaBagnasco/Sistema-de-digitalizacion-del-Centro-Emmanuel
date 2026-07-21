import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Huerta from "../pages/Huerta";
import Produccion from "../pages/administracion/Produccion";
import Ventas from "../pages/administracion/Ventas";
import ManoDeObra from "../pages/administracion/ManoDeObra";
import StockProductos from "../pages/administracion/StockDeProductos";
import StockInsumos from "../pages/administracion/StockDeInsumos";
import Leche from "../pages/Lacteos/Leche";
import Quesos from "../pages/Lacteos/Quesos";
import DulceDeLeche from "../pages/Lacteos/DulceDeLeche";
import Quark from "../pages/Lacteos/Quark";
import Mermeladas from "../pages/Alimentos-procesados/Mermeladas";
import Molienda from "../pages/Alimentos-procesados/Molienda";



export default function AppRoutes() {

    return (

        <Routes>

            <Route element={<MainLayout />}>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/lacteos/Leche"
                    element={<Leche />}
                />
                    <Route
                    path="/lacteos/Quesos"
                    element={<Quesos />}
                />
                    <Route
                    path="/lacteos/DulceDeLeche"
                    element={<DulceDeLeche />}
                />
                    <Route
                    path="/lacteos/Quark"
                    element={<Quark />}
                />

                <Route
                    path="/huerta"
                    element={<Huerta />}
                />

                <Route
                    path="/alimentos-procesados/Mermeladas"
                    element={<Mermeladas />}
                />
                    <Route
                    path="/alimentos-procesados/Molienda"
                    element={<Molienda />}
                />

                <Route
                    path="/administracion/produccion"
                    element={<Produccion />}
                />
                  <Route
                    path="/administracion/ManoDeObra"
                    element={<ManoDeObra />}
                />
                  <Route
                    path="/administracion/StockDeProductos"
                    element={<StockProductos />}
                />
                  <Route
                    path="/administracion/StockDeInsumos"
                    element={<StockInsumos />}
                />
                  <Route
                    path="/administracion/Ventas"
                    element={<Ventas />}
                />

            </Route>

        </Routes>

    );

}