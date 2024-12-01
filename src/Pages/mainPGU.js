import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function MainPGU(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header log="not_connected" />
      
      <div style={{ flex: 1 }}>
      </div>
      

      <Footer />
    </div>
  );
}

export default MainPGU;
