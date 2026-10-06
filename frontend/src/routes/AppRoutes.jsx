import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
    obtenerPermisoRequerido,
    obtenerUsuarioActual,
    tienePermisoParaPagina,
} from "./permisoPagina";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Huerta from "../pages/Huerta";
import Movimientos from "../pages/administracion/Movimientos";
import Ventas from "../pages/administracion/Ventas";
import ManoDeObra from "../pages/administracion/ManoDeObra";
import ProductoInsumo from "../pages/administracion/ProductoInsumo";
import Reportes from "../pages/administracion/Reportes";

import Leche from "../pages/Lacteos/Leche";
import Quesos from "../pages/Lacteos/Quesos";
import DulceDeLeche from "../pages/Lacteos/DulceDeLeche";

import Mermeladas from "../pages/Alimentos-procesados/Mermeladas";
import Molienda from "../pages/Alimentos-procesados/Molienda";

import Usuarios from "../pages/administracion/Usuarios";
import Permisos from "../pages/administracion/Permisos";
import Login from "../pages/Login";


export default function AppRoutes() {

    const location = useLocation();
    const usuario = obtenerUsuarioActual();
    const [permisosCargados, setPermisosCargados] = useState(false);
    const autenticado = Boolean(usuario);
    const idUsuario = usuario?.idUsuario;

    useEffect(() => {
        if (!idUsuario) {
            setPermisosCargados(true);
            return;
        }

        let cancelado = false;
        setPermisosCargados(false);

        api.get(`/usuarios/${idUsuario}`)
            .then((respuesta) => {
                const usuarioActualizado = {
                    ...(obtenerUsuarioActual() || {}),
                    permisos: (respuesta.data.permisos || []).map((permiso) => permiso.idPermiso),
                };
                localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
            })
            .catch((error) => {
                console.error("No se pudieron actualizar los permisos del usuario:", error);
            })
            .finally(() => {
                if (!cancelado) {
                    setPermisosCargados(true);
                }
            });

        return () => {
            cancelado = true;
        };
    }, [idUsuario]);

    const protegerPagina = (path, pagina) => {
        if (!autenticado) {
            return <Navigate to="/login" replace />;
        }
        if (!permisosCargados) {
            return <section className="pagina" role="status">Cargando permisos...</section>;
        }
        if (!tienePermisoParaPagina(usuario, path)) {
            const permisoRequerido = obtenerPermisoRequerido(path);
            return (
                <section className="pagina" role="alert">
                    <h2>Acceso denegado</h2>
                    <p>Tu usuario no tiene permiso para ingresar.</p>
                </section>
            );
        }
        return pagina;
    };

    return (

        <Routes location={location}>

            {/* Login SIN MainLayout */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<MainLayout />}>

                <Route path="/" element={
                    autenticado ? <Dashboard /> : <Navigate to="/login" replace />
                } />

                <Route path="/huerta/cosecha" element={protegerPagina("/huerta/cosecha", <Huerta />)} />

                <Route path="/lacteos/Leche" element={protegerPagina("/lacteos/Leche", <Leche />)} />
                <Route path="/lacteos/Quesos" element={protegerPagina("/lacteos/Quesos", <Quesos />)} />
                <Route path="/lacteos/DulceDeLeche" element={protegerPagina("/lacteos/DulceDeLeche", <DulceDeLeche />)} />

                <Route path="/alimentos-procesados/Mermeladas" element={protegerPagina("/alimentos-procesados/Mermeladas", <Mermeladas />)} />
                <Route path="/alimentos-procesados/Molienda" element={protegerPagina("/alimentos-procesados/Molienda", <Molienda />)} />


                <Route path="/administracion/usuarios" element={protegerPagina("/administracion/usuarios", <Usuarios />)} />
                <Route path="/administracion/permisos" element={protegerPagina("/administracion/permisos", <Permisos />)} />
                <Route path="/administracion/Movimientos" element={protegerPagina("/administracion/Movimientos", <Movimientos />)} />
                <Route path="/administracion/Produccion" element={<Navigate to="/administracion/Movimientos" replace />} />
                <Route path="/administracion/ManoDeObra" element={protegerPagina("/administracion/ManoDeObra", <ManoDeObra />)} />
                <Route path="/administracion/Insumos" element={<Navigate to="/administracion/ProductoInsumo" replace />} />
                <Route path="/administracion/Ventas" element={protegerPagina("/administracion/Ventas", <Ventas />)} />
                <Route path="/administracion/ProductoInsumo" element={protegerPagina("/administracion/ProductoInsumo", <ProductoInsumo />)} />
                <Route path="/administracion/reportes" element={protegerPagina("/administracion/reportes", <Reportes />)} />

            </Route> 

            {/* Cualquier otra URL */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

    );
}
