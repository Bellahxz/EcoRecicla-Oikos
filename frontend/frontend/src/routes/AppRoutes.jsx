import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import NovoCicloSection from "../sections/novocicloSection/NovoCicloSection.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />}/>
        <Route path="/novo-ciclo" element={<NovoCicloSection />} />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;