import HomeSection from "../sections/homeSection/HomeSection";
import EcopanelSection from "../sections/ecopanelSection/EcopanelSection";
import RadarVerdeSection from "../sections/radarverdeSection/RadarVerdeSection";

function HomePage() {
  return (
    <>
      <div id="home"><HomeSection /></div>
      <div id="ecopanel"><EcopanelSection /></div>
      <div id="radar-verde"><RadarVerdeSection /></div>
    </>
  );
}

export default HomePage;