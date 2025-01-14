import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RadioGroup, FormControlLabel, Radio, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";
import Loader from "../../../Components/Loader";
import { set } from "date-fns";

function SubmitAitiseisEndiaferontosPGU(props) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const id_b = params.get("id_b") || "";
  const [rantevou,setRantevou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const [uuid, setUuid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
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
    id_b: id_b,
    postid: "",
    UserId: "",
    tropos_synantisis: "",
    status: "Σε προσωρινή αποθήκευση",
    date: new Date().toLocaleDateString(),
    description: "", 
    gender: "",
  });


  // If post_id === -1 then we are creating a new post, otherwise we are editing an existing one
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
        if (id_b) {
          const fetchPosts = async () => {
            try {
              setLoading(true);
              const q = query(collection(FIREBASE_DB, 'rantevou'), where('id_b', '==', id_b),where('date', '==', newData.date));
              const querySnapshot = await getDocs(q);
              const post = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setRantevou(post);
            } catch (error) {
              console.error('Error fetching posts:', error);
            } finally {
              setLoading(false);
            }
          };
          fetchPosts();
        }
      }, [id_b]);
  
  console.log(newData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

  const handleTempSave = async () => {
    if (id === "") { // If post_id === -1 then we are creating a new post
        newData.status = "Σε προσωρινή αποθήκευση";
        try{
            const aitiseisRef = collection(FIREBASE_DB, 'aitiseis_endiaferontos');

            const docRef = await addDoc(aitiseisRef, newData);

            const documentId = docRef.id;
            newData.id = documentId;

            await setDoc(docRef, { id: documentId }, { merge: true });

        } catch (error) {
            console.error('Error adding document:', error);

        }
        } else { // Otherwise we are editing an existing post
        try {
            const postRef = doc(FIREBASE_DB, 'aitiseis_endiaferontos', id);
            await setDoc(postRef, newData, { merge: true });

        } catch (error) {
            console.error('Error updating document:', error);

        }  finally{
          navigate(-1);
        }
    }
  };

  const handleFinalSave = async () => {
    if(rantevou.id_p === ""){
      if (id === "" ) { // If post_id === -1 then we are creating a new post
          newData.UserId = uuid;
          newData.status = "Oριστική υποβολή";
          rantevou.id_p = uuid;
          try{
              const aitiseisRef = collection(FIREBASE_DB, 'aitiseis_endiaferontos');

              const docRef = await addDoc(aitiseisRef, newData);

              const documentId = docRef.id;
              newData.id = documentId;

              await setDoc(docRef, { id: documentId }, { merge: true });

          } catch (error) {
              console.error('Error adding document:', error);
          }
          try {
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

        }  finally{
          navigate(-1);
        }
      } else { // Otherwise we are editing an existing post
          newData.status = "Oριστική υποβολή";
          try {
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

          }
          try {
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

        }  finally{
          navigate(-1);
        }
      }
    }
    else{
      console.log("err");
    }
  };

  const handleDropdownChange = (post)=>{
    newData.date = post.date;
    setRantevou(post);
  };

  const handleProfileRedirect = () =>{ 
    navigate(`../goneis/profile`);
  };
  
  const isInPast = (date) => (date.get('year') < dayjs().get('year')) || (date.get('year') === dayjs().get('year') && date.get('month') < dayjs().get('month')) || (date.get('year') === dayjs().get('year') && date.get('month') === dayjs().get('month') && date.get('date') < dayjs().get('date'));
  const isNotPast = (date) => (date.get('year') > dayjs().get('year')) || (date.get('year') === dayjs().get('year') && date.get('month') > dayjs().get('month')) || (date.get('year') === dayjs().get('year') && date.get('month') === dayjs().get('month') && date.get('date') >= dayjs().get('date'));
  
  const handleDateTimeRangePickerChange = (_value) => {
    let date = dayjs(_value).format('YYYY-MM-DD HH:mm');
    setnewData((prevData) => ({
      ...prevData,
      ["date"]: date,
  }));
  }

  function ftf(posts){
    return posts.tropos_synantisis === "Δια ζώσης";
  }

  function remote(posts){
    return posts.tropos_synantisis === "Διαδικτυακά";
  }

  if (loading) {
    return <Loader />;
  }
  
  if (!user || !rantevou) {
    return <div>Δεν βρέθηκε ο χρήστης</div>;
  }

  return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />
  
          <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
  
            <div style={{ flex: 1, overflowY: "auto" }}>
  
              <Breadcrumbs />
              {/* {(id !== "" && rantevou.id_p !=="")  
                    ? <h4 style={{ color: "red", textAlign: "center" }}> Παρακαλώ συμπληρώστε σωστά όλα τα πεδία </h4> : ""} */}
              

              <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%"}}>
                <div style={{width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px"}}>
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
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  
            
                  <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                    <b>Στοιχεία παιδιού</b>
                  </h2>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <th>Φύλο</th>
                    <RadioGroup name="gender" value={newData.gender } onClick={handleInputChange} style={{ padding: "5px", borderRadius: "4px" }}>
                        <FormControlLabel value="Αγόρι" control={<Radio />} label="Αγόρι" />
                        <FormControlLabel value="Κορίτσι" control={<Radio />} label="Κορίτσι" />
                    </RadioGroup>
                  </div>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <th>Ημερομηνία γέννησης</th>
                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                        <DemoContainer  components={['DatePicker']}>
                            <DatePicker 
                              name="childBirthDate"
                              shouldDisableYear={isNotPast}
                              onChange={handleInputChange}
                              value={dayjs(user.childBirthDate)}
                              label="Ημερομηνία γέννησης" />
                        </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                    <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                      <b>Επιθυμητός τρόπος επικοινωνίας</b>
                    </h2>                  
                    <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <RadioGroup name="tropos_synantisis" value={newData.tropos_synantisis} onChange={handleInputChange} style={{ padding: "5px", borderRadius: "4px" }}>
                        <FormControlLabel value="Δια ζώσης" control={<Radio />} label="Δια ζώσης" />
                        <FormControlLabel value="Διαδικτυακά" control={<Radio />} label="Διαδικτυακά" />
                    </RadioGroup>

                    {newData.tropos_synantisis === 'Διαδικτυακά' && (
                      <FormControl fullWidth style={{ marginTop: '20px' }}>
                        <InputLabel>Επιλέξτε ημερομηνία και ώρα</InputLabel>
                        <Select
                          value={posts.date}
                          label="Επιλέξτε ημερομηνία και ώρα"
                        >
                          {loading ? (
                            <MenuItem disabled>Loading...</MenuItem>
                          ) : (
                            posts.filter(remote).map((post) => (
                              <MenuItem onClick={()=>handleDropdownChange(post)} key={post.id} value={post.id}>
                                {post.date}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                      )}
                      {newData.tropos_synantisis === 'Δια ζώσης' && (
                      <FormControl fullWidth style={{ marginTop: '20px' }}>
                        <InputLabel>Επιλέξτε ημερομηνία και ώρα</InputLabel>
                        <Select
                          value={posts.date}
                          // onChange={handleDropdownChange}
                          label="Επιλέξτε ημερομηνία και ώρα"
                        >
                          {loading ? (
                            <MenuItem disabled>Loading...</MenuItem>
                          ) : (
                            posts.filter(ftf).map((post) => (
                              <MenuItem key={post.id} value={post.id}>
                                {post.date}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                      )}
                  </div>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                    <b>Επιλογή ημερομηνίας</b>
                  </h2>  
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer  components={['Ημερομηνία και ώρα']}>
                        <DemoItem  label="Ημερομηνία και ώρα">
                        <DateTimePicker  name={"date"}  onChange={handleDateTimeRangePickerChange} value={dayjs(newData.date)} shouldDisableYear={isInPast} />
                        </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                  </div>
                  </tbody>
                </table>
               </div>

               <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                    <b>Μήνυμα</b>
                  </h2>                  
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                  <Box
                    
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '75ch' } }}
                    noValidate
                    autoComplete="off"
                    >
                    <div>
                    
                        <TextField
                        name="description"
                        onChange={handleInputChange}
                        id="outlined-multiline-flexible"
                        value={newData.description}
                        multiline
                        maxRows={13}
                        />
                    </div>
                  </Box>
                  </div>
                  </tbody>
                </table>
               </div>
              
  
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", gap: "40%" }}>
                
                <button onClick={()=> navigate(-1)}  style={{ width: "15%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
                                  borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",marginLeft:"-10%" }}>
                  Επιστροφή
                </button>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20%", marginRight:"-10%" }}>
                    <button onClick={handleTempSave}  style={{ width:"30ch", height: "8vh", backgroundColor: "#2b8cbe", color: "white", border: "none", 
                                    borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                    Προσωρινή αποθήκευση
                    </button>
                    <button onClick={handleFinalSave}  style={{  height: "8vh", backgroundColor: "green", color: "white", border: "none", 
                                    borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
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