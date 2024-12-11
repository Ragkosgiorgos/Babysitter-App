import React , { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import ProgressTracker from "../../Components/ProgressTracker";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, FormControl } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useLocation } from 'react-router-dom';

function DimiourgiaAggelias() {
    const location = useLocation();
    const { stage } = location.state; // Get the stage from the location state

    const uid = 1; //? Get the user id from the session

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];

    // Track the current step
    const [currentStep, setCurrentStep] = useState(stage || 0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Function to go to the next step
    const goToNextStep = (e) => {
        if (currentStep === 1) {
            setIsSubmitted(true);
            if (newData.description === "" || newData.area === "" || newData.ageFrom === "" || newData.ageTo === "" || newData.time === "" || newData.accomodation === "" ) {
                return;
            }
            setIsSubmitted(false);
        }
        setCurrentStep(currentStep + 1);
    };

    const navigate = useNavigate();

    // Function to go to the previous step
    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
        if (currentStep === 0) { // Go to the page of Aggelies
            navigate("/aggelies");
        }
    };

    const [newData, setnewData] = useState({
        id: -1,
        uid: uid,
        status: "Σε Προσωρινή Αποθήκευση",
        date: new Date().toLocaleDateString(),
        area: "",
        description: "",
        accomodation: "",
        ageFrom: "",
        ageTo: "",
        time: "",
        car: "",
        monFrom: "00:00",
        monTo: "23:59",
        tueFrom: "00:00",
        tueTo: "23:59",
        wedFrom: "00:00",
        wedTo: "23:59",
        thuFrom: "00:00",
        thuTo: "23:59",
        friFrom: "00:00",
        friTo: "23:59",
        satFrom: "00:00",
        satTo: "23:59",
        sunFrom: "00:00",
        sunTo: "23:59"
    });

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

    const ages = [
        0.5,
        1,
        1.5,
        2,
        2.5,
    ];
    
    const [profiles, setProfiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetch("/data/ntantades.json")
          .then((response) => {
            console.log("Response:", response); // Debug the response object
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse as JSON
          })
          .then((data) => {
            setProfiles(data); // Update the state
          })
          .catch((error) => {
            console.error("Error fetching JSON:", error);
          });
    }, []);

    function capitalizeWords(str) {
        if (str === undefined || str === null) {
            return ''; // Return an empty string if the value is undefined or null
        }
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
    
    const user = profiles.find(profile => profile.uid === uid);
    if (!user) {
        return <div>Δεν βρέθηκε ο χρήστης με id: {uid}</div>;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                            justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}><b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b></h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {user.name} </h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.surname}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Ημερομηνία γέννησης:</b> {user.birthDate}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Πόλη:</b> {user.area}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.email}</h4>
                        </div>
                    </div>
                );
            case 1:
                return (
                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                      justifyContent: "center", marginLeft: "20%", padding: "2%", marginTop: "2%" }}>

                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                            
                            
                            <h5 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}> Περιγραφή { isSubmitted && !newData.description ? <h5 style={{ color: "red", marginLeft: "20px", fontSize: "0.8em", borderTop: "20%" }}> *Συμπληρώστε </h5> : "" }</h5> 
                            <textarea name="description" placeholder="Περιγραφή αγγελίας." value={newData.description} onChange={handleInputChange}
                                        style={{ marginLeft: "5%", marginBottom: "5%", width: "60%", height: "10vh", border: isSubmitted && !newData.description ? "1px solid red" : "" }}>
                            </textarea>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <FormControl style={{ marginTop: "1vh", fontSize: "2%", width: "25%", border: isSubmitted && !newData.area ? "1px solid red" : "" }}>
                                    <Select
                                        labelId="agg-area-select-label"
                                        name="area"
                                        value={newData.area}
                                        onChange={handleInputChange}
                                        style={{ height: "auto" }}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>
                                            Επιλέξτε περιοχή
                                        </MenuItem>
                                        {areasOfGreece.map((area) => (
                                            <MenuItem key={area} value={area.toLowerCase()}>
                                                {area}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                    <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "15%" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <h7> από </h7>

                                            <FormControl>
                                                <Select
                                                    labelId="agg-ageFrom-select-label"
                                                    name="ageFrom"
                                                    value={newData.ageFrom}
                                                    onChange={handleInputChange}
                                                    style={{ border: isSubmitted && !newData.ageFrom ? "1px solid red" : "", height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age} ετών
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                                    
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <h7> εώς </h7>
                                            <FormControl>
                                                <Select
                                                    labelId="agg-ageTo-select-label"
                                                    name="ageTo"
                                                    value={newData.ageTo}
                                                    onChange={handleInputChange}
                                                    style={{ border: isSubmitted && !newData.ageTo ? "1px solid red" : "", height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age} ετών
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="time" name="time" value={newData.time} onChange={handleInputChange} style={{ border: isSubmitted && !newData.time ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                    <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="accomodation" name="accomodation" value={newData.accomodation} onChange={handleInputChange} style={{ border: isSubmitted && !newData.accomodation ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Ναι" control={<Radio />} label="Ναι" />
                                    <FormControlLabel value="Όχι" control={<Radio />} label="Όχι" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%" }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div style={{ marginTop: "2vh", display: "flex", flexDirection: "column" }}>
                                        <h6 style={{ fontWeight:"bold" }}> Ημέρες και ώρες </h6>
                                        <div style={{ marginTop: "1vh", display: "flex", flexDirection: "column", gap: "10px" , width:"80%", marginLeft: "10%" }}>
                                            {[
                                            { day: "Δευτέρα", from: newData.monFrom, to: newData.monTo, setFrom: (newValue) => setnewData({ ...newData, monFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, monTo: newValue }) },
                                            { day: "Τρίτη", from: newData.tueFrom, to: newData.tueTo, setFrom: (newValue) => setnewData({ ...newData, tueFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, tueTo: newValue }) },
                                            { day: "Τετάρτη", from: newData.wedFrom, to: newData.wedTo, setFrom: (newValue) => setnewData({ ...newData, wedFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, wedTo: newValue }) },
                                            { day: "Πέμπτη", from: newData.thuFrom, to: newData.thuTo, setFrom: (newValue) => setnewData({ ...newData, thuFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, thuTo: newValue }) },
                                            { day: "Παρασκευή", from: newData.friFrom, to: newData.friTo, setFrom: (newValue) => setnewData({ ...newData, friFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, friTo: newValue }) },
                                            { day: "Σάββατο", from: newData.satFrom, to: newData.satTo, setFrom: (newValue) => setnewData({ ...newData, satFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, satTo: newValue }) },
                                            { day: "Κυριακή", from: newData.sunFrom, to: newData.sunTo, setFrom: (newValue) => setnewData({ ...newData, sunFrom: newValue }), setTo: (newValue) => setnewData({ ...newData, sunTo: newValue }) },
                                            ].map(({ day, from, to, setFrom, setTo }) => (
                                            <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                <h8>{day}</h8>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                <TimePicker
                                                    label="Από"
                                                    value={newData.from}
                                                    onChange={(newValue) => setFrom(newValue)}
                                                    renderInput={(params) => <input {...params} />}
                                                    style={{  }}
                                                />
                                                <TimePicker
                                                    label="Έως"
                                                    value={newData.to}
                                                    onChange={(newValue) => setTo(newValue)}
                                                    renderInput={(params) => <input {...params} />}
                                                    style={{  }}
                                                />
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </LocalizationProvider>
                            </div>

                        </div>
                );
            case 2:
                return (
                        <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                            {/* Data for the first step */}
                            <div style={{ textAlign: "center"}}>
                                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                                                justifyContent: "center", padding: "2%" }}>
                                    <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {user.name} </h4>
                                    <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.surname}</h4>
                                    <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Ημερομηνία γέννησης:</b> {user.birthDate}</h4>
                                    <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Πόλη:</b> {user.area}</h4>
                                    <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                                    <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.email}</h4>
                                </div>
                            </div>

                            {/* Data for the second step */}
                            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                      justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                            
                            <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.description}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {capitalizeWords(newData.area)}
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5%", marginLeft: "15%" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            από: {newData.ageFrom}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            εώς: {newData.ageTo}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.time}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.accomodation}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" , width:"80%" }}>
                                        {[
                                        { day: "Δευτέρα", from: newData.monFrom, to: newData.monTo },
                                        { day: "Τρίτη", from: newData.tueFrom, to: newData.tueTo },
                                        { day: "Τετάρτη", from: newData.wedFrom, to: newData.wedTo },
                                        { day: "Πέμπτη", from: newData.thuFrom, to: newData.thuTo },
                                        { day: "Παρασκευή", from: newData.friFrom, to: newData.friTo },
                                        { day: "Σάββατο", from: newData.satFrom, to: newData.satTo },
                                        { day: "Κυριακή", from: newData.sunFrom, to: newData.sunTo },
                                        ].map(({ day, from, to }) => (
                                        <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <h8>{day}</h8>
                                            <div style={{ display: "flex", gap: "10px", marginLeft: "20%" }}>
                                                <div>{from}</div>-
                                                <div>{to}</div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                </div>
                );
            case 3:
                return (
                    <div style={{ textAlign: "center", marginTop: "4%", marginBottom: "27%" }}>
                        <h2>Η αγγελία σας με κωδικό {newData.id} δημοσιεύτηκε με επιτυχία!</h2>
                        <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Αγγελίες μου".</h4>
                    </div>
                );
            case 4:
                return (
                    <div style={{ textAlign: "center", marginTop: "4%", marginBottom: "27%" }}>
                        {navigate("/aggelies")}
                    </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="connected" id={uid} property="babysitter" name={user.name} surname={user.surname} />

            <div style={{ flex: 1 }}>
                <Breadcrumbs />

                <ProgressTracker steps={steps} activeStep={currentStep} />

                {renderStepContent()}

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50%", marginTop: "2%" }}>
                    { currentStep !== 3 &&
                    <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                            onClick={goToPreviousStep} >
                        {currentStep === 0 ? "Επιστροφή" : "Προηγούμενο"}
                    </button>}
                        
                    {(currentStep < 2 &&
                        <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                                onClick={goToNextStep}>
                            Επόμενο
                        </button>) || (currentStep === 3 &&
                        <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                                onClick={goToNextStep}>
                            Επιστροφή
                        </button>)
                        || 
                        <div style={{ display: "flex", gap: "25%" }}>
                            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "100%" }}
                                onClick={goToNextStep}> Προσωρινή αποθήκευση </button>
                            
                            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "100%" }}
                                onClick={goToNextStep}> Οριστική υποβολή </button>
                        </div>
                    }
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default DimiourgiaAggelias;
