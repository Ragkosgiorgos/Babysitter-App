import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";

import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/el"; // Import Greek locale
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("el", {
  meridiem: (hour) => (hour < 12 ? "ΠΜ" : "ΜΜ"), // Translate AM/PM to ΠΜ/ΜΜ
});

function AddRantevouPGU() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uuid, setUuid] = useState(null);
  const [user, setUser] = useState({});
  const [newData, setnewData] = useState({
    id: "",
    id_p: "",
    id_b: uuid,
    tropos_synantisis: "",
    date: "",
    address: "",
    link: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (uuid) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUser(users[0]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [uuid]);

  const handleFinalSave = async () => {
    setIsSubmitted(true);
    if (!newData.tropos_synantisis || !newData.date || 
        (newData.tropos_synantisis === "Δια ζώσης" && !newData.address) || 
        (newData.tropos_synantisis === "Διαδικτυακά" && !newData.link)) {
      return;
    }
    setIsSubmitted(false);

    newData.status = "Oριστική υποβολή";
    newData.id_b = user.userId;

    try {
      setLoading(true);
      const rantevouRef = collection(FIREBASE_DB, "rantevou");
      const docRef = await addDoc(rantevouRef, newData);
      const documentId = docRef.id;
      await setDoc(docRef, { id: documentId }, { merge: true });
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setLoading(false);
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
    const date = dayjs(_value).format("YYYY-MM-DD HH:mm");
    setnewData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const minDateTime = dayjs().add(1, "hour");
  dayjs.locale("el");

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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "underline" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Προσθήκη διαθέσιμου ραντεβού</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%", marginTop: "2%" }}>
              <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold" }}>Ημερομηνία & Ώρα ραντεβού</h4>
              {isSubmitted && !newData.date && (<h7 style={{ color: "red" }}> Επιλέξετε ημερομηνία και ώρα </h7>)}
              <div style={{ display: "flex", flexDirection: "row", marginLeft: "5%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                  <DemoContainer components={["Ημερομηνία και ώρα"]}>
                    <DemoItem label="">
                      <DateTimePicker
                        value={newData.date ? dayjs(newData.date) : null}
                        onChange={handleDateTimeRangePickerChange}
                        minDateTime={minDateTime}
                        ampm
                        ampmInClock
                        slotProps={{
                          textField: {
                            inputProps: {
                              placeholder: "Επιλέξτε ημερομηνία και ώρα",
                            },
                            error: false,
                          },
                        }}
                        format="DD/MM/YYYY hh:mm A"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%"  }}>Τρόπος συνάντησης</h4>
              {isSubmitted && !newData.tropos_synantisis && (<h7 style={{ color: "red" }}> Επιλέξετε τρόπο επικοινωνίας </h7>)}
              <FormControl style={{ marginLeft: "5%", width: "30%" }}>
                <RadioGroup row aria-labelledby="demo-form-control-label-placement" value={newData.tropos_synantisis} onChange={handleInputChange} name="tropos_synantisis">
                  <FormControlLabel value="Διαδικτυακά" control={<Radio />} label="Διαδικτυακά" labelPlacement="end" />
                  <FormControlLabel value="Δια ζώσης" control={<Radio />} label="Δια ζώσης" />
                </RadioGroup>
              </FormControl>
              {newData.tropos_synantisis === "Δια ζώσης" && (
                <div>
                  <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}>Διεύθυνση</h4>
                  {isSubmitted && !newData.address && (
                    <h7 style={{ color: "red", display: "block", marginTop: "5px", marginBottom: "7px" }}> Εισάγετε τη διεύθυνση </h7>
                  )}
                  <input type="text" name="address" placeholder="Διεύθυνση" onChange={handleInputChange} style={{ width: "70%", marginLeft: "5%" }} />
                </div>
              )}
              {newData.tropos_synantisis === "Διαδικτυακά" && (
                <div>
                  <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}>Link για διαδικτυακή συνάντηση</h4>
                  {isSubmitted && !newData.link && (
                    <h7 style={{ color: "red", display: "block", marginBottom: "7px" }}>Εισάγετε το link</h7>
                  )}
                  <input type="text" name="link" onChange={handleInputChange} placeholder="Link συνάντησης" style={{ marginLeft: "5%", width: "70%" }} />
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", gap: "50%" }}>
              <button onClick={() => navigate(-1)} style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%" }}>
                Επιστροφή
              </button>
              <button onClick={handleFinalSave} style={{ height: "3%", backgroundColor: "green", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%" }}>
                Προσθήκη
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddRantevouPGU;
