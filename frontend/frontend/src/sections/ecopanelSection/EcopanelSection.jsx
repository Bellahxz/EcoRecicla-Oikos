import "./EcopanelSection.css";

import sheetImg from "../../assets/images/sheet.png";
import truckImg from "../../assets/images/truck.png";
import attentionImg from "../../assets/images/attention.png";

function scrollToAnchor(anchorId) {
  const el = document.getElementById(anchorId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function EcopanelSection() {
  const cards = [
    {
      img: sheetImg,
      title: "Média reciclagem",
      description: <><strong>Percentual médio</strong> de resíduos desviados de aterros sanitários.</>,
      btn: "Ver metas!",
      anchor: "radar-media",
    },
    {
      img: truckImg,
      title: "Volume total",
      description: <>Soma da quantidade gerada de <strong>todos os estados</strong> exibidos.</>,
      btn: "Ver ranking!",
      anchor: "radar-volume",
      highlight: true,
    },
    {
      img: attentionImg,
      title: "Zonas de atenção!",
      description: <>Municípios que <strong>não atingiram as metas</strong> de sustentabilidade.</>,
      btn: "Ver zonas!",
      anchor: "radar-zonas",
    },
  ];

  return (
    <section className="ecopanel-section" id="ecopanel">

      <div className="ecopanel-header">
        <h2 className="ecopanel-title">ecopanel</h2>
        <p className="ecopanel-subtitle">Inteligência e gestão de resíduos!</p>
      </div>

      <div className="ecopanel-cards">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`ecopanel-card ${card.highlight ? "ecopanel-card--highlight" : ""}`}
          >
            <img src={card.img} alt={card.title} className="card-img" />
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <button
              className="card-btn"
              onClick={() => scrollToAnchor(card.anchor)}
            >
              {card.btn}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
}

export default EcopanelSection;