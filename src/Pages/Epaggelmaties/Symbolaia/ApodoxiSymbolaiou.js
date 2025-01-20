import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import "dayjs/locale/el"; // Greek locale
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import ProgressTracker from "../../../Components/ProgressTracker";
import Loader from "../../../Components/Loader";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../Components/Breadcrumbs";

function ApodoxiSymbolaiou() {
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [user, setUser] = useState({});
    const [parent, setParent] = useState({});
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "Eπιβεβαίωση στοιχείων κηδεμόνα και παιδιού",
        "Eπιβεβαίωση στοιχείων babysitter",
        "Eπιβεβαίωση στοιχείων συμφωνητικού",
        "Υπογραφή συμφωνητικού",
    ];

    // Fetch current user UUID
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

    // Fetch contract data
    useEffect(() => {
        if (contractId) {
            const fetchContract = async () => {
            setLoading(true);
            try {
                const contractRef = doc(FIREBASE_DB, "contracts", contractId);
                const contractSnapshot = await getDoc(contractRef);

                if (contractSnapshot.exists()) {
                setContract(contractSnapshot.data());
                console.log("Contract fetched: ", contractSnapshot.data());
                } else {
                console.log("No such contract!");
                }
            } catch (error) {
                console.error("Error fetching contract: ", error);
            } finally {
                setLoading(false);
            }
            };

            fetchContract();
        }
    }, [contractId]);

    // Fetch user data
    useEffect(() => {
        if (uuid) {
            const fetchUserData = async () => {
            try {
                setLoading(true);
                const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
                setUser(users[0]);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
            };

            fetchUserData();
        }
    }, [uuid]);

    // Fetch parent data
    useEffect(() => {
        if (contract && contract.id_p) {
            const fetchParentData = async () => {
            try {
                setLoading(true);
                const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", contract.id_p));
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
                setParent(users[0]);
            } catch (error) {
                console.error("Error fetching parent data:", error);
            } finally {
                setLoading(false);
            }
            };

            fetchParentData();
        }
    }, [contract]);

    const handleAction = async (action) => {
        try {
        setLoading(true);
        const contractRef = doc(FIREBASE_DB, "contracts", contractId);
        const newStatus = action === "accept" ? "Σε ισχύ" : "Απορρίφθηκε";

        await updateDoc(contractRef, {
            status: newStatus,
        });

        setContract((prevContract) => ({
            ...prevContract,
            status: newStatus,
        }));
        } catch (error) {
        console.error("Error updating contract status:", error);
        } finally {
        setLoading(false);
        }
    };

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

    const handleRedirect = () => {
        navigate("/dashboard/Symfwnitika");
    };

    const handleEditClick = (field) => {
        // Replace with your desired route
        navigate(`/dashboard/profiles`);
    };

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
                                <b>Επιβεβαίωση στοιχείων babysitter</b>
                            </h2>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <b>Όνομα:</b> {user.firstName}
                                </h4>
                                <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                            </div>
                            <hr />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <b>Επίθετο:</b> {user.lastName}
                                </h4>
                                <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                            </div>
                            <hr />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <b>Ημερομηνία γέννησης:</b> {user.birthDate}
                                </h4>
                                <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                            </div>
                            <hr />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <b>email:</b> {user.email}
                                </h4>
                                <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                            </div>
                            <hr />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                    <b>Τηλέφωνο:</b> {user.phone}
                                </h4>
                                <img style={{ cursor: "pointer" }} src="/edit (1).svg" alt="Edit" onClick={() => handleEditClick()} />
                            </div>
                        </div>
                    </div>
                );
            
                case 2:
                    return (
                        <div style={{ textAlign: "center" }}>
                        <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                <b>Επιβεβαίωση στοιχείων συμφωνητικού</b>
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
                                <b>Έναρξη συμφωνητικού:</b> {contract.startDate}
                            </h4>
                            <hr />
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                <b>Λήξη συμφωνητικού:</b> {contract.endDate}
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
                                        <b>Αποδοχή ή απόρριψη του συμφωνητικού</b>
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
                                    }}> <h3>Το συμφωνητικό σας υπογράφτηκε με επιτυχία. 
                                    Μπορείτε να το δείτε στη κατηγορία <a href="/dashboard/Symfwnitika">"Τα Συμφωνητικά μου"</a></h3>
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
                                            <b>Στοιχεία συμφωνητικού</b>
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
                                            <b>Έναρξη συμφωνητικού:</b> {contract.startDate}
                                        </h4>
                                        <hr />
                                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                            <b>Λήξη συμφωνητικού:</b> {contract.endDate}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {contract.status === "Απορρίφθηκε" && (
                                <>
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
                                        <h3>Το συμφωνητικό με κωδικό #{contract.id} έχει απορριφθεί.</h3>
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
                                            <b>Στοιχεία συμφωνητικού</b>
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
                                            <b>Έναρξη συμφωνητικού:</b> {contract.startDate}
                                        </h4>
                                        <hr />
                                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                            <b>Λήξη συμφωνητικού:</b> {contract.endDate}
                                        </h4>
                                    </div>
                                    
                                </>

                            )}
                        </div>
                    );
                    
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <div style={{ flex: 1 }}>

                <Breadcrumbs/>
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
