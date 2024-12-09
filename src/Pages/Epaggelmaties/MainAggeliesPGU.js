import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

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
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header log="not_connected" />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι Αγγελίες μου</h2>
              <Tooltip title={
                              <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column" }}>
                                <div><VisibilityIcon style={{ cursor: "pointer" }} />: προβολή αγγελίας</div>
                                <div><ArrowForwardIcon style={{ cursor: "pointer" }} />: επεξεργασία αγγελίας</div>
                                <div><DeleteForeverIcon style={{ cursor: "pointer" }}  />: διαγραφή αγγελίας</div>
                              </div>} placement="top" style={{marginTop:"3%"}}>
                  <Button> <InfoIcon /> </Button>
                </Tooltip>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", border: "none", 
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Προσθήκη νέας αγγελίας
              </button>
              
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός Αγγελίας</th>
                    <th>Αιτήσεις ενδιαφέροντος</th>
                    <th>Κατάσταση Αγγελίας</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id_aggelias} style={{ borderTop: "0.2px solid #333" }}>
                      <td>{profile.id_aggelias}</td>
                      <td>{profile.apasxolisi}</td>
                      <td>{profile.status}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "10%" }}>
                        <VisibilityIcon style={{ cursor: "pointer" }} />
                        <ArrowForwardIcon style={{ cursor: "pointer" }} />
                        <DeleteForeverIcon style={{ cursor: "pointer" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
            
          </div>

        </div>
      </div>
      
      <div>
        <Footer />
      </div>
      
    </div>
  );
}

export default MainAggeliesPGU;
