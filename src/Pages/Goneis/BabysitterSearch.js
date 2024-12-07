import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";

function BabysitterSearch() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: "100vh", overflow: "auto" }}>
            <div>
                <Header log="not_connected" />
                <div style={{ flex: 1, overflowY: "auto" }}>
                    <Breadcrumbs />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <BabysitterFilters />
                        <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                            <JobPosting />
                            <JobPosting />
                            <JobPosting />
                            <JobPosting />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BabysitterSearch;

