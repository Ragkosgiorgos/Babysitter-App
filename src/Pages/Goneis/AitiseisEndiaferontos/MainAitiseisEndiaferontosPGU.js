import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function MainAitiseisEndiaferontosPGU() {
  const navigate = useNavigate(); 

  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const routeChangeEdit = (ids) =>{ 
    navigate(`edit?id=${ids[0]}&b_id=${ids[1]}`);
  };

  const routeChangePreview = (id_aitisis,id_b) =>{ 
    navigate(`preview?id=${id_aitisis}`);
  };

  const routeViewPost = (id) => {
    navigate(`/viewPost?id=${id}`);
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
          const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'), where('UserId', '==', uuid));
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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι αιτήσεις ενδιαφέροντός μου</h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <thead style={{ lineHeight: "2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Αγγελία</th>
                    <th>Κατάσταση</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                      <td><span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeViewPost(post.postid)}>Προβολή</span></td>
                      <td>{post.status}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "10%" }}>
                        {post.status === "Oριστική υποβολή" && <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangePreview(post.id,post.postid)}>Προβολή</span>}
                        {post.status === "Σε προσωρινή αποθήκευση" && <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangeEdit([post.id,post.postid])}>Επεξεργασία</span>}
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
      
      <div>
        <Footer />
      </div>
      
    </div>
  );
}

export default MainAitiseisEndiaferontosPGU;