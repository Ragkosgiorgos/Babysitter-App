import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import 'dayjs/locale/el'; 
import Footer from "../../../Components/Footer";
import Header from "../../../Components/Header";
import Loader from "../../../Components/Loader.js";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import ProgressTracker from "../../../Components/ProgressTracker";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase.js';
import { addDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { handleScrollToTop } from "../../../Utils/Methods/index.js";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);


function DimiourgiaSymbolaiou(props) {
    const navigate = useNavigate();
    const [weekdays, setWeekdays] = useState(false);
    const [weekends, setWeekends] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [rantevou, setRantevou] = useState([]);
    const [contract, setContract] = useState([]);
    const [khdemonas, setKhdemonas] = useState({});
    const [isDateRangeOverlapping, setIsDateRangeOverlapping] = useState(false);
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

    useEffect(() => {
        console.log("Updated stepTwoData:", stepTwoData);
    }, [stepTwoData]);
    

    const [currentStep, setCurrentStep] = useState(0);


    const [isLoading, setIsLoading] = useState(false); // Added isLoading state

    // Check if user is logged in and get UUID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch all babysitters
    useEffect(() => {
        if (uuid) { 
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
        }
    }, [uuid]);

    // Fetch all appointments based on user UUID
    useEffect(() => {
        if (uuid) { // Ensure UUID is available
            const fetchRantevou = async () => {
                setLoading(true);
                try {    
                    const q = query(
                        collection(FIREBASE_DB, 'rantevou'),
                        where('id_p', '==', uuid)
                    );
    
                    const querySnapshot = await getDocs(q);
       
                    if (!querySnapshot.empty) {
                        const rantevou = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        setRantevou(rantevou);
                    } else {
                        setRantevou([]); 
                    }
                } catch (error) {
                    console.error('Error fetching contracts:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchRantevou();
        }
    }, [uuid]);
    


    // Fetch all contracts based on user UUID
    useEffect(() => {
        if (uuid) { // Don't fetch if UUID is not set
            const fetchContracts = async () => {
                setLoading(true);
                try {
                    const q = query(collection(FIREBASE_DB, 'contracts'), where('id_p', '==', uuid));
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
        }
    }, [uuid]);

    // Fetch user data for Khdemonas
    useEffect(() => {
        if (uuid) { // Don't fetch if UUID is not set
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
        }
    }, [uuid]);

    // Filter hired babysitters based on contracts
    const hiredBabysitters = profiles.filter((profile) => {
        return rantevou.some((contract) => contract.id_b === profile.userId);
    });
    const [errors, setErrors] = useState({});

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
    const isDateRangeOverlappingWithContracts = (selectedRange) => {
        const newStartDate = dayjs(selectedRange.startDate);
        const newEndDate = dayjs(selectedRange.endDate);
    
        console.log("Checking overlap with selected range: ", newStartDate.format('DD/MM/YYYY'), newEndDate.format('DD/MM/YYYY'));
    
        // Ensure contract is defined and is an array
        if (!Array.isArray(contract)) {
            console.error("Contract is not an array:", contract);
            return false;
        }

        let overlapoccured = false;
    
        contract.forEach((contract) => {
            const existingStartDate = dayjs(contract.startDate, 'DD/MM/YYYY');
            const existingEndDate = dayjs(contract.endDate, 'DD/MM/YYYY');
    
            // Validate the parsed dates
            if (!existingStartDate.isValid() || !existingEndDate.isValid()) {
                console.error("Invalid date format for contract:", {
                    startDate: contract.startDate,
                    endDate: contract.endDate
                });
            } else {
                console.log("Parsed contract range:", 
                    existingStartDate.format('DD/MM/YYYY'), 
                    existingEndDate.format('DD/MM/YYYY')
                );
            }
    
            console.log("Checking contract range: ", existingStartDate.format('DD/MM/YYYY'), existingEndDate.format('DD/MM/YYYY'));
    
            // Check if the selected date range overlaps with any contract date range
            if (
                newStartDate.isBefore(existingEndDate) && 
                newEndDate.isAfter(existingStartDate)
            ) {
                console.log("Overlap detected with contract:", contract.id);
                overlapoccured = true;
            }
        });

        // Return false if no overlap is found
        return overlapoccured;
    };
    
    

    const handleDateRangeChange = (item) => {
        setStepTwoData((prevData) => ({
            ...prevData,
            dateRange: [item.selection],
        }));
    
        
        const selectedRange = item.selection;
        const overlap = isDateRangeOverlappingWithContracts(selectedRange);
        setIsDateRangeOverlapping(overlap);
        console.log(overlap);
        console.log(isDateRangeOverlapping);
    };
    

    // Submit contract
const submitContract = async () => {
    setIsSubmitting(true);
    try {
        setIsLoading(true);

        // Create contract data
        const contractData = {
            id_p: uuid,
            id_b: babysitter.userId,
            time: stepTwoData.employmentTime,
            hosting: stepTwoData.hostingPreference,
            date: stepTwoData.date,
            startDate: dayjs(stepTwoData.dateRange[0].startDate).format('DD/MM/YYYY'),
            endDate: dayjs(stepTwoData.dateRange[0].endDate).format('DD/MM/YYYY'),
            status: stepTwoData.status,
            weekdays: weekdays,
            weekends: weekends,
        };

        // Add contract to Firestore
        const ratingsRef = collection(FIREBASE_DB, 'contracts');
        const docRef = await addDoc(ratingsRef, contractData);

        // Save the contract ID in the document
        const documentId = docRef.id;
        await setDoc(docRef, { id: documentId }, { merge: true });

        setContractId(documentId); // Save contract ID

        await submitPayment(documentId, stepTwoData.dateRange[0].startDate, stepTwoData.dateRange[0].endDate);

    } catch (error) {
        console.error('Error adding document:', error);
    } finally {
        setIsSubmitting(false);
        setIsLoading(false);
    }
};

const submitPayment = async (contractId, startDate, endDate) => {
    setIsSubmitting(true);
    try {
        setLoading(true);

        const paymentsRef = collection(FIREBASE_DB, 'payments');
        let currentDate = dayjs(startDate);

        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            // Calculate next payment period's end date
            const nextDate = currentDate.add(1, 'month');

            // If nextDate exceeds the endDate, adjust the endPeriod to endDate
            const endPeriod = nextDate.isAfter(endDate) ? dayjs(endDate).format('DD/MM/YYYY') : nextDate.format('DD/MM/YYYY');

            // Create payment data
            const paymentData = {
                id_p: uuid,
                id_b: babysitter.userId,
                id_c: contractId,
                startPeriod: currentDate.format('DD/MM/YYYY'),
                endPeriod: endPeriod,
                date: new Date().toLocaleDateString(),
                Paid: "False",
            };

            // Add payment to Firestore
            const docRef = await addDoc(paymentsRef, paymentData);

            // Save the payment ID in the document
            const documentId1 = docRef.id;
            await setDoc(docRef, { id: documentId1 }, { merge: true });

            // Move to the next month
            currentDate = nextDate;
        }
    } catch (error) {
        console.error('Error adding payment document:', error);
    } finally {
        setIsSubmitting(false);
        setLoading(false);
    }
};

    

    // Steps for the form navigation
    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Επιβεβαίωση στοιχείων παιδιού",
        "Συμπλήρωση στοιχείων babysitter και στοιχείων εργασίας",
        "Προεπισκόπηση και υποβολή",
        "Αναμονή για υπογραφή από babysitter",
        "Αποδοχή ή απόρριψη συμφωνητικού",
    ];


    const goToNextStep = (e) => {
        if (currentStep === 2) {
            setIsSubmitting(true);
    
            // Validate required fields
            const newErrors = {};
    
            if (!stepTwoData.employmentTime) newErrors.employmentTime = "Παρακαλώ επιλέξτε χρόνο απασχόλησης";
            if (!stepTwoData.hostingPreference) newErrors.hostingPreference = "Παρακαλώ επιλέξτε χώρο φιλοξενίας";
            if (!stepTwoData.dateRange[0]?.startDate) newErrors.startDate = "Παρακαλώ επιλέξτε ημερομηνία έναρξης";
            if (!stepTwoData.dateRange[0]?.endDate) newErrors.endDate = "Παρακαλώ επιλέξτε ημερομηνία λήξης";
            if (!weekdays && !weekends) newErrors.days = "Παρακαλώ επιλέξτε τουλάχιστον μία κατηγορία ημέρας";
    
            setErrors(newErrors);
    
            // If there are errors, stop submission
            if (Object.keys(newErrors).length > 0) {
                handleScrollToTop();
                return;
            }
    
            setIsSubmitting(false);
        }
    
        setCurrentStep(currentStep + 1);
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

    const handleEditClick = (field) => {
        // Replace with your desired route
        navigate(`/dashboard/profiles`);
    };

    // Handle loading state
    if (loading) {
        return <Loader />;
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
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <div>
                                    <b>Όνομα:</b> {khdemonas?.firstName || "N/A"}
                                    </div>
                                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                                </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <div>
                                        <b>Επίθετο:</b> {khdemonas?.lastName || "N/A"}
                                    </div>
                                    <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                                 </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.birthDate || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Εmail:</b> {khdemonas?.email || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Τηλέφωνο:</b> {khdemonas?.phone || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
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
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Όνομα:</b> {khdemonas?.childFirstName || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Επίθετο:</b> {khdemonas?.childLastName || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>Ημερομηνία γέννησης:</b> {khdemonas?.childBirthDate || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div>
                                <b>ΑΜΚΑ:</b> {khdemonas?.childAmka || "N/A"}
                            </div>
                            <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                         </div>
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
                                flexDirection: "column",
                            }}
                        >
                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                                <b>Συμπληρώστε τα στοιχεία της αγγελίας</b>
                            </h2>

                            <div style={{ width: "80%" }}>
                                {/* First Box: Babysitter Selection */}
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
                                    
                                    <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                        <b>Επιλέξτε τον babysitter που θέλετε να κάνετε συμφωνητικό</b>
                                    </h2>
                                    {isSubmitting && !babysitter.userId && (
                                        <p style={{ color: "red",textAlign:"center" }}>
                                            Παρακαλώ επιλέξτε νταντά
                                        </p>
                                    )}
                                    <select
                                    style={{ width: "50%", height: "30px" }}
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

                                {/* Second Box: Days Selection */}
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
                                        <b>Ημέρες</b>
                                    </h2>
                                    <div style={{display:"flex",flexDirection:"row"}}>
                                    
                                    <FormControlLabel
                                        control={<Checkbox checked={weekdays} onChange={handleWeekdaysChange} />}
                                        label="Καθημερινές"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={weekends} onChange={handleWeekendsChange} />}
                                        label="Σαββατοκύριακο"
                                    />
                                    {isSubmitting && !weekdays && !weekends && (
                                        <p style={{ color: "red",textAlign:"center" }}>
                                            Παρακαλώ επιλέξτε τουλάχιστον μία κατηγορία ημέρας
                                        </p>
                                    )}
                                    </div>
                                    
                                </div>

                                {/* Third Box: Hosting Preference */}
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
                                    <div style={{display:"flex",flexDirection:"row"}}>
                                    <FormControl>
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
                                                value="Στον χώρο του babysitter"
                                                control={<Radio />}
                                                label="Στον χώρο του babysitter"
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    {isSubmitting && !stepTwoData.hostingPreference && (
                                        <p style={{ color: "red",textAlign:"center" }}>
                                            Παρακαλώ επιλέξτε χώρο Φιλοξενίας
                                        </p>
                                    )}
                                    </div>
                                    
                                </div>

                                {/* Fourth Box: Employment Time */}
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
                                        <b>Χρόνος απασχόλησης</b>
                                    </h2>
                                    <div style={{display:"flex",flexDirection:"row"}}>
                                    <FormControl>
                                        <RadioGroup
                                            value={stepTwoData.employmentTime}
                                            onChange={handleEmploymentTimeChange}
                                        >
                                            <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                            <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                        </RadioGroup>
                                    </FormControl>

                                    {isSubmitting && !stepTwoData.employmentTime && (
                                        <p style={{ color: "red",textAlign:"center"}}>
                                            Παρακαλώ επιλέξτε χρόνο απασχόλησης
                                        </p>
                                    )}
                                    </div>
                                    
                                </div>

                                {/* Fifth Box: Date Range */}
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
                                    <div style={{display:"flex",flexDirection:"row"}}>
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        ranges={stepTwoData.dateRange}
                                        minDate={new Date()}
                                    />

                                    {isSubmitting && !stepTwoData.dateRange[0]?.startDate && (
                                        <p style={{ color: "red",textAlign:"center" }}>
                                            Παρακαλώ επιλέξτε ημερομηνία έναρξης
                                        </p>
                                    )}
                                    {isSubmitting && !stepTwoData.dateRange[0]?.endDate && (
                                        <p style={{ color: "red",textAlign:"center" }}>
                                            Παρακαλώ επιλέξτε ημερομηνία λήξης
                                        </p>
                                    )}
                                    {isDateRangeOverlapping && (
                                        <p style={{ color: "red", textAlign:"center" }}>
                                            Η ημερομηνία που επιλέξατε επικαλύπτεται με άλλα συμφωνητικά.
                                        </p>
                                    )}

                                    {stepTwoData.dateRange[0]?.startDate === "" || stepTwoData.dateRange[0]?.endDate === "" ? (
                                        <p style={{ color: "red", textAlign: "center" }}>
                                          Παρακαλώ επιλέξτε ημερομηνία έναρξης και λήξης.
                                        </p>
                                      ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

        );  
            case 3:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Προεπισκόπηση συμφωνητικού</h2>
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
                                <b>Στοιχεία babysitter για ταυτοποίηση</b>
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
                    <h4 style={{textAlign:"left", marginTop: "3%", marginLeft: "6%" }}>
                        {weekdays && weekends
                            ? "Καθημερινές και Σαββατοκύριακο"
                            : weekdays
                            ? "Καθημερινές"
                            : weekends
                            ? "Σαββατοκύριακο"
                            : "Δεν έχει επιλεχθεί κάποια επιλογή"}
                    </h4>
                </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Φιλοξενία</b>
                        </h2>
                        <h4 style={{textAlign:"left" ,marginTop: "3%", marginLeft: "6%" }}>{stepTwoData.hostingPreference === "guardian" ? "Στον χώρο του κηδεμόνα" : "Στον χώρο του babysitter"}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Χρόνος απασχόλησης</b>
                        </h2>
                        <h4 style={{textAlign:"left" ,marginTop: "3%", marginLeft: "6%" }}>{stepTwoData.employmentTime === "part-time" ? "Μερική" : "Πλήρης"}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Ημερομηνίες</b>
                        </h2>
                        <h4 style={{textAlign:"left" ,marginTop: "3%", marginLeft: "6%" }}><b>Από:</b> {stepTwoData.dateRange[0].startDate.toLocaleDateString()}</h4>
                        <h4 style={{textAlign:"left" ,marginTop: "3%", marginLeft: "6%" }}><b>Έως:</b> {stepTwoData.dateRange[0].endDate.toLocaleDateString()}</h4>
                    </div>


                    </div>
                );
            case 4:
                return (
                    <div style={{ textAlign: "center" }}>
           
            {isLoading ? (
                <Loader />
            ) : contractId ? (
                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                    <span>Το συμφωνητικό με κωδικό #{contractId} βρίσκεται υπό αναμονή απάντησης από τον/την babysitter. 
                    Μπορείτε να παρακολουθείτε τυχόν εξελίξεις από τη λίστα συμφωνητικών.</span>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                    <span>Υποβάλλετε το συμφωνητικό για να λάβετε τον κωδικό.</span>
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
    {/* Show 'Επιστροφή' and 'Επόμενο' in step 0 */}
    {currentStep === 0 && (
        <>
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
                    window.history.back();
                }}
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
                    if (!isDateRangeOverlapping) {
                        goToNextStep();
                    }
                }}
            >
                Επόμενο
            </button>
        </>
    )}

    {/* Show 'Προηγούμενο' button only if not at step 0 */}
    {currentStep !== 0 && currentStep !== 4 && (
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
                goToPreviousStep();
            }}
        >
            Προηγούμενο
        </button>
    )}

    {/* Show 'Επόμενο' button only for steps 1 and 2 */}
    {currentStep < 3 && currentStep !== 0 && (
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
                if (!isDateRangeOverlapping) {
                    goToNextStep();
                }
            }}
        >
            Επόμενο
        </button>
    )}

    {/* Show 'Υποβολή' button only on step 3 */}
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

    {/* Show 'Επιστροφή' button for steps 4 */}
    {(currentStep === 4) && (
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
                window.history.back();
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
