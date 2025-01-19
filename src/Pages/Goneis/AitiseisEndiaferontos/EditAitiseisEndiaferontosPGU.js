import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { handleScrollToTop } from "../../../Utils/Methods/index";
import { useNavigate } from "react-router-dom";
import { RadioGroup, FormControlLabel, Radio, MenuItem, Select } from "@mui/material";
import TextField from '@mui/material/TextField';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";

function SubmitAitiseisEndiaferontosPGU() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const Id_b = params.get("b_id") || "";
  const [rantevou,setRantevou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const [uuid, setUuid] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
            setUuid(user.uid);
        } else {
            navigate('/login');
        }
    });
    return () => unsubscribe();
  }, []);

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

  const [newData, setnewData] = useState({
    id: id,
    id_b: Id_b,
    id_r: "",
    postid: "",
    UserId: "",
    tropos_synantisis: "",
    status: "Σε προσωρινή αποθήκευση",
    date: "",
    description: "", 
    gender: "",
  });

  // If id === "" then we are creating a new post, otherwise we are editing an existing one
  useEffect(() => {
    const fetchAitiseisData = async () => {
      if (id !== "") {
          try {
              setLoading(true);
              const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'), where('id', '==', id));
              const querySnapshot = await getDocs(q);
              const posts = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              }));
              setnewData(posts[0]);
          } catch (error) {
            console.error('Error fetching post data:', error);
          } finally {
            setLoading(false);
          }
        }
    };

    fetchAitiseisData();
  }, [id]);

  // Fetch the posts' data from the database
  useEffect(() => {
    if (Id_b) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'rantevou'), where('id_b', '==', Id_b));
          const querySnapshot = await getDocs(q);
          const post = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          setPosts(post);
        } catch (error) {
          console.error('Error fetching rantevou:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts(); 
    }
      
  }, [Id_b]);
    
  useEffect(() => {
    if (newData.id_r) {
      const fetchRantevou = async () => {
        try {
          setLoading(true);
          const qr = query(collection(FIREBASE_DB, 'rantevou'), where('id', '==', newData.id_r));
          const querySnapshotr = await getDocs(qr);
          const postsr = querySnapshotr.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRantevou(postsr[0]);
        } catch (error) {
          console.error('Error fetching rantevou data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchRantevou();
    }
  }, [newData.id_r]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

  const handleTempSave = async () => {
    setIsSubmitted(true);
    if (!newData.tropos_synantisis || !newData.date) {
      handleScrollToTop();
      return;
    }
    setIsSubmitted(false);
    if (id === "") { // If id === "" then we are creating a new post
      newData.UserId = uuid;
      newData.status = "";
      try {
          setLoading(true);
          const aitiseisRef = collection(FIREBASE_DB, 'aitiseis_endiaferontos');

          const docRef = await addDoc(aitiseisRef, newData);

          const documentId = docRef.id;
          newData.id = documentId;

          await setDoc(docRef, { id: documentId }, { merge: true });
      } catch (error) {
          console.error('Error adding document:', error);
      } finally{
          setLoading(false);
          navigate(`/goneis/profile/aitiseis-endiaferontos`);
      }
    } else { // Otherwise we are editing an existing post
      try {
          setLoading(true);
          const postRef = doc(FIREBASE_DB, 'aitiseis_endiaferontos', id);
          await setDoc(postRef, newData, { merge: true });
      } catch (error) {
          console.error('Error updating document:', error);
      }  finally {
          setLoading(false);
          navigate(`/goneis/profile/aitiseis-endiaferontos`);
      }
    }
  };

  const handleFinalSave = async () => {
    setIsSubmitted(true);
    if (!newData.tropos_synantisis || !newData.date) {
      handleScrollToTop();
      return;
    }
    setIsSubmitted(false);
    if(rantevou.id_p === ""){
      if (id === "" ) { // If id === "" then we are creating a new post
          newData.UserId = uuid;
          newData.status = "Oριστική υποβολή";
          rantevou.id_p = uuid;
          try {
              setLoading(true);
              const aitiseisRef = collection(FIREBASE_DB, 'aitiseis_endiaferontos');

              const docRef = await addDoc(aitiseisRef, newData);

              const documentId = docRef.id;
              newData.id = documentId;

              await setDoc(docRef, { id: documentId }, { merge: true });

          } catch (error) {
              console.error('Error adding document:', error);
          } finally {
              setLoading(false);
          }

          try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, 'rantevou'),where('id', '==', rantevou.id));
            const querySnapshot = await getDocs(q);
            const Posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const postRef = doc(FIREBASE_DB, 'rantevou', Posts[0].id);
            await setDoc(postRef, rantevou, { merge: true });

        } catch (error) {
            console.error('Error updating document:', error);
        } finally {
            setLoading(false);
            navigate('/goneis/profile/aitiseis-endiaferontos');
        }
      } else { // Otherwise we are editing an existing post
          newData.status = "Oριστική υποβολή";
          try {
              setLoading(true);
              const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'),where('id', '==', id));
              const querySnapshot = await getDocs(q);
              const Posts = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              }));
              const postRef = doc(FIREBASE_DB, 'aitiseis_endiaferontos', Posts[0].id);
              await setDoc(postRef, newData, { merge: true });
          } catch (error) {
              console.error('Error updating document:', error);
          } finally {
              setLoading(false);
              navigate('/goneis/profile/aitiseis-endiaferontos');
          }
          try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, 'rantevou'),where('id', '==', rantevou.id));
            const querySnapshot = await getDocs(q);
            const Posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const postRef = doc(FIREBASE_DB, 'rantevou', Posts[0].id);
            await setDoc(postRef, rantevou, { merge: true });
        } catch (error) {
            console.error('Error updating document:', error);
        } finally{
            setLoading(false);
            navigate('/goneis/profile/aitiseis-endiaferontos');
        }
      }
    }
  };

  const handleDropdownChange = (post) => {
    setnewData((prevData) => ({
      ...prevData,
      id_r: post.id,
      date: post.date,
    }));
  };  

  const handleProfileRedirect = () => navigate("/dashboard/profiles");

  function ftf(posts){
    return posts.tropos_synantisis === "Δια ζώσης";
  }

  function remote(posts){
    return posts.tropos_synantisis === "Διαδικτυακά";
  }

  function isavailable(dates){
    return dates.id_p === "";
  }

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

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <h1 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%", textDecoration: "underline" }}>
                  {id ? "Επεξεργασία αίτησης ενδιαφέροντος" : "Δημιουργία αίτησης ενδιαφέροντος"}
                </h1>
                <h5> Με * σημειώνονται τα υποχρεωτικά πεδία </h5>
                {isSubmitted && (!newData.tropos_synantisis || !newData.date) ? <h4 style={{ color: "red" }}> Παρακαλoύμε συμπληρώστε τα υποχρεωτικά πεδία </h4> : ""}
              </div>
              
              <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", padding: "2%" }}>
                  <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                      <b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b>
                  </h2>
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                      <div>
                        <b>Όνομα:</b> {user?.firstName || "N/A"}
                      </div>
                      <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleProfileRedirect()} />
                    </div>
                  </h4>
                  <hr />
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                        <b>Επίθετο:</b> {user?.lastName || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleProfileRedirect()} />
                  </div>
                  </h4>
                  <hr />
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                        <b>Εmail:</b> {user.email || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleProfileRedirect()} />
                  </div>
                  </h4>
                  <hr />
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                        <b>Τηλέφωνο:</b> {user.phone || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleProfileRedirect()} />
                  </div>
                  </h4>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                  <b> Επιβεβαίωση στοιχείων παιδιού </b>
                </h2>
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                      <b>Όνομα:</b> {user?.childFirstName || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => navigate(`/goneis/profile/aitiseis-endiaferontos/edit?id=${id}&b_id=${Id_b}`)} />
                  </div>
                </h4>
                <hr />
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                      <b>Επίθετο:</b> {user?.childFirstName || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => navigate(`/goneis/profile/aitiseis-endiaferontos/edit?id=${id}&b_id=${Id_b}`)} />
                  </div>
                </h4>
                <hr />
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                      <b>Φύλο:</b> {user?.childGender || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => navigate(`/goneis/profile/aitiseis-endiaferontos/edit?id=${id}&b_id=${Id_b}`)} />
                  </div>
                </h4>
                <hr />
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "98%" }}>
                    <div>
                      <b>Φύλο:</b> {user?.childBirthDate || "N/A"}
                    </div>
                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => navigate(`/goneis/profile/aitiseis-endiaferontos/edit?id=${id}&b_id=${Id_b}`)} />
                  </div>
                </h4>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                  <b>Επιθυμητός τρόπος επικοινωνίας*</b>
                </h2>
                {isSubmitted && (!newData.tropos_synantisis) ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Παρακαλoύμε επιλέξτε τρόπο επικοινωνίας </h6> : null}
                <div style={{ display: "flex", gap: "5%", justifyContent: "center", alignItems: "center", marginTop: "1%" }}>
                  <RadioGroup
                    name="tropos_synantisis"
                    value={newData.tropos_synantisis}
                    onChange={handleInputChange}
                    style={{
                      padding: "5px",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px"
                    }}
                  >
                    <FormControlLabel value="Δια ζώσης" control={<Radio />} label="Δια ζώσης" />
                    <FormControlLabel value="Διαδικτυακά" control={<Radio />} label="Διαδικτυακά" />
                  </RadioGroup>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                  <b>Επιλέξτε ημερομηνία και ώρα*</b>
                </h2>
                { newData.id_r && rantevou.id_p !== "" ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Το επιλεγμένο ραντεβού δεν είναι διαθέσιμο </h6> : "" }
                { newData.id_r && rantevou.id_p === "" ? <h6 style={{ color: "green", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Το επιλεγμένο ραντεβού είναι διαθέσιμο </h6> : "" }

                { newData.tropos_synantisis === "" && <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Παρακαλoύμε επιλέξτε πρώτα τρόπο επικοινωνίας </h6> }

                {isSubmitted && (!newData.date)
                      ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Παρακαλoύμε επιλέξετε ημερομηνία και ώρα </h6> : ""}

                { newData.tropos_synantisis === 'Διαδικτυακά' && posts.filter(isavailable).filter(remote).length === 0 ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Δεν υπάρχουν διαθέσιμες ημερομηνίες και ώρες </h6> : "" }
                { newData.tropos_synantisis === 'Διαδικτυακά' && posts.filter(isavailable).filter(remote).length > 0 ?
                  (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Select
                        value={newData.id_r || ""}
                        label={newData.tropos_synantisis}
                        onChange={(e) => {
                          const selectedPost = posts.find((post) => post.id === e.target.value);
                          handleDropdownChange(selectedPost);
                        }}
                        displayEmpty
                        style={{
                          width: "40%",
                          height: "2%",
                          fontSize: "1em",
                          marginTop: "2%",
                        }}
                      >
                        {loading ? (
                          <Loader />
                        ) : (
                          posts.filter(isavailable).filter(remote).map((post) => (
                            <MenuItem key={post.id} value={post.id}>
                              {post.date}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </div>
                  ) : null
                }
                
                { newData.tropos_synantisis === 'Δια ζώσης' && posts.filter(isavailable).filter(ftf).length === 0 ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Δεν υπάρχουν διαθέσιμες ημερομηνίες και ώρες </h6> : "" }
                {newData.tropos_synantisis === 'Δια ζώσης' && posts.filter(isavailable).filter(ftf).length > 0 ?
                  (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Select
                        value={newData.id_r || ""}
                        label={newData.tropos_synantisis}
                        onChange={(e) => {
                          const selectedPost = posts.find((post) => post.id === e.target.value);
                          handleDropdownChange(selectedPost);
                        }}
                        displayEmpty
                        style={{
                          width: "40%",
                          height: "2%",
                          fontSize: "1em",
                          marginTop: "2%",
                        }}
                      >
                        <MenuItem value="" disabled>
                          Επιλέξτε ημερομηνία και ώρα
                        </MenuItem>
                        {loading ? (
                          <Loader />
                        ) : (
                          posts.filter(isavailable).filter(ftf).map((post) => (
                            <MenuItem key={post.id} value={post.id}>
                              {post.date}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </div>
                  ) : null 
                }
                { newData.tropos_synantisis === 'Δια ζώσης' && posts.filter(isavailable).filter(ftf).length === 0 ? <h6 style={{ color: "red", justifyContent: "center", textAlign: "center", width: "100%", marginTop: "5px" }}> Δεν υπάρχουν διαθέσιμες ημερομηνίες και ώρες </h6> : "" }

              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                  <b>Μήνυμα</b>
                </h2>                  
                <div style={{ display: "flex",  gap: "5%", marginBottom: "3%", marginTop: "3%" }}>
                  <TextField
                    id="description"
                    name="description"
                    label="Μήνυμα"
                    multiline
                    rows={4}
                    value={newData.description}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
  
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" , marginTop: "5%", gap: "40%" }}>
                <button 
                  onClick={()=> navigate(-1)}
                  style={{
                      height: "3%",
                      backgroundColor: "#2b8cbe",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "2%",
                      width: "12%",
                    }}>
                  Επιστροφή
                </button>
                
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20%", marginRight:"-10%" }}>
                    <button onClick={handleTempSave}  style={{
                      backgroundColor: "#F28C28",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "2%",
                      width: "100%",
                    }}>
                      Προσωρινή αποθήκευση
                    </button>
                    
                    <button onClick={handleFinalSave}  style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "5px",
                      marginTop: "2%",
                      width: "200px",
                    }}>
                      Αποθήκευση
                    </button>
                </div>
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
  
export default SubmitAitiseisEndiaferontosPGU;
 