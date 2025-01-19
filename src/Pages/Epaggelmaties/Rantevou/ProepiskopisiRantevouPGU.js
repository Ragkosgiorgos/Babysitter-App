import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";
import { use } from "react";

function ProepiskopisiAvailableRantevou() {
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
          navigate("/login");
        }
      });
      return () => unsubscribe();
    }, [navigate]);

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
    const [parent, setParent] = useState({});
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
    useEffect(() => {
      if (aitisi.id_p) {
        const fetchParentData = async () => {
          try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', aitisi.id_p));
            const querySnapshot = await getDocs(q);
            const parents = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setParent(parents[0]);
          } catch (error) {
            console.error('Error fetching parent data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchParentData();
      }
    }, [aitisi.id_p]);

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    if (loading) {
      return <Loader />;
    }

    return (
        <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
            <div>
            <Header />
            <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                <Breadcrumbs />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "underline" }}>
                    <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Προβολή ραντεβού</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%", marginTop: "2%" }}>
                    <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold" }}>Ονοματεπώνυμο κηδεμόνα:</h4>
                    <h5 style={{ display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "5%" }}>{parent?.firstName} {parent?.lastName}</h5>

                    <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}>Ημερομηνία & Ώρα ραντεβού:</h4>
                    <h5 style={{ display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "5%" }}>{formatDateTime(aitisi?.date)}</h5>

                    <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%"  }}>Τρόπος συνάντησης:</h4>
                    <h5 style={{ display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "5%" }}>{aitisi?.tropos_synantisis}</h5>

                    {aitisi.tropos_synantisis === "Δια ζώσης" && (
                    <div>
                        <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}>Διεύθυνση:</h4>
                        <h5 style={{ display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "5%" }}>{aitisi?.address}</h5>
                        
                    </div>
                    )}
                    {aitisi.tropos_synantisis === "Διαδικτυακά" && (
                    <div>
                        <h4 style={{ display: "flex", flexDirection: "row", fontWeight: "bold", marginTop: "3%" }}>Link για διαδικτυακή συνάντηση</h4>
                        <a 
                          href={aitisi.link.startsWith('http') ? aitisi.link : `https://${aitisi.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "5%", fontSize: "20px" }}
                        >
                          {aitisi.link}
                        </a>
                    </div>
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", gap: "50%" }}>
                    <button onClick={() => navigate(-1)} style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%" }}>
                    Επιστροφή
                    </button>
                </div>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProepiskopisiAvailableRantevou;
