import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import ProgressTracker from "../../../Components/ProgressTracker";
import Loader from "../../../Components/Loader";
import { calculateAge } from "../../../Utils/Methods/index";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase';

function CreateRating() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Get user's UUID and fetch user data
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
            setUuid(user.uid);
        } else {
            navigate("/404");
        }
    });
    return () => unsubscribe();
  }, []);

  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
          setLoading(true);
          const q1 = query(collection(FIREBASE_DB, 'user'), where('property', '==', 'babysitter'));
          const querySnapshot1 = await getDocs(q1);
          const users1 = querySnapshot1.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setProfiles(users1);
      } catch (error) {
          console.error('Error fetching user data:', error);
      } finally {
          setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch all the babysitters that the user has hired
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    const fetchContracts = async () => {
      try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'contracts'), where('id_p', '==', uuid));
          const querySnapshot = await getDocs(q);
          const contracts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setContracts(contracts);
      } catch (error) {
          console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [uuid]);

  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    const fetchRatings = async () => {
      try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'ratings'), where('id_p', '==', uuid));
          const querySnapshot = await getDocs(q);
          const ratings = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setRatings(ratings);
      } catch (error) {
          console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [uuid]);

  // Filter the babysitters that the user has hired, but hasn't rated yet and have an active contract
  const today = new Date();

  const hiredBabysitters = profiles.filter((profile) => {
    // Filter contracts for the current babysitter
    const contractDue = contracts.filter((contract) => {
      if (contract.id_b !== profile.userId) return false;
  
      // Parse the startDate from "DD/MM/YYYY"
      const [day, month, year] = contract.startDate.split("/").map(Number);
      const startDate = new Date(year, month - 1, day);
  
      // Check if the contract's startDate is today or in the past
      return startDate <= today;
    });
  
    // Check if the babysitter is already rated
    const rated = ratings.filter((rating) => rating.id_b === profile.userId);
  
    // Return true if the babysitter has on due contracts and is not rated
    return contractDue.length > 0 && rated.length === 0;
  });  

  const [babysitter, setBabysitter] = useState({});

  const [rating, setRating] = useState({
    id: 0,
    id_b: 0,
    id_p: uuid,
    rating: 0,
    comment: "",
  });

  const steps = [
    "Επιλέξτε τον/την babysitter που θέλετε να αξιολογήσετε",
    "Αξιολογήστε τον/την babysitter"
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Submit rating to the database
  const submitRating = async () => {
    rating.id_p = uuid;
    rating.id_b = babysitter.userId;
    try{
      setLoading(true);
      const ratingsRef = collection(FIREBASE_DB, 'ratings');

      const docRef = await addDoc(ratingsRef, rating);

      const documentId = docRef.id;

      await setDoc(docRef, { id: documentId }, { merge: true });
    } catch (error) {
      console.error('Error adding document:', error);
    } finally {
      setLoading(false);
    }

    // Update babysitter profile with the new rating average
    const babysitterProfile = profiles.filter((profile) => profile.userId === babysitter.userId);
    let sum = babysitterProfile[0].rating * babysitterProfile[0].ratingCount;
    sum += rating.rating;
    const newRatingCount = babysitterProfile[0].ratingCount + 1;
    const newRating = sum / newRatingCount;
    babysitterProfile[0].rating = newRating;
    babysitterProfile[0].ratingCount = newRatingCount;

    try {
      setLoading(true);
      const docRef = collection(FIREBASE_DB, 'user').doc(babysitterProfile[0].id);
      await setDoc(docRef, babysitterProfile[0], { merge: true });
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleNext = () => {
    if (activeStep === 0) {
      setIsSubmitting(true);
    }
    if (activeStep === 1) {
      submitRating();
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0 || activeStep == 2) goBack();
    setActiveStep((prevStep) => prevStep - 1);
  };

  const goBack = () => {
    window.history.back();
  }

  const setBabysitterChoice = (babysitter_id) => {
    const babysitter = profiles.filter((profile) => profile.userId === babysitter_id);
    setBabysitter(babysitter[0]);
  };

  if (loading) {
    return <Loader />;
  }

  if (uuid && !loading && !hiredBabysitters.length) {
    return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Breadcrumbs />

            <ProgressTracker activeStep={activeStep} steps={steps} />

          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "5%" }}>
            <h2 style={{ fontWeight: "bold", textAlign: "center" }}>
              Δεν υπάρχει κάποιος/α babysitter, για να αξιολογήσετε.
            </h2>
            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={goBack}>
              Επιστροφή
            </button>
          </div>

        </div>

        <div>
          <Footer />
        </div>

      </div>
    );
  }

  if (!uuid && !loading) {
    navigate("/404");
  }

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2%" }}>
            <h3 style={{ marginTop: "3%", textAlign: "center" }}>Επιλέξτε τον/την babysitter που θέλετε να αξιολογήσετε</h3>
            {isSubmitting && !babysitter.userId && ( <p style={{ color: "red", marginLeft: "25%" }}>Παρακαλώ επιλέξτε νταντά</p> )}
            <select
              style={{ width: "50%", height: "30px", marginLeft: "25%" }}
              onChange={(e) => setBabysitterChoice(e.target.value)}
              value={babysitter.userId || ""}
            >
              <option value="" disabled> Επιλέξτε νταντά </option>
              {hiredBabysitters.map((babysitter) => (
                <option key={babysitter.userId} value={babysitter.userId}>
                  {babysitter.firstName} {babysitter.lastName}
                </option>
              ))}

            </select>
          </div>
        );
      case 1:
        return (
          <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3%", marginLeft: "20%", width: "60%" }}>

              <div style={{ display: "flex", flexDirection: "row", marginTop: "2%" }}>
                <h6 style={{ marginTop: "3%" , backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
                {babysitter.img ? 
                  (babysitter.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> :
                  <img src="/images/woman_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  )
                : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
                </h6>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: "3%" }}>
                <h1>{babysitter.firstName} {babysitter.lastName} ({calculateAge(babysitter.birthDate)} ετών)</h1>
              </div>
                  
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

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%", backgroundColor: "#D9EAFD", borderRadius: "10px", width: "50%", marginLeft: "25%" }}>
              <textarea
                style={{ width: "90%", height: "100px", marginLeft: "5%", marginTop: "2%" , marginBottom: "2%", borderRadius: "5px", border: "1px solid #333" }}
                placeholder="Σχόλια"
                value={rating.comment}
                onChange={(e) => setRating({ ...rating, comment: e.target.value })}
              />
            </div>
          </div>
        );
      case 2: 
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "5%" }}>
            <h1>Η αξιολόγησή σας καταχωρήθηκε με επιτυχία!</h1>
            <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333", 
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={goBack}>
              Επιστροφή
            </button>
          </div>
        );
        
      default:
        <>step:{step}</>
    }
  }

  return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Breadcrumbs />

            <ProgressTracker activeStep={activeStep} steps={steps} />

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
