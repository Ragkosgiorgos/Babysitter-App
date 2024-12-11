import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import ProgressTracker from "../../Components/ProgressTracker";
import { useLocation } from "react-router-dom";
import { FormControl, FormControlLabel } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import dayjs from 'dayjs';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file

function DimiourgiaSymbolaiou(props) {
    const location = useLocation();

    const [timeMondayFrom, setTimeMondayFrom] = useState(null);
    const [timeMondayTo, setTimeMondayTo] = useState(null);
    const [timeTuesdayFrom, setTimeTuesdayFrom] = useState(null);
    const [timeTuesdayTo, setTimeTuesdayTo] = useState(null);
    const [timeWednesdayFrom, setTimeWednesdayFrom] = useState(null);
    const [timeWednesdayTo, setTimeWednesdayTo] = useState(null);
    const [timeThursdayFrom, setTimeThursdayFrom] = useState(null);
    const [timeThursdayTo, setTimeThursdayTo] = useState(null);
    const [timeFridayFrom, setTimeFridayFrom] = useState(null);
    const [timeFridayTo, setTimeFridayTo] = useState(null);
    const [timeSaturdayFrom, setTimeSaturdayFrom] = useState(null);
    const [timeSaturdayTo, setTimeSaturdayTo] = useState(null);
    const [timeSundayFrom, setTimeSundayFrom] = useState(null);
    const [timeSundayTo, setTimeSundayTo] = useState(null);

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
                            <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "70%",justifyContent: "center",marginLeft: "15%",padding: "2%",}}>
                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                    <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                                </h2>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <label>
                                        <b>Όνομα:</b>
                                        <input type="text" name="firstName" value={professionalData.firstName} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%", marginLeft:"10px" }}/>
                                    </label> 
                                </h4>
                                <hr />
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                        <label>
                                            <b>Επίθετο:</b>
                                            <input type="text" name="lastName" value={professionalData.lastName} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%",marginLeft:"10px" }}/>
                                        </label> 
                                </h4>
                                <hr />
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <label>
                                        <b>ΑΦΜ:</b>
                                        <input type="text" name="afm" value={professionalData.afm} onChange={handleInputChange} style={{ marginTop: "3%", width: "50%",marginLeft:"10px" }}/>
                                    </label> 
                                </h4>
                            </div>
                            <div style={{display:"flex",flexDirection:"row"}} >
                            <div style={{ display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "30%",justifyContent: "center",marginLeft: "15%",padding: "2%",}}>
                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                    <b>Επιλέξτε τις ημέρες και ώρες που
                                    χρειάζεστε τον/την επαγγελματία</b>
                                </h2>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div style={{ marginTop: "2vh", display: "flex", flexDirection: "column" }}>
                                    <h6 style={{fontWeight:"bold"}}>Ημέρες και ώρες</h6>
                                    <div style={{ marginTop: "1vh", display: "flex", flexDirection: "column", gap: "10px" , width:"80%"}}>
                                        {[
                                        { day: "Δευτέρα", from: timeMondayFrom, to: timeMondayTo, setFrom: setTimeMondayFrom, setTo: setTimeMondayTo },
                                        { day: "Τρίτη", from: timeTuesdayFrom, to: timeTuesdayTo, setFrom: setTimeTuesdayFrom, setTo: setTimeTuesdayTo },
                                        { day: "Τετάρτη", from: timeWednesdayFrom, to: timeWednesdayTo, setFrom: setTimeWednesdayFrom, setTo: setTimeWednesdayTo },
                                        { day: "Πέμπτη", from: timeThursdayFrom, to: timeThursdayTo, setFrom: setTimeThursdayFrom, setTo: setTimeThursdayTo },
                                        { day: "Παρασκευή", from: timeFridayFrom, to: timeFridayTo, setFrom: setTimeFridayFrom, setTo: setTimeFridayTo },
                                        { day: "Σάββατο", from: timeSaturdayFrom, to: timeSaturdayTo, setFrom: setTimeSaturdayFrom, setTo: setTimeSaturdayTo },
                                        { day: "Κυριακή", from: timeSundayFrom, to: timeSundayTo, setFrom: setTimeSundayFrom, setTo: setTimeSundayTo },
                                        ].map(({ day, from, to, setFrom, setTo }) => (
                                        <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <h8>{day}</h8>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                            <TimePicker
                                                label="Από"
                                                value={from}
                                                onChange={(newValue) => setFrom(newValue)}
                                                renderInput={(params) => <input {...params} />}
                                            />
                                            <TimePicker
                                                label="Έως"
                                                value={to}
                                                onChange={(newValue) => setTo(newValue)}
                                                renderInput={(params) => <input {...params} />}
                                            />
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                </LocalizationProvider>
                                <hr />
                                                
                            </div>
                            <div style={{display: "flex",flexDirection: "column",width:"50%"}}>
                                <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",justifyContent: "center",marginLeft: "5%",padding: "2%",height:"30vh"}}>
                                    <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                            <b>Φιλοξενία</b>
                                    </h2>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="radio-buttons-group" style={{ textAlign: "left", textDecoration: "underline" }}
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="Στον χώρο του κηδεμόνα" />
                                            <FormControlLabel value="male" control={<Radio />} label="Στον χώρο του επαγγελματία" />
                                        </RadioGroup>
                                    </FormControl>
                                                
                                </div>
                                <div
    style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10%",
        backgroundColor: "#ece7f2",
        borderRadius: "2%",
        justifyContent: "center",
        marginLeft: "5%",
        padding: "2%",
        height: "30vh",
    }}
>
    <DateRange
        editableDateInputs={true}
        onChange={(item) => setRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={range}
    />
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
