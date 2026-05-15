import { useEffect, useState } from "react";
import "./NovoCicloSection.css";
import { fetchResiduos, criarResiduo, atualizarResiduo, deletarResiduo, importarCsv } from "../../services/api";

const estadosBR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO"
];

const SECTION_IDS = {
  "Home": null,
  "Ecopanel": "ecopanel",
  "Radar Verde": "radar-verde",
  "Novo Ciclo": "novo-ciclo",
  "Raízes": "raizes",
};

function scrollToSection(sectionId) {
  if (!sectionId) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NovoCicloSection() {
  const [aba, setAba] = useState("novo");
  const [form, setForm] = useState({
    municipio: "", estado: "", quantidadeGerada: "", taxaReciclagem: "", ano: ""
  });
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [registroEditado, setRegistroEditado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [csvNome, setCsvNome] = useState(null);
  const [sucessoNovo, setSucessoNovo] = useState(false);
  const [sucessoGerenciar, setSucessoGerenciar] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [activeLink, setActiveLink] = useState("Novo Ciclo");
  const [hoveredLink, setHoveredLink] = useState(null);
  const links = ["Home", "Ecopanel", "Radar Verde", "Novo Ciclo", "Raízes"];

  useEffect(() => {
    async function carregarRegistros() {
      setLoading(true);
      setErro(null);
      try {
        const dados = await fetchResiduos();
        setRegistros(dados);
      } catch (error) {
        setErro(error.message || "Erro ao carregar registros");
      } finally {
        setLoading(false);
      }
    }
    carregarRegistros();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingSubmit(true);
    setErro(null);

    try {
      const dadosResiduo = {
        municipio: form.municipio,
        estado: form.estado,
        quantidadeGerada: Number(form.quantidadeGerada),
        taxaReciclagem: Number(form.taxaReciclagem),
        ano: Number(form.ano)
      };

      const modoEdicao = editandoId !== null;
      if (modoEdicao) {
        await atualizarResiduo(editandoId, dadosResiduo);
        setRegistros(registros.map(r =>
          r.id === editandoId ? { ...dadosResiduo, id: editandoId } : r
        ));
        setEditandoId(null);
        setRegistroEditado(null);
        setIsEditModalOpen(false);
      } else {
        const novoResiduo = await criarResiduo(dadosResiduo);
        setRegistros([...registros, novoResiduo]);
      }

      setForm({ municipio: "", estado: "", quantidadeGerada: "", taxaReciclagem: "", ano: "" });
      setMensagemSucesso(modoEdicao ? "atualizado" : "salvo");
      if (modoEdicao) {
        setSucessoGerenciar(true);
        setSucessoNovo(false);
        setTimeout(() => setSucessoGerenciar(false), 3000);
      } else {
        setSucessoNovo(true);
        setSucessoGerenciar(false);
        setTimeout(() => setSucessoNovo(false), 3000);
      }
    } catch (error) {
      setErro(error.message || "Erro ao salvar registro");
    } finally {
      setLoadingSubmit(false);
    }
  }

  function handleEditar(r) {
    setForm({
      municipio: r.municipio,
      estado: r.estado,
      quantidadeGerada: String(r.quantidadeGerada),
      taxaReciclagem: String(r.taxaReciclagem),
      ano: String(r.ano)
    });
    setEditandoId(r.id);
    setRegistroEditado(r);
    setIsEditModalOpen(true);
  }

  function handleFecharModal() {
    setIsEditModalOpen(false);
    setRegistroEditado(null);
    setEditandoId(null);
    setForm({ municipio: "", estado: "", quantidadeGerada: "", taxaReciclagem: "", ano: "" });
  }

  async function handleExcluir(id) {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        await deletarResiduo(id);
        setRegistros(registros.filter(r => r.id !== id));
        setMensagemSucesso("excluído");
        setSucessoGerenciar(true);
        setSucessoNovo(false);
        setTimeout(() => setSucessoGerenciar(false), 3000);
      } catch (error) {
        setErro(error.message || "Erro ao excluir registro");
      }
    }
  }

  async function handleCsv(e) {
    const file = e.target.files[0];
    if (file) {
      setCsvNome(file.name);
      setLoadingSubmit(true);
      setErro(null);
      try {
        await importarCsv(file);
        setMensagemSucesso("importado");
        setSucessoNovo(true);
        setSucessoGerenciar(false);
        setTimeout(() => setSucessoNovo(false), 3000);
        const dados = await fetchResiduos();
        setRegistros(dados);
      } catch (error) {
        setErro(error.message || "Erro ao importar CSV");
      } finally {
        setLoadingSubmit(false);
        setCsvNome(null);
        e.target.value = null;
      }
    }
  }

  return (
    <section className="novociclo-section" id="novo-ciclo">

      <nav className="home-navbar">
        <div className="logo">OIKOS</div>
        <ul className="nav-links">
          {links.map((link) => (
            <li
              key={link}
              className={hoveredLink === link || (!hoveredLink && activeLink === link) ? "active" : ""}
              onClick={() => {
                setActiveLink(link);
                scrollToSection(SECTION_IDS[link]);
              }}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link}
            </li>
          ))}
        </ul>
      </nav>

      <div className="novociclo-content">

        <div className="novociclo-left">
          <h2 className="novociclo-title">
            <span className="novociclo-title--dark">novo ciclo</span>
          </h2>
          <p className="novociclo-subtitle">Registre e gerencie os dados municipais!</p>
        </div>

        <div className="novociclo-right">

          <div className="novociclo-tabs">
            <button
              className={`novociclo-tab ${aba === "novo" ? "active" : ""}`}
              onClick={() => {
                setAba("novo");
                setEditandoId(null);
                setRegistroEditado(null);
                setForm({ municipio: "", estado: "", quantidadeGerada: "", taxaReciclagem: "", ano: "" });
              }}
            >
              + Novo Registro
            </button>
            <button
              className={`novociclo-tab ${aba === "gerenciar" ? "active" : ""}`}
              onClick={() => setAba("gerenciar")}
            >
              Gerenciar Dados
            </button>
          </div>

          {aba === "novo" && (
            <div className="novociclo-card">
              <h3 className="novociclo-card-title">
                {editandoId ? "Editando Registro" : "Novo Registro"}
              </h3>

              {sucessoNovo && (
                <div className="novociclo-sucesso">
                  Registro {mensagemSucesso} com sucesso!
                </div>
              )}

              {erro && (
                <div className="novociclo-erro">❌ {erro}</div>
              )}

              <form className="novociclo-form" onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label>Município</label>
                    <input type="text" name="municipio" placeholder="Ex: São Paulo" value={form.municipio} onChange={handleChange} required />
                  </div>
                  <div className="form-group form-group--small">
                    <label>Estado</label>
                    <select name="estado" value={form.estado} onChange={handleChange} required>
                      <option value="">UF</option>
                      {estadosBR.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantidade Gerada (ton)</label>
                    <input type="number" name="quantidadeGerada" placeholder="Ex: 1500,5" value={form.quantidadeGerada} onChange={handleChange} required min="0" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Taxa de Reciclagem (%)</label>
                    <input type="number" name="taxaReciclagem" placeholder="Ex: 72" value={form.taxaReciclagem} onChange={handleChange} required min="0" max="100" step="0.01" />
                  </div>
                  <div className="form-group form-group--small">
                    <label>Ano</label>
                    <input type="number" name="ano" placeholder="Ex: 2026" value={form.ano} onChange={handleChange} required min="2000" max="2099" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Importar CSV</label>
                  <label className="csv-upload">
                    <input type="file" accept=".csv" onChange={handleCsv} />
                    <span>{csvNome ? csvNome : "Clique para selecionar um arquivo .csv"}</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-salvar" disabled={loadingSubmit}>
                    {loadingSubmit ? "Salvando..." : (editandoId ? "Salvar Alterações" : "+ Adicionar Registro")}
                  </button>
                  {editandoId && (
                    <button type="button" className="btn-cancelar" onClick={() => {
                      setEditandoId(null);
                      setForm({ municipio: "", estado: "", quantidadeGerada: "", taxaReciclagem: "", ano: "" });
                    }}>
                      Cancelar
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

          {aba === "gerenciar" && (
            <div className="novociclo-card">
              <h3 className="novociclo-card-title">Registros Cadastrados</h3>

              {erro && <div className="novociclo-erro">❌ {erro}</div>}

              {sucessoGerenciar && (
                <div className="novociclo-sucesso">
                  Registro {mensagemSucesso} com sucesso!
                </div>
              )}

              {loading ? (
                <div className="novociclo-loading">Carregando registros...</div>
              ) : registros.length === 0 ? (
                <p className="novociclo-vazio">Nenhum registro encontrado.</p>
              ) : (
                <table className="novociclo-table">
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Estado</th>
                      <th>Qtd (ton)</th>
                      <th>Reciclagem (%)</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map(r => (
                      <tr key={r.id}>
                        <td>{r.municipio}</td>
                        <td>{r.estado}</td>
                        <td>{r.quantidadeGerada.toLocaleString("pt-BR")}</td>
                        <td>{r.taxaReciclagem}%</td>
                        <td>{r.ano}</td>
                        <td className="td-acoes">
                          <button className="btn-editar" onClick={() => handleEditar(r)}>✏️</button>
                          <button className="btn-excluir" onClick={() => handleExcluir(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {isEditModalOpen && (
            <div className="modal-overlay">
              <div className="modal-card">
                <button type="button" className="modal-close" onClick={handleFecharModal}>×</button>
                <h3 className="novociclo-card-title">Editar Registro</h3>

                {erro && <div className="novociclo-erro">❌ {erro}</div>}

                <form className="novociclo-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Município</label>
                      <input type="text" name="municipio" placeholder="Ex: São Paulo" value={form.municipio} onChange={handleChange} required />
                    </div>
                    <div className="form-group form-group--small">
                      <label>Estado</label>
                      <select name="estado" value={form.estado} onChange={handleChange} required>
                        <option value="">UF</option>
                        {estadosBR.map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantidade Gerada (ton)</label>
                      <input type="number" name="quantidadeGerada" placeholder="Ex: 1500,5" value={form.quantidadeGerada} onChange={handleChange} required min="0" step="0.01" />
                    </div>
                    <div className="form-group">
                      <label>Taxa de Reciclagem (%)</label>
                      <input type="number" name="taxaReciclagem" placeholder="Ex: 72" value={form.taxaReciclagem} onChange={handleChange} required min="0" max="100" step="0.01" />
                    </div>
                    <div className="form-group form-group--small">
                      <label>Ano</label>
                      <input type="number" name="ano" placeholder="Ex: 2026" value={form.ano} onChange={handleChange} required min="2000" max="2099" />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-salvar" disabled={loadingSubmit}>
                      {loadingSubmit ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <button type="button" className="btn-cancelar" onClick={handleFecharModal}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default NovoCicloSection;