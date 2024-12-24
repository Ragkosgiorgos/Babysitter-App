import React from "react";
import { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Footer from "../../../Components/Footer";
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from "../../../config/firebase";

function ViewRating() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || -1;

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

  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetch("/data/ratings.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRatings(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
    }, []);

  useEffect(() => {
    setRating(ratings.find(rating => rating.id === id));
  }, [ratings, id]);

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
    }
  , []);

  useEffect(() => {
    if (profiles.length > 0 && rating) {
      setProfile(profiles.find(profile => profile.uid === rating.id_b));
    }
  }, [profiles, rating]);

  const goBack = () => { 
    window.history.back();
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  };

  if (!rating || !profile) {//? Error handling
      return <div>Error loading rating {id}</div>;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", marginTop: "3%" }}>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3%", marginLeft: "20%", width: "60%" }}>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <img src={profile.img} alt="Profile" style={{ width: "200px", height: "200px", borderRadius: "3%" }} />
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
                <Rating size="large" name="read-only" value={rating.rating_help} readOnly />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Επικοινωνία</Typography>
                <Rating size="large" name="read-only" value={rating.rating_contact} readOnly />
              </Box>
            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "2.5%" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Εξυπηρετικότητα</Typography>
                <Rating size="large" name="read-only" value={rating.rating_relationship} readOnly />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Εξυπηρετικότητα</Typography>
                <Rating size="large" name="read-only" value={rating.rating_fulfill} readOnly />
              </Box>
            </div>
            
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "3%" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Συνολική βαθμολογία</Typography>
                <Rating size="large" name="read-only" value={rating.rating} readOnly />
              </Box>
            </div>

          </div>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%", backgroundColor: "#D9EAFD", borderRadius: "10px", width: "50%", marginLeft: "25%" }}>
            {rating.comment ? <p style={{ marginLeft: "2%" }}><b>Σχόλια: </b>{rating.comment}</p> : <p style={{ marginLeft: "2%" }}>Δεν υπάρχει σχόλιο</p>}
          </div>

        </div>

      </div>

      <button style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333", 
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={goBack}>
        Επιστροφή
      </button>

      <div>
        <Footer />
      </div>

    </div>
  );
}

export default ViewRating;
