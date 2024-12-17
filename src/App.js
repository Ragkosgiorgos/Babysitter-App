import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import ReactDOM from "react-dom/client";
import BabysitterSearch from "./Pages/Goneis/BabysitterSearch";
import MainAggeliesPGU from "./Pages/Epaggelmaties/MainAggeliesPGU";
import DimiourgiaAggelias from "./Pages/Epaggelmaties/DimiourgiaAggelias";
import MainRantevouPGU from "./Pages/Epaggelmaties/MainRantevouPGU"
import AvailableRantevouPGU from "./Pages/Epaggelmaties/AvailableRantevouPGU";
import AddRantevouPGU from "./Pages/Epaggelmaties/AddRantevouPGU"
import ProepiskopisiRantevouPGU from "./Pages/Epaggelmaties/ProepiskopisiRantevouPGU";
import EditRantevouPGU from "./Pages/Epaggelmaties/EditRantevouPGU";
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
      
      <Route path="epaggelmaties/rantevou" element={<MainRantevouPGU />} />
      <Route path="epaggelmaties/rantevou/available" element={<AvailableRantevouPGU />} />
      <Route path="epaggelmaties/rantevou/available/add" element={<AddRantevouPGU />} />
      <Route path="epaggelmaties/rantevou/proepiskopisi" element={<ProepiskopisiRantevouPGU />} />
      <Route path="epaggelmaties/rantevou/available/edit" element={<EditRantevouPGU />} />
    </Routes>    
      </BrowserRouter>
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);