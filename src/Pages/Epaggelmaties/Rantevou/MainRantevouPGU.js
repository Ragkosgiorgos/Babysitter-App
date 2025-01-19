import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import Loader from "../../../Components/Loader";

function MainRantevouPGU() { 
  const navigate = useNavigate();

  const [uuid, setUuid] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch user's rantevou data from the database
  useEffect(() => {
    if (uuid) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'rantevou'), where('id_b', '==', uuid));
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

  function isbooked(dates){
    return dates.id_p !== "";
  }

  const routeChangeAvailable = () => { 
    navigate(`available`);
  };

  const routeChangePreview = (id) => { 
    navigate(`proepiskopisi?id=${id}`);
  };

  if (loading) {
    return <Loader />;
  }
  
  if (!uuid) {
    navigate("/404");
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα ραντεβού μου</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button  onClick={routeChangeAvailable} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", 
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Επεξεργασία διαθέσιμων ραντεβού
              </button>
              
              
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Ημερομηνία</th>
                    <th>Τρόπος</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.filter(isbooked).map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333" }}>
                      <td>{post.date}</td>
                      <td>{post.tropos_synantisis}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "10%" }}>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangePreview(post.id)}>Προβολή</span>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: "10px" }}>Δεν υπάρχουν ραντεβού</td>
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

export default MainRantevouPGU;
