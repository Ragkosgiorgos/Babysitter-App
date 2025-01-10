import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";
import Loader from "../../../Components/Loader";

function SubmitAitiseisEndiaferontosPGU(props) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

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
    postid: "",
    UserId: "",
    tropos_synantisis: "",
    status: "Σε προσωρινή αποθήκευση",
    date: new Date().toLocaleDateString(),
    description: "", 
    date_of_birth: "",
    gender: "",
  });

  const [aitisi, setAitisi] = useState({});
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
                    console.log(posts[0]);
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

        }
    }
  };

  const handleFinalSave = async () => {
    if (id === "") { // If post_id === -1 then we are creating a new post
        newData.UserId = uuid;
        newData.status = "Oριστική υποβολή";
        try{
            const aitiseisRef = collection(FIREBASE_DB, 'aitiseis_endiaferontos');

            const docRef = await addDoc(aitiseisRef, newData);

            const documentId = docRef.id;
            newData.id = documentId;

            await setDoc(docRef, { id: documentId }, { merge: true });

        } catch (error) {
            console.error('Error adding document:', error);
        }  finally{
          navigate(-1);
        }
    } else { // Otherwise we are editing an existing post
        newData.status = "Oριστική υποβολή";
        try {
            const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'),where('id', '==', id));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot.id);
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Document ID:", posts);
            const postRef = doc(FIREBASE_DB, 'aitiseis_endiaferontos', posts[0].id);
            await setDoc(postRef, newData, { merge: true });

        } catch (error) {
            console.error('Error updating document:', error);

        } finally{
          navigate(-1);
        }
    }

  };

  const location = useLocation();
  const today = dayjs();

  const isInPast = (date) => (date.get('year') < dayjs().get('year')) || (date.get('year') === dayjs().get('year') && date.get('month') < dayjs().get('month')) || (date.get('year') === dayjs().get('year') && date.get('month') === dayjs().get('month') && date.get('date') < dayjs().get('date'));
  const isNotPast = (date) => (date.get('year') > dayjs().get('year')) || (date.get('year') === dayjs().get('year') && date.get('month') > dayjs().get('month')) || (date.get('year') === dayjs().get('year') && date.get('month') === dayjs().get('month') && date.get('date') >= dayjs().get('date'));

  if (loading) {
    return <Loader />;
  }
  
  if (!user) {
    return <div>Δεν βρέθηκε ο χρήστης</div>;
  }

  return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />
  
          <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
  
            <div style={{ flex: 1, overflowY: "auto" }}>
  
              <Breadcrumbs />
              
              
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
        
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Στοιχεία επικοινωνίας:</th>
                  </tr>
                  <div >
                    <div>
                        <label style={{ padding: "20px" }}>

                            Ονοματεπώνυμο <tr> <input type="text" 
                              value={user.firstName + " " + user.lastName}
                              onChange={handleInputChange}
                              // onChange={handleChange} 
                              /> </tr>
                        </label> 

                        <label style={{ padding: "20px" }}>
                            Τηλέφωνο <tr> <input value={user.phone} onChange={handleInputChange}/> </tr>
                        </label> 
                         
                        <label>
                            Email <tr> <input value={user.email} onChange={handleInputChange}/> </tr>
                        </label> 
                    </div>
                  </div>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  
            
                  <h5 style={{ fontWeight: "bold"}}> Στοιχεία παιδιού </h5>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <th>Φύλο</th>
                    <RadioGroup value={newData.gender } onClick={handleInputChange} style={{ padding: "5px", borderRadius: "4px" }}>
                        <FormControlLabel value="Αγόρι" control={<Radio />} label="Αγόρι" />
                        <FormControlLabel value="Κορίτσι" control={<Radio />} label="Κορίτσι" />
                    </RadioGroup>
                  </div>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <th>Ημερομηνία γέννησης</th>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker 
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
                  <h5 style={{ marginLeft: "5%" ,textAlign: "left" ,fontWeight: "bold"}}> Επιθυμητός τρόπος επικοινωνίας </h5>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                    <RadioGroup value={newData.tropos_synantisis} onChange={handleInputChange} style={{ padding: "5px", borderRadius: "4px" }}>
                        <FormControlLabel value="Δια ζώσης" control={<Radio />} label="Δια ζώσης" />
                        <FormControlLabel value="Διαδικτυακά" control={<Radio />} label="Διαδικτυακά" />
                    </RadioGroup>
                  </div>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%",display: "flex" , flexDirection: "column" , backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <h5 style={{ marginLeft: "5%" ,textAlign: "left" ,fontWeight: "bold"}}> Επιλογή ημερομηνίας </h5>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer onChange={handleInputChange} components={['Ημερομηνία και ώρα']}>
                        <DemoItem label="Ημερομηνία και ώρα">
                        
                        <DateTimePicker  value={dayjs(newData.date)} shouldDisableYear={isInPast} />
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
                  <h5 style={{ marginLeft: "5%" ,textAlign: "left" ,fontWeight: "bold"}}> Μήνυμα </h5>
                  <div style={{ display: "flex",  gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                  <Box
                    
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '75ch' } }}
                    noValidate
                    autoComplete="off"
                    >
                    <div>
                    
                        <TextField
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