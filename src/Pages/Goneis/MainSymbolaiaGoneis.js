import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import ReplayIcon from '@mui/icons-material/Replay';



function MainSymbolaiaGoneisPGU() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/apodoxi-symbolaiou'); 
  };

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column" }}>

          <div style={{ flex: 1 }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα συμβόλαια μου</h2>
              <Tooltip title={
                <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection: "column" }}>
                  <div><VisibilityIcon style={{ cursor: "pointer" }} />: προβολή συμβολαίου</div>
                  <div><DeleteForeverIcon style={{ cursor: "pointer",color:"black" }} />: διαγραφή συμβολαίου</div>
                  <div><ReplayIcon
                        style={{ cursor: "pointer", marginLeft: "10px" }}/>:Ανανέωση συμβολαίου</div>
                </div>
              } placement="top" style={{ marginTop: "3%" }}>
                <Button> <InfoIcon /> </Button>
              </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "80%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                <thead style={{ lineHeight: "2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός συμβολαίου</th>
                    <th>Ονοματεπώνυμο συμβαλλόμενου</th>
                    <th>Κατάσταση συμβολαίου</th>
                    <th>Αξιολόγηση</th>
                    <th style={{width:"150px"}}></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Hliana</td>
                    <td>Σε ισχύ</td>
                    <td>Προβολή</td>
                    <DeleteForeverIcon 
      style={{ cursor: "pointer", marginLeft: "10px", color: "black" }} 
      
    />
    <ReplayIcon
      style={{ cursor: "pointer", marginLeft: "10px"}}
    />
    <VisibilityIcon
    style={{ cursor: "pointer",marginLeft:"10px" }} 
  />
                  </tr>
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

export default MainSymbolaiaGoneisPGU;
