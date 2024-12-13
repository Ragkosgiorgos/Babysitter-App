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

function MainAggeliesPGU() {
  const [posts, setPosts] = useState([]); // Initialize as an empty array
  const uid = 1; //? Get the user id from the session

  const handleDelete = (id) => { //? Delete the post with the given id from the base
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
  };

  const navigate = useNavigate();

  const handleNewPost = () => {
    navigate("/nea-aggelia", { state: { id: uid } }); // Pass id as state
  };

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
        setPosts(data); // Update the state
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header log="not_connected" />

        <div style={{ display: "flex", flexDirection: "column" }}>

          <div style={{ flex: 1}}>

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
              
              <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white",
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}
                                onClick={handleNewPost}>
                Προσθήκη νέας αγγελίας
              </button>
              
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead style={{ lineHeight: "2em"}}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός Αγγελίας</th>
                    <th>Αιτήσεις ενδιαφέροντος</th>
                    <th>Κατάσταση Αγγελίας</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.filter(post => post.uid === uid)
                  .map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                      <td>{post.id}</td>
                      <td>{}</td>
                      <td>{post.status}</td>
                      <td style={{ display: "flex", justifyContent: "center", alignItems:"center", marginTop:"0.5em", gap:"10px" }}>
                        <VisibilityIcon style={{ cursor: "pointer" }} />
                        { post.status === "Σε προσωρινή αποθήκευση" ? <ArrowForwardIcon style={{ cursor: "pointer" }} onClick={() => navigate("/nea-aggelia", { state: { id: uid, stage: 2 } })} /> : <ArrowForwardIcon style={{ height: "0px" }}/> }
                        <DeleteForeverIcon style={{ cursor: "pointer" }} onClick={() => handleDelete(uid)} />
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
