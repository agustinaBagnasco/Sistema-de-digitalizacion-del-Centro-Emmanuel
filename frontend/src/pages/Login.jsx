import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Login.css";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [error, setError] = useState("");

    const ingresar = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const respuesta = await api.post("/auth/login", {
                nombreUsuario: usuario,
                clave: clave
            });

            if (respuesta.data.success) {

    localStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.data)
    );

    navigate("/");
}

        } catch (error) {
            setError(
                error.response?.data?.mensaje
                || error.response?.data?.message
                || "Usuario o contraseña incorrectos."
            );

        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Centro Emmanuel</h1>

                <p>Ingreso al sistema</p>


                <form onSubmit={ingresar}>


                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e)=>setUsuario(e.target.value)}
                    />


                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={clave}
                        onChange={(e)=>setClave(e.target.value)}
                    />


                    <button>
                        Ingresar
                    </button>


                </form>

                {error && <p className="login-error" role="alert">{error}</p>}
            </div>

        </div>

    );

};
export default Login;