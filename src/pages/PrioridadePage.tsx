import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmpresaById } from "../utils/empresa";
import "../styles/prioridade.css";

const PrioridadePage = () => {
  const navigate = useNavigate();
  const { empresa } = useParams();

  const empresaSelecionada = useMemo(() => getEmpresaById(empresa), [empresa]);

  useEffect(() => {
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = empresaSelecionada.logo;
  }, [empresaSelecionada]);

  const handleSelecionarPolo = (polo: "vale" | "resende") => {
    navigate(`/formulario/${empresaSelecionada.id}/${polo}`);
  };

  return (
    <main className="priority-page">
      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div>

      <div className="priority-container">
        <button type="button" className="priority-back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <section className="priority-card">
          <div className="priority-logo-box">
            <img
              src={empresaSelecionada.logo}
              alt={`Logo ${empresaSelecionada.nome}`}
              className="priority-logo"
            />
          </div>

          <span className="priority-badge">SELEÇÃO DE PRIORIDADE</span>

          <h1 className="priority-title">
            Qual a prioridade de hoje para <span>{empresaSelecionada.nome}</span>?
          </h1>

          <p className="priority-subtitle">
            Escolha abaixo a unidade responsável para continuar o fluxo de geração
            das etiquetas.
          </p>

          <div className="priority-buttons">
            <button
              type="button"
              className="priority-button"
              onClick={() => handleSelecionarPolo("vale")}
            >
              <span className="button-glow"></span>
              <span className="button-content">
                <strong>Vale do Café</strong>
                <small>Seguir para a operação do polo Vale do Café</small>
              </span>
            </button>

            <button
              type="button"
              className="priority-button"
              onClick={() => handleSelecionarPolo("resende")}
            >
              <span className="button-glow"></span>
              <span className="button-content">
                <strong>Resende</strong>
                <small>Seguir para a operação do polo Resende</small>
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrioridadePage;