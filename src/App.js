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
import Profile from "./Components/Profile";
import DimiourgiaSymbolaiou from "./Pages/Goneis/Symbolaia/DimiourgiaSymbolaiou";
import ApodoxiSymbolaiou from "./Pages/Epaggelmaties/Symbolaia/ApodoxiSymbolaiou";
import MainSymbolaiaEpaggelmatiesPGU from "./Pages/Epaggelmaties/Symbolaia/MainSymbolaiaEpaggelmatiesPGU";
import CreateRating from "./Pages/Goneis/Ratings/CreateRating";
import MainSymbolaiaGoneisPGU from "./Pages/Goneis/Symbolaia/MainSymbolaiaGoneis";
import MainAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/MainAitiseisEndiaferontosPGU";
import EditAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/EditAitiseisEndiaferontosPGU";
import PreviewAitiseisEndiaferontosPGU from "./Pages/Goneis/AitiseisEndiaferontos/PreviewAitiseisEndiaferontos";
import ErrorPage from "./Components/ErrorPage";
import ProvoliSymbolaiou from "./Pages/Goneis/Symbolaia/ProvoliSymbolaiou";
import MainPliromesGoneis from "./Pages/Goneis/Pliromes/MainPliromesGoneis";
import PliromiEpaggelmatia from "./Pages/Goneis/Pliromes/PliromiEpaggelmatia";
import MainPliromesEpaggelmaties from "./Pages/Epaggelmaties/Pliromes/MainPliromesEpaggelmaties";
import Viografiko from "./Pages/Epaggelmaties/Profile/Viografiko";
import ViewAvailabilityPGU from "./Pages/Goneis/AitiseisEndiaferontos/ViewAvailabilityPGU";
import Dashboard from "./Components/Dashboard";
import Profiles from "./Pages/Profiles";
import Ratings from "./Pages/Ratings";
import ProvoliSymbolaiouEpaggelmatia from "./Pages/Epaggelmaties/Symbolaia/ProvoliSymbolaiaEpaggelmaties";

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<MainPGU />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="profile" element={<Profile/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register/>} />

          <Route path="goneis" element={<MainGoneisPGU />} />
          <Route path="epaggelmaties" element={<MainEpaggelmatiesPGU />} />

          {/* Profile Pages & Viografiko */}
          <Route path="/dashboard/profiles" element={<Profiles/>} />
          <Route path="dashboard/viografiko" element={<Viografiko />} />

          {/* Babysitter Search */}
          <Route path="anazitisi" element={<BabysitterSearch />} />

          {/* Babysitter Aggelies */}
          <Route path="dashboard/aggelies" element={<MainAggeliesPGU />} />
          <Route path="neaAggelia" element={<DimiourgiaAggelias />} />
          <Route path="previewAggelias" element={<PreviewAggelias />} />
          <Route path="viewPost" element={<ViewJobPost />} />
          
          {/* Rantevou */}
          <Route path="epaggelmaties/rantevou" element={<MainRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available" element={<AvailableRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/add" element={<AddRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/proepiskopisi" element={<ProepiskopisiRantevouPGU />} />
          <Route path="epaggelmaties/rantevou/available/edit" element={<EditRantevouPGU />} />

          {/* Khdemones Ratings */}
          <Route path="/ratings" element={<Ratings />} />
          <Route path="goneis/ratings/add" element={<CreateRating />} />

          {/* Babysitter Ratings */}
          <Route path="/ratings/previewAksiologisi" element={<ViewRating />} />

          {/* Khdemones Symbolaia */}
          <Route path="/goneis/symbolaia" element={<MainSymbolaiaGoneisPGU />} />
          <Route path="/neo-symbolaio" element={<DimiourgiaSymbolaiou />} />
          <Route path="/goneis/symbolaia/provoli/:contractId" element={<ProvoliSymbolaiou/>} />

          {/* Babysitter Symbolaia */}
          <Route path="epaggelmaties/symbolaia" element={<MainSymbolaiaEpaggelmatiesPGU />} />
          <Route path="/epaggelmaties/symbolaia/apantisi/:contractId" element={<ApodoxiSymbolaiou/>} />
          <Route path="/epaggelmaties/symbolaia/provoli/:contractId" element={<ProvoliSymbolaiouEpaggelmatia/>} />

          {/* Khdemones Pliromes */}
          <Route path="/goneis/symbolaia/pliromes" element={<MainPliromesGoneis/>} />
          <Route path="/goneis/symbolaia/pliromes/nea-pliromi" element={<PliromiEpaggelmatia/>} />

          {/* Babysitter Pliromes */}
          <Route path="/epaggelmaties/pliromes" element={<MainPliromesEpaggelmaties/>} />

          {/* Khdemones Aitiseis Endiaferontos */}
          <Route path="/goneis/profile/aitiseis-endiaferontos" element={<MainAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/profile/aitiseis-endiaferontos/edit" element={<EditAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/profile/aitiseis-endiaferontos/preview" element={<PreviewAitiseisEndiaferontosPGU />} />
          <Route path="/goneis/view-availability" element={<ViewAvailabilityPGU />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;