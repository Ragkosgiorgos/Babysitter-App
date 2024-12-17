import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProepiskopisiRantevouPGU(props) {
  const location = useLocation();
  const {id} = location.state || {};
  let navigate = useNavigate();
  

    const [profiles, setProfiles] = useState([]); // Initialize as an empty array
  
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

    const aitisi = profiles.find(profile => profile.id_aitisis === id);
    const redirect = ()=>{
      window.location.href = aitisi.link;
    }
    
    if(aitisi === undefined){return}
    return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header log="not_connected" />
  
          <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
  
            <div style={{ flex: 1, overflowY: "auto" }}>
  
              <Breadcrumbs />
              
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
  
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Προσωπικά στοιχεία κηδεμόνα:</th>
                  </tr>

                  <td>Όνομα: {aitisi.Onoma}</td>
                  <tr><td>Επίθετο: {aitisi.Epitheto}</td></tr>

                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Στοιχεία επικοινωνίας:</th>
                  </tr>
  
                  <td>Αριθμός κινητού τηλεφώνου: {aitisi.kinito}</td>
                  <tr><td>Email: {aitisi.email}</td></tr>                  
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Στοιχεία ραντεβού</th>
                  </tr>

                  <td>Ημερομηνία: {aitisi.date}</td>
                  <tr><td>Ώρα: {aitisi.time}</td></tr>
                  <tr><td>Τρόπος: {aitisi.tropos_synantisis}</td></tr> 
                  {aitisi.tropos_synantisis === "Διαδικτυακά" && (<tr><td>Σύνδεσμος:<Button onClick={redirect} 
                  style={{  height: "0%", backgroundColor: "#D9EAFD", color: "blue", marginTop: "0%"}} >{aitisi.link}</Button></td></tr> )}                 
                  {aitisi.tropos_synantisis === "Δια ζώσης" && (<tr><td>Διεύθυνση: {aitisi.address}</td></tr> )} 
                  </tbody>
                </table>
              </div>
              
  
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", marginRight: "70%" }}>
                
                <button onClick={()=> navigate(-1)}  style={{ width: "35%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
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
  
export default ProepiskopisiRantevouPGU;