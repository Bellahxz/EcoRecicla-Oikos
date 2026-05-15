import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const dadosEstados = {
  2020: {
    SP: { municipio: "São Paulo", estado: "SP", status: "Atenção", toneladas: 12300 },
    RJ: { municipio: "Rio de Janeiro", estado: "RJ", status: "Crítica", toneladas: 8900 },
    MG: { municipio: "Belo Horizonte", estado: "MG", status: "Monitoramento", toneladas: 7600 },
    RS: { municipio: "Porto Alegre", estado: "RS", status: "Em dia", toneladas: 5400 },
    PR: { municipio: "Curitiba", estado: "PR", status: "Em dia", toneladas: 4800 },
    SC: { municipio: "Florianópolis", estado: "SC", status: "Em dia", toneladas: 3200 },
    BA: { municipio: "Salvador", estado: "BA", status: "Crítica", toneladas: 6700 },
    GO: { municipio: "Goiânia", estado: "GO", status: "Atenção", toneladas: 3900 },
    PE: { municipio: "Recife", estado: "PE", status: "Crítica", toneladas: 5100 },
    CE: { municipio: "Fortaleza", estado: "CE", status: "Atenção", toneladas: 4600 },
    AM: { municipio: "Manaus", estado: "AM", status: "Monitoramento", toneladas: 3800 },
    PA: { municipio: "Belém", estado: "PA", status: "Crítica", toneladas: 4200 },
    MT: { municipio: "Cuiabá", estado: "MT", status: "Atenção", toneladas: 2900 },
    MS: { municipio: "Campo Grande", estado: "MS", status: "Monitoramento", toneladas: 2600 },
    ES: { municipio: "Vitória", estado: "ES", status: "Em dia", toneladas: 2100 },
    MA: { municipio: "São Luís", estado: "MA", status: "Crítica", toneladas: 3500 },
    PB: { municipio: "João Pessoa", estado: "PB", status: "Atenção", toneladas: 2200 },
    RN: { municipio: "Natal", estado: "RN", status: "Atenção", toneladas: 2000 },
    AL: { municipio: "Maceió", estado: "AL", status: "Crítica", toneladas: 1800 },
    PI: { municipio: "Teresina", estado: "PI", status: "Crítica", toneladas: 1900 },
    SE: { municipio: "Aracaju", estado: "SE", status: "Monitoramento", toneladas: 1400 },
    RO: { municipio: "Porto Velho", estado: "RO", status: "Monitoramento", toneladas: 1600 },
    TO: { municipio: "Palmas", estado: "TO", status: "Atenção", toneladas: 1300 },
    AC: { municipio: "Rio Branco", estado: "AC", status: "Crítica", toneladas: 900 },
    AP: { municipio: "Macapá", estado: "AP", status: "Crítica", toneladas: 800 },
    RR: { municipio: "Boa Vista", estado: "RR", status: "Monitoramento", toneladas: 700 },
    DF: { municipio: "Brasília", estado: "DF", status: "Em dia", toneladas: 3100 },
  },
  2021: {
    SP: { municipio: "São Paulo", estado: "SP", status: "Monitoramento", toneladas: 13100 },
    RJ: { municipio: "Rio de Janeiro", estado: "RJ", status: "Atenção", toneladas: 9400 },
    MG: { municipio: "Belo Horizonte", estado: "MG", status: "Em dia", toneladas: 8100 },
    RS: { municipio: "Porto Alegre", estado: "RS", status: "Em dia", toneladas: 5700 },
    PR: { municipio: "Curitiba", estado: "PR", status: "Em dia", toneladas: 5100 },
    SC: { municipio: "Florianópolis", estado: "SC", status: "Em dia", toneladas: 3500 },
    BA: { municipio: "Salvador", estado: "BA", status: "Atenção", toneladas: 7100 },
    GO: { municipio: "Goiânia", estado: "GO", status: "Monitoramento", toneladas: 4200 },
    PE: { municipio: "Recife", estado: "PE", status: "Atenção", toneladas: 5400 },
    CE: { municipio: "Fortaleza", estado: "CE", status: "Monitoramento", toneladas: 4900 },
    AM: { municipio: "Manaus", estado: "AM", status: "Atenção", toneladas: 4000 },
    PA: { municipio: "Belém", estado: "PA", status: "Atenção", toneladas: 4500 },
    MT: { municipio: "Cuiabá", estado: "MT", status: "Monitoramento", toneladas: 3100 },
    MS: { municipio: "Campo Grande", estado: "MS", status: "Em dia", toneladas: 2800 },
    ES: { municipio: "Vitória", estado: "ES", status: "Em dia", toneladas: 2300 },
    MA: { municipio: "São Luís", estado: "MA", status: "Atenção", toneladas: 3700 },
    PB: { municipio: "João Pessoa", estado: "PB", status: "Monitoramento", toneladas: 2400 },
    RN: { municipio: "Natal", estado: "RN", status: "Monitoramento", toneladas: 2200 },
    AL: { municipio: "Maceió", estado: "AL", status: "Atenção", toneladas: 1900 },
    PI: { municipio: "Teresina", estado: "PI", status: "Atenção", toneladas: 2100 },
    SE: { municipio: "Aracaju", estado: "SE", status: "Em dia", toneladas: 1600 },
    RO: { municipio: "Porto Velho", estado: "RO", status: "Atenção", toneladas: 1800 },
    TO: { municipio: "Palmas", estado: "TO", status: "Monitoramento", toneladas: 1500 },
    AC: { municipio: "Rio Branco", estado: "AC", status: "Atenção", toneladas: 1000 },
    AP: { municipio: "Macapá", estado: "AP", status: "Crítica", toneladas: 850 },
    RR: { municipio: "Boa Vista", estado: "RR", status: "Atenção", toneladas: 800 },
    DF: { municipio: "Brasília", estado: "DF", status: "Em dia", toneladas: 3400 },
  },
  2022: {
    SP: { municipio: "São Paulo", estado: "SP", status: "Em dia", toneladas: 14200 },
    RJ: { municipio: "Rio de Janeiro", estado: "RJ", status: "Monitoramento", toneladas: 10100 },
    MG: { municipio: "Belo Horizonte", estado: "MG", status: "Em dia", toneladas: 8800 },
    RS: { municipio: "Porto Alegre", estado: "RS", status: "Em dia", toneladas: 6100 },
    PR: { municipio: "Curitiba", estado: "PR", status: "Em dia", toneladas: 5500 },
    SC: { municipio: "Florianópolis", estado: "SC", status: "Em dia", toneladas: 3900 },
    BA: { municipio: "Salvador", estado: "BA", status: "Monitoramento", toneladas: 7600 },
    GO: { municipio: "Goiânia", estado: "GO", status: "Em dia", toneladas: 4600 },
    PE: { municipio: "Recife", estado: "PE", status: "Monitoramento", toneladas: 5800 },
    CE: { municipio: "Fortaleza", estado: "CE", status: "Em dia", toneladas: 5300 },
    AM: { municipio: "Manaus", estado: "AM", status: "Monitoramento", toneladas: 4300 },
    PA: { municipio: "Belém", estado: "PA", status: "Atenção", toneladas: 4800 },
    MT: { municipio: "Cuiabá", estado: "MT", status: "Em dia", toneladas: 3400 },
    MS: { municipio: "Campo Grande", estado: "MS", status: "Em dia", toneladas: 3100 },
    ES: { municipio: "Vitória", estado: "ES", status: "Em dia", toneladas: 2600 },
    MA: { municipio: "São Luís", estado: "MA", status: "Monitoramento", toneladas: 4000 },
    PB: { municipio: "João Pessoa", estado: "PB", status: "Em dia", toneladas: 2700 },
    RN: { municipio: "Natal", estado: "RN", status: "Em dia", toneladas: 2500 },
    AL: { municipio: "Maceió", estado: "AL", status: "Monitoramento", toneladas: 2100 },
    PI: { municipio: "Teresina", estado: "PI", status: "Atenção", toneladas: 2300 },
    SE: { municipio: "Aracaju", estado: "SE", status: "Em dia", toneladas: 1800 },
    RO: { municipio: "Porto Velho", estado: "RO", status: "Em dia", toneladas: 2000 },
    TO: { municipio: "Palmas", estado: "TO", status: "Em dia", toneladas: 1700 },
    AC: { municipio: "Rio Branco", estado: "AC", status: "Monitoramento", toneladas: 1100 },
    AP: { municipio: "Macapá", estado: "AP", status: "Atenção", toneladas: 950 },
    RR: { municipio: "Boa Vista", estado: "RR", status: "Monitoramento", toneladas: 900 },
    DF: { municipio: "Brasília", estado: "DF", status: "Em dia", toneladas: 3700 },
  },
};

const statusColors = {
  "Crítica": "#ff4d4d",
  "Atenção": "#ffa500",
  "Monitoramento": "#a855f7",
  "Em dia": "#22c55e",
};

export default function MapaBrasil({ anoInicial = 2022 }) {
  const svgRef = useRef(null);
  const [ano, setAno] = useState(anoInicial);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 600;
    const height = 480;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const dados = dadosEstados[ano];

    fetch("https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-100-mun.json")
      .then(r => r.json())
      .then(geojson => {
        const projection = d3.geoMercator().fitSize([width, height], geojson);
        const path = d3.geoPath().projection(projection);

        svg.selectAll("path")
          .data(geojson.features)
          .join("path")
          .attr("d", path)
          .attr("fill", d => {
            const sigla = d.properties.UF;
            const info = dados[sigla];
            return info ? statusColors[info.status] : "#e0e0e0";
          })
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.5)
          .style("cursor", "pointer")
          .style("transition", "all 0.2s")
          .on("mousemove", function(event, d) {
            const sigla = d.properties.UF;
            const info = dados[sigla];
            const [x, y] = d3.pointer(event);
            
            setTooltip({
              visible: true,
              x: x,
              y: y,
              data: info 
                ? { ...info, sigla, municipioReal: d.properties.name }
                : { sigla, municipio: sigla, municipioReal: d.properties.name, status: "Sem dados", toneladas: "-" },
            });
            
            d3.select(this)
              .attr("opacity", 0.8)
              .attr("stroke-width", 1.5)
              .raise(); // Traz o estado para frente ao passar o mouse
          })
          .on("mouseleave", function() {
            setTooltip({ visible: false });
            d3.select(this)
              .attr("opacity", 1)
              .attr("stroke-width", 0.5);
          });
      });
  }, [ano]);

  return (
    <div className="mapa-brasil-wrapper">
      <div className="mapa-brasil-filtros">
        {[2020, 2021, 2022].map(a => (
          <button
            key={a}
            className={`mapa-ano-btn ${ano === a ? "active" : ""}`}
            onClick={() => setAno(a)}
          >
            {a}
          </button>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "auto", display: "block" }} />

        {tooltip.visible && tooltip.data && (
          <div
            className="mapa-tooltip"
            style={{ 
                left: tooltip.x + 20, 
                top: tooltip.y - 20 
            }}
          >
            <span className="tooltip-municipio">{tooltip.data.municipioReal || tooltip.data.municipio}</span>
            <div className="tooltip-estado">Estado: <strong>{tooltip.data.sigla || tooltip.data.estado}</strong></div>
            <div className="tooltip-status" style={{ color: statusColors[tooltip.data.status] || "#666" }}>
              <span style={{ fontSize: '18px' }}>•</span> {tooltip.data.status}
            </div>
            <div className="tooltip-ton">
              {tooltip.data.toneladas !== "-"
                ? `${Number(tooltip.data.toneladas).toLocaleString("pt-BR")} toneladas`
                : "Sem dados cadastrados"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}