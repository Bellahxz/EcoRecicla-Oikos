import { useState } from "react";
import "./NovoCicloSection.css";

const estadosBR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO"
];

const registrosMock = [
  { id: 1, municipio: "Metrópole", estado: "SP", quantidade: 1500, reciclagem: 72, ano: 2026 },
  { id: 2, municipio: "Alpha", estado: "RJ", quantidade: 1200, reciclagem: 65, ano: 2026 },
  { id: 3, municipio: "Cidade Bela", estado: "MG", quantidade: 1100, reciclagem: 58, ano: 2025 },
  { id: 4, municipio: "Paulínea", estado: "SP", quantidade: 800, reciclagem: 45, ano: 2025 },
];

function NovoCicloSection() {
  const [aba, setAba] = useState("novo");
  const [form, setForm] = useState({
    municipio: "", estado: "", quantidade: "", reciclagem: "", ano: ""
  });
  const [registros, setRegistros] = useState(registrosMock);
  const [editandoId, setEditandoId] = useState(null);
  const [csvNome, setCsvNome] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const links = ["Home", "Ecopanel", "Radar Verde", "Novo Ciclo", "Raízes"];
  const [activeLink, setActiveLink] = useState("Novo Ciclo");
  const [hoveredLink, setHoveredLink] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editandoId !== null) {
      setRegistros(registros.map(r =>
        r.id === editandoId ? { ...form, id: editandoId, quantidade: Number(form.quantidade), reciclagem: Number(form.reciclagem), ano: Number(form.ano) } : r
      ));
      setEditandoId(null);
    } else {
      setRegistros([...registros, { ...form, id: Date.now(), quantidade: Number(form.quantidade), reciclagem: Number(form.reciclagem), ano: Number(form.ano) }]);
    }
    setForm({ municipio: "", estado: "", quantidade: "", reciclagem: "", ano: "" });
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  }

  function handleEditar(r) {
    setForm({ municipio: r.municipio, estado: r.estado, quantidade: String(r.quantidade), reciclagem: String(r.reciclagem), ano: String(r.ano) });
    setEditandoId(r.id);
    setAba("novo");
  }

  function handleExcluir(id) {
    setRegistros(registros.filter(r => r.id !== id));
  }

  function handleCsv(e) {
    const file = e.target.files[0];
    if (file) setCsvNome(file.name);
  }

  return (
    <section className="novociclo-section">

      <nav className="home-navbar">
        <div className="logo">OIKOS</div>
        <ul className="nav-links">
          {links.map((link) => (
            <li
              key={link}
              className={hoveredLink === link || (!hoveredLink && activeLink === link) ? "active" : ""}
              onClick={() => setActiveLink(link)}
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
              onClick={() => { setAba("novo"); setEditandoId(null); setForm({ municipio: "", estado: "", quantidade: "", reciclagem: "", ano: "" }); }}
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
                {editandoId ? "✏️ Editando Registro" : "📋 Novo Registro"}
              </h3>

              {sucesso && (
                <div className="novociclo-sucesso">
                  ✅ Registro {editandoId ? "atualizado" : "salvo"} com sucesso!
                </div>
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
                    <input type="number" name="quantidade" placeholder="Ex: 1500" value={form.quantidade} onChange={handleChange} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Taxa de Reciclagem (%)</label>
                    <input type="number" name="reciclagem" placeholder="Ex: 72" value={form.reciclagem} onChange={handleChange} required min="0" max="100" />
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
                    <span className="csv-icon">📂</span>
                    <span>{csvNome ? csvNome : "Clique para selecionar um arquivo .csv"}</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-salvar">
                    {editandoId ? "Salvar Alterações" : "+ Adicionar Registro"}
                  </button>
                  {editandoId && (
                    <button type="button" className="btn-cancelar" onClick={() => { setEditandoId(null); setForm({ municipio: "", estado: "", quantidade: "", reciclagem: "", ano: "" }); }}>
                      Cancelar
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

          {aba === "gerenciar" && (
            <div className="novociclo-card">
              <h3 className="novociclo-card-title">📊 Registros Cadastrados</h3>
              {registros.length === 0 ? (
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
                        <td>{r.quantidade.toLocaleString("pt-BR")}</td>
                        <td>{r.reciclagem}%</td>
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

        </div>

      </div>

    </section>
  );
}

export default NovoCicloSection;