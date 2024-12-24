import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import BabysitterSearch from "./Pages/Goneis/BabysitterSearch";
import MainAggeliesPGU from "./Pages/Epaggelmaties/Aggelies/MainAggeliesPGU";
import DimiourgiaAggelias from "./Pages/Epaggelmaties/Aggelies/DimiourgiaAggelias";
import MainRantevouPGU from "./Pages/Epaggelmaties/MainRantevouPGU"
import AvailableRantevouPGU from "./Pages/Epaggelmaties/AvailableRantevouPGU";
import AddRantevouPGU from "./Pages/Epaggelmaties/AddRantevouPGU"
import ProepiskopisiRantevouPGU from "./Pages/Epaggelmaties/ProepiskopisiRantevouPGU";
import EditRantevouPGU from "./Pages/Epaggelmaties/EditRantevouPGU";
import ViewJobPost from "./Pages/Goneis/ViewJobPost";
import PreviewAggelias from "./Pages/Epaggelmaties/Aggelies/PreviewAggelias";
import GonRatingMain from "./Pages/Goneis/Ratings/GonRatingMain";
import EpaggRatingMain from "./Pages/Epaggelmaties/Ratings/EpaggRatingMain";
import ViewRating from "./Pages/Epaggelmaties/Ratings/ViewRating";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import DimiourgiaSymbolaiou from "./Pages/Goneis/DimiourgiaSymbolaiou";

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>
          <Route path="profile" element={<Profile/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register/>} />

          <Route path="/" element={<MainPGU />} />
          <Route path="goneis" element={<MainGoneisPGU />} />

          <Route path="anazitisi" element={<BabysitterSearch />} />

          <Route path="epaggelmaties" element={<MainEpaggelmatiesPGU />} />
          <Route path="aggelies" element={<MainAggeliesPGU />} />
          
          <Route path="nea-aggelia" element={<DimiourgiaAggelias />} />
          <Route path="neo-symbolaio" element={<DimiourgiaSymbolaiou />} />
          <Route path="preview-aggelias" element={<PreviewAggelias />} />

          <Route path="view-post" element={<ViewJobPost />} />
          
          <Route path="epaggelmaties/rantevou" element={<MainRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available" element={<AvailableRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/add" element={<AddRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/proepiskopisi" element={<ProepiskopisiRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/edit" element={<EditRantevouPGU />} />

          <Route path="goneis/ratings" element={<GonRatingMain />} />

          <Route path="epaggelmaties/ratings" element={<EpaggRatingMain />} />

          <Route path="preview-aksiologisis" element={<ViewRating />} />

          <Route path="*" element={<h1>404 - Not Found</h1>} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;