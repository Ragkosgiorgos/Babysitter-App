import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function GonRatingMain() {
  const navigate = useNavigate();

  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [babysitters, setBabysitters] = useState([]);

  // Check if user is logged in and get the UUID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's ratings
  useEffect(() => {
    if (uuid) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'ratings'), where('id_p', '==', uuid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFilteredPosts(posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [uuid]);

  // Fetch babysitters
  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        setLoading(true);
        const q = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'babysitter'));
        const querySnapshot = await getDocs(q);
        const babysitters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBabysitters(babysitters);
      } catch (error) {
        console.error('Error fetching babysitters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBabysitters();
  }, []);

  // Find babysitter's name
  const findBabysitter = (id) => {
    const babysitter = babysitters.find(babysitter => babysitter.userId === id);
    return babysitter ? babysitter.firstName + " " + babysitter.lastName : "Δεν βρέθηκε";
  };

  // Delete a post
  const handleDelete = async (id) => {
    try {
      const updatedPosts = filteredPosts.filter(post => post.id !== id);
      setFilteredPosts(updatedPosts);

      const postRef = doc(FIREBASE_DB, 'ratings', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Navigate to preview
  const previewRating = (id) => {
    navigate(`/ratings/previewAksiologisi?id=${id}`);
  };

  // Navigate to add new rating
  const handleNewRating = () => {
    navigate("/ratings/add");
  };

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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι Αξιολογήσεις μου</h2>
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
                    <th>Babysitter</th>
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
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => previewRating(post.id)}> Προβολή </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
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

export default GonRatingMain;
