import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import Loader from "../../Components/Loader";
import { convertDateFormat } from "../../Utils/Methods";
import ClearIcon from '@mui/icons-material/Clear';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function EpaggelmatiesProfile() {
  const navigate = useNavigate();

  const [editedData, setEditedData] = useState({});

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    birthDate: false,
    afm: false,
    address: false,
    area: false,
    email: false,
    phone: false,
    
    description: false,
    education: false,
    img: false,
  });

  // Fetch the user's data from the database (babysitter)
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
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

  if (loading) {
    return <Loader />;
  }

  if (!babysitter) {
    navigate("/404");
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
              (babysitter.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> : 
              <img src="/images/women_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />)
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

              {["firstName", "lastName", "birthDate", "afm", "email", "phone"].map((field) => (
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
                            : "Τηλέφωνο"}:
                        </b>{" "}
                        {isEditing[field] ? (
                          <input
                            type={field === "birthDate" ? "date" : "text"}
                            name={field}
                            value={editedData[field]}
                            onChange={handleInputChange}
                          />
                        ) : (
                          field === "birthDate" ? convertDateFormat(babysitter[field]) : (babysitter[field] || "N/A")
                        )}
                      </div>
                      {isEditing[field] && (
                        <button style={{ marginRight: "10px", fontSize: "12px", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "1px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", color: "white", backgroundColor: "green" }}
                          onClick={() => handleSaveChanges(field)}>
                          Αποθήκευση
                        </button>
                      )}
                      <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick(field)}/>
                    </div>
                  </h4>
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
