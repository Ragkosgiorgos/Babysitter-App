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

function DimiourgiaAggelias(props) {

    const uid = 1; //? Get the user id from the session
    const uid1 = props.id; console.log("uid1:", uid1);

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];

    // Track the current step
    const [currentStep, setCurrentStep] = useState(0);

    // Function to go to the next step
    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            if (currentStep === 1) {
                {/* all fields are required */}
                if (formData.description === "" || formData.area === "" || formData.ageFrom === "" || formData.ageTo === "" || formData.time === "" || formData.accomodation === "") {
                    alert("Παρακαλώ συμπληρώστε όλα τα πεδία.");
                    return;
                }
            }
            setCurrentStep(currentStep + 1);
        }
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

    const [formData, setFormData] = useState({
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
        "0,5 ετών",
        "1.0 ετών",
        "1.5 ετών",
        "2.0 ετών",
        "2.5 ετών",
    ];
    
    const [profiles, setProfiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);

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
                            
                            <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                            <textarea name="description" placeholder="Περιγραφή αγγελίας." value={formData.description} onChange={handleInputChange}
                                style={{ marginLeft: "5%", marginBottom: "5%", width: "60%" }}> </textarea>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <FormControl style={{ marginTop: "1vh", fontSize: "2%", width: "25%" }}>
                                    <Select
                                        labelId="agg-area-select-label"
                                        name="area"
                                        value={formData.area}
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
                                                    value={formData.ageFrom}
                                                    onChange={handleInputChange}
                                                    style={{ height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age}
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
                                                    value={formData.ageTo}
                                                    onChange={handleInputChange}
                                                    style={{ height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age}
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
                                <RadioGroup row aria-label="time" name="time" value={formData.time} onChange={handleInputChange}>
                                    <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                    <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="accomodation" name="accomodation" value={formData.accomodation} onChange={handleInputChange}>
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
                                            { day: "Δευτέρα", from: formData.monFrom, to: formData.monTo, setFrom: (newValue) => setFormData({ ...formData, monFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, monTo: newValue }) },
                                            { day: "Τρίτη", from: formData.tueFrom, to: formData.tueTo, setFrom: (newValue) => setFormData({ ...formData, tueFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, tueTo: newValue }) },
                                            { day: "Τετάρτη", from: formData.wedFrom, to: formData.wedTo, setFrom: (newValue) => setFormData({ ...formData, wedFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, wedTo: newValue }) },
                                            { day: "Πέμπτη", from: formData.thuFrom, to: formData.thuTo, setFrom: (newValue) => setFormData({ ...formData, thuFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, thuTo: newValue }) },
                                            { day: "Παρασκευή", from: formData.friFrom, to: formData.friTo, setFrom: (newValue) => setFormData({ ...formData, friFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, friTo: newValue }) },
                                            { day: "Σάββατο", from: formData.satFrom, to: formData.satTo, setFrom: (newValue) => setFormData({ ...formData, satFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, satTo: newValue }) },
                                            { day: "Κυριακή", from: formData.sunFrom, to: formData.sunTo, setFrom: (newValue) => setFormData({ ...formData, sunFrom: newValue }), setTo: (newValue) => setFormData({ ...formData, sunTo: newValue }) },
                                            ].map(({ day, from, to, setFrom, setTo }) => (
                                            <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                <h8>{day}</h8>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                <TimePicker
                                                    label="Από"
                                                    value={formData.from}
                                                    onChange={(newValue) => setFrom(newValue)}
                                                    renderInput={(params) => <input {...params} />}
                                                />
                                                <TimePicker
                                                    label="Έως"
                                                    value={formData.to}
                                                    onChange={(newValue) => setTo(newValue)}
                                                    renderInput={(params) => <input {...params} />}
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
                                {formData.description}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {capitalizeWords(formData.area)}
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5%", marginLeft: "15%" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            από: {formData.ageFrom}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            εώς: {formData.ageTo}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {formData.time}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {formData.accomodation}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" , width:"80%" }}>
                                        {[
                                        { day: "Δευτέρα", from: formData.monFrom, to: formData.monTo },
                                        { day: "Τρίτη", from: formData.tueFrom, to: formData.tueTo },
                                        { day: "Τετάρτη", from: formData.wedFrom, to: formData.wedTo },
                                        { day: "Πέμπτη", from: formData.thuFrom, to: formData.thuTo },
                                        { day: "Παρασκευή", from: formData.friFrom, to: formData.friTo },
                                        { day: "Σάββατο", from: formData.satFrom, to: formData.satTo },
                                        { day: "Κυριακή", from: formData.sunFrom, to: formData.sunTo },
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
                        <h2>Η αγγελία σας με κωδικό {formData.id} δημοσιεύτηκε με επιτυχία!</h2>
                        <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Αγγελίες μου".</h4>
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
                    <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                            onClick={goToPreviousStep} >
                        {currentStep === 0 ? "Επιστροφή" : "Προηγούμενο"}
                    </button>

                    <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                            onClick={goToNextStep} disabled={currentStep === steps.length - 1}>
                        Επόμενο
                    </button>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default DimiourgiaAggelias;
