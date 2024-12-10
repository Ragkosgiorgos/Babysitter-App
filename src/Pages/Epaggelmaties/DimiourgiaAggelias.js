import React , { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import { useLocation } from "react-router-dom";
import ProgressTracker from "../../Components/ProgressTracker";

function DimiourgiaAggelias(props) {
    
    const location = useLocation();
    const uid = 1;
    console.log("User id:", uid);

    const steps = [
        "Επιβεβαίωση προσωπικών στοιχείων",
        "Συμπλήρωση στοιχείων εργασίας",
        "Προεπισκόπηση και Υποβολή",
        "Δημοσίευση αγγελίας",
    ];

    // Track the current step
    const [currentStep, setCurrentStep] = useState(0);

    // Function to go to the next step
    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Function to go to the previous step
    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    const [profiles, setProfiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value // Dynamically update the field using the name attribute
        }));
    }

    useEffect(() => {
        fetch("/data/ntantades.json")
          .then((response) => {
            console.log("Response:", response); // Debug the response object
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse as JSON
          })
          .then((data) => {
            console.log("Fetched data:", data); // Log the fetched data
            setProfiles(data); // Update the state
          })
          .catch((error) => {
            console.error("Error fetching JSON:", error);
          });
      }, []);
    
    const user = profiles.find(profile => profile.id === uid);
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
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {} </h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.Epitheto}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Ημερομηνία γέννησης:</b> {user.HmGennhshs}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Πόλη:</b> {user.Polh}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Οδός:</b> {user.Onoma}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός:</b> {user.Onoma}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.Onoma}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                            <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.Onoma}</h4>
                            <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                        </div>

                    </div>
                );
            case 1:
                return (
                    <div style={{ textAlign: "center" }}>
                        <input type="text" placeholder="Τίτλος αγγελίας" value={formData.name} onChange={handleInputChange} style={{ width: "50%", height: "3%", marginTop: "2%" }} />
                        <br />
                        <textarea placeholder="Περιγραφή αγγελίας" style={{ width: "50%", height: "10%", marginTop: "2%" }} />

                    </div>
                );
            case 2:
                return (
                    <div style={{ textAlign: "center" }}>

                    </div>
                );
            case 3:
                return (
                    <div style={{ textAlign: "center" }}>
                        <h2>Η αγγελία σας δημοσιεύτηκε με επιτυχία!</h2>
                        <h4>Μπορείτε να δείτε την αγγελία σας στην κατηγορία "Αγγελίες μου".</h4>
                    </div>
                );
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="connected" id={uid} />

            <div style={{ flex: 1 }}>
                <Breadcrumbs />

                <ProgressTracker steps={steps} activeStep={currentStep} />

                {renderStepContent()}

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", gap: "50%", marginBottom: "10px" }}>
                    <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}
                            onClick={goToPreviousStep} disabled={currentStep === 0}>
                        Προηγούμενο
                    </button>

                    <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}
                            onClick={goToNextStep} disabled={currentStep === steps.length - 1}>
                        Επόμενο
                    </button>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default DimiourgiaAggelias;
