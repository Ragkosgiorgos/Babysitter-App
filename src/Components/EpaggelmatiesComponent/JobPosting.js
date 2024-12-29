import React from "react";
import { useNavigate } from 'react-router-dom';
import { calculateAge, capitalizeWords } from "../../Utils/Methods/index";

function JobPosting(props){
  const profile = props.profile;
  const post = props.post;
  const id = post.id;
  
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    navigate(`/view-post?id=${id}`);
  }

  return(
    <div style={{marginTop:"5vh",marginLeft:"15%",backgroundColor:"#DBE2EF",width:"60%", borderRadius:"2vh"}}>

      <div  style={{display:"flex",flexDirection:"column"}}>  

        <div style={{display:"flex",flexDirection:"row"}}>

          <h6 style={{ marginTop: "3%" , backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "2%", marginRight: "3%" }}>
                  {profile.img ? "Photo" : "No photo"}
          </h6>

          <div style={{display:"flex",flexDirection:"column",marginTop:"2vh"}}>

            <h3> {profile.firstName} {profile.lastName} </h3>
            <div style={{display:"flex", flexDirection:"column", marginLeft:"0%", marginRight:"0%"}}>
              <h6> <b>Πόλη:</b> {capitalizeWords(post.area)} </h6>
              <h6> <b>Ηλικία:</b> {calculateAge(profile.birthDate)} </h6>
              <h6> <b>Εκπαίδευση:</b> {profile.education} </h6>
              <h6> <b>Χρόνος Απασχόλησης:</b> {post.time} </h6>
              <h6> <b>Φιλοξενία στον χώρο του/της:</b> {post.accomodation} </h6>
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
