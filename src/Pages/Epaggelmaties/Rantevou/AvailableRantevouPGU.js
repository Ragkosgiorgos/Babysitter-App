import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function AvailableRantevouPGU() {
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

  const routeChangeAdd = () =>{ 
    navigate("./add");
  };

  const routeChangeEdit = (id_aitisis) =>{ 
    navigate(`edit?id=${id_aitisis}`);
  };

  const routeChangeView = (id_aitisis) =>{
    navigate(`view?id=${id_aitisis}`);
  };

  const handleReturn = () => {
    window.history.back();
  };

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

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", tableLayout: "fixed" }}>
                <thead style={{ lineHeight: "1.2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th style={{ padding: "10px" }}>Ημερομηνία και ώρα</th>
                    <th style={{ padding: "10px" }}>Τρόπος</th>     
                    <th style={{ padding: "10px" }}>Ενέργειες</th>               
                  </tr>
                </thead>
                <tbody>
                  {posts.filter(isavailable).map((posts) => (
                    <tr key={posts.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2em" }}>
                      <td style={{ padding: "10px" }}>{posts.date}</td>
                      <td style={{ padding: "10px" }}>{posts.tropos_synantisis}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "10px" }}>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangeView(posts.id)}>Προβολή</span>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangeEdit(posts.id)}>Επεξεργασία</span>
                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleDelete(posts.id)}>Διαγραφή</span>
                      </td>
                    </tr>
                  ))}
                  { posts.filter(isavailable).length === 0 &&
                    <tr>
                      <td colSpan={3} style={{ padding: "10px", lineHeight: "2em", fontWeight: "bold", textDecoration: "underline" }}>Δεν υπάρχουν διαθέσιμα ραντεβού</td>
                    </tr>
                  }
                </tbody>
              </table>

            </div>
              
            <button
              style={{
                position: "fixed",
                marginBottom: "8%",
                marginRight: "2%",
                bottom: "2%",
                right: "2%",
                height: "auto",
                backgroundColor: "#2b8cbe",
                color: "white",
                borderRadius: "5%",
                width: "12%",
                cursor: "pointer",
                border: "1px solid #333",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
              }}
              onClick={handleReturn}
            >
              Επιστροφή
            </button>
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
