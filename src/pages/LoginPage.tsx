import { useNavigate } from "react-router-dom";
import { EMPRESAS } from "../data/empresa";
import "../styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSelecionarEmpresa = (empresa: string) => {
    navigate(`/prioridade/${empresa}`);
  };

  return (
    <main className="login-page">
      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div>

      <section className="login-card">
        <div className="login-header">
          <span className="login-badge">PAINEL OPERACIONAL</span>
          <h1 className="login-title">Sistema de Etiquetas</h1>
          <p className="login-subtitle">
            Escolha a transportadora para iniciar o fluxo de separação e emissão
            das etiquetas.
          </p>
        </div>

        <div className="login-buttons">
          {EMPRESAS.map((empresa) => (
            <button
              key={empresa.id}
              type="button"
              className="login-button"
              onClick={() => handleSelecionarEmpresa(empresa.id)}
            >
              <span className="button-glow"></span>

              <span className="login-button-content">
                <span className="login-button-logo-box">
                  <img
                    src={empresa.logo}
                    alt={`Logo ${empresa.nome}`}
                    className="login-button-logo"
                  />
                </span>

                <span className="button-text">{empresa.nome}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LoginPage;