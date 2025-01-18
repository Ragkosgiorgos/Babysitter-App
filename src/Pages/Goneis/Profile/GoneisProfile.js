import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import ClearIcon from '@mui/icons-material/Clear';
import Loader from "../../../Components/Loader";
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { el } from 'date-fns/locale'; // Greek locale
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Register Greek locale
registerLocale('el', el);

function GoneisProfile() {
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

    childFirstName: false,
    childLastName: false,
    childBirthDate: false,
    childGender: false,
  });

  const [uuid, setUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [khdemonas, setKhdemonas] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setEditedData(profiles[0]);
        setKhdemonas(profiles[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchUserData();
    }
  }, [uuid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
    setEditedData({ ...editedData, [field]: khdemonas?.[field] || "" });
  };

  const handleSaveChanges = async (field) => {
    if (!validateForm()) { // If there are errors, do not save changes and return and print the errors
      return;
    }
    
    setIsEditing({ ...isEditing, [field]: false });
    setKhdemonas({ ...khdemonas, [field]: editedData[field] });

    try {
      const userRef = doc(FIREBASE_DB, "user", khdemonas.uid);
      await updateDoc(userRef, {
        [field]: editedData[field],
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleImageChange = async (e) => {
    setEditedData({ ...editedData, img: true });
    setKhdemonas({ ...khdemonas, img: true });

    try {
      const userRef = doc(FIREBASE_DB, "user", khdemonas.uid);
      await updateDoc(userRef, {
        img: true,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDeleteImage = async () => {
    setEditedData({ ...editedData, img: false });
    setKhdemonas({ ...khdemonas, img: false });

    try {
      const userRef = doc(FIREBASE_DB, "user", khdemonas.uid);
      await updateDoc(userRef, {
        img: false,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

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

    if (!editedData.childFirstName) {
      newErrors.childFirstName = 'Το όνομα του παιδιού είναι υποχρεωτικό.';
    } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(editedData.childFirstName)) {
        newErrors.childFirstName = 'Το όνομα του παιδιού πρέπει να περιέχει μόνο γράμματα.';
    }

    if (!editedData.childLastName) {
        newErrors.childLastName = 'Το επώνυμο του παιδιού είναι υποχρεωτικό.';
    } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(editedData.childLastName)) {
        newErrors.childLastName = 'Το επώνυμο του παιδιού πρέπει να περιέχει μόνο γράμματα.';
    }

    setError(newErrors);

    // If no errors, return true; otherwise, return false
    return Object.keys(newErrors).length === 0;
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />

      <Breadcrumbs />

      <h1 style={{ textAlign: "center", marginTop: "25px", textDecoration: "underline" }}>
        <b>Το προφίλ μου</b>
      </h1>
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", marginTop: "25px" }}>
        <div style={{ display: "flex", width: "80%", gap: "20px" }}>

          <div style={{ display: "flex", flexDirection: "column", width: "25%", backgroundColor: "#ece7f2", borderRadius: "2%", padding: "2%", marginTop: "10px", height: "35%", marginRight: "20px", justifyContent: "center", alignItems: "center" }}>
            <h3 style={{ textAlign: "center", textDecoration: "underline" }}> <b> Φωτογραφία </b> </h3>
            <h6 style={{ marginTop: "3%", backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid #333" }}>
              {khdemonas.img ? 
                (khdemonas.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> 
                  : khdemonas.gender === "Γυναίκα" ? <img src="/images/woman_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                )
              : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
            </h6>
            <hr style={{ width: "100%" }} />
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
            {/* Parent's Details */}
            <div style={{ backgroundColor: "#ece7f2", borderRadius: "2%", padding: "2%", display: "flex", flexDirection: "column", marginTop: "10px" }}>
              <h3 style={{ textAlign: "left", textDecoration: "underline" }}>
                <b> Τα προσωπικά σας στοιχεία </b>
              </h3>
              {["firstName", "lastName", "birthDate", "email", "afm", "area", "phone", "gender"].map((field) => (
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
                            : field === "area" ? "Περιοχή"
                            : field === "phone" ? "Τηλέφωνο"
                            : "Φύλο"}:
                        </b>{" "}
                        {isEditing[field] ? (
                          field === "birthDate" ? (
                            <DatePicker
                              selected={
                                editedData.birthDate
                                  ? new Date(
                                      ...editedData.birthDate.split("/").reverse().map((n, i) => (i === 1 ? +n - 1 : +n))
                                    )
                                  : null
                              }
                              onChange={(date) => {
                                if (date) {
                                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                  handleInputChange({ target: { name: "birthDate", value: formattedDate } });
                                }
                              }}
                              locale="el"
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Επιλέξτε ημερομηνία"
                              maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
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
                          ) : (
                            <input
                              type="text"
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                            />
                          )
                        ) : (
                          khdemonas?.[field]
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
                  {error[field] && <p style={{ color: 'red', marginLeft: "6%" }}>{error[field]}</p>}
                  <hr />
                </div>
              ))}
            </div>
            {/* Child's Details */}
            <div style={{ backgroundColor: "#ece7f2", borderRadius: "2%", padding: "2%", display: "flex", flexDirection: "column", marginTop: "10px" }}>
              <h3 style={{ textAlign: "left", textDecoration: "underline" }}>
                <b> Τα προσωπικά στοιχεία του παιδιού </b>
              </h3>
              {["childFirstName", "childLastName", "childBirthDate", "childGender"].map((field) => (
                <div key={field}>
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ width: "80%" }}>
                        <b>
                          {field === "childFirstName"
                            ? "Όνομα παιδιού"
                            : field === "childLastName"
                            ? "Επίθετο παιδιού"
                            : field === "childBirthDate"
                            ? "Ημερομηνία γέννησης παιδιού"
                            : "Φύλο παιδιού"}:
                        </b>{" "}
                        {isEditing[field] ? (
                          field === "childBirthDate" ? (
                            <DatePicker
                              selected={
                                editedData.childBirthDate
                                  ? new Date(
                                      ...editedData.childBirthDate.split("/").reverse().map((n, i) => (i === 1 ? +n - 1 : +n))
                                    )
                                  : null
                              }
                              onChange={(date) => {
                                if (date) {
                                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                  handleInputChange({ target: { name: "childBirthDate", value: formattedDate } });
                                }
                              }}
                              locale="el"
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Επιλέξτε ημερομηνία"
                              maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                          ) : field === "childGender" ? (
                            <select
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                              style={{ width: "20%", padding: "5px", fontSize: "20px", marginLeft: "15px" }}
                            >
                              <option value="Άντρας">Άντρας</option>
                              <option value="Γυναίκα">Γυναίκα</option>
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
                          khdemonas?.[field]
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
                  {error[field] && <p style={{ color: 'red', marginLeft: "6%" }}>{error[field]}</p>}
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default GoneisProfile;
