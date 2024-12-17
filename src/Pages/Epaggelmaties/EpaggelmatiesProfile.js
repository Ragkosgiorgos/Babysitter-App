import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function EpaggelmatiasProfile() {
  const [profiles, setProfiles] = useState([]);
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

  useEffect(() => {
    fetch("/data/ntantades.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfiles(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  const epaggelmatias = profiles.find((profile) => profile.uid === 1);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
    setEditedData({ ...editedData, [field]: epaggelmatias?.[field] || "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = (field) => {
    const updatedProfile = { ...epaggelmatias, [field]: editedData[field] };
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.uid === epaggelmatias.uid ? updatedProfile : profile
      )
    );
    setIsEditing({ ...isEditing, [field]: false });
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

  return (
    <div>
    <Header log="connected" uid={1} name={epaggelmatias?.name } surname={epaggelmatias?.surname} property={"babysitter"}/>
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", marginTop: "90px" }}>
        <div style={{ display: "flex", width: "80%" }}>
          {/* Left column with the image */}
          <div style={{ width: "30%", marginTop: "90px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src={profileImage || epaggelmatias?.img || "/default-placeholder.jpg"}
                alt="Epaggelmatias"
                style={{ width: "80%", height: "auto", borderRadius: "10px" }}
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

          <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            {/* Professional's Details Box */}
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
              <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                <b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b>
              </h2>
              {["name", "surname", "area", "birthDate", "education", "phone", "email", "afm"].map((field) => (
                <div key={field}>
                  <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ width: "80%" }}>
                        <b>
                          {field === "name"
                            ? "Όνομα"
                            : field === "surname"
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
                          epaggelmatias?.[field] || "N/A"
                        )}
                      </div>
                      {isEditing[field] && (
                        <button style={{ marginRight: "10px" }} onClick={() => handleSaveChanges(field)}>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EpaggelmatiasProfile;
