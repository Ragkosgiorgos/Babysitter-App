import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";

function MainAggeliesPGU() {
  const [profiles, setProfiles] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetch("/data/aggelies.json")
      .then((response) => {
        console.log("Response:", response); // Debug the response object
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse as JSON
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setProfiles(data); // Update the state
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
            <h2 style={{fontWeight:"bold", textAlign:"center"}}>Οι Αγγελίες μου</h2>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>

                
                <Footer />
            </div>
            
        </div>
        
    </div>
  );
}

export default MainAggeliesPGU;