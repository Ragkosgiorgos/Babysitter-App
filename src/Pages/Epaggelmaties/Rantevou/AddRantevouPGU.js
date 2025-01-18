import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import 'dayjs/locale/el'; // Import Greek locale
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";
import Loader from "../../../Components/Loader";

dayjs.extend(customParseFormat); // Extend Dayjs to handle custom formats

function AddRantevouPGU() {
  const navigate = useNavigate();
  const today = dayjs();
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

    const [newData, setnewData] = useState({
      id: id,
      id_p: "",
      id_b: "",
      tropos_synantisis: "",
      date: new Date().toLocaleDateString(),
      address: "", 
    });

      // Fetch user data when uuid is available
      useEffect(() => {
        if (uuid) {
          setnewData((prevData) => ({
            ...prevData,
            ["id_b"]: uuid,
          }));
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

  const handleFinalSave = async () => {
    // post_id === -1, we are creating a new post
        newData.id_b = uuid;
        newData.status = "Oριστική υποβολή";
        try{
            const rantevouRef = collection(FIREBASE_DB, 'rantevou');
  
            const docRef = await addDoc(rantevouRef, newData);
  
            const documentId = docRef.id;
            newData.id = documentId;
  
            await setDoc(docRef, { id: documentId }, { merge: true });
  
        } catch (error) {
            console.error('Error adding document:', error);
        }  finally{
          navigate(-1);
        }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setnewData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
    };
  
    const handleDateTimeRangePickerChange = (_value) => {
      let date = dayjs(_value).format('YYYY-MM-DD HH:mm');
      console.log(date);
      setnewData((prevData) => ({
        ...prevData,
        ["date"]: date,
    }));
    }

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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Προσθήκη διαθέσιμου ραντεβού</h2>
            </div>

            <div style={{ width: "40%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", display: "flex", flexDirection: "row", justifyContent: "center",
                           alignItems: "center", margin: "auto", height: "100%", gap: "20%", marginTop: "2%" }}>
                  <FormControl>
                      <RadioGroup
                          row
                          aria-labelledby="demo-form-control-label-placement"
                          value={newData.tropos_synantisis}
                          onChange={handleInputChange}
                          name="tropos_synantisis"
                          style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", flexDirection: "column" }}
                      >
                      <FormControlLabel value="Διαδικτυακά" control={<Radio />} label="Διαδικτυακά" labelPlacement="end"  />
                      <FormControlLabel value="Δια ζώσης" control={<Radio />} label="Δια ζώσης" />
                      </RadioGroup>
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs} locale="el" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", flexDirection: "column" }}>
                      <DemoContainer components={['Ημερομηνία και ώρα']}>
                          <DemoItem label="Ημερομηνία και ώρα">
                          <DateTimePicker onChange={handleDateTimeRangePickerChange} value={dayjs(newData.date)} shouldDisableYear={isInPast} format="DD/MM/YYYY h:mm A" disablePast={true} disableFuture={false} />
                          </DemoItem>
                      </DemoContainer>
                  </LocalizationProvider>

            </div>
                    
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "25%", gap: "50%" }}>
                    <button onClick={()=> navigate(-1)} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Προηγούμενο</button>
                    <button onClick={handleFinalSave} style={{  height: "3%", backgroundColor: "green", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Προσθήκη</button>
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

export default AddRantevouPGU;
