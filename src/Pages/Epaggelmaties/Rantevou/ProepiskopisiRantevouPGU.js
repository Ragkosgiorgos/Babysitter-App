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
        <div style={{ flex: 1 }}>
              <Breadcrumbs />
              <div style={{ textAlign: "center", marginTop: "1%"}}>
                            <h2>Η αιτησή σας με <b style={{ textDecoration: "underline" }}>κωδικό {aitisi.id}</b> δημοσιεύτηκε με επιτυχία!</h2>
                            <h4>Μπορείτε να δείτε το ραντεβού σας στην κατηγορία "Τα ραντεβού μου".</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "2%", marginLeft: "10%", marginRight: "10%" }}>
                        <div style={{ textAlign: "center"}}>
                            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%",
                                            justifyContent: "center", padding: "2%" }}>
                                <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b> Τα προσωπικά σας στοιχεία </b></h2>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Όνομα:</b> {user.firstName}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Επίθετο:</b> {user.lastName}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}</h4>
                                <hr style={{width: "100%", marginTop:"0%", marginBottom: "0%"}}></hr>
                                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}><b>Email:</b> {user.email}</h4>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", 
                                    justifyContent: "center", marginLeft: "20%", padding: "2%" }}>

                        <h2 style={{ textAlign: "center", textDecoration: "underline" }}><b>Τα στοιχεία του ραντεβού</b></h2>
                        
                        <h5 style={{ fontWeight: "bold"}}> Ημερομηνία και ώρα συνάντησης </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
                            {aitisi.date}
                        </div>

                        <h5 style={{ fontWeight: "bold"}}> Επιθυμητός τρόπος επικοινωνίας </h5>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>            
                          {aitisi.tropos_synantisis === "Διαδικτυακά" && (<tr>Σύνδεσμος:<Button onClick={redirect} 
                          style={{  height: "0%", backgroundColor: "#D9EAFD", color: "blue", marginTop: "0%"}} >Link{aitisi.link}</Button></tr> )}                 
                          {aitisi.tropos_synantisis === "Δια ζώσης" && (<tr>Διεύθυνση: {aitisi.address}</tr> )} 
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5%", gap: "40%" }}>
                
                <button
                    style={{
                        height: "5%",
                        backgroundColor: "#2b8cbe",
                        color: "white",
                        borderRadius: "5%",
                        width: "12%",
                        cursor: "pointer",
                        border: "1px solid #333",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                        marginLeft: "55%",
                    }}
                    onClick={() => navigate(`/epaggelmaties/rantevou`)}
                >
                    Επιστροφή
                </button>
              </div>                        
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default ProepiskopisiRantevouPGU;