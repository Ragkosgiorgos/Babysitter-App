import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
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

  // Fetch ratings data
  const [filteredPosts, setFilteredPosts] = useState([]);
  const fetchPosts = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'ratings'), where('id_b', '==', uuid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setFilteredPosts(posts);
      } catch (error) {
          console.error('Error fetching posts:', error);
      }
  };
  fetchPosts();

  // Fetch parents' data
  const [parents, setParents] = useState([]);
  const fetchParents = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'parent'));
          const querySnapshot = await getDocs(q);
          const parents = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setParents(parents);
      } catch (error) {
          console.error('Error fetching parents:', error);
      }
  };
  fetchParents();

  // Preview rating
  const previewRating = (rating_id) => {
    navigate(`preview-aksiologisis?id=${rating_id}`);
  };
  
  if (!user) { //? Εrror handling
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
                      <td>{parents.filter(parent => parent.userId === post.id_p).map(parent => parent.firstName + " " + parent.lastName)}</td>
                      <td>{post.rating}/5</td>
                      <td style={{ display: "flex", justifyContent: "center", alignItems:"center", marginTop:"0.5em", gap:"10px" }}>
                        <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => previewRating(post.id)} />
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
