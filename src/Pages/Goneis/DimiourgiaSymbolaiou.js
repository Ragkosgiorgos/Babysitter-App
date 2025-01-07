import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/el'; 
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import ProgressTracker from "../../Components/ProgressTracker";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../config/firebase.js'
import { doc, updateDoc } from 'firebase/firestore';
import { addDoc, setDoc } from 'firebase/firestore';
dayjs.locale("el"); // Set the locale to Greek



function DimiourgiaSymbolaiou(props) {
    const [weekdays, setWeekdays] = useState(false);
    const [weekends, setWeekends] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [contract, setContract] = useState([]);
    const [khdemonas, setKhdemonas] = useState({});
    const [stepTwoData, setStepTwoData] = useState({
        id: '',
        id_p: '',
        id_b: '',
        time: '', 
        date: new Date().toLocaleDateString(),
        workingDays: '',
        dateRange: [
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            },
        ],
        status: 'Σε αναμονή'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [babysitter, setBabysitter] = useState({});
    const [contractId, setContractId] = useState(null);
    const [validationMessage, setValidationMessage] = useState("");

    const [currentStep, setCurrentStep] = useState(0);

     // Define isLoading state
     const [isLoading, setIsLoading] = useState(false); // Added isLoading state

     // Define professionalData state
     const [professionalData, setProfessionalData] = useState({
         firstName: "",
         lastName: "",
         afm: "",
     }); // Added professionalData state

    // Check if user is logged in and get UUID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch all babysitters
    useEffect(() => {
        if (!uuid) return; // Don't fetch if UUID is not set (user not logged in)
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const q1 = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'babysitter'));
                const querySnapshot1 = await getDocs(q1);
                const users1 = querySnapshot1.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProfiles(users1);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [uuid]);

    // Fetch all contracts based on user UUID
    useEffect(() => {
        if (!uuid) return; // Don't fetch if UUID is not set
        const fetchContracts = async () => {
            setLoading(true);
            try {
                const q = query(collection(FIREBASE_DB, 'rantevou'), where('id_p', '==', uuid));
                const querySnapshot = await getDocs(q);
                const contracts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setContracts(contracts);
            } catch (error) {
                console.error('Error fetching contracts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, [uuid]);


    // Fetch all contracts based on user UUID
    useEffect(() => {
        if (!contractId) return; // Don't fetch if UUID is not set
        const fetchContracts = async () => {
            setLoading(true);
            try {
                const q = query(collection(FIREBASE_DB, 'contracts'), where('id', '==', contractId));
                const querySnapshot = await getDocs(q);
                const contract = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setContract(contract);
            } catch (error) {
                console.error('Error fetching contracts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, [uuid]);

    // Fetch user data for Khdemonas
    useEffect(() => {
        if (!uuid) return; // Don't fetch if UUID is not set
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setKhdemonas(users[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [uuid]);

    // Filter hired babysitters based on contracts
    const hiredBabysitters = profiles.filter((profile) => {
        return contracts.some((contract) => contract.id_b === profile.userId);
    });

    // Validate Step Two
    const validateStepTwo = () => {
        return (
            (weekdays || weekends) && // At least one checkbox selected
            stepTwoData.hostingPreference?.trim() !== "" &&
            stepTwoData.employmentTime?.trim() !== "" &&
            stepTwoData.dateRange.length > 0 // Ensure date range is selected
        );
    };

    const handleNextStep = () => {
        if (!validateStepTwo()) {
            setValidationMessage("Παρακαλώ συμπληρώστε όλα τα πεδία πριν προχωρήσετε.");
            return;
        }
        setValidationMessage(""); // Clear message if validation passes
        goToNextStep();
    };

    const handleWeekdaysChange = (event) => {
        setWeekdays(event.target.checked);
    };

    const handleWeekendsChange = (event) => {
        setWeekends(event.target.checked);
    };

    const handleHostingPreferenceChange = (event) => {
        setStepTwoData((prevData) => ({
            ...prevData,
            hostingPreference: event.target.value,
        }));
    };

    const handleEmploymentTimeChange = (event) => {
        setStepTwoData((prevData) => ({
            ...prevData,
            employmentTime: event.target.value,
        }));
    };

    const handleDateRangeChange = (item) => {
        setStepTwoData((prevData) => ({
            ...prevData,
            dateRange: [item.selection],
        }));
    };

    // Submit contract
    const submitContract = async () => {
        setIsSubmitting(true);
        try {
            const contractData = {
                id_p: uuid,
                id_b: babysitter.userId,
                time: stepTwoData.employmentTime,
                hosting: stepTwoData.hostingPreference,
                date: stepTwoData.date,
                startDate: dayjs(stepTwoData.dateRange[0].startDate).format('dddd D MMMM YYYY'),
                endDate: dayjs(stepTwoData.dateRange[0].endDate).format('dddd D MMMM YYYY'),
                status: stepTwoData.status,
                weekdays: weekdays,
                weekends: weekends,
            };

            const ratingsRef = collection(FIREBASE_DB, 'contracts');
            const docRef = await addDoc(ratingsRef, contractData);

            const documentId = docRef.id;
            await setDoc(docRef, { id: documentId }, { merge: true });

            setContractId(documentId); // Save contract ID
        } catch (error) {
            console.error('Error adding document:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Steps for the form navigation
    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Επιβεβαίωση στοιχείων παιδιού",
        "Συμπλήρωση στοιχείων επαγγελματία και στοιχείων εργασίας",
        "Προεπισκόπηση και υποβολή",
        "Αναμονή για υπογραφή από επαγγελματία",
    ];

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

    const setBabysitterChoice = (babysitter_id) => {
        const selectedBabysitter = profiles.find((profile) => profile.userId === babysitter_id);
        setBabysitter(selectedBabysitter);
    };

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

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
                                <b>Όνομα:</b> {khdemonas?.firstName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.lastName || "N/A"}
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
                                <b>Όνομα:</b> {khdemonas?.childFirstName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.childLastName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.childBirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {khdemonas?.childAmka || "N/A"}
                            </h4>
                        </div>
                    </div>
                );
            
                case 2:
                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "120vh", 
                                padding: "0 10%",
                            }}
                            >
                            <div style={{ width: "80%" }}>
                                {/* First Box */}
                                <div
                                style={{
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    padding: "2%",
                                    height: "20vh",
                                    textAlign: "center",
                                    marginBottom: "20px",
                                }}
                                >
                                <h3 style={{ marginTop: "3%" }}>
                                    Επιλέξτε τον επαγγελματία που θέλετε να κάνετε συμβόλαιο
                                </h3>
                                {isSubmitting && !babysitter.userId && (
                                    <p style={{ color: "red", marginLeft: "25%" }}>Παρακαλώ επιλέξτε νταντά</p>
                                )}
                                <select
                                    style={{ width: "50%", height: "30px" }}
                                    onChange={(e) => setBabysitterChoice(e.target.value)}
                                    value={babysitter.userId || ""}
                                >
                                    <option value="" disabled>
                                    Επιλέξτε νταντά
                                    </option>
                                    {hiredBabysitters.map((babysitter) => (
                                    <option key={babysitter.userId} value={babysitter.userId}>
                                        {babysitter.firstName} {babysitter.lastName}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                {/* Second Box */}
                                <div
                                style={{
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    padding: "2%",
                                    height: "20vh",
                                    marginBottom: "20px",
                                }}
                                >
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
                                </div>

                                {/* Third Box */}
                                

                                {/* Fourth Box */}
                                <div
                                style={{
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    padding: "2%",
                                    height: "20vh",
                                    marginBottom: "20px",
                                }}
                                >
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
                                    style={{ textAlign: "left" }}
                                    >
                                    <FormControlLabel
                                        value="Στον χώρο του κηδεμόνα"
                                        control={<Radio />}
                                        label="Στον χώρο του κηδεμόνα"
                                    />
                                    <FormControlLabel
                                        value="Στον χώρο του επαγγελματία"
                                        control={<Radio />}
                                        label="Στον χώρο του επαγγελματία"
                                    />
                                    </RadioGroup>
                                </FormControl>
                                </div>

                                {/* Fifth Box */}
                                <div
                                style={{
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    padding: "2%",
                                    height: "20vh",
                                    marginBottom:"20px"
                                }}
                                >
                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                    <b>Χρόνος απασχόλησης</b>
                                </h2>
                                <FormControl>
                                    <RadioGroup
                                    value={stepTwoData.employmentTime}
                                    onChange={handleEmploymentTimeChange}
                                    >
                                    <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                    <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                    </RadioGroup>
                                </FormControl>
                                </div>

                                <div
                                style={{
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    padding: "2%",
                                    height: "60vh",
                                    marginBottom: "20px",
                                }}
                                >
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
                                <b>Όνομα:</b> {khdemonas?.firstName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.lastName || "N/A"}
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
                                <b>Όνομα:</b> {khdemonas?.childFirstName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {khdemonas?.childLastName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.childBirthDate || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {khdemonas?.childAmka || "N/A"}
                            </h4>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Στοιχεία επαγγελματία για ταυτοποίηση</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {babysitter.firstName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {babysitter.lastName }
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΦΜ:</b> {babysitter.afm}
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
           
            {isLoading ? (
                <p>Submitting contract...</p> // Loading state
            ) : contractId ? (
                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                    <span>Το συμβόλαιο με κωδικό #{contractId} βρίσκεται υπό αναμονή απάντησης από τον/την επαγγελματία. 
                    Μπορείτε να παρακολουθείτε τυχόν εξελίξεις από τη λίστα συμβολαίων.</span>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                    <span>Υποβάλλετε το συμβόλαιο για να λάβετε τον κωδικό.</span>
                </div>
            )}
        </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
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
                    {/* Show 'Προηγούμενο' button only if not at step 0 */}
                    {currentStep !== 0 && (
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
                    )}
    
                    {/* Show 'Επόμενο' button for steps 0, 1, 2 */}
                    {currentStep < 3 && (
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
                    )}
    
                    {/* Show 'Υποβολή' button on step 3 */}
                    {currentStep === 3 && (
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
                                // Handle submission action here
                                submitContract();
                                goToNextStep();
                            }}
                        >
                            Υποβολή
                        </button>
                    )}
    
                    {/* Show 'Επιστροφή' button on step 4 */}
                    {currentStep === 4 && (
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
                                // Handle return action here
                                alert("Επιστροφή");
                            }}
                        >
                            Επιστροφή
                        </button>
                    )}
                </div>
            </div>
    
            <Footer />
        </div>
    );    
    
    
}

export default DimiourgiaSymbolaiou;
