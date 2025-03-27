import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/el';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
dayjs.extend(customParseFormat);

function EpaggelmatiesProfile() {
  const navigate = useNavigate();

  const [editedData, setEditedData] = useState({});

  const [isEditing, setIsEditing] = useState({
    email: false,
    firstName: false,
    lastName: false,
    birthDate: false,
    afm: false,
    area: false,
    phone: false,
    gender: false,
    img: false,
    
    education: false,
  });

  // Fetch the user's data from the database (babysitter)
  const [uuid, setUuid] = useState(null);
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

  const [loading, setLoading] = useState(true);
  const [babysitter, setbabysitter] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setEditedData(profiles[0]);
        setbabysitter(profiles[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [uuid]);

  // Validation of input
  const [error, setError] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!editedData.email) {
        newErrors.email = 'Το email είναι υποχρεωτικό.';
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
        newErrors.email = 'Λάθος μορφή email.';
    }

    if (!editedData.firstName) {
        newErrors.firstName = 'Το όνομα είναι υποχρεωτικό.';
    } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(editedData.firstName)) {
        newErrors.firstName = 'Το όνομα πρέπει να περιέχει μόνο γράμματα.';
    }

    if (!editedData.lastName) {
        newErrors.lastName = 'Το επώνυμο είναι υποχρεωτικό.';
    } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(editedData.lastName)) {
        newErrors.lastName = 'Το επώνυμο πρέπει να περιέχει μόνο γράμματα.';
    }

    if (!editedData.birthDate) {
        newErrors.birthDate = 'Η ημερομηνία γέννησης είναι υποχρεωτική.';
    } else {
        const age = new Date().getFullYear() - new Date(editedData.birthDate).getFullYear();
        if (age < 18) {
            newErrors.birthDate = 'Πρέπει να είστε άνω των 18 ετών.';
        }
    }

    if (!editedData.afm) {
        newErrors.afm = 'Το ΑΦΜ είναι υποχρεωτικό.';
    } else if (!/^\d{9}$/.test(editedData.afm)) {
        newErrors.afm = 'Το ΑΦΜ πρέπει να αποτελείται από 9 ψηφία.';
    }

    if (!editedData.phone) {
        newErrors.phone = 'Το τηλέφωνο είναι υποχρεωτικό.';
    } else if (!/^\d{10}$/.test(editedData.phone)) {
        newErrors.phone = 'Το τηλέφωνο πρέπει να αποτελείται από 10 ψηφία.';
    }

    setError(newErrors);

    // If no errors, return true; otherwise, return false
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
    setEditedData({ ...editedData, [field]: babysitter?.[field] || "" });
  };

  // Save changes to the database
  const handleSaveChanges = (field) => {
    if (!validateForm()) { // If there is invalid data, do not save changes and print errror messages
      return;
    }
    setIsEditing({ ...isEditing, [field]: false });
    setbabysitter({ ...babysitter, [field]: editedData[field] });

    try {
      const userRef = doc(FIREBASE_DB, "user", babysitter.uid);
      updateDoc(userRef, {
        [field]: editedData[field],
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Handle image selection from file input
  const handleImageChange = (e) => {
    setEditedData({ ...editedData, img: true });
    setbabysitter({ ...babysitter, img: true });

    try {
      const userRef = doc(FIREBASE_DB, "user", babysitter.uid);
      updateDoc(userRef, {
        img: true,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Delete the image from the database
  const handleDeleteImage = () => {
    setEditedData({ ...editedData, img: false });
    setbabysitter({ ...babysitter, img: false });

    try {
      const userRef = doc(FIREBASE_DB, "user", babysitter.uid);
      updateDoc(userRef, {
        img: false,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const parsedDate = editedData.birthDate
    ? dayjs(editedData.birthDate, 'DD/MM/YYYY')
    : null;

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = newValue.format('DD/MM/YYYY');
      handleInputChange({ target: { name: 'birthDate', value: formattedDate } });
    }
  };

  const areasOfGreece = [
    "Αθήνα",
    "Θεσσαλονίκη",
    "Πάτρα",
    "Ηράκλειο",
    "Λάρισα",
    "Βόλος",
    "Ιωάννινα",
    "Καβάλα",
    "Χανιά",
    "Ρόδος",
  ];

  const education = [
    "Δημοτικό",
    "Γυμνάσιο",
    "Λύκειο",
    "Πανεπιστήμιο",
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <Header />

      <Breadcrumbs />

      <h1 style={{ textAlign: "center", marginTop: "25px", textDecoration: "underline" }}> <b>Το προφίλ μου</b> </h1>
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", marginTop: "25px" }}>

        <div style={{ display: "flex", width: "80%", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", width: "25%", backgroundColor: "#ece7f2", borderRadius: "2%", padding: "2%", marginTop: "10px", height: "50%", marginRight: "20px", justifyContent: "center", alignItems: "center" }}>

            <h3 style={{ textAlign: "center", textDecoration: "underline" }}> <b> Φωτογραφία </b> </h3>
            <h6 style={{ marginTop: "3%" , backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
              {babysitter.img ? 
              (babysitter.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                : babysitter.gender === "Γυναίκα" ? <img src="/images/woman_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />)
              : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
            </h6> <hr style={{ width: "100%" }} />

            <button style={{ marginTop: "10px", backgroundColor: "green", color: "white", borderRadius: "5px", cursor: "pointer", border: "1px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", width: "50%" }}
              onClick={() => document.getElementById("fileInput").click()}>
              Επιλογή φωτογραφίας
            </button>

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <button style={{ marginTop: "10px", backgroundColor: "red", color: "white", borderRadius: "5px", cursor: "pointer", border: "1px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", width: "50%" }}
              onClick={handleDeleteImage}>
              <ClearIcon /> Αφαίρεση
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            <div style={{ backgroundColor: "#ece7f2", borderRadius: "2%", padding: "2%", display: "flex", flexDirection: "column", marginTop: "10px" }}>

              <h3 style={{ textAlign: "left", textDecoration: "underline" }}>
                <b> Τα προσωπικά σας στοιχεία </b>
              </h3>

              {["firstName", "lastName", "birthDate", "email", "afm", "phone", "area", "gender", "education"].map((field) => (
                <div key={field}>
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ width: "80%" }}>
                        <b>
                          {field === "firstName" ? "Όνομα"
                            : field === "lastName" ? "Επίθετο"
                            : field === "birthDate" ? "Ημερομηνία γέννησης"
                            : field === "afm" ? "ΑΦΜ"
                            : field === "email" ? "Email"
                            : field === "phone" ? "Τηλέφωνο"
                            : field === "area" ? "Περιοχή"
                            : field === "education" ? "Εκπαίδευση"
                            : "Φύλο"}:
                        </b>{" "}
                        {isEditing[field] ? (
                          field === "birthDate" ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                              <DatePicker
                                label="Επιλέξτε ημερομηνία"
                                value={parsedDate}
                                onChange={handleDateChange}
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { placeholder: 'Επιλέξτε ημερομηνία' } }}
                                maxDate={dayjs().subtract(1, 'day')}
                              />
                            </LocalizationProvider>
                          ) : field === "gender" ? (
                            <select
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                              style={{ width: "20%", padding: "5px", fontSize: "20px", marginLeft: "15px" }}
                            >
                              <option value="Άντρας">Άντρας</option>
                              <option value="Γυναίκα">Γυναίκα</option>
                              <option value="Άλλο">Άλλο</option>
                            </select>
                          ) : field === "area" ? (
                            <select
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                              style={{ width: "30%", padding: "5px", fontSize: "20px", marginLeft: "15px" }}
                            >
                              {areasOfGreece.map((area) => (
                                <option key={area} value={area}>
                                  {area}
                                </option>
                              ))}
                            </select>
                          ) : field === "education" ? (
                            <select
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                              style={{ width: "30%", padding: "5px", fontSize: "20px", marginLeft: "15px" }}
                            >
                              {education.map((edu) => (
                                <option key={edu} value={edu}>
                                  {edu}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                            />
                          )
                        ) : (
                          babysitter?.[field]
                        )}
                      </div>
                      {isEditing[field] && (
                        <button
                          style={{
                            marginRight: "10px",
                            fontSize: "12px",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            border: "1px solid #333",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            backgroundColor: "green"
                          }}
                          onClick={() => handleSaveChanges(field)}
                        >
                          Αποθήκευση
                        </button>
                      )}
                      <img
                        style={{ cursor: "pointer" }}
                        src="/edit (1).svg"
                        alt="Edit"
                        onClick={() => handleEditClick(field)}
                      />
                    </div>
                  </h4>
                  {error[field] && <p style={{ color: "red", marginLeft: "6%" }}>{error[field]}</p>}
                  <hr />
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );
}

export default EpaggelmatiesProfile;
