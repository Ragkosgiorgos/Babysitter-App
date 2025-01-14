import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { calculateAge } from "../../../Utils/Methods/index";
import { FIREBASE_DB } from '../../../config/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';

function ViewRating() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || -1;

  const [rating, setRating] = useState({});
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q1 = query(collection(FIREBASE_DB, 'ratings'), where('id', '==', id));
        const querySnapshot1 = await getDocs(q1);
        const ratings = querySnapshot1.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRating(ratings[0]);
  
        if (ratings.length > 0) {
          const rating = ratings[0];
          const q2 = query(collection(FIREBASE_DB, 'user'), where('userId', '==', rating.id_b));
          const querySnapshot2 = await getDocs(q2);
          const profiles = querySnapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProfile(profiles[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);  

  const goBack = () => { 
    window.history.back();
  };

  if (loading) {
    return <Loader />;
  }

  if (!rating || !profile) {
    navigate("/404");
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", marginTop: "3%" }}>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3%", marginLeft: "20%", width: "60%" }}>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <h6 style={{ marginTop: "3%" , backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
              {profile.img ? 
                (profile.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> :
                <img src="/images/woman_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                )
              : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
              </h6>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1>{profile.firstName} {profile.lastName} ({calculateAge(profile.birthDate)} ετών)</h1>
              <p style={{ width: "80%"}} > {profile.description}</p>
            </div>
            
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "3%", justifyContent: "center", alignItems: "center" }}>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Εξυπηρετικότητα</Typography>
                <Rating size="large" name="read-only" value={rating.rating_help || 0} readOnly />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Επικοινωνία</Typography>
                <Rating size="large" name="read-only" value={rating.rating_contact || 0} readOnly />
              </Box>
            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "2.5%" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Σχέση με το παιδί</Typography>
                <Rating size="large" name="read-only" value={rating.rating_relationship || 0} readOnly />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Εξυπηρετικότητα</Typography>
                <Rating size="large" name="read-only" value={rating.rating_fulfill || 0} readOnly />
              </Box>
            </div>
            
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "3%" }}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Συνολική βαθμολογία</Typography>
                <Rating size="large" name="read-only" value={rating.rating || 0} readOnly />
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
