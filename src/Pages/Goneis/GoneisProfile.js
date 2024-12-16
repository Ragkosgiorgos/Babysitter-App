import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

function GoneisProfile() {
  const [profiles, setProfiles] = useState([]);
  const [editedData, setEditedData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    afm: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    surname: false,
    birthDate: false,
    afm: false,
    email: false,
    phone: false,
  });

  useEffect(() => {
    fetch("/data/khdemones.json")
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

  const khdemonas = profiles.find((profile) => profile.uid === 2);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
    setEditedData({ ...editedData, [field]: khdemonas?.[field] || "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = (field) => {
    const updatedProfile = { ...khdemonas, [field]: editedData[field] };
    // Update the profiles array with the new data
    setProfiles((prevProfiles) => {
      return prevProfiles.map((profile) =>
        profile.uid === khdemonas.uid ? updatedProfile : profile
      );
    });
    // Disable editing mode for that field
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <div>
      <Header log="connected" uid={1} name={"Νικολέτα"} surname={"Αντωνίου"} property={"parent"} />

      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", marginTop: "90px" }}>
        {/* Flex container for image and data box */}
        <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
          {/* Left column with the image */}
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <img
              src="/data/nikoleta.jpeg" // Replace with your image URL
              alt="Khdemonas"
              style={{ width: "80%", height: "auto", borderRadius: "10px" }} // Adjust size as needed
            />
          </div>
            <div style={{display:"flex",flexDirection:"column"}}>
            <h2>Στοιχεία κηδεμόνα</h2>
          {/* Right column with the data box */}
          <div
            style={{
              flex: 2,
              backgroundColor: "#ece7f2",
              borderRadius: "2%",
              padding: "2%",
              display: "flex",
              flexDirection: "column",
              marginTop:"10px"
            }}
          >
            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
              <b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b>
            </h2>
            {["name", "surname", "birthDate", "afm", "email", "phone"].map((field) => (
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
                        {field === "name"
                          ? "Όνομα"
                          : field === "surname"
                          ? "Επίθετο"
                          : field === "birthDate"
                          ? "Ημερομηνία γέννησης"
                          : field === "afm"
                          ? "ΑΦΜ"
                          : field === "email"
                          ? "Email"
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
                        khdemonas?.[field] || "N/A"
                      )}
                    </div>
                    {isEditing[field] && (
                      <button
                        style={{
                          marginRight: "10px", // Space between button and img
                        }}
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
          </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default GoneisProfile;

