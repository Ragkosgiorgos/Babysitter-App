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

  const [editedChildData, setEditedChildData] = useState({
    childName: "",
    childSurname: "",
    childBirthDate: "",
    amka: "",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    surname: false,
    birthDate: false,
    afm: false,
    email: false,
    phone: false,
  });

  const [isChildEditing, setIsChildEditing] = useState({
    childName: false,
    childSurname: false,
    childBirthDate: false,
    amka: false,
  });

  const [profileImage, setProfileImage] = useState(""); // State to store selected image

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

  const handleChildEditClick = (field) => {
    setIsChildEditing({ ...isChildEditing, [field]: true });
    setEditedChildData({ ...editedChildData, [field]: khdemonas?.[field] || "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleChildInputChange = (e) => {
    const { name, value } = e.target;
    setEditedChildData({ ...editedChildData, [name]: value });
  };

  const handleSaveChanges = (field) => {
    const updatedProfile = { ...khdemonas, [field]: editedData[field] };
    setProfiles((prevProfiles) => {
      return prevProfiles.map((profile) =>
        profile.uid === khdemonas.uid ? updatedProfile : profile
      );
    });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleSaveChildChanges = (field) => {
    const updatedProfile = { ...khdemonas, [field]: editedChildData[field] };
    setProfiles((prevProfiles) => {
      return prevProfiles.map((profile) =>
        profile.uid === khdemonas.uid ? updatedProfile : profile
      );
    });
    setIsChildEditing({ ...isChildEditing, [field]: false });
  };

  // Handle image selection from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Convert the image to base64 URL
    }
  };

  return (
    <div>
      <Header log="connected" uid={1} name={"Νικολέτα"} surname={"Αντωνίου"} property={"parent"} />

      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", marginTop: "90px" }}>
        <div style={{ display: "flex", width: "80%" }}>
          {/* Left column with the image */}
          <div style={{ width: "30%", marginTop: "90px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src={profileImage || "/data/nikoleta.jpeg"} // Use the selected image if available, else fallback to default
                alt="Khdemonas"
                style={{ width: "80%", height: "auto", borderRadius: "10px" }}
              />
              <button
                onClick={() => document.getElementById("fileInput").click()} // Trigger the file input when the button is clicked
                style={{
                  position: "absolute",
                  top: "0px", // Position from the top of the container
                  right: "0px", // Position from the right of the container
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <img src="/edit (1).svg" alt="Edit" style={{ width: "20px", height: "20px" }} />
              </button>

              {/* Hidden file input */}
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
            {/* Guardian's Details Box */}
            <h2>Στοιχεία κηδεμόνα</h2>
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
                            marginRight: "10px", 
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

            {/* Child's Details Box */}
            <h2 style={{ marginTop: "30px" }}>Στοιχεία Παιδιού</h2>
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
                <b>Επιβεβαιώστε τα προσωπικά στοιχεία του παιδιού</b>
              </h2>
              {["childName", "childSurname", "childBirthDate", "amka"].map((field) => (
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
                          {field === "childName"
                            ? "Όνομα παιδιού"
                            : field === "childSurname"
                            ? "Επίθετο παιδιού"
                            : field === "childBirthDate"
                            ? "Ημερομηνία γέννησης παιδιού"
                            : "AMKA"}:
                        </b>{" "}
                        {isChildEditing[field] ? (
                          <input
                            type={field === "childBirthDate" ? "date" : "text"}
                            name={field}
                            value={editedChildData[field]}
                            onChange={handleChildInputChange}
                          />
                        ) : (
                          khdemonas?.[field] || "N/A"
                        )}
                      </div>
                      {isChildEditing[field] && (
                        <button
                          style={{
                            marginRight: "10px", 
                          }}
                          onClick={() => handleSaveChildChanges(field)}
                        >
                          Save
                        </button>
                      )}
                      <img
                        style={{ cursor: "pointer" }}
                        src="/edit (1).svg"
                        alt="Edit"
                        onClick={() => handleChildEditClick(field)}
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

export default GoneisProfile;
