import React from "react";
import { useNavigate } from 'react-router-dom';  // Import useNavigate and useLocation

function JobPosting(props){
  const profile = props.profile;
  const post = props.post;
  const id = post.id;

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  };
  
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    navigate(`/view-post?id=${id}`);
  }

  return(
    <div style={{marginTop:"5vh",marginLeft:"15%",backgroundColor:"#DBE2EF",width:"60%", borderRadius:"2vh"}}>

      <div  style={{display:"flex",flexDirection:"column"}}>  

        <div style={{display:"flex",flexDirection:"row"}}>

          <img style={{ marginRight: "2vh", marginLeft:"2vh", marginTop:"2vh" }} src={profile.img} width="100vw" height="100vh" className="d-inline-block align-top" alt=""/>

          <div style={{display:"flex",flexDirection:"column",marginTop:"2vh"}}>

            <h3> {profile.name} {profile.surname} </h3>
            <div style={{display:"flex", flexDirection:"column", marginLeft:"0%", marginRight:"0%"}}>
              <h6> <b>Πόλη:</b> {post.area} </h6>
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