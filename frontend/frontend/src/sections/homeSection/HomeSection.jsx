import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSection.css";
import Planet from "./Planet";

function HomeSection() {
  const [activeLink, setActiveLink] = useState("Home");
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();

  const links = ["Home", "Ecopanel", "Radar Verde", "Novo Ciclo", "Raízes"];

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

  return (
    <section className="home-section">

      <nav className="home-navbar">

        <div className="logo">
          OIKOS
        </div>

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
              onClick={() => handleLinkClick(link)}
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

          <h1><strong>Dados que</strong><br/><strong className="highlight-text">Transformam!</strong></h1>

          <p>Guiando <strong>municípios</strong> rumo a um futuro com{" "} <strong>desperdício zero e máxima<br/>eficiência circular.</strong></p>

          <div className="home-buttons">
            <button className="primary-btn" onClick={() => navigate("/novo-ciclo")}>
              + Novo Registro!
            </button>
            <button className="secondary-btn" onClick={() => navigate("/novo-ciclo?aba=gerenciar")}>
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