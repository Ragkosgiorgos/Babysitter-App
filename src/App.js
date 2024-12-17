import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import ReactDOM from "react-dom/client";
import BabysitterSearch from "./Pages/Goneis/BabysitterSearch";
import MainAggeliesPGU from "./Pages/Epaggelmaties/MainAggeliesPGU";
import DimiourgiaAggelias from "./Pages/Epaggelmaties/DimiourgiaAggelias";
import DimiourgiaSymbolaiou from "./Pages/Goneis/DimiourgiaSymbolaiou";
import PreviewAggelias from "./Pages/Epaggelmaties/PreviewAggelias";
import GoneisProfile from "./Pages/Goneis/GoneisProfile";
import EpaggelmatiesProfile from "./Pages/Epaggelmaties/EpaggelmatiesProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPGU />} />
      <Route path="goneis" element={<MainGoneisPGU />} />
      <Route path="goneis/anazitisi" element={<BabysitterSearch />} />
      <Route path="epaggelmaties" element={<MainEpaggelmatiesPGU />} />
      <Route path="aggelies" element={<MainAggeliesPGU />} />
      <Route path="nea-aggelia" element={<DimiourgiaAggelias />} />
      <Route path="neo-symbolaio" element={<DimiourgiaSymbolaiou />} />
      <Route path="preview-aggelias" element={<PreviewAggelias />} />
      <Route path="goneis/profile" element = {<GoneisProfile />} />
      <Route path="epaggelmaties/profile" element = {<EpaggelmatiesProfile />} />
    </Routes>    
      </BrowserRouter>
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
