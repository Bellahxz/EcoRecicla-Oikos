import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSection.css";
import Planet from "./Planet";

<<<<<<< HEAD
=======
// Mapa de cada link para o id da seção correspondente
const SECTION_IDS = {
  "Home": null,           // volta ao topo
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
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
function HomeSection() {
  const [activeLink, setActiveLink] = useState("Home");
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();

  const links = ["Home", "Ecopanel", "Radar Verde", "Novo Ciclo", "Raízes"];
<<<<<<< HEAD

  function handleLinkClick(link) {
    setActiveLink(link);
    if (link === "Novo Ciclo") {
      navigate("/novo-ciclo");
    } else {
      const ids = {
        "Home": "home",
        "Ecopanel": "ecopanel",
        "Radar Verde": "radar-verde",
        "Raízes": "raizes",
      };
      const el = document.getElementById(ids[link]);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }
=======
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1

  return (
    <section className="home-section" id="home">

      <nav className="home-navbar">

        <div className="logo">OIKOS</div>

        <ul className="nav-links">
          {links.map((link) => (
            <li
              key={link}
              className={
                hoveredLink === link ||
                (!hoveredLink && activeLink === link)
                  ? "active"
                  : ""
              }
<<<<<<< HEAD
              onClick={() => handleLinkClick(link)}
=======
              onClick={() => {
                setActiveLink(link);
                scrollToSection(SECTION_IDS[link]);
              }}
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link}
            </li>
          ))}
        </ul>

      </nav>

      <div className="home-content">

        <div className="home-text">

          <h1><strong>Dados que</strong><br /><strong className="highlight-text">Transformam!</strong></h1>

          <p>Guiando <strong>municípios</strong> rumo a um futuro com{" "}<strong>desperdício zero e máxima<br />eficiência circular.</strong></p>

          <div className="home-buttons">
<<<<<<< HEAD
            <button className="primary-btn" onClick={() => navigate("/novo-ciclo")}>
              + Novo Registro!
            </button>
            <button className="secondary-btn" onClick={() => navigate("/novo-ciclo?aba=gerenciar")}>
=======
            <button
              className="primary-btn"
              onClick={() => scrollToSection("novo-ciclo")}
            >
              + Novo Registro!
            </button>
            <button
              className="secondary-btn"
              onClick={() => scrollToSection("novo-ciclo")}
            >
>>>>>>> 70de6b8c9a422425f9fb1776883fd04808e4a0f1
              Gerenciar Dados!
            </button>
          </div>

        </div>

        <Planet />

      </div>

    </section>
  );
}

export default HomeSection;