import React, { useState, useEffect } from "react";

import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/el'; // Greek locale
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import ProgressTracker from "../../../Components/ProgressTracker";

function ApodoxiSymbolaiou(){

    const steps = [
        "Eπιβεβαίωση στοιχείων κηδεμόνα και παιδιού",
        "Επιβεβαίωση στοιχείων επαγγελματία",
        "Επιβεβαίωση στοιχείων επαγγελματία",
        "Υπογραφή συμβολαίου",
    ];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        fetch("/data/sumbolaia.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data);
                setSymbolaio(data);
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
    const [symbolaio, setSymbolaio] = useState([]);

    const data = symbolaio.find((item) => item.id_symbolaiou === 1);
    const [actionTaken, setActionTaken] = useState(null);
    const handleAction = (action) => {
        setActionTaken(action);
    };
    


    


    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία κηδεμόνα </b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {data?.parentname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {data?.parentsurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {data?.parentbirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {data?.parentemail || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {data?.parentphone || "N/A"}
                            </h4>
                        </div>

                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικα στοιχεία παιδιού</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {data?.childName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {data?.childSurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {data?.childBirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {data?.amka || "N/A"}
                            </h4>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Επιβεβαίωση στοιχείων επαγγελματία</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {data?.babysittername || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {data?.babysittersurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {data?.babysitterbirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {data?.babysitteremail || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {data?.babysitterphone || "N/A"}
                            </h4>
                        </div>
                    </div>
                );
            
                case 2:
                    return (
                        <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Επιβεβαίωση στοιχείων συμβολαίου</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημέρες εργασίας</b> {data?.workdays || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Χρόνος απασχόλησης:</b> {data?.workTime || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Φιλοξενία:</b> {data?.hospitality || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Έναρξη συμβολαίου:</b> {data?.workStart || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Λήξη συμβολαίου:</b> {data?.workEnd || "N/A"}
                            </h4>
                        </div>
                    </div>
                    );
                
                    
                    case 3:
                        return (
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                {!actionTaken && (
                                    <>
                                        <h2 style={{ textAlign: "center", textDecoration: "underline", marginBottom: "20px" }}>
                                            <b>Αποδοχή ή απόρριψη συμβολαίου</b>
                                        </h2>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                gap: "200px", // Space between buttons
                                            }}
                                        >
                                            <button
                                                style={{
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#4CAF50",
                                                    color: "white",
                                                }}
                                                onClick={() => handleAction("accept")}
                                            >
                                                Αποδοχή
                                            </button>
                    
                                            <button
                                                style={{
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#F44336",
                                                    color: "white",
                                                }}
                                                onClick={() => handleAction("decline")}
                                            >
                                                Απόρριψη
                                            </button>
                                        </div>
                                    </>
                                )}
                    
                                {actionTaken === "accept" && (

                                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία κηδεμόνα </b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {data?.parentname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {data?.parentsurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {data?.parentbirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {data?.parentemail || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {data?.parentphone || "N/A"}
                            </h4>
                        </div>

                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικα στοιχεία παιδιού</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {data?.childName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {data?.childSurname || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {data?.childBirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {data?.amka || "N/A"}
                            </h4>
                        </div>
                    </div>
                    
                                    
                                )}
                    
                                {actionTaken === "decline" && (
                                    <p>Το συμβόλαιο έχει απορριφθεί.</p>
                                )}
                            </div>
                        );
                    

                    
        }
    };
    return(
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
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
                        onClick={() => {
                            goToNextStep();
                        }}
                    >
                        Επόμενο
                    </button>
                </div>
            </div>
    
            <Footer />
        </div>
    );
}

export default ApodoxiSymbolaiou;