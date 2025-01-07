import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function GonRatingMain() {
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

  // Fetch user's ratings from the database
  const [filteredPosts, setFilteredPosts] = useState([]);
  const fetchPosts = async () => {
    try {
        const q = query(collection(FIREBASE_DB, 'ratings'), where('id_p', '==', uuid));
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

  // Find the babysitters
  const [babysitters, setBabysitters] = useState([]);
  const fetchBabysitters = async () => {
    try {
      const q = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'babysitter'));
      const querySnapshot = await getDocs(q);
      const babysitters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
      }));
      setBabysitters(babysitters);
    } catch (error) {
      console.error('Error fetching babysitters:', error);
    }
  };
  fetchBabysitters();

  // Find the babysitter's name to display in the table
  const findBabysitter = (id) => {
    const babysitter = babysitters.find(babysitter => babysitter.userId === id);
    return babysitter ? babysitter.firstName + " " + babysitter.lastName : "Δεν βρέθηκε";
  };

  // Delete a post from the database
  const handleDelete = (id) => {
    const updatedPosts = filteredPosts.filter(post => post.id !== id);
    setFilteredPosts(updatedPosts);

    // Delete the post from the database
    const postRef = doc(FIREBASE_DB, 'ratings', id);
    deleteDoc(postRef);
  };

  const previewRating = (id) => {
    navigate(`/epaggelmaties/ratings/preview-aksiologisis?id=${id}`);
  };

  const handleNewRating = () => {
    navigate("/goneis/ratings/add");
  };

  if (!user) {
    navigate("/404");
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white",
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}
                                onClick={handleNewRating}>
                Προσθήκη νέας αξιολόγησης
              </button>
              
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead style={{ lineHeight: "2em"}}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Επαγγελματίας</th>
                    <th>Συνολική βαθμολογία</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                      <td>{findBabysitter(post.id_b)}</td>
                      <td>{post.rating}</td>
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

export default GonRatingMain;
