import "./EcopanelSection.css";
import { useNavigate } from "react-router-dom";

import sheetImg from "../../assets/images/sheet.png";
import truckImg from "../../assets/images/truck.png";
import attentionImg from "../../assets/images/attention.png";

function EcopanelSection() {
  const navigate = useNavigate();

  const cards = [
    {
      img: sheetImg,
      title: "Média reciclagem",
      description: <><strong>Percentual médio</strong> de resíduos desviados de aterros sanitários.</>,
      btn: "Ver metas!",
      route: "/radar-verde/media",
    },
    {
      img: truckImg,
      title: "Volume total",
      description: <>Soma da quantidade gerada de <strong>todos os municípios</strong> exibidos.</>,
      btn: "Ver ranking!",
      route: "/radar-verde/volume",
      highlight: true,
    },
    {
      img: attentionImg,
      title: "Zonas de atenção!",
      description: <>Municípios que <strong>não atingiram as metas</strong> de sustentabilidade.</>,
      btn: "Ver zonas!",
      route: "/radar-verde/zonas",
    },
  ];

  return (
    <section className="ecopanel-section">

      <div className="ecopanel-header">
        <h2 className="ecopanel-title">ecopanel</h2>
        <p className="ecopanel-subtitle">inteligência e gestão de resíduos!</p>
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
            <button className="card-btn" onClick={() => navigate(card.route)}>
              {card.btn}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
}

export default EcopanelSection;