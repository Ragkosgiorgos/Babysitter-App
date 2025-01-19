import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function ViewAvailabilityPGU(){
  const navigate = useNavigate(); 

  const params = new URLSearchParams(window.location.search);
  const id_b = params.get("id_b") || "";
  
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch the user's data from the database
  const [user, setUser] = useState({});
  useEffect(() => {
    if (uuid){
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

  // Fetch available rantevou of babysitter from the database
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (uuid) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'rantevou'), where('id_b', '==', id_b));
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

  function isavailable(dates){
    return dates.id_p === "";
  }

  const routeChangeEdit = (id_rantevou) => navigate(`../goneis/profile/aitiseis-endiaferontos/edit?id_rantevou=${id_rantevou}`);
  
  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα διαθέσιμα ραντεβού μου</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Ημερομηνία και ώρα</th>
                    <th>Τρόπος</th>     
                    <th>Ενέργειες</th>               
                  </tr>
                </thead>
                <tbody>
                  {posts.filter(isavailable).map((posts) => (
                    <tr key={posts.id} style={{ borderTop: "0.2px solid #333" }}>
                      <td>{posts.date}</td>
                      <td>{posts.tropos_synantisis}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "0%" }}>
                      <Button onClick={() => routeChangeEdit(posts.id)}> <img style={{ cursor: "pointer" ,marginRight: "0px", position: "relative" }} src="/edit.svg" width="40%" height="20vh" alt="" /> </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", marginRight: "70%" }}>
              
              <button onClick={()=> navigate("../goneis/view-availability")} style={{ width: "35%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
                                borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Επιστροφή
              </button>
              
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

export default ViewAvailabilityPGU;