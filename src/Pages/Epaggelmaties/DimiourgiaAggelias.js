import React , { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import ProgressTracker from "../../Components/ProgressTracker";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, FormControl } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

function DimiourgiaAggelias(props) {

    const uid = 1; //? Get the user id from the session

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
        monTo: "00:00",
        tueFrom: "00:00",
        tueTo: "00:00",
        wedFrom: "00:00",
        wedTo: "00:00",
        thuFrom: "00:00",
        thuTo: "00:00",
        friFrom: "00:00",
        friTo: "00:00",
        satFrom: "00:00",
        satTo: "00:00",
        sunFrom: "00:00",
        sunTo: "00:00",
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
    
    const user = profiles.find(profile => profile.uid === uid);
    if (!user) {
        return <div>Δεν βρέθηκε ο χρήστης με id: {uid}</div>;
    }

    const zeroAM = dayjs().set('hour', 0).startOf('hour');

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
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                        </div>

                    </div>
                );
            case 1:
                return (
                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                      justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                            
                            <h5 style={{ fontWeight: "bold"}}> Περιγραφή </h5>
                            <textarea name="description" placeholder="Περιγραφή αγγελίας." value={formData.description} onChange={handleInputChange}
                                style={{ marginLeft: "5%", marginBottom: "1%" }}> </textarea>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "1%" }}>
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

                            <h5 style={{ fontWeight: "bold"}}> Ηλικία από </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "1%" }}>
                                <FormControl style={{ marginTop: "1vh", fontSize: "2%", width: "25%" }}>
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

                            <h5 style={{ fontWeight: "bold"}}> Ηλικία έως </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "1%" }}>
                                <FormControl style={{ marginTop: "1vh", fontSize: "2%", width: "25%" }}>
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

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "1%" }}>
                                <RadioGroup row aria-label="time" name="time" value={formData.accomodation} onChange={handleInputChange}>
                                    <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                    <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "1%" }}>
                                <RadioGroup row aria-label="accomodation" name="accomodation" value={formData.accomodation} onChange={handleInputChange}>
                                    <FormControlLabel value="Ναι" control={<Radio />} label="Ναι" />
                                    <FormControlLabel value="Όχι" control={<Radio />} label="Όχι" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%" }}>

                                <div style={{ display: "flex", flexDirection: "column", marginBottom: "60%" }}>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Δευτέρα </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.monFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                monFrom: newValue ? newValue.format('HH:mm') : prevData.monFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.monTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                monTo: newValue ? newValue.format('HH:mm') : prevData.monTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Τρίτη </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker style = {{width: "50%"}}
                                                        value={dayjs(formData.tueFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                tueFrom: newValue ? newValue.format('HH:mm') : prevData.tueFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.tueTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                tueTo: newValue ? newValue.format('HH:mm') : prevData.tueTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>
                                    
                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Τετάρτη </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.wedFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                wedFrom: newValue ? newValue.format('HH:mm') : prevData.wedFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.wedTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                wedTo: newValue ? newValue.format('HH:mm') : prevData.wedTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                </div>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Πέμπτη </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.thuFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                thuFrom: newValue ? newValue.format('HH:mm') : prevData.thuFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.thuTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                thuTo: newValue ? newValue.format('HH:mm') : prevData.thuTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Παρασκευή </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.friFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                friFrom: newValue ? newValue.format('HH:mm') : prevData.friFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.friTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                friTo: newValue ? newValue.format('HH:mm') : prevData.friTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Σάββατο </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.satFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                satFrom: newValue ? newValue.format('HH:mm') : prevData.satFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.satTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                satTo: newValue ? newValue.format('HH:mm') : prevData.satTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <h7 style={{ textDecoration: "underline", marginLeft: "5%" }}> Κυριακή </h7>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10%", marginLeft: "10%" }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <DemoItem label="από">
                                                    <TimePicker
                                                        value={dayjs(formData.sunFrom, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                sunFrom: newValue ? newValue.format('HH:mm') : prevData.sunFrom,
                                                            }))
                                                        }
                                                        ampm={false} // Use 24-hour format
                                                    />
                                                </DemoItem>
                                                <DemoItem label="μέχρι">
                                                    <TimePicker
                                                        value={dayjs(formData.sunTo, 'HH:mm')}
                                                        onChange={(newValue) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                sunTo: newValue ? newValue.format('HH:mm') : prevData.sunTo,
                                                            }))
                                                        }
                                                        ampm={false}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                </div>
                            </div>

                        </div>
                );
            case 2:
                return (
                    <div style={{ textAlign: "center" }}>

                    </div>
                );
            case 3:
                return (
                    <div style={{ textAlign: "center" }}>
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

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50%" }}>
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
