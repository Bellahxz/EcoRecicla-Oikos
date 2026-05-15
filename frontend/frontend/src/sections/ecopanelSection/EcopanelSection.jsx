import "./EcopanelSection.css";

import sheetImg from "../../assets/images/sheet.png";
import truckImg from "../../assets/images/truck.png";
import attentionImg from "../../assets/images/attention.png";

<<<<<<< HEAD
function EcopanelSection() {

  function handleClick(route) {
    const el = document.getElementById(route);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
=======
function scrollToAnchor(anchorId) {
  const el = document.getElementById(anchorId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1

function EcopanelSection() {
  const cards = [
    {
      img: sheetImg,
      title: "Média reciclagem",
      description: <><strong>Percentual médio</strong> de resíduos desviados de aterros sanitários.</>,
      btn: "Ver metas!",
<<<<<<< HEAD
      route: "radar-media",
=======
      anchor: "radar-media",
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
    },
    {
      img: truckImg,
      title: "Volume total",
      description: <>Soma da quantidade gerada de <strong>todos os estados</strong> exibidos.</>,
      btn: "Ver ranking!",
<<<<<<< HEAD
      route: "radar-verde",
=======
      anchor: "radar-volume",
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
      highlight: true,
    },
    {
      img: attentionImg,
      title: "Zonas de atenção!",
      description: <>Municípios que <strong>não atingiram as metas</strong> de sustentabilidade.</>,
      btn: "Ver zonas!",
<<<<<<< HEAD
      route: "radar-zonas",
=======
      anchor: "radar-zonas",
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
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
<<<<<<< HEAD
            <button className="card-btn" onClick={() => handleClick(card.route)}>
=======
            <button
              className="card-btn"
              onClick={() => scrollToAnchor(card.anchor)}
            >
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
              {card.btn}
            </button>
          </div>
        ))}
      </div>

    </section>
  );
}

export default EcopanelSection;