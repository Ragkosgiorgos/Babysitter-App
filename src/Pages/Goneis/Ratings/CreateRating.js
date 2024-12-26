import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { calculateAge } from "../../../Utils/Methods/CalculateAge";
import { useNavigate } from "react-router-dom";

function CreateRating() {
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
          }
      });
      return () => unsubscribe();
  }, []);
  
  const [profile, setProfile] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setProfile(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

  const [rating, setRating] = useState({
    id: 0,
    id_b: 0,
    id_p: 0,
    rating: 0,
    comment: "",
    rating_contact: 0,
    rating_relationship: 0,
    rating_fulfill: 0,
    rating_help: 0
  });

  const navigate = useNavigate();
  
  const goBack = () => {
    window.history.back();
  }

  const submitRating = () => {
    console.log(rating);
  }

  // First choose the babysitter from those who have been hired by the user
  // Then choose the rating to give to the babysitter
  // Then submit the rating to the firebase database
  // Then go back to the previous page
  // Use render to display the page

  const steps = [
    "Επιλέξτε τη νταντά που θέλετε να αξιολογήσετε",
    "Αξιολογήστε τη νταντά"
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    if (activeStep === 1) {
      goBack();
    }
  };

  const [hiredBabysitters, setHiredBabysitters] = useState([]);

  const renderStep = (step) => {
    switch (step) {
      //? Choose the babysitter from those who have been hired by the user
      case 0:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2%" }}>
            <Typography variant="h4" style={{ color: "#2b8cbe" }}>
              {steps[0]}
            </Typography>

            <Box style={{ display: "flex", flexDirection: "column", gap: "2%" }}>
              {hiredBabysitters.map((babysitter) => (
                <div style={{ display: "flex", flexDirection: "row", gap: "2%" }}>
                  <Typography variant="h6" style={{ color: "#2b8cbe" }}>
                    {babysitter.name}
                  </Typography>

                  <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }} onClick={() => {
                                    setRating({ ...rating, id_b: babysitter.id });
                                    handleNext();
                                  }}>
                    Επιλογή
                  </button>
                </div>
              ))}
            </Box>
          </div>
        );
      case 1:
        return (
          <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3%", marginLeft: "20%", width: "60%" }}>

              <div style={{ display: "flex", flexDirection: "row" }}>
                {profile.img ? "Photo" : "No photo"}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1>{profile.name} {profile.surname} ({calculateAge(profile.birthDate)} ετών)</h1>
                <p style={{ width: "80%"}} > {profile.description}</p>
              </div>
                  
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: "3%", justifyContent: "center", alignItems: "center" }}>

              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>

                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Εξυπηρετικότητα</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating.rating_help}
                    onChange={(event, newValue) => {
                      setRating({ ...rating, rating_help: newValue });
                    }}
                  />
                </Box>

                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Επικοινωνία</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating.rating_contact}
                    onChange={(event, newValue) => {
                      setRating({ ...rating, rating_contact: newValue });
                    }}
                  />
                </Box>
              </div>

              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "2.5%" }}>

                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Σχέση με το παιδί</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating.rating_relationship}
                    onChange={(event, newValue) => {
                      setRating({ ...rating, rating_relationship: newValue });
                    }}
                  />
                </Box>

                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Εξυπηρετικότητα</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating.rating_fulfill}
                    onChange={(event, newValue) => {
                      setRating({ ...rating, rating_fulfill: newValue });
                    }}
                  />
                </Box>
              </div>
              
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "3%" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Συνολική βαθμολογία</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating.rating}
                    onChange={(event, newValue) => {
                      setRating({ ...rating, rating: newValue });
                    }}
                  />
                </Box>
              </div>

            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%", backgroundColor: "#D9EAFD", borderRadius: "10px", width: "50%", marginLeft: "25%" }}>
              <textarea
                style={{ width: "80%", height: "100px", marginLeft: "2%", marginTop: "2%" }}
                placeholder="Σχόλια"
                value={rating.comment}
                onChange={(e) => setRating({ ...rating, comment: e.target.value })}
              />
            </div>
          </div>
        );
      default:
        navigate("/goneis/ratings");
    }
  }

  return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />

          <div style={{ display: "flex", flexDirection: "column", marginTop: "3%" }}>
            <Breadcrumbs />

            {renderStep(activeStep)}

          </div>

        </div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "70%", marginLeft: "20%", width: "60%" }}>
          <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333", 
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={handleBack}>
            {activeStep === 0 ? "Επιστροφή" : "Προηγούμενο"}
          </button>

          <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Υποβολή" : "Επόμενο"}
          </button>
        </div>

        <div>
          <Footer />
        </div>

      </div>
  );
}

export default CreateRating;
