import React , { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import ProgressTracker from "../../../Components/ProgressTracker";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, FormControl } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import EditIcon from '@mui/icons-material/Edit';
import 'dayjs/locale/el';

dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);

// Update Greek locale to include custom AM/PM translations
dayjs.updateLocale('el', {
    meridiem: (hour) => (hour < 12 ? 'ΠΜ' : 'ΜΜ'), // Translate AM -> ΠΜ, PM -> ΜΜ
    formats: {
        LT: 'h:mm A', // Ensure it uses the "A" for AM/PM
    },
});

function DimiourgiaAggelias() {
    const location = useLocation();
    const navigate = useNavigate();

    const uid = location.state.uid || -1; // Get the user id from the location state
    const step = parseInt(location.state.step) || 0; // Get the step from the location state
    const post_id = parseInt(location.state.post_id) || -1; // Get the post id from the location state

    const [profiles, setProfiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const [newData, setnewData] = useState({
        id: -1,
        uid: uid,
        status: "Σε προσωρινή αποθήκευση",
        date: new Date().toLocaleDateString(),
        area: "",
        description: "",
        accomodation: "",
        ageFrom: "",
        ageTo: "",
        time: "",
        car: "",
    });
    const [currentStep, setCurrentStep] = useState(step || 0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [correctAge, setCorrectAge] = useState(true);

    // Fetch all babysitters' data
    useEffect(() => {
        fetch("/data/ntantades.json")
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setProfiles(data);
          })
          .catch((error) => {
            console.error("Error fetching JSON:", error);
          });
    }, []);

    // Fetch all job posts
    useEffect(() => {
        fetch("/data/aggelies.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);
    
    // Set the user's data based on their uid
    useEffect(() => {
        if (profiles.length > 0) {
            const user = profiles.find((user) => user.uid === uid);
            setUser(user);
        }
    }, [profiles, uid]);

    // Keep only the user's posts
    useEffect(() => {
        if (user && posts.length > 0) {
            const userPosts = posts.filter((post) => post.uid === uid);
            setPosts(userPosts);
        }
    }, [user, posts, uid]);

    // If post_id === -1 then we are creating a new post, otherwise we are editing an existing one
    useEffect(() => {
        if (post_id !== -1) {
            const foundPost = posts.find((post) => post.id === post_id);
            if (foundPost) {
                setnewData((prevData) => ({
                    ...prevData,
                    ...foundPost,
                    ageFrom: parseFloat(foundPost.ageFrom),
                    ageTo: parseFloat(foundPost.ageTo),
                    area: decapitalizeWords(foundPost.area),
                    status: "Σε προσωρινή αποθήκευση",
                }));
            }
        }
    }, [post_id, posts]);

    // ageFrom <= ageTo
    function checkAge() {
        if (newData.ageFrom > newData.ageTo) {
            setCorrectAge(false);
            return false;
        }
        setCorrectAge(true);
        return true;
    };
    
    const goToMainAggelies = () => {
        navigate(`/aggelies?uid=${uid}`);
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

    // Handle the input change from user
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Set the post status to "Σε προσωρινή αποθήκευση"
    const handleTempSave = () => {
        const newId = posts.length + 1;
        setnewData((prevData) => ({
            ...prevData,
            id: newId,
            status: "Σε προσωρινή αποθήκευση",
        }));

        // Write the data to the database
        const updatedPosts = [...posts, newData];
        setPosts(updatedPosts);

        setCurrentStep(3);
    };

    // Set the post status to "Δημοσιευμένη"
    const handleFinalSave = () => {
        setnewData((prevData) => {
            const newId = posts.length + 1;
            const finalData = {
                ...prevData,
                id: newId,
                status: "Δημοσιευμένη",
            };
            setPosts([...posts, finalData]);
            return finalData;
        });
    
        setCurrentStep(3);
    };

    // Screen smoothly scrolls to the top
    const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    };

    // Capitalize the first letter of each word
    function capitalizeWords(str) {
        if (str === undefined || str === null) {
            return '';
        }
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Decapitalize the first letter of each word
    function decapitalizeWords(str) {
        if (str === undefined || str === null) {
            return '';
        }
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
            .join(" ");
    }

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
        return <div>Δεν βρέθηκε ο χρήστης με id: {uid}</div>;
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
                                <h4 style={{ textAlign: "left" }}><b>Όνομα:</b> {user.name} </h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Επίθετο:</b> {user.surname}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Ημερομηνία γέννησης:</b> {user.birthDate}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Πόλη:</b> {user.area}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
                            </div>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginTop: "3%" }}>
                                <h4 style={{ textAlign: "left" }}><b>Email:</b> {user.email}</h4>
                                <EditIcon style={{ float: "right", cursor: "pointer" }} onClick={() => navigate(`/edit-profile?uid=${uid}`)} />
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

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            {/*//? */}

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
                                            από: {newData.ageFrom}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            εώς: {newData.ageTo}
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

                            <h5 style={{ fontWeight: "bold"}}> Διαθέσιμες ημέρες και ώρες </h5>
                            {/*//? */}

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
            <Header log="connected" id={uid} property="babysitter" name={user.name} surname={user.surname} />

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
