import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function MainAitiseisEndiaferontosPGU() {
  const navigate = useNavigate(); 
  const routeChangeEdit = (id_aitisis) =>{ 
    navigate(`edit?id=${id_aitisis}`);
  };

  const routeChangePreview = (id_aitisis) =>{ 
    navigate(`preview?id=${id_aitisis}`);
  };

  const [uuid, setUuid] = useState(null);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
          }
      });
      return () => unsubscribe();
  }, []);

  const [user, setUser] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUser(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

  const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'), where('UserId', '==', uuid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setPosts(posts);
      } catch (error) {
          console.error('Error fetching posts:', error);
      }
  };
  fetchPosts();

  //? Error handling
  if (!user) {
    return <div>Error fetching user data</div>;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι αιτήσεις ενδιαφέροντός μου</h2>
              <Tooltip title={
                              <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column" }}>
                                <div><VisibilityIcon   style={{ cursor: "pointer" }} />: στοιχεία ραντεβού</div>
                                <div><DeleteForeverIcon style={{ cursor: "pointer" }}  />: διαγραφή ραντεβού</div>
                                <div><ArrowForwardIcon style={{ cursor: "pointer" }} />: επεξεργασία αίτησης</div>
                              </div>} placement="top" style={{marginTop:"3%"}}>
                  <Button> <InfoIcon /> </Button>
                </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός αίτησης</th>
                    <th>Αγγελία</th>
                    <th>Κατάσταση</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333" }}>
                      <td>{post.id}</td>
                      <td>{post.postid}</td>
                      <td>{post.status}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "10%" }}>
                      {post.status === "Oριστική υποβολή" && (<VisibilityIcon onClick={() => routeChangePreview(post.id)  }
                      style={{ cursor: "pointer" }}/>)}
                      {post.status === "Σε προσωρινή αποθήκευση" && (<ArrowForwardIcon onClick={() => routeChangeEdit(post.id)  }
                      style={{ cursor: "pointer" }}/>)}
                        <DeleteForeverIcon style={{ cursor: "pointer" }} />
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

export default MainAitiseisEndiaferontosPGU;