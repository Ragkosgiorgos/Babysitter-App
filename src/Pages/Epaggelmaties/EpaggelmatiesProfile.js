import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from '../../config/firebase';
import { CircularProgress } from "@mui/material";

function EpaggelmatiasProfile() {
  const [loading, setLoading] = useState(false);

  const [editedData, setEditedData] = useState({
    name: "",
    surname: "",
    area: "",
    birthDate: "",
    education: "",
    phone: "",
    email: "",
    afm: "",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    surname: false,
    area: false,
    birthDate: false,
    education: false,
    phone: false,
    email: false,
    afm: false,
  });

  const [profileImage, setProfileImage] = useState(""); // State to store selected image

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
          const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
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

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
    setEditedData({ ...editedData, [field]: user?.[field] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = (field) => {
    const updatedData = { ...user, [field]: editedData[field] };
    setUser(updatedData);
    setIsEditing({ ...isEditing, [field]: false });
    setLoading(true);
  
    const userRef = collection(FIREBASE_DB, "user");
    const q = query(userRef, where("userId", "==", uuid));
  
    getDocs(q)
      .then((querySnapshot) => {
        const updatePromises = querySnapshot.docs.map((docSnapshot) => {
          const docRef = doc(FIREBASE_DB, "user", docSnapshot.id);
          return updateDoc(docRef, updatedData);
        });

        return Promise.all(updatePromises); // Wait for all updates to complete
      })
      .then(() => {
        console.log("All documents updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user || user.property !== "babysitter") {
    return (
      <div style={{ textAlign: "center", marginTop: "90px" }}>
        <h1>Δεν είστε εγγεγραμμένος ως επαγγελματίας</h1>
        <a href="/register">Εγγραφή ως επαγγελματίας</a>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          marginTop: "90px",
        }}
      >
        <div style={{ display: "flex", width: "80%" }}>
          {/* Left column with the image */}
          <div style={{ width: "30%", marginTop: "90px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src={profileImage || "/profile.png"}
                alt="Profile"
                style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              />
              <button
                onClick={() => document.getElementById("fileInput").click()}
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <img src="/edit (1).svg" alt="Edit" style={{ width: "20px", height: "20px" }} />
              </button>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Main content area */}
          <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            <h2>Στοιχεία Επαγγελματία</h2>
            <div
              style={{
                backgroundColor: "#ece7f2",
                borderRadius: "2%",
                padding: "2%",
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              {loading ? ( // Show the loader when loading is true
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                    <b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b>
                  </h2>
                  {[
                    "firstName",
                    "lastName",
                    "area",
                    "birthDate",
                    "education",
                    "phone",
                    "email",
                    "afm",
                  ].map((field) => (
                    <div key={field}>
                      <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ width: "80%" }}>
                            <b>
                              {field === "firstName"
                                ? "Όνομα"
                                : field === "lastName"
                                ? "Επίθετο"
                                : field === "area"
                                ? "Περιοχή"
                                : field === "birthDate"
                                ? "Ημερομηνία Γέννησης"
                                : field === "education"
                                ? "Εκπαίδευση"
                                : field === "phone"
                                ? "Τηλέφωνο"
                                : field === "email"
                                ? "Email"
                                : "ΑΦΜ"}:
                            </b>{" "}
                            {isEditing[field] ? (
                              <input
                                type={field === "birthDate" ? "date" : "text"}
                                name={field}
                                value={editedData[field]}
                                onChange={handleInputChange}
                              />
                            ) : (
                              user?.[field]
                            )}
                          </div>
                          {isEditing[field] && (
                            <button
                              style={{ marginRight: "10px" }}
                              onClick={() => handleSaveChanges(field)}
                            >
                              Save
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
                      <hr />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EpaggelmatiasProfile;
