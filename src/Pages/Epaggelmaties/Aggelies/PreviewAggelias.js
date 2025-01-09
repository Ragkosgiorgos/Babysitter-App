import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import ProgressTracker from "../../../Components/ProgressTracker";
import Loader from "../../../Components/Loader";
import { capitalizeWords, convertDateFormat } from "../../../Utils/Methods/index";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function PreviewAggelias() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const aggelia_id = params.get("aggelia_id");

    const [uuid, setUuid] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [aggelia, setAggelia] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            } else {
                navigate("/404"); // Redirect if not logged in
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch user data when uuid is set
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUser(users[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) {
            fetchUserData();
        }
    }, [uuid]);

    // Fetch aggelia data when uuid and aggelia_id are set
    useEffect(() => {
        const fetchAggeliesData = async () => {
            try {
                setLoading(true);
                const q = query(
                    collection(FIREBASE_DB, 'aggelies'),
                    where('id', '==', aggelia_id),
                    where('uid', '==', uuid)
                );
                const querySnapshot = await getDocs(q);
                const aggelies = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAggelia(aggelies[0]);
            } catch (error) {
                console.error('Error fetching job data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (uuid && aggelia_id) {
            fetchAggeliesData();
        }
    }, [uuid, aggelia_id]);

    const goToMainAggelies = () => window.history.back();

    // Return loader while fetching data
    if (loading || !aggelia || !user) {
        return <Loader />;
    }

    if (!aggelia || !user) {
        navigate("/404");
    }

    // Steps for the progress tracker
    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <div style={{ flex: 1 }}>
                <Breadcrumbs />

                <ProgressTracker steps={steps} activeStep={5} />
                <div style={{ textAlign: "center", marginTop: "1%" }}>
                    <h2>Η αγγελία σας με <b style={{ textDecoration: "underline" }}>κωδικό {aggelia.id}</b> δημοσιεύτηκε με επιτυχία!</h2>
                    <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Αγγελίες μου".</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                            justifyContent: "center", padding: "2%"
                        }}>
                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {user.firstName}</h4>
                            <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.lastName}</h4>
                            <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Ημερομηνία γέννησης:</b> {convertDateFormat(user.birthDate)}</h4>
                            <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Πόλη:</b> {user.area}</h4>
                            <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                            <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.email}</h4>
                        </div>
                    </div>

                    <div style={{
                        display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%",
                        justifyContent: "center", marginLeft: "20%", padding: "2%"
                    }}>

                        <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Τα στοιχεία της αγγελίας</b></h2>
                        
                        <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>

                        <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.description}
                        </div>

                        <h5 style={{ fontWeight: "bold" }}> Περιοχή </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {capitalizeWords(aggelia.area)}
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h5 style={{ fontWeight: "bold" }}> Ηλικία παιδιού </h5>
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

                        <h5 style={{ fontWeight: "bold" }}> Απασχόληση </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.time}
                        </div>

                        <h5 style={{ fontWeight: "bold" }}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.accomodation}
                        </div>

                        <h5 style={{ fontWeight: "bold" }}> Διαθέτω μεταφορικό μέσο </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aggelia.car}
                        </div>

                        <h5 style={{ fontWeight: "bold" }}> Διαθέσιμες ημέρες και ώρες </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                            {aggelia.dates === "Και τα δύο" ? "Σαββατοκύριακο και καθημερινές" : aggelia.dates}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                    <button style={{
                        height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%"
                    }}
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
