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
import { format } from 'date-fns';
import { el } from 'date-fns/locale';



function DimiourgiaSymbolaiou(props) {
    const [weekdays, setWeekdays] = useState(false);
    const [weekends, setWeekends] = useState(false);
    
    // Check if user is logged in, get the user's UUID and fetch user data
    const [uuid, setUuid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);
    const [profiles, setProfiles] = useState([]);
    const fetchUserData = async () => {
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
        }
    };
    fetchUserData();
  
    // Fetch all the babysitters that the user had an appointment
    const [contracts, setContracts] = useState([]);
    const fetchContracts = async () => {
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
      }
    };
    fetchContracts();
  
    const hiredBabysitters = profiles.filter((profile) => {
      return contracts.some((contract) => contract.id_b === profile.userId);
    });
  

    const [khdemonas, setKhdemonas] = useState({});
    useEffect(() => {
        const fetchUserData = async () => {
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
            }
        };
        fetchUserData();
    }, [uuid]);

    const handleWeekdaysChange = (event) => {
        setWeekdays(event.target.checked);
    };

    const handleWeekendsChange = (event) => {
        setWeekends(event.target.checked);
    };

    const validateStepTwo = () => {
        return (
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
        id: '',
        id_p: '',
        id_b: '',
        time:'', // Απασχόληση
        date: new Date().toLocaleDateString(),
        workingDays:'',
        dateRange: [
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            },
        ],
        status: 'pending'
    });

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [babysitter, setBabysitter] = useState({});
    const findContact = async (contractId) => {
        try {
            // Query Firestore to find contract by ID
            const q = query(
                collection(FIREBASE_DB, 'contracts'),
                where('id', '==', contractId)  // Use the contract ID passed to the function
            );
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.log('No contract found.');
                setIsMatched(false);  // No match found
                return;
            }
    
            const contract = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))[0];  // Assuming there's only one document returned
    
            setBabysitter(contract);  // Assuming `babysitter` state should hold the contract data
    
        } catch (error) {
            console.error('Error fetching contract:', error);
            setIsMatched(false);  // If there's an error, set isMatched to false
        } finally {
            if (!babysitter) {
                setIsMatched(true);
            }
        }
    };
    const [contractId, setContractId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const submitContract = async () => {
        setIsLoading(true); // Start loading
        try {
            const contractData = {
                id_p: uuid,
                id_b: babysitter.userId,
                time: stepTwoData.employmentTime,
                hosting: stepTwoData.hostingPreference,
                date: stepTwoData.date,
                startDate: stepTwoData.dateRange[0].startDate.toString(), // Force conversion to string
                endDate: stepTwoData.dateRange[0].endDate.toString(),     // Force conversion to string
                status: stepTwoData.status,
                weekdays: weekdays,
                weekends: weekends,
            };
    
            const ratingsRef = collection(FIREBASE_DB, 'contracts');
            const docRef = await addDoc(ratingsRef, contractData);
    
            const documentId = docRef.id;
            await setDoc(docRef, { id: documentId }, { merge: true });
    
            setContractId(documentId); // Set the contract ID state
            console.log('Contract submitted successfully:', documentId);
        } catch (error) {
            console.error('Error adding document:', error);
        } finally {
            setIsLoading(false); // End loading
        }
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
    const [value, setValue] = useState(dayjs());;

    const [professionalData, setProfessionalData] = useState({
        firstName: "",
        lastName: "",
        afm: "",
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfessionalData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log("Updated Professional Data:", updatedData); // Log the updated state values
            return updatedData;
        });
    };

    const setBabysitterChoice = (babysitter_id) => {
        const babysitter = profiles.filter((profile) => profile.userId === babysitter_id);
        setBabysitter(babysitter[0]);
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
                        <div style={{ textAlign: "center" }}>
                            <div>
                            <div style={{display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", justifyContent: "center", marginLeft: "5%", padding: "2%", height: "30vh" }}>
                            <h3 style={{ marginTop: "3%", textAlign: "center" }}>Επιλέξτε τον επαγγελματία που θέλετε να κάνετε συμβόλαιο</h3>
                            {isSubmitting && !babysitter.userId && ( <p style={{ color: "red", marginLeft: "25%" }}>Παρακαλώ επιλέξτε νταντά</p> )}
                            <select
              style={{ width: "50%", height: "30px", marginLeft: "25%" }}
              onChange={(e) => setBabysitterChoice(e.target.value)}
              value={babysitter.userId || ""}
            >
              <option value="" disabled> Επιλέξτε νταντά </option>
              {hiredBabysitters.map((babysitter) => (
                <option key={babysitter.userId} value={babysitter.userId}>
                  {babysitter.firstName} {babysitter.lastName}
                </option>
              ))}

            </select>
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
                                                    <FormControlLabel value="Στον χώρο του κηδεμόνα" control={<Radio />} label="Στον χώρο του κηδεμόνα" />
                                                    <FormControlLabel value="Στον χώρο του επαγγελματία" control={<Radio />} label="Στον χώρο του επαγγελματία" />
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
                                                <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                                <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
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
                           submitContract()
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
