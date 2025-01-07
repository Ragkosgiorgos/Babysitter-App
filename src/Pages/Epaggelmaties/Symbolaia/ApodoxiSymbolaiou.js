import React, { useState, useEffect } from "react";
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase';
import 'dayjs/locale/el'; // Greek locale
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import ProgressTracker from "../../../Components/ProgressTracker";
import { useParams } from 'react-router-dom'; // Import useParams
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

function ApodoxiSymbolaiou(){
    const { contractId } = useParams();
    const [loading, setLoading] = useState(true); // Define loading state
    const [contract, setContract] = useState(null); // Define contract state
    const [babysitter, setBabysitter] = useState({});
    const [workingDaysFormatted, setWorkingDaysFormatted] = useState(""); // State for working days text
    const [startDateFormatted, setStartDateFormatted] = useState(""); // State for formatted start date
    const [endDateFormatted, setEndDateFormatted] = useState(""); // State for formatted end date
    let workingDaysText = "";
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/epaggelmaties/symbolaia'); 
    };

    const steps = [
        "Eπιβεβαίωση στοιχείων κηδεμόνα και παιδιού",
        "Επιβεβαίωση στοιχείων επαγγελματία",
        "Επιβεβαίωση στοιχείων επαγγελματία",
        "Υπογραφή συμβολαίου",
    ];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                if (!contractId) {
                    console.error('contractId is not defined');
                    return;
                }
                setLoading(true);
                const contractRef = doc(FIREBASE_DB, 'contracts', contractId);
                const contractSnapshot = await getDoc(contractRef);
          
                if (contractSnapshot.exists()) {
                    setContract(contractSnapshot.data()); // Set contract data if found
                    const formattedDate = format(new Date(contract.dateRange.startDate), "EEEE d MMMM yyyy", { locale: el });
                    setStartDateFormatted(formattedDate);
                    const formattedDate1 = format(new Date(contract.dateRange.endDate), "EEEE d MMMM yyyy", { locale: el });
                    setEndDateFormatted(formattedDate1);

                    const workingDays = contract.workingDays;
                    
                    if (workingDays.weekdays && workingDays.weekends) {
                        workingDaysText = "Kαθημερινές και Σαββατοκύριακα";
                    } else if (workingDays.weekdays) {
                        workingDaysText = "Καθημερινές";
                    } else if (workingDays.weekends) {
                        workingDaysText = "Σαββατοκύριακα";
                    }

                    setWorkingDaysFormatted(workingDaysText);

                    console.log('Contract fetched: ', contractSnapshot.data()); // Log fetched contract data
                } else {
                    console.log('No such contract!');
                }
            } catch (error) {
                console.error('Error fetching contract: ', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchContract();
    }, [contractId]);
    
    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const [uuid, setUuid] = useState(null);
    const [parent, setParent] = useState({}); // State to store the user data object

   
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
              console.log(user.uid)
          }
      });
      return () => unsubscribe();
  }, []);
  const [user, setUser] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUser(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();
  const fetchParentData = async () => {
    try {
        const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', contract.id_p ));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setParent(users[0]);
        console.log(parent)
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
fetchParentData();
    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const [symbolaio, setSymbolaio] = useState([]);

    const data = symbolaio.find((item) => item.id_symbolaiou === 1);
    const [actionTaken, setActionTaken] = useState(null);

    const handleAction = async (action) => {
        try {
            // Define the contractRef for the current contract
            const contractRef = doc(FIREBASE_DB, 'contracts', contractId); // Adjust collection name if necessary
    
            // Determine the new status based on the action
            const newStatus = action === "accept" ? "Σε ισχύ" : "Απορρίφθηκε";
    
            // Update the contract status in Firestore
            await updateDoc(contractRef, {
                status: newStatus
            });
    
            // Optionally: Update local state, show a success message, or handle UI change
            console.log(`Contract status updated to: ${newStatus}`);
    
            // You could also update the UI by updating the contract status in your component state
            setContract(prevContract => ({
                ...prevContract,
                status: newStatus,
            }));
    
        } catch (error) {
            console.error("Error updating contract status:", error);
        }
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
                                <b>Όνομα:</b> {parent.firstName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {parent.lastName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {parent.birthDate}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {parent.email}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {parent.phone}
                            </h4>
                        </div>

                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Προσωπικα στοιχεία παιδιού</b>
                            </h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Όνομα:</b> {parent.childFirstName || "N/A"}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {parent.childLastName }
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> {parent.childBirthDate}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>ΑΜΚΑ:</b> {parent.childAmka}
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
                                <b>Όνομα:</b>{user.firstName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Επίθετο:</b> {user.lastName}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Ημερομηνία γέννησης:</b> { user.birthDate}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Email:</b> {user.email}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Τηλέφωνο:</b> {user.phone}
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
                            <b>Ημέρες εργασίας:</b> 
                            {
                                contract.weekdays && contract.weekends ? "Καθημερινές και Σαββατοκύριακα" :
                                contract.weekdays ? "Καθημερινές" :
                                contract.weekends ? "Σαββατοκύριακα" : ""
                            }
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Χρόνος απασχόλησης:</b> {contract.time}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Φιλοξενία:</b> {contract.hosting}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Έναρξη συμβολαίου:</b> {contract.startDate}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Λήξη συμβολαίου:</b> {contract.endDate}
                            </h4>
                        </div>
                    </div>
                    );
                
                    
                    case 3:
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            
        {contract.status === "Σε αναμονή" ? (
                <>
                    <h2 style={{ textAlign: "center", textDecoration: "underline", marginBottom: "20px" }}>
                        <b>Αποδοχή ή απόρριψη του συμβολαίου</b>
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
            ):

            contract.status === "Σε ισχύ" && (
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "2%",
                        backgroundColor: "#ece7f2",
                        borderRadius: "2%",
                        width: "60%",
                        justifyContent: "center",
                        marginLeft: "20%",
                        padding: "2%",
                    }}> <h3>Το συμβόλαιό σας με κωδικό #{contract.id} υπογράφτηκε με επιτυχία. 
                    Μπορείτε να το δείτε στη λίστα συμβολαίων</h3> </div>
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
                            <b>Προσωπικά στοιχεία κηδεμόνα </b>
                        </h2>
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Όνομα:</b> {parent.firstName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Επίθετο:</b> {parent.lastName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Ημερομηνία γέννησης:</b> {parent.birthDate}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Email:</b> {parent.email}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Τηλέφωνο:</b> {parent.phone}
                        </h4>
                    </div>

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
                            <b>Προσωπικά στοιχεία παιδιού</b>
                        </h2>
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Όνομα:</b> {parent.childFirstName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Επίθετο:</b> {parent.lastName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Ημερομηνία γέννησης:</b> {parent.birthDate}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>ΑΜΚΑ:</b> {parent.childAmka}
                        </h4>
                    </div>

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
                            <b>Στοιχεία συμβολαίου</b>
                        </h2>
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Ημέρες εργασίας:</b> 
                            {
                                contract.weekdays && contract.weekends ? "Καθημερινές και Σαββατοκύριακα" :
                                contract.weekdays ? "Καθημερινές" :
                                contract.weekends ? "Σαββατοκύριακα" : ""
                            }
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Χρόνος απασχόλησης:</b> {contract.time}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Φιλοξενία:</b> {contract.hosting}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Έναρξη συμβολαίου:</b> {contract.startDate}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Λήξη συμβολαίου:</b> {contract.endDate}
                        </h4>
                    </div>
                </div>
            )}

            {contract.status === "Απορρίφθηκε" && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "2%",
                    backgroundColor: "#ece7f2",
                    borderRadius: "2%",
                    width: "60%",
                    justifyContent: "center",
                    marginLeft: "20%",
                    padding: "2%",
                }}>
                <h3>Το συμβόλαιο με κωδικό #{contract.id} έχει απορριφθεί.</h3>
                </div>
            )}
        </div>
    );
      
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
                        gap:"50%", 
                        marginBottom: "10px",
                    }}
                >
                    {currentStep === 0 ? (
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
                            onClick={handleRedirect}
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
                        >
                            Επόμενο
                        </button>

                    </>
                    ) : currentStep === 3 ? (
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
                            onClick={goToPreviousStep}
                            disabled={currentStep === 2}
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
                            onClick={handleRedirect}
                        >
                            Επιστροφή
                        </button>
                    </>
                    ) : (
                        // Show both "Προηγούμενο" and "Επόμενο" buttons in step 1 and 2
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
                            >
                                Επόμενο
                            </button>
                        </>
                    )}
                </div>
            </div>
        
            <Footer />
        </div>
    );
    
}

export default ApodoxiSymbolaiou;