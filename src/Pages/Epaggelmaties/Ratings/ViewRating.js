import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
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

        <Breadcrumbs />

        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%" }}>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "3%" }}>
            <h6 style={{ marginTop: "3%" , backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
            {profile.img ? 
              (profile.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> :
              <img src="/images/woman_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
              )
            : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
            </h6>
            <h1 style={{ marginTop: "4%" }}> {profile.firstName} {profile.lastName} ({calculateAge(profile.birthDate)} ετών) </h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "3%", marginLeft: "45%" }}>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Συνολική βαθμολογία</Typography>
              <Rating size="large" name="read-only" value={rating.rating || 0} readOnly />
            </Box>
          </div>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%", backgroundColor: "#D9EAFD", borderRadius: "10px", width: "50%", marginLeft: "25%" }}>
            {rating.comment ? <p style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1.5%" }}><b>Σχόλια: </b>{rating.comment}</p> : <p style={{ marginLeft: "2%" }}>Δεν υπάρχει σχόλιο</p>}
          </div>

        </div>

      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5%" }}>
        <button 
          style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333", 
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginRight: "4%",}} 
          onClick={goBack}
        >
          Επιστροφή
        </button>
      </div>

      <div>
        <Footer />
      </div>

    </div>
  );
}

export default ViewRating;
