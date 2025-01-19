import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/MainPGU";
import MainGoneisPGU from "./Pages/Goneis/MainGoneisPGU";
import MainEpaggelmatiesPGU from "./Pages/Epaggelmaties/MainEpaggelmatiesPGU";
import BabysitterSearch from "./Pages/BabysitterSearch";
import MainAggeliesPGU from "./Pages/Epaggelmaties/Aggelies/MainAggeliesPGU";
import DimiourgiaAggelias from "./Pages/Epaggelmaties/Aggelies/DimiourgiaAggelias";
import MainRantevouPGU from "./Pages/Epaggelmaties/Rantevou/MainRantevouPGU"
import AvailableRantevouPGU from "./Pages/Epaggelmaties/Rantevou/AvailableRantevouPGU";
import AddRantevouPGU from "./Pages/Epaggelmaties/Rantevou/AddRantevouPGU"
import ProepiskopisiRantevouPGU from "./Pages/Epaggelmaties/Rantevou/ProepiskopisiRantevouPGU";
import EditRantevouPGU from "./Pages/Epaggelmaties/Rantevou/EditRantevouPGU";
import ViewJobPost from "./Pages/ViewJobPost";
import PreviewAggelias from "./Pages/Epaggelmaties/Aggelies/PreviewAggelias";
import ViewRating from "./Pages/Epaggelmaties/Ratings/ViewRating";
import Login from "./Components/Login";
import Register from "./Components/Register";
import DimiourgiaSymbolaiou from "./Pages/Goneis/Symbolaia/DimiourgiaSymbolaiou";
import ApodoxiSymbolaiou from "./Pages/Epaggelmaties/Symbolaia/ApodoxiSymbolaiou"
import CreateRating from "./Pages/Goneis/Ratings/CreateRating";
import MainAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/MainAitiseisEndiaferontosPGU";
import EditAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/EditAitiseisEndiaferontosPGU";
import PreviewAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/PreviewAitiseisEndiaferontos";
import ErrorPage from "./Components/ErrorPage";
import ProvoliSymbolaiou from "./Pages/Goneis/Symbolaia/ProvoliSymbolaiou";
import Viografiko from "./Pages/Epaggelmaties/Profile/Viografiko";
import ProepiskopisiAvailableRantevou from "./Pages/Epaggelmaties/Rantevou/ProepiskopisiAvailableRantevou";
import Dashboard from "./Components/Dashboard";
import Profiles from "./Pages/Profiles";
import Ratings from "./Pages/Ratings";
import ProvoliSymbolaiouEpaggelmatia from "./Pages/Epaggelmaties/Symbolaia/ProvoliSymbolaiaEpaggelmaties";
import Symfwnitika from "./Pages/Symfwnitka";
import Pliromes from "./Pages/Pliromes";

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<MainPGU />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register/>} />

          <Route path="khdemones" element={<MainGoneisPGU />} />
          <Route path="babysitters" element={<MainEpaggelmatiesPGU />} />

          {/* Profile Pages & Viografiko */}
          <Route path="/dashboard/profiles" element={<Profiles/>} />
          <Route path="/dashboard/viografiko" element={<Viografiko />} />
          <Route path="/dashboard/Symfwnitika" element={<Symfwnitika />} />
          <Route path="/dashboard/Pliromes" element={<Pliromes />} />

          {/* Babysitter Search */}
          <Route path="/anazitisi" element={<BabysitterSearch />} />

          {/* Babysitter Aggelies */}
          <Route path="dashboard/aggelies" element={<MainAggeliesPGU />} />
          <Route path="neaAggelia" element={<DimiourgiaAggelias />} />
          <Route path="previewAggelias" element={<PreviewAggelias />} />
          <Route path="/aggelies/viewPost" element={<ViewJobPost />} />
          <Route path="/anazitisi/viewPost" element={<ViewJobPost />} />
          
          {/* Rantevou */}
          <Route path="/dashboard/rantevou" element={<MainRantevouPGU />} />
          <Route path="/dashboard/rantevou/available" element={<AvailableRantevouPGU />} />
          <Route path="/dashboard/rantevou/available/add" element={<AddRantevouPGU />} />
          <Route path="/dashboard/rantevou/available/view" element={<ProepiskopisiAvailableRantevou />} />
          <Route path="/dashboard/rantevou/proepiskopisi" element={<ProepiskopisiRantevouPGU />} />
          <Route path="/dashboard/rantevou/available/edit" element={<EditRantevouPGU />} />

          {/* Khdemones Ratings */}
          <Route path="/dashboard/ratings" element={<Ratings />} />
          <Route path="/dashboard/ratings/add" element={<CreateRating />} />

          {/* Babysitter Ratings */}
          <Route path="/dashboard/ratings/previewAksiologisi" element={<ViewRating />} />

          {/* Khdemones Symbolaia */}
          <Route path="/dashboard/Symfwnitika/add" element={<DimiourgiaSymbolaiou />} />
          <Route path="/goneis/Symfwnitika/view/:contractId" element={<ProvoliSymbolaiou/>} />

          {/* Babysitter Symbolaia */}
          <Route path="/dashboard/Symfwnitika/apantisi/:contractId" element={<ApodoxiSymbolaiou/>} />
          <Route path="/dashboard/Symfwnitika/view/:contractId" element={<ProvoliSymbolaiouEpaggelmatia/>} />

          {/* Khdemones Aitiseis Endiaferontos */}
          <Route path="/dashboard/aitiseis-endiaferontos" element={<MainAitiseisEndiaferontosPGU />} />
          <Route path="/dashboard/aitiseis-endiaferontos/edit" element={<EditAitiseisEndiaferontosPGU />} />
          <Route path="/dashboard/aitiseis-endiaferontos/preview" element={<PreviewAitiseisEndiaferontosPGU />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;