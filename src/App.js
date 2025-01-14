import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import BabysitterSearch from "./Pages/Goneis/BabysitterSearch";
import MainAggeliesPGU from "./Pages/Epaggelmaties/Aggelies/MainAggeliesPGU";
import DimiourgiaAggelias from "./Pages/Epaggelmaties/Aggelies/DimiourgiaAggelias";
import MainRantevouPGU from "./Pages/Epaggelmaties/MainRantevouPGU"
import AvailableRantevouPGU from "./Pages/Epaggelmaties/Rantevou/AvailableRantevouPGU";
import AddRantevouPGU from "./Pages/Epaggelmaties/Rantevou/AddRantevouPGU"
import ProepiskopisiRantevouPGU from "./Pages/Epaggelmaties/ProepiskopisiRantevouPGU";
import EditRantevouPGU from "./Pages/Epaggelmaties/Rantevou/EditRantevouPGU";
import ViewJobPost from "./Pages/Goneis/ViewJobPost";
import PreviewAggelias from "./Pages/Epaggelmaties/Aggelies/PreviewAggelias";
import GonRatingMain from "./Pages/Goneis/Ratings/GonRatingMain";
import EpaggRatingMain from "./Pages/Epaggelmaties/Ratings/EpaggRatingMain";
import ViewRating from "./Pages/Epaggelmaties/Ratings/ViewRating";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import DimiourgiaSymbolaiou from "./Pages/Goneis/DimiourgiaSymbolaiou";
import ApodoxiSymbolaiou from "./Pages/Epaggelmaties/Symbolaia/ApodoxiSymbolaiou";
import MainSymbolaiaEpaggelmatiesPGU from "./Pages/Epaggelmaties/Symbolaia/MainSymbolaiaEpaggelmatiesPGU";
import EpaggelmatiasProfile from "./Pages/Epaggelmaties/EpaggelmatiesProfile";
import GoneisProfile from "./Pages/Goneis/GoneisProfile";
import CreateRating from "./Pages/Goneis/Ratings/CreateRating";
import MainSymbolaiaGoneisPGU from "./Pages/Goneis/MainSymbolaiaGoneis";
import MainAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/MainAitiseisEndiaferontosPGU";
import EditAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/EditAitiseisEndiaferontosPGU";
import PreviewAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/PreviewAitiseisEndiaferontos";
import ErrorPage from "./Components/ErrorPage";
import ProvoliSymbolaiou from "./Pages/Goneis/ProvoliSymbolaiou";
import ViewAvailabilityPGU from "./Pages/Goneis/AitiseisEndiaferontos/ViewAvailabilityPGU";

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

          <Route path="/epaggelmaties/profile" element={<EpaggelmatiasProfile />} />
          <Route path="/goneis/profile" element={<GoneisProfile />} />

          <Route path="anazitisi" element={<BabysitterSearch />} />

          <Route path="epaggelmaties" element={<MainEpaggelmatiesPGU />} />
          <Route path="aggelies" element={<MainAggeliesPGU />} />
          
          <Route path="nea-aggelia" element={<DimiourgiaAggelias />} />
          <Route path="preview-aggelias" element={<PreviewAggelias />} />
          <Route path="view-post" element={<ViewJobPost />} />

          <Route path="neo-symbolaio" element={<DimiourgiaSymbolaiou />} />
         
          
          <Route path="epaggelmaties/rantevou" element={<MainRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available" element={<AvailableRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/add" element={<AddRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/proepiskopisi" element={<ProepiskopisiRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/edit" element={<EditRantevouPGU />} />
          <Route path="/epaggelmaties/symbolaia/apantisi/:contractId" element={<ApodoxiSymbolaiou/>} />

          <Route path="epaggelmaties/symbolaia" element={<MainSymbolaiaEpaggelmatiesPGU />} />

          <Route path="goneis/ratings" element={<GonRatingMain />} />
          <Route path="goneis/ratings/add" element={<CreateRating />} />
          <Route path="goneis/symbolaia" element={<MainSymbolaiaGoneisPGU />} />
          <Route path="/goneis/symbolaia/provoli/:contractId" element={<ProvoliSymbolaiou/>} />

          <Route path="epaggelmaties/ratings" element={<EpaggRatingMain />} />

          <Route path="epaggelmaties/ratings/preview-aksiologisis" element={<ViewRating />} />

          <Route path="/goneis/profile/aitiseis-endiaferontos" element={<MainAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/profile/aitiseis-endiaferontos/edit" element={<EditAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/profile/aitiseis-endiaferontos/preview" element={<PreviewAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/view-availability" element={<ViewAvailabilityPGU />} />
          <Route path="*" element={<h1>404 - Not Found</h1>} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;