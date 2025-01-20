import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function MainAitiseisEndiaferontosPGU() {
  const navigate = useNavigate(); 

  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [post, setPost] = useState(null);

  const routeChangeEdit = (ids) =>{ 
    navigate(`edit?id=${ids[0]}&b_id=${ids[1]}`);
  };

  const routeChangePreview = (id_aitisis,id_b) =>{ 
    navigate(`preview?id=${id_aitisis}`);
  };

  const routeViewPost = (id) => {
    navigate(`/dashboard/aitiseisEndiaferontos/viewPost?id=${id}`);
  };

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

  // Get all job applies
  useEffect(() => {
    const fetchData = async () => {
    try {
      const postQuery = query(collection(FIREBASE_DB, "aggelies"));
        const postQuerySnapshot = await getDocs(postQuery);
        const posts = postQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const fetchedPost = posts;
        setPost(fetchedPost);
      if (!fetchedPost?.uid) {
          console.warn("Post UID is missing or invalid.");
          return;
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
      fetchData();
  }, [uuid]);
      
  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const babysitterRef = collection(FIREBASE_DB, 'user');
        const querySnapshot = await getDocs(query(babysitterRef, where("property", "==", "babysitter")));
        const babysitterData = querySnapshot.docs.map(doc => ({
          userId: doc.id,
          ...doc.data(),
        }));
        setBabysitters(babysitterData);
      } catch (error) {
        console.error("Error fetching babysitters:", error);
      }
    };

    fetchBabysitters();
  }, []);

  const handlePostPreview = (babysitterId) => {
    const job_post = post.find(p => p.uid === babysitterId);
    routeViewPost(job_post.id);
  };

  const findBabysitterName = (babysitterId) => {
    const babysitter = babysitters.find(b => b.userId === babysitterId);
    return babysitter ? `${babysitter.firstName} ${babysitter.lastName}` : "Άγνωστο";
  }

  const handleDelete = async (id) => {
    try {
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      const postRef = doc(FIREBASE_DB, 'aitiseis_endiaferontos', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι αιτήσεις ενδιαφέροντός μου</h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

            <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", tableLayout: "fixed" }}>
            <thead style={{ lineHeight: "1.2em"}}>
            <tr style={{ borderBottom: "2px solid #333" }}>
                    <th style={{ padding: "10px" }}>Αγγελία</th>
                    <th style={{ padding: "10px" }}>Κατάσταση</th>
                    <th style={{ padding: "10px" }}>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2em" }}>
                      <td style={{ padding: "10px" }}><span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handlePostPreview(post.id_b)}>{findBabysitterName(post.id_b)}</span></td>
                      <td style={{ padding: "10px" }}>{post.status !== "Σε προσωρινή αποθήκευση" ? <span style={{ color: "green" }}>{post.status}</span> : <span style={{ color: "#F28C28" }}>{post.status}</span>}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap:"10px", padding: "10px" }}>
                        {post.status === "Oριστική υποβολή" && 
                          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangePreview(post.id,post.postid)}>Προβολή</span>}
                        
                        {post.status === "Σε προσωρινή αποθήκευση" && 
                        <div style={{display: "flex", gap: "25px", padding: "10px" }} >
                        <span  style={{ cursor: "pointer", textDecoration: "underline"}} onClick={() => handleDelete(post.id)}>Διαγραφή</span>
                        <span  style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => routeChangeEdit([post.id,post.id_b])}>Επεξεργασία</span>
                        </div>}
                        
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "10px", lineHeight: "2em", fontWeight: "bold", textDecoration: "underline" }}>Δεν υπάρχουν αιτήσεις</td>
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