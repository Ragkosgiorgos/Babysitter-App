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
import Viografiko from "./Pages/Epaggelmaties/Profile/Viografiko";
import ProepiskopisiAvailableRantevou from "./Pages/Epaggelmaties/Rantevou/ProepiskopisiAvailableRantevou";
import Dashboard from "./Components/Dashboard";
import Profiles from "./Pages/Profiles";
import Ratings from "./Pages/Ratings";
import Symfwnitika from "./Pages/Symfwnitka";
import Pliromes from "./Pages/Pliromes";
import ViewContract from "./Pages/ViewContract";
import PliromiEpaggelmatia from "./Pages/Goneis/Pliromes/PliromiEpaggelmatia";

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
          <Route path="/anazitisi" element={<BabysitterSearch />} />

          {/* Profile Pages & Viografiko */}
          <Route path="/dashboard/profiles" element={<Profiles/>} />
          <Route path="/dashboard/viografiko" element={<Viografiko />} />

          {/* Symfwnitika & Pliromes */}
          <Route path="/dashboard/Symfwnitika" element={<Symfwnitika />} />
          <Route path="/dashboard/Pliromes" element={<Pliromes />} />
          <Route path="/dashboard/Pliromes/neaPliromi" element={<PliromiEpaggelmatia />} />

          {/* Babysitter Aggelies */}
          <Route path="/dashboard/aggelies" element={<MainAggeliesPGU />} />
          <Route path="/dashboard/aggelies/add" element={<DimiourgiaAggelias />} />
          <Route path="/dashboard/aggelies/viewPost" element={<ViewJobPost />} />
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

          {/* Khdemones Syfmwnitika */}
          <Route path="/dashboard/Symfwnitika/add" element={<DimiourgiaSymbolaiou />} />
          <Route path="/dashboard/Symfwnitika/view/:contractId" element={<ViewContract />} />
          <Route path="/dashboard/Symfwnitika/rate" element={<CreateRating />} />
          <Route path="/dashboard/Symfwnitika/previewAksiologisi" element={<ViewRating />} />

          {/* Babysitter Symfwnitika */}
          <Route path="/dashboard/Symfwnitika/apantisi/:contractId" element={<ApodoxiSymbolaiou/>} />
          
          {/* Khdemones Aitiseis Endiaferontos */}
          <Route path="/dashboard/aitiseisEndiaferontos" element={<MainAitiseisEndiaferontosPGU />} />
          <Route path="/dashboard/aitiseisEndiaferontos/edit" element={<EditAitiseisEndiaferontosPGU />} />
          <Route path="/dashboard/aitiseisEndiaferontos/preview" element={<PreviewAitiseisEndiaferontosPGU />} />
          <Route path="/dashboard/aitiseisEndiaferontos/viewPost" element={<ViewJobPost />} />

          <Route path="*" element={<ErrorPage />} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;