
import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
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

function PreviewAitiseisEndiaferontosPGU(props) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";

  const [uuid, setUuid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

  const [user, setUser] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'),where( 'userId' , '==' , uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUser(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

  const [newData, setnewData] = useState({
    id: id,
    postid: "",
    UserId: "",
    tropos_synantisis: "",
    status: "Oριστική υποβολή",
    date: new Date().toLocaleDateString(),
    description: "", 
    date_of_birth: "",
    gender: "",
  });
  // If post_id === -1 then we are creating a new post, otherwise we are editing an existing one
  const [aitisi, setAitisi] = useState({});
    const fetchAitiseisData = async () => {
        try {
            const q = query(collection(FIREBASE_DB, 'aitiseis_endiaferontos'), where('id', '==', id), where('UserId', '==', uuid));
            const querySnapshot = await getDocs(q);
            const aitiseis = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAitisi(aitiseis[0]);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };
  fetchAitiseisData();

  
  if (!user || !aitisi) {
    return <div>Δεν βρέθηκε ο χρήστης</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
  
          <div style={{ flex: 1 }}>
              <Breadcrumbs />
              <div style={{ textAlign: "center", marginTop: "1%"}}>
                            <h2>Η αιτησή σας με <b style={{ textDecoration: "underline" }}>κωδικό {aitisi.id}</b> δημοσιεύτηκε με επιτυχία!</h2>
                            <h4>Μπορείτε να δείτε την αιτησή σας στην κατηγορία "Οι αιτήσεις ενδιαφέροντός μου".</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                        <div style={{ textAlign: "center"}}>
                            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                                            justifyContent: "center", padding: "2%" }}>
                                <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {user.firstName}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.lastName}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.email}</h4>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                    justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                        <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Τα στοιχεία της αίτησης</b></h2>
                        
                        <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aitisi.description}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Ημερομηνία και ώρα συνάντησης </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aitisi.date}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Ημερομηνία γέννησης παιδιού </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {user.childBirthDate}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Φύλο παιδιού </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aitisi.gender}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Επιθυμητός τρόπος επικοινωνίας </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aitisi.tropos_synantisis}
                        </div>
                    </div>
                </div>
              <div style={{ display: "flex", justifyContent: "left", alignItems: "left", marginTop: "5%"}}>
                
                <button onClick={()=> navigate(-1)}  style={{ width: "15%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
                                  borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",marginLeft:"10%" }}>
                  Επιστροφή
                </button>
              </div>                
        
          <Footer />
        </div>
      </div>
    );
  }
  
export default PreviewAitiseisEndiaferontosPGU;
