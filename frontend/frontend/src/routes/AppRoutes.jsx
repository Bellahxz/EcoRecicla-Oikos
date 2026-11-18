import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import NovoCicloSection from "../sections/novocicloSection/NovoCicloSection.jsx";

function AppRoutes() {
  return (
    <HashRouter>

      <Routes>

        <Route path="/" element={<HomePage />}/>
        <Route path="/novo-ciclo" element={<NovoCicloSection />} />

      </Routes>

    </HashRouter>
  );
}

export default AppRoutes;
