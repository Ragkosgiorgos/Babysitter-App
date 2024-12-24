import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";

function AvailableRantevouPGU() {
  const [profiles, setProfiles] = useState([]); // Initialize as an empty array

  const navigate = useNavigate();  
  const routeChangeAdd = () =>{ 
    navigate("./add");
  };

  const routeChangeEdit = () =>{ 
    navigate("./edit");
  };

  useEffect(() => {
    fetch("/data/rantevou.json")
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
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα διαθέσιμα ραντεβού μου</h2>
              <Tooltip title={
                              <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column" }}>
                                {/* <div><  style={{ cursor: "pointer" }} />: στοιχεία ραντεβού</div> */}
                                <div><DeleteForeverIcon style={{ cursor: "pointer" }}  />: διαγραφή ραντεβού</div>
                              </div>} placement="top" style={{marginTop:"3%"}}>
                  <Button> <InfoIcon /> </Button>
                </Tooltip>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button onClick={routeChangeAdd} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", 
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Προσθήκη διαθέσιμου ραντεβού
              </button>
              
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Ημερομηνία</th>
                    <th>Ώρα</th>
                    <th>Τρόπος</th>     
                    <th>Ενέργειες</th>               
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id_aitisis} style={{ borderTop: "0.2px solid #333" }}>
                      <td>{profile.date}</td>
                      <td>{profile.time}</td>
                      <td>{profile.tropos_synantisis}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "0%" }}>
                      <Button onClick={routeChangeEdit}> <img style={{ cursor: "pointer" ,marginRight: "0px", position: "relative" }} src="/edit.svg" width="40%" height="20vh" alt="" /> </Button>
                      <DeleteForeverIcon style={{ cursor: "pointer" ,marginTop: "4px"}} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", marginRight: "70%" }}>
              
              <button onClick={()=> navigate(-1)} style={{ width: "35%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
                                borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Επιστροφή
              </button>
              
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

export default AvailableRantevouPGU;
