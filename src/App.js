import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPGU from "./Pages/mainPGU";
import MainGoneisPGU from "./Pages/Goneis/mainGoneisPGU";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPGU />} />
      <Route path="goneis" element={<MainGoneisPGU />} />
    </Routes>    
      </BrowserRouter>
    </div>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
