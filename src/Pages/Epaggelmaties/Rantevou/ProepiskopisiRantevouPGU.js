import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebase";


function ProepiskopisiRantevouPGU(props) {
  const location = useLocation();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const navigate = useNavigate();
  
  const [uuid, setUuid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

  const [user, setUser] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'),where( 'userId' , '==' , uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUser(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

  const [newData, setnewData] = useState({
    id: id,
    postid: "",
    UserId: "",
    tropos_synantisis: "",
    status: "Oριστική υποβολή",
    date: new Date().toLocaleDateString(),
    description: "", 
    date_of_birth: "",
    gender: "",
  });
  // If post_id === -1 then we are creating a new post, otherwise we are editing an existing one
  const [aitisi, setAitisi] = useState({});
    const fetchAitiseisData = async () => {
        try {
            const q = query(collection(FIREBASE_DB, 'rantevou'), where('id', '==', id), where('id_b', '==', uuid));
            const querySnapshot = await getDocs(q);
            const aitiseis = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAitisi(aitiseis[0]);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };
  fetchAitiseisData();

    const redirect = ()=>{
      window.location.href = aitisi.link;
    }
    
    if (!user || !aitisi) {
      return <div>Δεν βρέθηκε ο χρήστης</div>;
    }
    return (
      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
        <div>
          <Header />
  
          <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
  
            <div style={{ flex: 1, overflowY: "auto" }}>
  
              <Breadcrumbs />
              
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
  
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Προσωπικά στοιχεία κηδεμόνα:</th>
                  </tr>

                  <td>Όνομα: {user.firsName}</td>
                  <tr><td>Επίθετο: {user.lastName}</td></tr>

                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Στοιχεία επικοινωνίας:</th>
                  </tr>
  
                  <td>Αριθμός κινητού τηλεφώνου: {user.phone}</td>
                  <tr><td>Email: {user.email}</td></tr>                  
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>
                  <tbody>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                  <th>Στοιχεία ραντεβού</th>
                  </tr>

                  <td>Ημερομηνία: {aitisi.date}</td>
                  <tr><td>Τρόπος: {aitisi.tropos_synantisis}</td></tr> 
                  {aitisi.tropos_synantisis === "Διαδικτυακά" && (<tr><td>Σύνδεσμος:<Button onClick={redirect} 
                  style={{  height: "0%", backgroundColor: "#D9EAFD", color: "blue", marginTop: "0%"}} >{aitisi.link}</Button></td></tr> )}                 
                  {aitisi.tropos_synantisis === "Δια ζώσης" && (<tr><td>Διεύθυνση: {aitisi.address}</td></tr> )} 
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