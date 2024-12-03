import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function MainPGU(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header log="not_connected" />
      <div style={{ flex: 1,overflowY: "auto" }}>
        <div style={{display: "flex",justifyContent:"center"}}>
          <img style={{marginRight:"8px", position: "relative", zIndex: 1 }} src="/hero1.avif" width="100%" height="500vh"  alt="" />  
        </div>
        <div style={{backgroundColor:"white", position: "relative", zIndex: 2, marginTop:"-10vh", display:"flex",width:"50%", justifyContent:"center", margin: "0 auto", flexDirection:"column",border: "1px solid black",borderTopLeftRadius: "15px",borderTopRightRadius: "15px",borderBottomLeftRadius: "15px",borderBottomRightRadius: "15px",height: "20vh"}}>
          <h6 style={{textAlign:"center"}}>Βρείτε τον/την επαγγελματία που σας ταιριάζει!</h6>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginTop:"3%"}}>
            <div style={{display:"flex",width:"30%",outline:"1px solid black",marginLeft:"10%",borderTopLeftRadius: "15px",borderTopRightRadius: "15px",borderBottomLeftRadius: "15px",borderBottomRightRadius: "15px",height: "5vh"}}>
              <button style={{background: "none",border: "none",padding: 0,cursor: "pointer",width:"100%",display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between"}}>
              <span style={{fontWeight: 100,marginLeft:"3%"}}>Βρείτε αυτό που ψάχνετε</span>
              <img src="/search (1).svg" alt="Search" style={{ width: "24px", height: "24px" }} />
              </button>
            </div>
            
            <span style={{marginRight:"10%",textDecoration: "underline"}}>Βρείτε εργασία</span>
          </div>
        </div>
        <div style={{display: "flex",justifyContent:"center",marginTop:"25px"}}>
          <img style={{height:"25vh"}} src="/progress.png"  alt="" />  
        </div>
        <div style={{marginLeft:"2vh"}}><h6 >Δείτε ενδεικτικές αγγελίες για εργασία:</h6></div>
        <div style={{marginTop:"20px",marginLeft:"20px", display:"flex", gap:"5vh", justifyContent:"center"}}>
          
          <div style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px", backgroundColor:"#d3d3d3",height:"35vh",width:"20%",paddingTop:"10px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div>
              <span style={{marginLeft:"4%"}}>Τίτλος</span>
              <div style={{ borderBottom: "1px solid #000", marginTop: "10px" }}></div>
              <span style={{marginLeft:"4%"}}> Περιγραφή</span>
            </div>
            <div style={{display: "flex",justifyContent:"center"}}>
              <button style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px",width:"70%"}}>
              <span>Δείτε την αγγελία</span>
              </button>
            </div>
          </div>
          <div style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px", backgroundColor:"#d3d3d3",height:"35vh",width:"20%",paddingTop:"10px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div>
              <span style={{marginLeft:"4%"}}>Τίτλος</span>
              <div style={{ borderBottom: "1px solid #000", marginTop: "10px" }}></div>
              <span style={{marginLeft:"4%"}}> Περιγραφή</span>
            </div>
            <div style={{display: "flex",justifyContent:"center"}}>
              <button style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px",width:"70%"}}>
              <span>Δείτε την αγγελία</span>
              </button>
            </div>
          </div>
          <div style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px", backgroundColor:"#d3d3d3",height:"35vh",width:"20%",paddingTop:"10px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div>
              <span style={{marginLeft:"4%"}}>Τίτλος</span>
              <div style={{ borderBottom: "1px solid #000", marginTop: "10px" }}></div>
              <span style={{marginLeft:"4%"}}> Περιγραφή</span>
            </div>
            <div style={{display: "flex",justifyContent:"center"}}>
              <button style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px",width:"70%"}}>
              <span>Δείτε την αγγελία</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MainPGU;
