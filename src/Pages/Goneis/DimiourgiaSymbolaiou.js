import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import ProgressTracker from "../../Components/ProgressTracker";
import { useLocation } from "react-router-dom";

function DimiourgiaSymbolaiou(props) {
    const location = useLocation();

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Επιβεβαίωση στοιχείων παιδιού",
        "Συμπλήρωση στοιχείων επαγγελματία και στοιχείων εργασίας",
        "Προεπισκόπηση και υποβολή",
        "Αναμονή για υπογραφή από επαγγελματία",
        "Αποδοχή ή απόρριψη συμβολαίου",
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [profiles, setProfiles] = useState([]);

    const [professionalData, setProfessionalData] = useState({
        firstName: "",
        lastName: "",
        afm: "",
    });

    useEffect(() => {
        fetch("/data/khdemones.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data);
                setProfiles(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const khdemonas = profiles.find((profile) => profile.uid === 2);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfessionalData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log("Updated Professional Data:", updatedData); // Log the updated state values
            return updatedData;
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "2%",
                                backgroundColor: "#ece7f2",
                                borderRadius: "2%",
                                width: "60%",
                                justifyContent: "center",
                                marginLeft: "20%",
                                padding: "2%",
                            }}
                        >
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {khdemonas?.name || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.surname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.birthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {khdemonas?.email || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {khdemonas?.phone || "N/A"}
                            </h4>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "2%",
                                backgroundColor: "#ece7f2",
                                borderRadius: "2%",
                                width: "60%",
                                justifyContent: "center",
                                marginLeft: "20%",
                                padding: "2%",
                            }}
                        >
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Επιβεβαιώστε τα στοιχεία του παιδιού</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {khdemonas?.childName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.childSurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.childBirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {khdemonas?.amka || "N/A"}
                            </h4>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Συμπληρώστε τα στοιχεία επαγγελματία και στοιχεία εργασίας</h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "2%",
                                backgroundColor: "#ece7f2",
                                borderRadius: "2%",
                                width: "60%",
                                justifyContent: "center",
                                marginLeft: "20%",
                                padding: "2%",
                            }}
                        >
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <label>
                                <b>Όνομα:</b>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={professionalData.firstName}
                                    onChange={handleInputChange}
                                    style={{ marginTop: "3%", width: "50%", marginLeft:"10px" }}
                                />
                                </label> 
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <label>
                                <b>Επίθετο:</b>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={professionalData.lastName}
                                    onChange={handleInputChange}
                                    style={{ marginTop: "3%", width: "50%",marginLeft:"10px" }}
                                />
                                </label> 
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <label>
                                <b>ΑΦΜ:</b>
                                <input
                                    type="text"
                                    name="afm"
                                    value={professionalData.afm}
                                    onChange={handleInputChange}
                                    style={{ marginTop: "3%", width: "50%",marginLeft:"10px" }}
                                />
                                </label> 
                            </h4>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Προεπισκόπηση συμβολαίου</h2>
                        {/* Preview the contract */}
                    </div>
                );
            case 4:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Αναμονή για υπογραφή από επαγγελματία</h2>
                    </div>
                );
            case 5:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Αποδοχή ή απόρριψη συμβολαίου</h2>
                        {/* Add acceptance/rejection logic */}
                    </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="connected" />

            <div style={{ flex: 1 }}>
                <ProgressTracker steps={steps} activeStep={currentStep} />

                {renderStepContent()}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "2%",
                        gap: "50%",
                        marginBottom: "10px",
                    }}
                >
                    <button
                        style={{
                            height: "3%",
                            backgroundColor: "#2b8cbe",
                            color: "white",
                            borderRadius: "5px",
                            marginTop: "2%",
                            width: "12%",
                        }}
                        onClick={goToPreviousStep}
                        disabled={currentStep === 0}
                    >
                        Προηγούμενο
                    </button>

                    <button
                        style={{
                            height: "3%",
                            backgroundColor: "#2b8cbe",
                            color: "white",
                            borderRadius: "5px",
                            marginTop: "2%",
                            width: "12%",
                        }}
                        onClick={goToNextStep}
                        disabled={currentStep === steps.length - 1}
                    >
                        Επόμενο
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default DimiourgiaSymbolaiou;
