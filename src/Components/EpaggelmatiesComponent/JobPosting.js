import React from "react";
import { useNavigate } from 'react-router-dom';  // Import useNavigate and useLocation

function JobPosting(props){
  const {Onoma,Epitheto,Polh,Ilikia,Ekpaideush,Apasxolisi,Filoksenia,imgn, id} = props.profile;
  
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    console.log("Redirecting to job posting with id:",id);
    navigate(`/aggelies/${id}`);
  }

  return(
    <div style={{marginTop:"5vh",marginLeft:"15%",backgroundColor:"#DBE2EF",width:"60%", borderRadius:"2vh"}}>

      <div  style={{display:"flex",flexDirection:"column"}}>  

        <div style={{display:"flex",flexDirection:"row"}}>

          <img style={{ marginRight: "2vh", marginLeft:"2vh", marginTop:"2vh" }} src={imgn} width="100vw" height="100vh" className="d-inline-block align-top" alt=""/>

          <div style={{display:"flex",flexDirection:"column",marginTop:"2vh"}}>

            <h3> {Onoma} {Epitheto} </h3>
            <div style={{display:"flex", flexDirection:"column", marginLeft:"0%", marginRight:"0%"}}>
              <h6> <b>Πόλη:</b> {Polh} </h6>
              <h6> <b>Ηλικία:</b> {Ilikia} </h6>
              <h6> <b>Εκπαίδευση:</b> {Ekpaideush} </h6>
              <h6> <b>Χρόνος Απασχόλησης:</b> {Apasxolisi} </h6>
              <h6> <b>Φιλοξενία στον χώρο του/της:</b> {Filoksenia} </h6>
            </div>

          </div>
            
        </div>

        <button style={{ alignSelf: "center", width: "40%",marginTop:"2vh", borderRadius:"1.2vh", border:"0.1vh solid black", marginBottom:"1vh", }} onClick={() => handleRedirect(id)}  > 
          <span >Δείτε περισσότερα!</span>
        </button>

      </div>

    </div>
  );
}

export default JobPosting;