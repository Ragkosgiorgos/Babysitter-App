import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function EpaggRatingMain() {
  const navigate = useNavigate();

  // State for UUID
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      } else {
        navigate("/404"); // Redirect if user not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [parents, setParents] = useState([]);

  // Fetch user, posts, and parents data
  useEffect(() => {
    const fetchData = async () => {
      if (!uuid) return;

      try {
        setLoading(true);

        // Fetch user data
        const userQuery = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
        const userSnapshot = await getDocs(userQuery);
        const users = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUser(users[0]);

        // Fetch posts
        const postsQuery = query(collection(FIREBASE_DB, 'ratings'), where('id_b', '==', uuid));
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredPosts(posts);

        // Fetch parents
        const parentsQuery = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'parent'));
        const parentsSnapshot = await getDocs(parentsQuery);
        const parentsData = parentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setParents(parentsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // Preview rating
  const previewRating = (rating_id) => {
    navigate(`preview-aksiologisis?id=${rating_id}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    navigate("/404");
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1 }}>
            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Οι Αξιολογήσεις μου</h2>
              <Tooltip
                title={
                  <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection: "column" }}>
                    <div>
                      <VisibilityIcon style={{ cursor: "pointer" }} />: προβολή αξιολόγησης
                    </div>
                  </div>
                }
                placement="top"
                style={{ marginTop: "3%" }}
              >
                <Button>
                  <InfoIcon />
                </Button>
              </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                <thead style={{ lineHeight: "2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός αξιολόγησης</th>
                    <th>Κηδεμόνας</th>
                    <th>Βαθμολογία</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts
                    .filter((post) => post.id_b === uuid)
                    .map((post, index) => (
                      <tr key={post.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                        <td>{index + 1}</td>
                        <td>
                          {parents
                            .filter((parent) => parent.userId === post.id_p)
                            .map((parent) => parent.firstName + " " + parent.lastName)}
                        </td>
                        <td>{post.rating}/5</td>
                        <td style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "0.5em", gap: "10px" }}>
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
