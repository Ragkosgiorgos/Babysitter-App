import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";

function ProepiskopisiRantevouPGU() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [user, setUser] = useState({});
  const [aitisi, setAitisi] = useState({});

  // Fetch user uuid
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

  // Fetch user data
  useEffect(() => {
    if (uuid) {
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
      fetchUserData();
    }
  }, [uuid]);

  // Fetch appointment data
  useEffect(() => {
    if (uuid && id) {
      const fetchAitiseisData = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'rantevou'), where('id', '==', id), where('id_b', '==', uuid));
          const querySnapshot = await getDocs(q);
          const aitiseis = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAitisi(aitiseis[0]);
        } catch (error) {
          console.error('Error fetching appointment data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAitiseisData();
    }
  }, [uuid, id]);

  const redirect = () => {
    if (aitisi.link) {
      window.location.href = aitisi.link;
    }
  }

  if (loading) {
    return <Loader />;
  }

  if ((!uuid || !aitisi) && !loading) {
    navigate("/404");
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", overflow: "auto", padding: "2%" }}>
        <Breadcrumbs />
        <h2 style={{ textAlign: "center", marginTop: "2%" }}>Προεπισκόπηση ραντεβού</h2>

        {/* Personal Information */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3%" }}>
          <div style={{ backgroundColor: "#D9EAFD", padding: "2%", borderRadius: "10px", width: "50%", textAlign: "center" }}>
            <h3>Προσωπικά στοιχεία κηδεμόνα</h3>
            <p><strong>Όνοματεπώνυμο:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Αριθμός κινητού τηλεφώνου:</strong> {user.phone}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        {/* Appointment Information */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3%" }}>
          <div style={{ backgroundColor: "#D9EAFD", padding: "2%", borderRadius: "10px", width: "50%", textAlign: "center" }}>
            <h3>Στοιχεία ραντεβού</h3>
            <p><strong>Ημερομηνία:</strong> {aitisi.date}</p>
            <p><strong>Τρόπος:</strong> {aitisi.tropos_synantisis}</p>
            {aitisi.tropos_synantisis === "Διαδικτυακά" && (
              <div>
                <p><strong>Σύνδεσμος:</strong> 
                  <Button onClick={redirect} style={{ backgroundColor: "#D9EAFD", color: "blue" }}>
                    Link
                  </Button>
                </p>
              </div>
            )}
            {aitisi.tropos_synantisis === "Δια ζώσης" && (
              <p><strong>Διεύθυνση:</strong> {aitisi.address}</p>
            )}
          </div>
        </div>

        {/* Navigation Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
          <button onClick={() => navigate(-1)} style={{ width: "35%", height: "8vh", backgroundColor: "gray", color: "white", border: "none", borderRadius: "5px", fontSize: "3vh", cursor: "pointer" }}>
            Επιστροφή
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProepiskopisiRantevouPGU;
