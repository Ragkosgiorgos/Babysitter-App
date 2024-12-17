import React , { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import ProgressTracker from "../../../Components/ProgressTracker";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function PreviewAggelias() {
    const location = useLocation();
    const uid = location.state.uid;
    const aggelia_id = location.state.aggelia_id;

    const navigate = useNavigate();

    const goToMainAggelies = () => {
        navigate(`/aggelies?uid=${uid}`);
    };

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];

    const [aggelies, setAggelies] = useState({});
    const [aggelia, setAggelia] = useState({});

    const [ntantades, setNtantades] = useState([]);
    const [ntanta, setNtanta] = useState({});

    // Fetch the babysitter's data
    useEffect(() => {
        fetch("/data/ntantades.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setNtantades(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    // Fetch the jobs' data
    useEffect(() => {
        fetch("/data/aggelies.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setAggelies(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    // Match the babysitter's id with the user id
    useEffect(() => {
        if (ntantades.length > 0) {
            const ntanta = ntantades.find((ntanta) => ntanta.uid === uid);
            setNtanta(ntanta);
        }
    }, [ntantades, uid]);

    // Match the job's id with the user id
    useEffect(() => {
        if (aggelies.length > 0) {
            const aggelia = aggelies.find((aggelia) => aggelia.id === aggelia_id);
            setAggelia(aggelia);
        }
    }, [aggelies, aggelia_id]);
    
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

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="connected" name={ntanta.name} surname={ntanta.surname} property="babysitter" />

            <div style={{ flex: 1 }}>
                <Breadcrumbs />

                <ProgressTracker steps={steps} activeStep={5} />
                    <div style={{ textAlign: "center", marginTop: "1%"}}>
                            <h2>Η αγγελία σας με <b style={{ textDecoration: "underline" }}>κωδικό {aggelia.id}</b> δημοσιεύτηκε με επιτυχία!</h2>
                            <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Αγγελίες μου".</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                        <div style={{ textAlign: "center"}}>
                            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                                            justifyContent: "center", padding: "2%" }}>
                                <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {ntanta.name} </h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {ntanta.surname}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Ημερομηνία γέννησης:</b> {ntanta.birthDate}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Πόλη:</b> {ntanta.area}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {ntanta.phone}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {ntanta.email}</h4>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                    justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                        <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                        
                        <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.description}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {capitalizeWords(aggelia.area)}
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "5%", marginLeft: "15%" }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        από: {aggelia.ageFrom}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        εώς: {aggelia.ageTo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.time}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.accomodation}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" , width:"80%" }}>
                                    {[
                                    { day: "Δευτέρα", from: aggelia.monFrom, to: aggelia.monTo },
                                    { day: "Τρίτη", from: aggelia.tueFrom, to: aggelia.tueTo },
                                    { day: "Τετάρτη", from: aggelia.wedFrom, to: aggelia.wedTo },
                                    { day: "Πέμπτη", from: aggelia.thuFrom, to: aggelia.thuTo },
                                    { day: "Παρασκευή", from: aggelia.friFrom, to: aggelia.friTo },
                                    { day: "Σάββατο", from: aggelia.satFrom, to: aggelia.satTo },
                                    { day: "Κυριακή", from: aggelia.sunFrom, to: aggelia.sunTo },
                                    ].map(({ day, from, to }) => (
                                    <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <h6>{day}</h6>
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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                    <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                            onClick={goToMainAggelies} >
                        Επιστροφή
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PreviewAggelias;
