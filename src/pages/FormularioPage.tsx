import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EtiquetaCard from "../components/EtiquetaCard";
import { motoristasResende, motoristasVale } from "../data/motoristas";
import type { Etiqueta } from "../types/etiqueta";
import { getEmpresaById } from "../utils/empresa";
import { criarEtiquetas, getDataViagem } from "../utils/etiqueta";
import "../styles/formulario.css";
import "../styles/toast.css";

const FormularioPage = () => {
  const navigate = useNavigate();
  const { empresa, polo } = useParams();

  const empresaSelecionada = useMemo(() => getEmpresaById(empresa), [empresa]);
  const poloSelecionado = (polo || "vale").trim().toLowerCase() as "vale" | "resende";
  const storageKey = `etiquetas-lote-${empresaSelecionada.id}-${poloSelecionado}`;

  const [motorista, setMotorista] = useState("");
  const [cidade, setCidade] = useState("");
  const [sacas, setSacas] = useState("");
  const [avulsos, setAvulsos] = useState("");
  const [palets, setPalets] = useState("");
  const [lote, setLote] = useState<Etiqueta[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"error" | "success" | "">("");

  useEffect(() => {
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = empresaSelecionada.logo;
  }, [empresaSelecionada]);

  useEffect(() => {
    const loteSalvo = localStorage.getItem(storageKey);

    if (!loteSalvo) return;

    try {
      const loteParseado = JSON.parse(loteSalvo) as Etiqueta[];
      setLote(loteParseado);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lote));
  }, [lote, storageKey]);

  const listaMotoristas = useMemo(() => {
    return poloSelecionado === "vale" ? motoristasVale : motoristasResende;
  }, [poloSelecionado]);

  const handleSelecionarMotorista = (nome: string) => {
    setMotorista(nome);
    const motoristaEncontrado = listaMotoristas.find((item) => item.nome === nome);
    setCidade(motoristaEncontrado?.cidade ?? "");
  };

  const resetCampos = () => {
    setMotorista("");
    setCidade("");
    setSacas("");
    setAvulsos("");
    setPalets("");
  };

  const mostrarErro = (texto: string) => {
    setMensagem(texto);
    setTipoMensagem("error");
  };

  const mostrarSucesso = (texto: string) => {
    setMensagem(texto);
    setTipoMensagem("success");
  };

  const limparMensagem = () => {
    setMensagem("");
    setTipoMensagem("");
  };

  const handleAdicionarAoLote = () => {
    limparMensagem();

    const numSacas = Number(sacas) || 0;
    const numAvulsos = Number(avulsos) || 0;
    const numPalets = Number(palets) || 0;

    if (!motorista.trim() || !cidade.trim()) {
      mostrarErro("Selecione um motorista válido para continuar.");
      return;
    }

    if (numSacas === 0 && numAvulsos === 0 && numPalets === 0) {
      mostrarErro("Informe pelo menos uma quantidade para adicionar ao lote.");
      return;
    }

    const valores = [numSacas, numAvulsos, numPalets];
    const temValorInvalido = valores.some((valor) => valueIsInvalid(valor));

    if (temValorInvalido) {
      mostrarErro("Os valores devem estar entre 0 e 15.");
      return;
    }

    const dataViagem = getDataViagem();
    const novasEtiquetas: Etiqueta[] = [];
    let proximoNumero = lote.length + 1;

    if (numSacas > 0) {
      const etiquetasSacas = criarEtiquetas({
        quantidade: numSacas,
        tipo: "Saca",
        total: numSacas,
        numeroInicial: proximoNumero,
        motorista,
        cidade,
        empresa: empresaSelecionada.nome,
        data: dataViagem,
      });
      novasEtiquetas.push(...etiquetasSacas);
      proximoNumero += etiquetasSacas.length;
    }

    if (empresaSelecionada.permiteAvulso && numAvulsos > 0) {
      const etiquetasAvulsos = criarEtiquetas({
        quantidade: numAvulsos,
        tipo: "Avulso",
        total: numAvulsos,
        numeroInicial: proximoNumero,
        motorista,
        cidade,
        empresa: empresaSelecionada.nome,
        data: dataViagem,
      });
      novasEtiquetas.push(...etiquetasAvulsos);
      proximoNumero += etiquetasAvulsos.length;
    }

    if (empresaSelecionada.permitePalet && numPalets > 0) {
      const etiquetasPalets = criarEtiquetas({
        quantidade: numPalets,
        tipo: "Palet",
        total: numPalets,
        numeroInicial: proximoNumero,
        motorista,
        cidade,
        empresa: empresaSelecionada.nome,
        data: dataViagem,
      });
      novasEtiquetas.push(...etiquetasPalets);
    }

    setLote((prev) => [...prev, ...novasEtiquetas]);
    resetCampos();
    mostrarSucesso("Etiquetas adicionadas ao lote com sucesso.");
  };

  const handleLimparLote = () => {
    setLote([]);
    localStorage.removeItem(storageKey);
    mostrarSucesso("Lote limpo com sucesso.");
  };

  const handleImprimir = () => {
    if (lote.length === 0) {
      mostrarErro("Adicione etiquetas ao lote antes de imprimir.");
      return;
    }

    const printWindow = window.open("", "", "width=900,height=1200");
    if (!printWindow) {
      mostrarErro("Não foi possível abrir a janela de impressão.");
      return;
    }

    const styles = `
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: "Times New Roman", serif;
          font-weight: bold;
          color: black;
          margin: 0;
          padding: 0;
        }
        .page {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          padding: 20px;
          page-break-after: always;
          box-sizing: border-box;
        }
        .etiqueta {
          width: 300px;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .etiqueta p {
          margin: 6px 0;
          text-align: center;
        }
        .motorista { font-size: 54px; }
        .cidade { font-size: 50px; }
        .empresa { font-size: 42px; }
        .tipo-pos { font-size: 42px; }
        .etiqueta-num { font-size: 32px; margin-top: 10px; }
      </style>
    `;

    let etiquetasHTML = "";

    for (let i = 0; i < lote.length; i += 3) {
      const grupo = lote.slice(i, i + 3);
      etiquetasHTML += `<div class="page">`;

      grupo.forEach((item) => {
        etiquetasHTML += `
          <div class="etiqueta">
            <p class="motorista">${item.motorista}</p>
            <p class="cidade">${item.cidade}</p>
            <p class="empresa">${item.empresa}</p>
            <p class="tipo-pos">${item.tipo} - ${item.pos}</p>
            <p class="etiqueta-num">Etiqueta ${item.num} - ${item.data}</p>
          </div>
        `;
      });

      etiquetasHTML += `</div>`;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Impressão de Etiquetas</title>
          ${styles}
        </head>
        <body>
          ${etiquetasHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const totalSacas = lote.filter((item) => item.tipo === "Saca").length;
  const totalAvulsos = lote.filter((item) => item.tipo === "Avulso").length;
  const totalPalets = lote.filter((item) => item.tipo === "Palet").length;

  return (
    <main className="form-page">
      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div>

      <div className="form-wrapper">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <header className="form-header">
          <div className="form-logo-box">
            <img
              src={empresaSelecionada.logo}
              alt={`Logo ${empresaSelecionada.nome}`}
              className="form-logo"
            />
          </div>

          <div className="header-texts">
            <span className="form-badge">PAINEL DE ETIQUETAS</span>
            <h1 className="titulo">Sistema de Etiquetas — {empresaSelecionada.nome}</h1>
            <p className="subtitulo">
              Unidade {poloSelecionado === "vale" ? "Vale do Café" : "Resende"}.
              Preencha os dados abaixo para gerar etiquetas com rapidez e organização.
            </p>
          </div>
        </header>

        <div className="content-grid">
          <section className="glass-card form-main-card">
            <h2 className="section-title">Dados da operação</h2>

            <form className="formulario" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>Motorista</label>
                <select
                  value={motorista}
                  onChange={(e) => handleSelecionarMotorista(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {listaMotoristas.map((item) => (
                    <option key={item.nome} value={item.nome}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>

              {cidade === "CALIFORNIA" && (
                <div className="input-group">
                  <label>Digite o nome do motorista</label>
                  <input
                    type="text"
                    value={motorista}
                    onChange={(e) => setMotorista(e.target.value)}
                    placeholder="Nome do motorista"
                  />
                </div>
              )}

              <div className="input-group">
                <label>Cidade</label>
                <input type="text" value={cidade} readOnly disabled />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Sacas (0 a 15)</label>
                  <input
                    type="number"
                    value={sacas}
                    onChange={(e) => setSacas(e.target.value)}
                    min={0}
                    max={15}
                    placeholder="0"
                  />
                </div>

                {empresaSelecionada.permiteAvulso && (
                  <div className="input-group">
                    <label>Avulsos (0 a 15)</label>
                    <input
                      type="number"
                      value={avulsos}
                      onChange={(e) => setAvulsos(e.target.value)}
                      min={0}
                      max={15}
                      placeholder="0"
                    />
                  </div>
                )}

                {empresaSelecionada.permitePalet && (
                  <div className="input-group">
                    <label>Palets (0 a 15)</label>
                    <input
                      type="number"
                      value={palets}
                      onChange={(e) => setPalets(e.target.value)}
                      min={0}
                      max={15}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={handleAdicionarAoLote}
              >
                Adicionar ao lote
              </button>

              {mensagem && (
                <div
                  className={`form-message ${
                    tipoMensagem === "error"
                      ? "form-message--error"
                      : "form-message--success"
                  }`}
                >
                  {mensagem}
                </div>
              )}
            </form>
          </section>

          <aside className="glass-card side-card">
            <h2 className="section-title">Resumo do lote</h2>

            <div className="stats">
              <div className="stat-box">
                <span>Total de etiquetas</span>
                <strong>{lote.length}</strong>
              </div>

              <div className="stat-box">
                <span>Sacas</span>
                <strong>{totalSacas}</strong>
              </div>

              {empresaSelecionada.permiteAvulso && (
                <div className="stat-box">
                  <span>Avulsos</span>
                  <strong>{totalAvulsos}</strong>
                </div>
              )}

              {empresaSelecionada.permitePalet && (
                <div className="stat-box">
                  <span>Palets</span>
                  <strong>{totalPalets}</strong>
                </div>
              )}

              <div className="stat-box">
                <span>Empresa</span>
                <strong>{empresaSelecionada.nome}</strong>
              </div>
            </div>

            <div className="botoes-gerais">
              <button
                type="button"
                className="secondary-button"
                onClick={handleLimparLote}
                disabled={lote.length === 0}
              >
                Limpar lote
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleImprimir}
                disabled={lote.length === 0}
              >
                Imprimir etiquetas
              </button>
            </div>
          </aside>
        </div>

        <section className="glass-card etiquetas-section">
          <h2 className="section-title">Etiquetas adicionadas</h2>

          {lote.length === 0 ? (
            <p className="empty-state">Nenhuma etiqueta adicionada ao lote ainda.</p>
          ) : (
            <div className="etiquetas-preview">
              {lote.map((item) => (
                <EtiquetaCard key={item.num} etiqueta={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

const valueIsInvalid = (valor: number) => valor < 0 || valor > 15;

export default FormularioPage;