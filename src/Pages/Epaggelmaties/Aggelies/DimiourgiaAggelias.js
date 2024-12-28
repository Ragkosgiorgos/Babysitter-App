import React , { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import ProgressTracker from "../../../Components/ProgressTracker";
import { capitalizeWords, decapitalizeWords } from "../../../Utils/Methods/index";
import { MenuItem, Select, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";
import { parse } from "date-fns";

function DimiourgiaAggelias() {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const step = parseInt(params.get("step")) || 0;
    const post_id = params.get("post_id") || "";

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

    const [newData, setnewData] = useState({
        id: post_id,
        uid: "",
        status: "Σε προσωρινή αποθήκευση",
        date: new Date().toLocaleDateString(),
        area: "",
        description: "",
        accomodation: "",
        ageFrom: "",
        ageTo: "",
        time: "",
        car: "",
        dates: "",
    });
    const [currentStep, setCurrentStep] = useState(step || 0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [correctAge, setCorrectAge] = useState(true);

    // If post_id === -1 then we are creating a new post, otherwise we are editing an existing one
    useEffect(() => {
        const fetchPostData = async () => {
            if (post_id !== "") {
                try {
                    const q = query(collection(FIREBASE_DB, 'aggelies'), where('id', '==', post_id), where('uid', '==', uuid));
                    const querySnapshot = await getDocs(q);
                    const posts = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setnewData(posts[0] || {});

                } catch (error) {
                    console.error('Error fetching post data:', error);
                }
            }
        };

        fetchPostData();
    }, [post_id, FIREBASE_DB]);

    // ageFrom <= ageTo
    function checkAge() {
        if (newData.ageFrom > newData.ageTo) {
            setCorrectAge(false);
            return false;
        }
        setCorrectAge(true);
        return true;
    };

    // Handle the input change from user
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Go to the next step
    const goToNextStep = (e) => {
        if (currentStep === 1) { // Check if the form is submitted correctly
            setIsSubmitted(true);
            checkAge();
            if (!newData.description || !newData.area || !newData.ageFrom || !newData.ageTo || !newData.time || !newData.accomodation || !correctAge) {
                handleScrollToTop();
                return;
            }
            setIsSubmitted(false);
        }
        setCurrentStep(currentStep + 1);
    };
    
    // Go to the previous step
    const goToPreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Set the post status to "Σε προσωρινή αποθήκευση"
    const handleTempSave = async () => {
        if (post_id === "") { // If post_id === -1 then we are creating a new post
            newData.uid = uuid;
            newData.status = "Σε προσωρινή αποθήκευση";
            try{
                const aggeliesRef = collection(FIREBASE_DB, 'aggelies');

                const docRef = await addDoc(aggeliesRef, newData);

                const documentId = docRef.id;
                newData.id = documentId;

                await setDoc(docRef, { id: documentId }, { merge: true });

            } catch (error) {
                console.error('Error adding document:', error);

            } finally {
                setCurrentStep(3);
            }
        } else { // Otherwise we are editing an existing post
            try {
                const postRef = doc(FIREBASE_DB, 'aggelies', post_id);
                await setDoc(postRef, newData, { merge: true });

            } catch (error) {
                console.error('Error updating document:', error);

            } finally {
                setCurrentStep(3);
            }
        }
    };

    // Set the post status to "Δημοσιευμένη"
    const handleFinalSave = async () => {
        if (post_id === "") { // If post_id === -1 then we are creating a new post
            newData.uid = uuid;
            newData.status = "Δημοσιευμένη";
            try{
                const aggeliesRef = collection(FIREBASE_DB, 'aggelies');

                const docRef = await addDoc(aggeliesRef, newData);

                const documentId = docRef.id;
                newData.id = documentId;

                await setDoc(docRef, { id: documentId }, { merge: true });

            } catch (error) {
                console.error('Error adding document:', error);

            } finally {
                setCurrentStep(3);
            }
        } else { // Otherwise we are editing an existing post
            newData.status = "Δημοσιευμένη";
            try {
                const q = query(collection(FIREBASE_DB, 'aggelies'), where('id', '==', post_id), where('uid', '==', uuid));
                const querySnapshot = await getDocs(q);
                const posts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const postRef = doc(FIREBASE_DB, 'aggelies', posts[0].id);
                await setDoc(postRef, newData, { merge: true });

            } catch (error) {
                console.error('Error updating document:', error);

            } finally {
                setCurrentStep(3);
            }
        }
    };

    // Screen smoothly scrolls to the top
    const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    };

    const goToMainAggelies = () => {
        navigate("/aggelies");
    };

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];
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
        0.5,
        1,
        1.5,
        2,
        2.5,
    ];

    //? If the user is not found, return an error message
    if (!user) {
        return <div>Δεν βρέθηκε ο χρήστης</div>;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                            justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
                            <h2 style={{ textAlign: "left", textDecoration: "underline" }}><b>Επιβεβαιώστε τα προσωπικά σας στοιχεία</b></h2>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Όνομα:</b> {user.firstName} </h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Επίθετο:</b> {user.lastName}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Ημερομηνία γέννησης:</b> {user.birthDate}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Πόλη:</b> {user.area}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Email:</b> {user.email}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate("/edit-profile")} />
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                      justifyContent: "center", marginLeft: "20%", padding: "2%", marginTop: "2%" }}>

                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                                {isSubmitted && (!newData.description || !newData.area || !newData.ageFrom || !newData.ageTo || !newData.time || !newData.accomodation || !correctAge)
                                             ? <h4 style={{ color: "red", textAlign: "center" }}> Παρακαλώ συμπληρωστε σωστά όλα τα πεδία </h4> : ""}
                                             
                            <h5 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5> 
                            <textarea name="description" placeholder="Περιγραφή αγγελίας." value={newData.description} onChange={handleInputChange}
                                        style={{ marginLeft: "5%", marginBottom: "5%", width: "60%", height: "10vh", border: isSubmitted && !newData.description ? "1px solid red" : "" }}>
                            </textarea>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <FormControl style={{ marginTop: "1vh", fontSize: "2%", width: "25%", border: isSubmitted && !newData.area ? "1px solid red" : "" }}>
                                    <Select
                                        labelId="agg-area-select-label"
                                        name="area"
                                        value={newData.area}
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

                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                    <div style={{ marginLeft: "0%" }}>{!correctAge && <h6 style={{ color: "red" }}> <b>*Η ηλικία "από" πρέπει να είναι μικρότερη ή ίση από την ηλικία "εώς"</b> </h6>}</div>
                                    <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <h6> από </h6>

                                            <FormControl>
                                                <Select
                                                    labelId="agg-ageFrom-select-label"
                                                    name="ageFrom"
                                                    value={newData.ageFrom}
                                                    onChange={handleInputChange}
                                                    style={{ border: isSubmitted && !newData.ageFrom ? "1px solid red" : "", height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age} ετών
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                                    
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <h6> εώς </h6>
                                            <FormControl>
                                                <Select
                                                    labelId="agg-ageTo-select-label"
                                                    name="ageTo"
                                                    value={newData.ageTo}
                                                    onChange={handleInputChange}
                                                    style={{ border: isSubmitted && !newData.ageTo ? "1px solid red" : "", height: "auto" }}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Επιλέξτε ηλικία
                                                    </MenuItem>
                                                    {ages.map((age) => (
                                                        <MenuItem key={age} value={age}>
                                                            {age} ετών
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="time" name="time" value={newData.time} onChange={handleInputChange} style={{ border: isSubmitted && !newData.time ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Πλήρης" control={<Radio />} label="Πλήρης" />
                                    <FormControlLabel value="Μερική" control={<Radio />} label="Μερική" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="accomodation" name="accomodation" value={newData.accomodation} onChange={handleInputChange} style={{ border: isSubmitted && !newData.accomodation ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Ναι" control={<Radio />} label="Ναι" />
                                    <FormControlLabel value="Όχι" control={<Radio />} label="Όχι" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω μεταφορικό μέσο </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                <RadioGroup row aria-label="car" name="car" value={newData.car} onChange={handleInputChange} style={{ border: isSubmitted && !newData.car ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Ναι" control={<Radio />} label="Ναι" />
                                    <FormControlLabel value="Όχι" control={<Radio />} label="Όχι" />
                                </RadioGroup>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                                <RadioGroup row aria-label="dates" name="dates" value={newData.dates} onChange={handleInputChange} style={{ border: isSubmitted && !newData.dates ? "1px solid red" : "", padding: "5px", borderRadius: "4px" }}>
                                    <FormControlLabel value="Σαββατοκύριακο" control={<Radio />} label="Σαββατοκύριακο" />
                                    <FormControlLabel value="Καθημερινές" control={<Radio />} label="Καθημερινές" />
                                    <FormControlLabel value="Και τα δύο" control={<Radio />} label="Και τα δύο" />
                                </RadioGroup>
                            </div>

                        </div>
                );
            case 2:
                return (
                        <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                            {/* Data for the first step */}
                            <div style={{ textAlign: "center"}}>
                                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                                                justifyContent: "center", padding: "2%" }}>
                                    <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
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
                                </div>
                            </div>

                            {/* Data for the second step */}
                            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                      justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                            <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Συμπληρώστε τα στοιχεία της αγγελίας</b></h2>
                            
                            <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Περιγραφή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.description}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Περιοχή </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {capitalizeWords(newData.area)}
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginBottom: "5%" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h5 style={{ fontWeight: "bold"}}> Ηλικία παιδιού </h5>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5%", marginLeft: "15%" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            από: {newData.ageFrom} χρόνων
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            εώς: {newData.ageTo} χρόνων
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Απασχόληση </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.time}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω το σπίτι μου για φιλοξενία </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.accomodation}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέτω μεταφορικό μέσο </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                                {newData.car}
                            </div>

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%" }}>
                                {newData.dates === "Και τα δύο" ? "Σαββατοκύριακο και καθημερινές" : newData.dates}
                            </div>

                        </div>
                </div>
                );
            case 3:
                return (
                    <div style={{ textAlign: "center", marginTop: "4%", marginBottom: "27%" }}>
                        {newData.status}
                        {newData.status === "Δημοσιευμένη" && <h2>Η αγγελία σας με κωδικό {newData.id} δημοσιεύτηκε με επιτυχία!</h2>}
                        {newData.status === "Σε προσωρινή αποθήκευση" && <h2>Η αγγελία σας με κωδικό {newData.id} αποθηκεύτηκε με επιτυχία!<br/>
                                                                             Μπορείτε να την επεξεργαστείτε και να την οριστικοποιήσετε αργότερα.</h2>}
                        <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Οι Αγγελίες μου".</h4>
                    </div>
                );
            case 4:
                return (
                    <div>
                        {goToMainAggelies()}
                    </div>
                );
            case -1:
                return (
                    <div>
                        {goToMainAggelies()}
                    </div>
                );
            default:
                return <div>Invalid Step {currentStep}</div>;
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <div style={{ flex: 1 }}>
                <Breadcrumbs />

                <ProgressTracker steps={steps} activeStep={currentStep} />

                {renderStepContent()}

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50%", marginTop: "2%" }}>
                    { currentStep !== 3 &&
                    <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                            onClick={goToPreviousStep} >
                        {currentStep === 0 ? "Επιστροφή" : "Προηγούμενο"}
                    </button>}
                        
                    {(currentStep < 2 &&
                        <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                                onClick={goToNextStep}>
                            Επόμενο
                        </button>) || (currentStep === 3 &&
                        <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "12%" }}
                                onClick={goToNextStep}>
                            Επιστροφή
                        </button>)
                        || 
                        <div style={{ display: "flex", gap: "25%" }}>
                            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "100%" }}
                                onClick={handleTempSave}> Προσωρινή αποθήκευση </button>
                            
                            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", width: "100%" }}
                                onClick={handleFinalSave}> Οριστική υποβολή </button>
                        </div>
                    }
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default DimiourgiaAggelias;
