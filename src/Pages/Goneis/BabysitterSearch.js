import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";


function BabysitterSearch(){

    
    return(
        <div style={{ display: 'flex', flexDirection: 'column', height: "100vh",overflow:"auto" }}>
            <Header log="not_connected" />
            <div style={{ flex: 1, overflowY: "auto" }}>
            <Breadcrumbs/>
            <BabysitterFilters/>
            </div>
            <Footer/>
        </div>
    );


}

export default BabysitterSearch;