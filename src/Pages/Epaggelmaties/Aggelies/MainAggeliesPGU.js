import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
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
          navigate("/login");
        }
      });
      return () => unsubscribe();
    }, [navigate]);

    const [user, setUser] = useState('');
    // Fetch user data when uuid is available
    useEffect(() => {
        if (uuid) {
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
                    const querySnapshot = await getDocs(q);
                    const users = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUser(users[0]);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [uuid]);

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

    // Delete a job post
    const [isPopupVisible, setPopupVisible] = useState(false);

    // Cancel deletion
    const cancelDeletion = () => {
      setPopupVisible(false);
    };

    const [deleteId, setDeleteId] = useState(null);

    // Force deletion
    const confirmDeletion = async () => {
      setPopupVisible(false);

      try {
        setLoading(true);
        const updatedPosts = posts.filter(post => post.id !== deleteId);
        setPosts(updatedPosts);
        const postRef = doc(FIREBASE_DB, 'aggelies', deleteId);
        await deleteDoc(postRef);
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id) => {
      setDeleteId(id);
      setPopupVisible(true);
    };

    // Redirects
    const handleNewPost = () => navigate("/neaAggelia");
    //const previewAggeliaRender = (aggelia_id) => navigate(`/previewAggelias?aggelia_id=${aggelia_id}`);
    const previewAggeliaRender = (aggelia_id) => navigate(`/aggelies/viewPost?id=${aggelia_id}`);
    const handleTempView = (post_id) => navigate(`/neaAggelia?step=2&post_id=${post_id}`);

    if (loading) {
      return <Loader />;
    }

    if (uuid && user && user?.property !== "babysitter") {
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
                <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι Αγγελίες μου</h2>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>  
                <Tooltip title={
                    <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column", fontSize:"1.2em", textAlign:"left" }}>
                      Για την δημιουργία αγγελίας χρειάζονται:
                      <ul>
                        <li>Περιγραφή αγγελίας,</li>
                        <li>Επιλογή περιοχής,</li>
                        <li>Επιλογή εύρους ηλικίας παιδιού,</li>
                        <li>Επιλογή πλήρης/μερικής απασχόλησης,</li>
                        <li>Επιλογή χώρου εργασίας,</li>
                        <li>Διάθεση ή μη μεταφορικού μέσου,</li>
                        <li>Επιλογή διαθεσιμότητας.</li>
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

                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", tableLayout: "fixed" }}>
                  <thead style={{ lineHeight: "2em" }}>
                    <tr style={{ borderBottom: "2px solid #333" }}>
                      <th style={{ padding: "10px" }}>Κατάσταση Αγγελίας</th>
                      <th style={{ padding: "10px" }}>Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post, index) => (
                      <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                        <td style={{ padding: "10px" }}>{post.status === "Δημοσιευμένη" ? <span style={{ color: "green" }}>{post.status}</span> : <span style={{ color: "#F28C28" }}>{post.status}</span>}</td>
                        <td style={{ display: "flex", justifyContent: "center", alignItems:"center", marginTop: "0.5em", gap: "25px", padding: "10px" }}>
                          {post.status === "Δημοσιευμένη" ?  <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => previewAggeliaRender(post.id)}>Προβολή</span> : ""}
                          {post.status !== "Δημοσιευμένη" ?  <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleTempView(post.id)}>Επεξεργασία</span> : ""}
                          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleDelete(post.id)}>Διαγραφή</span>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={3}>Δεν υπάρχουν αγγελίες</td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>

            </div>

          </div>

        </div>

        {isPopupVisible && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "90%", maxWidth: "400px", textAlign: "center" }}>
                  <h3 style={{ marginBottom: "20px" }}>Είστε σίγουρος/η ότι θέλετε να διαγράψετε την αγγελία;</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <button onClick={confirmDeletion} style={{ padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Ναι, διαγραφή</button>
                      <button onClick={cancelDeletion} style={{ padding: "10px 20px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Ακύρωση</button>
                  </div>
              </div>
          </div>
        )}
        <div>
          <Footer />
        </div>

      </div>
    );
}

export default MainAggeliesPGU;
