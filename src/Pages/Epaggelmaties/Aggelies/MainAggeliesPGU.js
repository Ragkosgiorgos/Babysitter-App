import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function MainAggeliesPGU() {
    const navigate = useNavigate();
    const [uuid, setUuid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    // Check if user is logged in, get the user's UUID
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          setUuid(user.uid);
        } else {
          navigate("/404");
        }
      });
      return () => unsubscribe();
    }, [navigate]);

    // Fetch the job posts' data from the database
    useEffect(() => {
      if (uuid) {
        const fetchPosts = async () => {
          try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, 'aggelies'), where('uid', '==', uuid));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(posts);
          } catch (error) {
            console.error('Error fetching posts:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchPosts();
      }
    }, [uuid]);

    const handleDelete = async (id) => {
      try {
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        const postRef = doc(FIREBASE_DB, 'aggelies', id);
        await deleteDoc(postRef);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    };

    // Redirects
    const handleNewPost = () => navigate("/nea-aggelia");
    const previewAggeliaRender = (aggelia_id) => navigate(`/preview-aggelias?aggelia_id=${aggelia_id}`);
    const handleTempView = (post_id) => navigate(`/nea-aggelia?step=2&post_id=${post_id}`);

    if (loading) {
      return <Loader />;
    }

    return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />

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
                <Tooltip title={
                                <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column", fontSize:"1.2em", textAlign:"left" }}>
                                  Για την δημιουργία αγγελίας χρειάζονται:
                                  <ul> 
                                    <li>Τίτλος αγγελίας</li>
                                    <li>Περιγραφή αγγελίας</li>
                                    <li>Επιλογή πλήρης/μερικής απασχόλησης</li>
                                    <li>Επιλογή περιοχής</li>
                                    <li>Επιλογή διαθεσιμότητας(ΣΚ/Καθημερινές/Και τα δύο)</li>
                                  </ul>
                                </div>} placement="top">
                    <Button> <InfoIcon /> </Button>
                  </Tooltip>

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
                    {posts.map((post, index) => (
                      <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                        <td>{index + 1}</td>
                        <td>{/*//? Decide if to put Aitiseis Endiaferontos count */}</td>
                        <td>{post.status}</td>
                        <td style={{ display: "flex", justifyContent: "center", alignItems:"center", marginTop:"0.5em", gap:"10px" }}>
                          { post.status !== "Σε προσωρινή αποθήκευση" ? <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => previewAggeliaRender(post.id)} /> : <VisibilityIcon style={{ height: "0px" }}/> }
                          { post.status === "Σε προσωρινή αποθήκευση" ? <ArrowForwardIcon style={{ cursor: "pointer" }} onClick={() => handleTempView(post.id)} /> : <ArrowForwardIcon style={{ height: "0px" }}/> }
                          <DeleteForeverIcon style={{ cursor: "pointer" }} onClick={() => handleDelete(post.id)} />
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={4}>Δεν υπάρχουν αγγελίες</td>
                      </tr>
                    )}
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
