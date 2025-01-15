import React, { useState, useEffect } from "react";
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import {FIREBASE_DB } from "../../../config/firebase";
import 'dayjs/locale/el'; // Greek locale
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { useParams } from 'react-router-dom'; // Import useParams
import ProgressTracker from "../../../Components/ProgressTracker";
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

    function ProvoliSymbolaiou() {
        const { contractId } = useParams();
        const [loading, setLoading] = useState(true);
        const [contract, setContract] = useState(null);
        const [currentStep, setCurrentStep] = useState(5); // Added currentStep state
        const [epagelmatias, setEpagelmatias] = useState({});
    
        const steps = [
            "Επιβεβαίωση προσωπικών στοιχείων",
            "Επιβεβαίωση στοιχείων παιδιού",
            "Συμπλήρωση στοιχείων επαγγελματία και στοιχείων εργασίας",
            "Προεπισκόπηση και υποβολή",
            "Αναμονή για υπογραφή από επαγγελματία",
            "Αποδοχή ή απόρριψη συμβολαίου"
        ];

        
    
        useEffect(() => {
            const fetchContract = async () => {
                try {
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
                setLoading(true);
                try {
                    const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", contract.id_b));
                    const querySnapshot = await getDocs(q);
                    const epagelmatias = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setEpagelmatias(epagelmatias);
                    console.log(epagelmatias);
                    console.log(contract.id_b);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            };
        
            // Ensure contract is defined and contract.id_b exists before calling fetchProfile
            if (contract && contract.id_b) {
                fetchProfile();
            }
        }, [contract]);  // This ensures the useEffect re-runs when `contract` changes
        

        const navigate = useNavigate();
        const handleReturnClick = () => {
            navigate('/goneis/symbolaia');
        };

    
        const renderStepContent = () => {
            if (loading) {
                return <h3>Loading...</h3>;
            }
    
            if (!contract) {
                return <p>Δεν βρέθηκε το συμβόλαιο.</p>;
            }
    
            switch (currentStep) {
                case 5:
                    return (
                        <div style={{ textAlign: "center", marginTop: "50px", borderRadius: "2%", padding: "2%", width: "70%", margin: "auto" }}>
    {contract.status === "Σε αναμονή" ? (
        <h3>Το συμβόλαιο με κωδικό #{contractId} είναι σε αναμονή προς απάντηση</h3>
    ) : contract.status === "Σε ισχύ" ? (
        <>  
            <div style={{display: "flex",
                flexDirection: "column",
                marginTop: "2%",
                backgroundColor: "#ece7f2",
                borderRadius: "2%",
                width: "70%",
                justifyContent: "center",
                marginLeft: "20%",
                padding: "2%",}}>
                <h3>Το συμβόλαιο με κωδικό #{contractId} είναι σε ισχύ</h3>
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
                        padding: "2%",
                    }}
                >
                    <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                        <b>Στοιχεία συμβολαίου</b>
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
                        <b>Έναρξη συμβολαίου:</b> {contract.startDate}
                    </h4>
                    <hr />
                    <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                        <b>Λήξη συμβολαίου:</b> {contract.endDate}
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
                        padding: "2%",
                    }}
                >
                {epagelmatias && epagelmatias.length > 0 ? (
                    <>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Στοιχεία επαγγελματία</b>
                        </h2>
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Όνομα:</b> {epagelmatias[0].firstName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Επίθετο:</b> {epagelmatias[0].lastName}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Τηλέφωνο:</b> {epagelmatias[0].phone}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>Email:</b> {epagelmatias[0].email}
                        </h4>
                        <hr />
                        <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                            <b>ΑΦΜ:</b> {epagelmatias[0].afm}
                        </h4>
                    </>
                ) : (
                    <p>Δεν βρέθηκαν τα στοιχεία του επαγγελματία.</p>
                )}
                
                </div>
            </div>
        </>
    ) : contract.status === "Απορρίφθηκε" ? (
        <h3>Το συμβόλαιο με κωδικό #{contractId} απορρίφθηκε</h3>
    ) : (
        <h3>Το συμβόλαιο με κωδικό #{contractId} έχει άγνωστη κατάσταση</h3>
    )}
</div>


                    );
            }
        };
    
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header />
                <div style={{ flex: 1, padding: "20px" }}>
                    
                <ProgressTracker steps={steps} activeStep={currentStep} />
                    {renderStepContent()}

                    <button
                    style={{
                        height: "3%",
                        backgroundColor: "#2b8cbe",
                        color: "white",
                        borderRadius: "5px",
                        marginTop: "2%",
                        width: "12%",marginLeft:"85%",
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
    
    export default ProvoliSymbolaiou;
