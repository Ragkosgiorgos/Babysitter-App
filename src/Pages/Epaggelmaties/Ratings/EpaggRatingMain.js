import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function EpaggRatingMain() {
  const navigate = useNavigate();

  // Check if user is logged in, get the user's UUID and fetch user data
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
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetch("/data/ratings.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  useEffect(() => {
      setFilteredPosts(posts.filter(post => post.id_b === uuid));
  }, [posts, uuid]);

  const handleDelete = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
  };

  const previewRating = (rating_id) => {
    navigate(`preview-aksiologisis?id=${rating_id}`);
  };
  
  if (!user) {
    return <div>Δεν βρέθηκε ο χρήστης με uid {uuid}</div>;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column" }}>

          <div style={{ flex: 1}}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι Αξιολογήσεις μου</h2>
              <Tooltip title={
                              <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column" }}>
                                <div><VisibilityIcon style={{ cursor: "pointer" }} />: προβολή αξιολόγησης</div>
                                <div><DeleteForeverIcon style={{ cursor: "pointer" }}  />: διαγραφή αξιολόγησης</div>
                              </div>} placement="top" style={{marginTop:"3%"}}>
                  <Button> <InfoIcon /> </Button>
                </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead style={{ lineHeight: "2em"}}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός αξιολόγησης</th>
                    <th>Κηδεμόνας</th>
                    <th>Βαθμολογία</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.filter(post => post.id_b === uuid)
                  .map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                      <td>{post.id}</td>
                      <td>{/*//? Put Khdemonas' uuid */}</td>
                      <td>{post.rating}/5</td>
                      <td style={{ display: "flex", justifyContent: "center", alignItems:"center", marginTop:"0.5em", gap:"10px" }}>
                        <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => previewRating(post.id)} />
                        <DeleteForeverIcon style={{ cursor: "pointer" }} onClick={() => handleDelete(post.id)} />
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

export default EpaggRatingMain;
