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
  // Fetch user uuid
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      } else { // If user is not logged in, redirect to 404 page
        navigate("/404");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data
  const [user, setUser] = useState({});
  useEffect(() => {
    if (uuid) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'user'),where( 'userId' , '==' , uuid));
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

  // Fetch rantevou data
  const [aitisi, setAitisi] = useState({});
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
            console.error('Error fetching job data:', error);
        } finally {
            setLoading(false);
        }
      };
      fetchAitiseisData();
    }
  }, [uuid, id]);

  const redirect = ()=>{
    window.location.href = aitisi.link;
  }

  if (loading) {
    return <Loader />;
  }
  
  if ((!uuid || !aitisi) && !loading) {
    navigate("/404");
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />
            <h2 style={{ textAlign: "center", marginTop: "2%" }}>
              Προεπισκόπηση ραντεβού
            </h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <tbody>
                <tr style={{ borderBottom: "2px solid #333" }}>
                <th>Προσωπικά στοιχεία κηδεμόνα:</th>
                </tr>

                <span style={{textDecoration: "underline"}}>Όνοματεπώνυμο:</span> {user.firstName} {user.lastName}

                <tr style={{ borderBottom: "2px solid #333" }}>
                <th>Στοιχεία επικοινωνίας:</th>
                </tr>

                Αριθμός κινητού τηλεφώνου: {user.phone}
                <tr>Email: {user.email}</tr>                  
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                <tbody>
                <tr style={{ borderBottom: "2px solid #333" }}>
                <th>Στοιχεία ραντεβού</th>
                </tr>

                Ημερομηνία: {aitisi.date}
                <tr>Τρόπος: {aitisi.tropos_synantisis}</tr> 
                {aitisi.tropos_synantisis === "Διαδικτυακά" && (<tr>Σύνδεσμος:<Button onClick={redirect} 
                style={{  height: "0%", backgroundColor: "#D9EAFD", color: "blue", marginTop: "0%"}} >Link{aitisi.link}</Button></tr> )}                 
                {aitisi.tropos_synantisis === "Δια ζώσης" && (<tr>Διεύθυνση: {aitisi.address}</tr> )} 
                </tbody>
              </table>
            </div>
            

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", marginRight: "70%" }}>
              
              <button onClick={()=> navigate(-1)}  style={{ width: "35%" , height: "8vh", backgroundColor: "gray", color: "white", border: "none", 
                                borderRadius: "5px", fontSize: "3vh", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Επιστροφή
              </button>
              
            </div>
            
          </div>

        </div>
      </div>
      
      <div>
        <Footer />
      </div>
      
    </div>
  );
}

export default ProepiskopisiRantevouPGU;