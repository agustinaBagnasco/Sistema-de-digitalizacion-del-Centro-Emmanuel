import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Centro Emmanuel</h1>
        <p>Sistema Integral de Gestión de la Granja</p>
      </header>

          <section className="modules">
        <div className="card">
          <h3>Producción lechera</h3>
         
        </div>

        <div className="card">
          <h3>Quesos y dulce de leche </h3>
         
        </div>

        <div className="card">
          <h3>Alimentos procesados</h3>
          
        </div>

        <div className="card">
          <h3>Huerta</h3>
          
        </div>

        <div className="card">
          <h3>Reportes</h3>
          
        </div>

      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Centro Emmanuel
      </footer>
    </div>
  );
}

export default App;
