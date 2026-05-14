import { useState } from "react";
import "./RadarVerdeSection.css";
import truckImg from "../../assets/images/truck.png";
import sheetImg from "../../assets/images/sheet.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const dadosMeta = [
  { municipio: "Metrópole", valor: 1500 },
  { municipio: "Alpha", valor: 1200 },
  { municipio: "Cidade Bela", valor: 1100 },
  { municipio: "Paulínea", valor: 800 },
];

const dadosPorAno = {
  2020: [
    { municipio: "Metrópole", valor: 1300 },
    { municipio: "Alpha", valor: 950 },
    { municipio: "Cidade Bela", valor: 870 },
    { municipio: "Paulínea", valor: 620 },
  ],
  2021: [
    { municipio: "Metrópole", valor: 1450 },
    { municipio: "Alpha", valor: 1100 },
    { municipio: "Cidade Bela", valor: 980 },
    { municipio: "Paulínea", valor: 750 },
  ],
  2022: [
    { municipio: "Metrópole", valor: 1500 },
    { municipio: "Alpha", valor: 1200 },
    { municipio: "Cidade Bela", valor: 1100 },
    { municipio: "Paulínea", valor: 800 },
  ],
};

const META_RECICLAGEM = 85;

const dadosReciclagemPorAno = {
  2020: 58,
  2021: 65,
  2022: 72,
};

function GaugeCircle({ value, meta }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const progressDash = (value / 100) * circ;
  const metaDash = (meta / 100) * circ;

  return (
    <div className="gauge-wrapper">
      <svg viewBox="0 0 180 180" className="gauge-svg">
        <defs>
          <linearGradient id="circGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7BCDC5" />
            <stop offset="100%" stopColor="#3E6763" />
          </linearGradient>
        </defs>
        {/* trilha */}
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e8f5f3" strokeWidth="13" />
        {/* arco meta */}
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke="#b2dfdb"
          strokeWidth="13"
          strokeDasharray={`${metaDash} ${circ - metaDash}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "90px 90px" }}
        />
        {/* arco progresso */}
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke="url(#circGrad)"
          strokeWidth="13"
          strokeDasharray={`${progressDash} ${circ - progressDash}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "90px 90px" }}
        />
        {/* valor dentro do círculo */}
        <text x="90" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="38" fontWeight="700" fill="#3E6763" fontFamily="Poppins, sans-serif">
          {value}%
        </text>
        {/* label dentro do círculo */}
        <text x="90" y="108" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#888" fontFamily="Poppins, sans-serif">
          ↗ Em evolução
        </text>
      </svg>
    </div>
  );
}

function RadarVerdeSection() {
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [verMeta, setVerMeta] = useState(true);
  const [anoReciclagem, setAnoReciclagem] = useState(2022);

  const dadosAtivos = verMeta
    ? dadosMeta
    : dadosPorAno[anoSelecionado] || dadosPorAno[2022];

  const totalVolume = dadosAtivos.reduce((acc, d) => acc + d.valor, 0);

  function handleAno(ano) {
    setAnoSelecionado(ano);
    setVerMeta(false);
  }

  function handleMeta() {
    setVerMeta(true);
    setAnoSelecionado(null);
  }

  const mediaReciclagem = dadosReciclagemPorAno[anoReciclagem];

  return (
    <section className="radar-section">

      <div className="radar-header">
        <h2 className="radarverde-title">radar verde</h2>
        <p className="radarverde-subtitle">Transformando indicadores em ações!</p>
      </div>

      {/* BLOCO 1 — Volume total | âncora: #radar-volume */}
      <div id="radar-volume" className="radar-content">

        <div className="radar-left">
          <img src={truckImg} alt="Caminhão" className="radar-truck" />
          <div className="radar-volume-box">
            <span className="radar-volume-label">Volume total</span>
            <span className="radar-volume-number">
              {totalVolume.toLocaleString("pt-BR")}
            </span>
            <span className="radar-volume-unit">toneladas</span>
          </div>
        </div>

        <div className="radar-chart-box">
          <div className="radar-chart-header">
            <span className="radar-chart-title">Ranking de Geração Municipal</span>
            <div className="radar-filters">
              <button
                className={`radar-filter-btn ${verMeta ? "active" : ""}`}
                onClick={handleMeta}
              >
                Meta
              </button>
              {[2020, 2021, 2022].map((ano) => (
                <button
                  key={ano}
                  className={`radar-filter-btn ${anoSelecionado === ano && !verMeta ? "active" : ""}`}
                  onClick={() => handleAno(ano)}
                >
                  {ano}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosAtivos} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#72B7AE" />
                  <stop offset="100%" stopColor="#3E6763" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="municipio" tick={{ fill: "#ccc", fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#ccc", fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#2a1a4a", border: "none", borderRadius: 12, color: "white" }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar dataKey="valor" fill="url(#barGradient)" radius={[8, 8, 0, 0]} label={{ position: "top", fill: "white", fontSize: 13 }} />
              {verMeta && (
                <ReferenceLine y={1000} stroke="#fff" strokeDasharray="6 3" label={{ value: "Meta", fill: "#fff", fontSize: 13 }} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* BLOCO 2 — Média de reciclagem | âncora: #radar-media */}
      <div id="radar-media" className="radar-content radar-media-row">

        {/* card esquerdo roxo */}
        <div className="radar-media-left">
          <img src={sheetImg} alt="Folha" className="radar-sheet" />
          <div className="radar-media-left-content">
            <h3 className="radar-media-titulo">Média de eficiência</h3>
            <p className="radar-media-desc">
              <strong>Percentual médio</strong> de resíduos desviados de aterros sanitários.
            </p>
          </div>
        </div>

        {/* card direito branco */}
        <div className="radar-media-card-branco">

          {/* topo: ícone trending_up */}
          <div className="radar-media-topo">
            <span className="trending-up">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3E6763" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </span>
          </div>

          {/* gauge + badge */}
          <div className="radar-media-content">
            <GaugeCircle value={mediaReciclagem} meta={META_RECICLAGEM} />
            <div className="radar-meta-badge-dark">
              <span className="radar-meta-dot-green" />
              Meta anual: <strong>{META_RECICLAGEM}% de eficiência</strong>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default RadarVerdeSection;