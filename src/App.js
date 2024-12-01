import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from './Pages/mainPGU';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MainPGU />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
