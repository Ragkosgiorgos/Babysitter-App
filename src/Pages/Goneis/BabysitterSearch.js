import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";

function BabysitterSearch() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/data/ntantades.json")
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfiles(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "auto" }}>

        <Header log="not_connected" />

        <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>

                <div style={{ display: "flex", flex: 1 }}>
                    {/* Filters bar */}
                    <BabysitterFilters />
                                        
                    {/* Job postings */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "1em" }}>
                        {profiles.map((profile) => (
                            <JobPosting key={profile.id} profile={profile} />
                        ))}
                    </div>

                </div>

                <Footer />
                
            </div>
            
        </div>
        
    </div>
  );
}

export default BabysitterSearch;
