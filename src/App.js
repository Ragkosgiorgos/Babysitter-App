import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import ReactDOM from "react-dom/client";
import BabysitterSearch from "./Pages/Goneis/BabysitterSearch";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPGU />} />
      <Route path="goneis" element={<MainGoneisPGU />} />
      <Route path="goneis/anazitisi" element={<BabysitterSearch />} />
      <Route path="epaggelmaties" element={<MainEpaggelmatiesPGU />} />
    </Routes>    
      </BrowserRouter>
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
