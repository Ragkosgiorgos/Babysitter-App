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
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import ProgressTracker from "../../Components/ProgressTracker";




function DimiourgiaSymbolaiou(props) {
    
  const [weekdays, setWeekdays] = useState(false);
  const [weekends, setWeekends] = useState(false);
  const [selectedTime, setSelectedTime] = useState(dayjs());

  const handleWeekdaysChange = (event) => {
    setWeekdays(event.target.checked);
  };

  const handleWeekendsChange = (event) => {
    setWeekends(event.target.checked);
  };

  const validateStepTwo = () => {
    return (
        professionalData.firstName.trim() !== "" &&
        professionalData.lastName.trim() !== "" &&
        professionalData.afm.trim() !== "" &&
        (weekdays || weekends) && // At least one checkbox selected
        stepTwoData.hostingPreference.trim() !== "" &&
        stepTwoData.employmentTime.trim() !== "" &&
        stepTwoData.dateRange.length > 0 // Ensure date range is selected
    );
};

const [validationMessage, setValidationMessage] = useState("");

const handleNextStep = () => {
    if (!validateStepTwo()) {
        setValidationMessage("Παρακαλώ συμπληρώστε όλα τα πεδία πριν προχωρήσετε.");
        return;
    }
    setValidationMessage(""); // Clear the message if validation passes
    goToNextStep();
};


  
    
    const location = useLocation();
    const [stepTwoData, setStepTwoData] = useState({
        availability: {
            Monday: { from: null, to: null },
            Tuesday: { from: null, to: null },
            Wednesday: { from: null, to: null },
            Thursday: { from: null, to: null },
            Friday: { from: null, to: null },
            Saturday: { from: null, to: null },
            Sunday: { from: null, to: null },
        },
        hostingPreference: "guardian", // Default value
        employmentTime: "part-time",
        dateRange: [
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            },
        ],
    });
    
    // Update availability time for a specific day
const handleTimeChange = (day, type, newValue) => {
    setStepTwoData((prevData) => {
        const updatedData = {
            ...prevData,
            availability: {
                ...prevData.availability,
                [day]: {
                    ...prevData.availability[day],
                    [type]: newValue,
                },
            },
        };
        console.log("Updated Step Two Data (availability):", updatedData);
        return updatedData;
    });
};

// Update hosting preference
const handleHostingPreferenceChange = (event) => {
    setStepTwoData((prevData) => {
        const updatedData = {
            ...prevData,
            hostingPreference: event.target.value,
        };
        console.log("Updated Step Two Data (hostingPreference):", updatedData);
        return updatedData;
    });
};

// Update employment time
const handleEmploymentTimeChange = (event) => {
    setStepTwoData((prevData) => {
        const updatedData = {
            ...prevData,
            employmentTime: event.target.value,
        };
        console.log("Updated Step Two Data (employmentTime):", updatedData);
        return updatedData;
    });
};

// Update date range
const handleDateRangeChange = (item) => {
    setStepTwoData((prevData) => {
        const updatedData = {
            ...prevData,
            dateRange: [item.selection],
        };
        console.log("Updated Step Two Data (dateRange):", updatedData);
        return updatedData;
    });
};


    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Επιβεβαίωση στοιχείων παιδιού",
        "Συμπλήρωση στοιχείων επαγγελματία και στοιχείων εργασίας",
        "Προεπισκόπηση και υποβολή",
        "Αναμονή για υπογραφή από επαγγελματία",
        "Αποδοχή ή απόρριψη συμβολαίου",
    ];

    const [range, setRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);

    const [currentStep, setCurrentStep] = useState(0);
    const [profiles, setProfiles] = useState([]);
    const [value,setValue] = useState(dayjs());;

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
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
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
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
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
                            <div>
                                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "70%", justifyContent: "center", marginLeft: "15%", padding: "2%", }}>
                                    <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                        <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                                    </h2>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                        <label>
                                            <b>Όνομα:</b>
                                            <input type="text" name="firstName" value={professionalData.firstName} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%", marginLeft: "10px" }} />
                                        </label>
                                    </h4>
                                    <hr />
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                        <label>
                                            <b>Επίθετο:</b>
                                            <input type="text" name="lastName" value={professionalData.lastName} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%", marginLeft: "10px" }} />
                                        </label>
                                    </h4>
                                    <hr />
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                        <label>
                                            <b>ΑΦΜ:</b>
                                            <input type="text" name="afm" value={professionalData.afm} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%", marginLeft: "10px" }} />
                                        </label>
                                    </h4>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", justifyContent: "center", marginLeft: "5%", padding: "2%", height: "30vh" }}>
                                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                <b>Ημέρες και ώρες</b>
                                            </h2>
                                                <FormControlLabel
                                                    control={<Checkbox checked={weekdays} onChange={handleWeekdaysChange} />}
                                                    label="Καθημερινές"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox checked={weekends} onChange={handleWeekendsChange} />}
                                                    label="Σαββατοκύριακο"
                                                />
                                        </div >
                                            <div style={{ display: "flex", flexDirection: "column", marginTop: "100px", backgroundColor: "#ece7f2", borderRadius: "2%", justifyContent: "center", marginLeft: "5%", padding: "2%", height: "30vh" }}>
                                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                            <b>Διάρκεια απασχόλησης</b>
                                            </h2>
                                            
                                                <DateRange
                                                    editableDateInputs={true}
                                                    onChange={handleDateRangeChange}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={stepTwoData.dateRange}
                                                />
                                            </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", justifyContent: "center", marginLeft: "5%", padding: "2%", height: "30vh" }}>
                                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                <b>Φιλοξενία</b>
                                            </h2>
                                            <FormControl>
                                                <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    value={stepTwoData.hostingPreference}
                                                    onChange={handleHostingPreferenceChange}
                                                    name="radio-buttons-group"
                                                    style={{ textAlign: "left", textDecoration: "underline" }}
                                                >
                                                    <FormControlLabel value="guardian" control={<Radio />} label="Στον χώρο του κηδεμόνα" />
                                                    <FormControlLabel value="professional" control={<Radio />} label="Στον χώρο του επαγγελματία" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", justifyContent: "center", marginLeft: "5%", padding: "2%", height: "30vh" }}>
                                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                <b>Χρόνος απασχόλησης</b>
                                            </h2>
                                            <FormControl>
                                            <RadioGroup
                                                value={stepTwoData.employmentTime}
                                                onChange={handleEmploymentTimeChange}
                                            >
                                                <FormControlLabel value="part-time" control={<Radio />} label="Μερική" />
                                                <FormControlLabel value="full-time" control={<Radio />} label="Πλήρης" />
                                            </RadioGroup>
                                        </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                
            case 3:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Προεπισκόπηση συμβολαίου</h2>
                        <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία κηδεμόνα</b>
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
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία παιδιού</b>
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
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {professionalData?.firstName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {professionalData?.lastName }
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΦΜ:</b> {professionalData?.afm}
                            </h4>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                    <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                        <b>Ημέρες και ώρες</b>
                    </h2>
                    <p>
                        {weekdays && weekends
                            ? "Καθημερινές και Σαββατοκύριακο"
                            : weekdays
                            ? "Καθημερινές"
                            : weekends
                            ? "Σαββατοκύριακο"
                            : "Δεν έχει επιλεχθεί κάποια επιλογή"}
                    </p>
                </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Φιλοξενία</b>
                        </h2>
                        <p>{stepTwoData.hostingPreference === "guardian" ? "Στον χώρο του κηδεμόνα" : "Στον χώρο του επαγγελματία"}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Χρόνος απασχόλησης</b>
                        </h2>
                        <p>{stepTwoData.employmentTime === "part-time" ? "Μερική" : "Πλήρης"}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Ημερομηνίες</b>
                        </h2>
                        <p><b>Από:</b> {stepTwoData.dateRange[0].startDate.toLocaleDateString()}</p>
                        <p><b>Έως:</b> {stepTwoData.dateRange[0].endDate.toLocaleDateString()}</p>
                    </div>


                    </div>
                );
            case 4:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                            <span>Το συμβόλαιο με κωδικό #XXXXXX βρίσκεται υπό αναμονή απάντησης από τον/την επαγγελματία. 
                            Μπορείτε να παρακολουθείτε τυχόν εξελίξεις από τη λίστα συμβολαίων. </span>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                                <span>Το συμβόλαιό σας με κωδικό #XXXXXX εγκρίθηκε από τον/την επαγγελματία.
                                Η συνεργασία σας με τον/την επαγγελματία είναι σε ισχύ. </span>
                            </div>
                        </div>
                        <h3>ή</h3>
                        <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                            <span>Το συμβόλαιό σας με κωδικό #XXXXXX απορρίφθηκε από τον/την επαγγελματία. </span>
                        </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία κηδεμόνα</b>
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
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικά στοιχεία παιδιού</b>
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
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {professionalData?.firstName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {professionalData?.lastName }
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΦΜ:</b> {professionalData?.afm}
                            </h4>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Ημέρες και ώρες</b>
                        </h2>
                        {Object.keys(stepTwoData.availability)
                            .filter(day => stepTwoData.availability[day].from && stepTwoData.availability[day].to) // Only include days with both from and to times
                            .map((day) => {
                                // Greek day mapping
                                const dayInGreek = {
                                    Monday: "Δευτέρα",
                                    Tuesday: "Τρίτη",
                                    Wednesday: "Τετάρτη",
                                    Thursday: "Πέμπτη",
                                    Friday: "Παρασκευή",
                                    Saturday: "Σάββατο",
                                    Sunday: "Κυριακή"
                                };

                                return (
                                    <div key={day} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "10px" }}>
                                        <h4>{dayInGreek[day]}</h4>
                                        <p><b>Από:</b> {stepTwoData.availability[day].from.format("HH:mm")} <b>Έως:</b> {stepTwoData.availability[day].to.format("HH:mm")}</p>
                                    </div>
                                );
                            })}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Φιλοξενία</b>
                        </h2>
                        <p>{stepTwoData.hostingPreference === "guardian" ? "Στον χώρο του κηδεμόνα" : "Στον χώρο του επαγγελματία"}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Χρόνος απασχόλησης</b>
                        </h2>
                        <p>{stepTwoData.employmentTime === "part-time" ? "Μερική" : "Πλήρης"}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Ημερομηνίες</b>
                        </h2>
                        <p><b>Από:</b> {stepTwoData.dateRange[0].startDate.toLocaleDateString()}</p>
                        <p><b>Έως:</b> {stepTwoData.dateRange[0].endDate.toLocaleDateString()}</p>
                    </div>
                    </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="connected" property={"parent"} name={khdemonas?.name} surname={khdemonas?.surname} />
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
                            if (currentStep === 2) {
                                if (!validateStepTwo()) {
                                    alert("Συμπληρώστε όλα τα πεδία πριν προχωρήσετε.");
                                    return;
                                }
                            }
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

export default DimiourgiaSymbolaiou;
