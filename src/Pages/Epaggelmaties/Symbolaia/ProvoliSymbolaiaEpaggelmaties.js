import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import ProgressTracker from "../../../Components/ProgressTracker";
import Loader from "../../../Components/Loader";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import 'dayjs/locale/el';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useParams } from 'react-router-dom';
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore";
import {FIREBASE_DB } from "../../../config/firebase";

function ProvoliSymbolaiouEpaggelmatia() {
    const { contractId } = useParams();
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [currentStep, setCurrentStep] = useState(5);
    const [gonios, setGonios] = useState({});

    const steps = [
        "Eπιβεβαίωση στοιχείων κηδεμόνα και παιδιού",
        "Eπιβεβαίωση στοιχείων babysitter",
        "Eπιβεβαίωση στοιχείων συμφωνητικού",
        "Υπογραφή συμφωνητικού",
    ];

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const contractRef = doc(FIREBASE_DB, 'contracts', contractId);
                const contractSnapshot = await getDoc(contractRef);

                if (contractSnapshot.exists()) {
                    setContract(contractSnapshot.data());
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", contract.id_p));
                const querySnapshot = await getDocs(q);
                const fetchedGonios = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGonios(fetchedGonios);
                console.log(gonios);
                console.log(contract.id_p)
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
    
        // Ensure contract is defined and contract.id_b exists before calling fetchProfile
        if (contract && contract.id_p) {
            fetchProfile();
        }
    }, [contract]);  // This ensures the useEffect re-runs when `contract` changes
    

    const navigate = useNavigate();
    const handleReturnClick = () => {
        navigate('/dashboard/Symfwnitika');
    };

    if (loading) {
        return <Loader />;
    }

    const renderStepContent = () => {
    
        if (!contract) {
            return <p>Δεν βρέθηκε το συμφωνητικό.</p>;
        }
    
        switch (currentStep) {
            case 5:
                return (
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "50px",
                            borderRadius: "2%",
                            padding: "2%",
                            width: "70%",
                            margin: "auto"
                        }}
                    >
                        {contract.status === "Σε αναμονή" ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginTop: "2%",
                                    backgroundColor: "#ece7f2",
                                    borderRadius: "2%",
                                    width: "70%",
                                    justifyContent: "center",
                                    marginLeft: "20%",
                                    padding: "2%"
                                }}
                            >
                                <h3>Το συμφωνητικό είναι σε <b> αναμονή </b> προς απάντηση</h3>
                            </div>
                        ) : contract.status === "Σε ισχύ" ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: "2%",
                                        backgroundColor: "#ece7f2",
                                        borderRadius: "2%",
                                        width: "70%",
                                        justifyContent: "center",
                                        marginLeft: "20%",
                                        padding: "2%"
                                    }}
                                >
                                    <h3>Το συμφωνητικό είναι <b> σε ισχύ </b></h3>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginTop: "2%",
                                            backgroundColor: "#ece7f2",
                                            borderRadius: "2%",
                                            width: "70%",
                                            justifyContent: "center",
                                            marginLeft: "20%",
                                            padding: "2%"
                                        }}
                                    >
                                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                            <b>Στοιχεία συμφωνητικού</b>
                                        </h2>
                                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                            <b>Ημέρες εργασίας:</b>{" "}
                                            {contract.weekdays && contract.weekends
                                                ? "Καθημερινές και Σαββατοκύριακα"
                                                : contract.weekdays
                                                ? "Καθημερινές"
                                                : contract.weekends
                                                ? "Σαββατοκύριακα"
                                                : ""}
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
                                    {gonios && gonios.length > 0 ? (
                                        <>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικά στοιχεία κηδεμόνα</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].firstName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].lastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].birthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Email:</b> {gonios[0].email}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Τηλέφωνο:</b> {gonios[0].phone}
                                                </h4>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικα στοιχεία παιδιού</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].childFirstName || "N/A"}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].childLastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].childBirthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>ΑΜΚΑ:</b> {gonios[0].childAmka}
                                                </h4>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Δεν βρέθηκαν τα στοιχεία του babysitter.</p>
                                    )}
                                </div>
                            </>
                        ) : contract.status === "Απορρίφθηκε" ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: "2%",
                                        backgroundColor: "#ece7f2",
                                        borderRadius: "2%",
                                        width: "70%",
                                        justifyContent: "center",
                                        marginLeft: "20%",
                                        padding: "2%"
                                    }}
                                >
                                    <h3>Το συμφωνητικό έχει <b>απορριφθεί</b> απο τον/την babysitter</h3>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginTop: "2%",
                                            backgroundColor: "#ece7f2",
                                            borderRadius: "2%",
                                            width: "70%",
                                            justifyContent: "center",
                                            marginLeft: "20%",
                                            padding: "2%"
                                        }}
                                    >
                                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                            <b>Στοιχεία συμφωνητικού</b>
                                        </h2>
                                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                            <b>Ημέρες εργασίας:</b>{" "}
                                            {contract.weekdays && contract.weekends
                                                ? "Καθημερινές και Σαββατοκύριακα"
                                                : contract.weekdays
                                                ? "Καθημερινές"
                                                : contract.weekends
                                                ? "Σαββατοκύριακα"
                                                : ""}
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
                                    {gonios && gonios.length > 0 ? (
                                        <>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικά στοιχεία κηδεμόνα</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].firstName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].lastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].birthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Email:</b> {gonios[0].email}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Τηλέφωνο:</b> {gonios[0].phone}
                                                </h4>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικα στοιχεία παιδιού</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].childFirstName || "N/A"}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].childLastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].childBirthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>ΑΜΚΑ:</b> {gonios[0].childAmka}
                                                </h4>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Δεν βρέθηκαν τα στοιχεία του babysitter.</p>
                                    )}
                                </div>
                            </>
                        ) : contract.status === "Ολοκληρώθηκε" ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: "2%",
                                        backgroundColor: "#ece7f2",
                                        borderRadius: "2%",
                                        width: "70%",
                                        justifyContent: "center",
                                        marginLeft: "20%",
                                        padding: "2%"
                                    }}
                                >
                                    <h3>Το συμφωνητικό έχει <b>ολοκληρωθεί</b></h3>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginTop: "2%",
                                            backgroundColor: "#ece7f2",
                                            borderRadius: "2%",
                                            width: "70%",
                                            justifyContent: "center",
                                            marginLeft: "20%",
                                            padding: "2%"
                                        }}
                                    >
                                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                            <b>Στοιχεία συμφωνητικού</b>
                                        </h2>
                                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                            <b>Ημέρες εργασίας:</b>{" "}
                                            {contract.weekdays && contract.weekends
                                                ? "Καθημερινές και Σαββατοκύριακα"
                                                : contract.weekdays
                                                ? "Καθημερινές"
                                                : contract.weekends
                                                ? "Σαββατοκύριακα"
                                                : ""}
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
                                    {gonios && gonios.length > 0 ? (
                                        <>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικά στοιχεία κηδεμόνα</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].firstName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].lastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].birthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Email:</b> {gonios[0].email}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Τηλέφωνο:</b> {gonios[0].phone}
                                                </h4>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "2%",
                                                    backgroundColor: "#ece7f2",
                                                    borderRadius: "2%",
                                                    width: "70%",
                                                    justifyContent: "center",
                                                    marginLeft: "20%",
                                                    padding: "2%"
                                                }}
                                            >
                                                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                                                    <b>Προσωπικα στοιχεία παιδιού</b>
                                                </h2>
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Όνομα:</b> {gonios[0].childFirstName || "N/A"}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Επίθετο:</b> {gonios[0].childLastName}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>Ημερομηνία γέννησης:</b> {gonios[0].childBirthDate}
                                                </h4>
                                                <hr />
                                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                                                    <b>ΑΜΚΑ:</b> {gonios[0].childAmka}
                                                </h4>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Δεν βρέθηκαν τα στοιχεία του babysitter.</p>
                                    )}
                                </div>
                            </>
                        ) :null}
                    </div>
                );
            default:
                return null;
        }
    };
    

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <div style={{ flex: 1 }}>
                <Breadcrumbs/>
                    
                <ProgressTracker steps={steps} activeStep={currentStep} />
                    {renderStepContent()}

                    <button
                    style={{
                        height: "3%",
                        backgroundColor: "#2b8cbe",
                        color: "white",
                        borderRadius: "5px",
                        marginTop: "2%",
                        width: "12%",marginLeft:"70%",
                    }}
                    onClick={handleReturnClick}
                >
                    Επιστροφή
                </button>
            </div>
            <Footer style={{ marginTop: "auto" }} />
        </div>
    );
}

export default ProvoliSymbolaiouEpaggelmatia;
