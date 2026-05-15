import "./EcopanelSection.css";

import sheetImg from "../../assets/images/sheet.png";
import truckImg from "../../assets/images/truck.png";
import attentionImg from "../../assets/images/attention.png";

function EcopanelSection() {

  function handleClick(route) {
    const el = document.getElementById(route);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const cards = [
    {
      img: sheetImg,
      title: "Média reciclagem",
      description: <><strong>Percentual médio</strong> de resíduos desviados de aterros sanitários.</>,
      btn: "Ver metas!",
      route: "radar-media",
    },
    {
      img: truckImg,
      title: "Volume total",
      description: <>Soma da quantidade gerada de <strong>todos os municípios</strong> exibidos.</>,
      btn: "Ver ranking!",
      route: "radar-verde",
      highlight: true,
    },
    {
      img: attentionImg,
      title: "Zonas de atenção!",
      description: <>Municípios que <strong>não atingiram as metas</strong> de sustentabilidade.</>,
      btn: "Ver zonas!",
      route: "radar-zonas",
    },
  ];

  return (
    <section className="ecopanel-section">

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
            <button className="card-btn" onClick={() => handleClick(card.route)}>
              {card.btn}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
}

export default EcopanelSection;