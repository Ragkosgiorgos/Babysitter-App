import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import Loader from "../../../Components/Loader";

function AvailableRantevouPGU() {
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();  
  const routeChangeAdd = () =>{ 
    navigate("./add");
  };

  const routeChangeEdit = (id_aitisis) =>{ 
    navigate(`edit?id=${id_aitisis}`);
  };

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

  const handleDelete = async (id) => {
    try {
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      const postRef = doc(FIREBASE_DB, 'rantevou', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  function isavailable(dates){
    return dates.id_p === "";
  }

  //? Error handling
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button onClick={routeChangeAdd} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", 
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Προσθήκη διαθέσιμου ραντεβού
              </button>
              
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
                      <td style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangeEdit(posts.id)}>Προβολή</span>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleDelete(posts.id)}>Διαγραφή</span>
                      </td>
                    </tr>
                  ))}
                  { posts.filter(isavailable).length === 0 &&
                    <tr>
                      <td colSpan="3">Δεν υπάρχουν διαθέσιμα ραντεβού</td>
                    </tr>
                  }
                </tbody>
              </table>

            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", marginRight: "70%" }}>
              
              <button onClick={()=> navigate("../epaggelmaties/rantevou")} style={{ width: "35%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
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

export default AvailableRantevouPGU;
