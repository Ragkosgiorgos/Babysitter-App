import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Accordion from 'react-bootstrap/Accordion';
import JobofferReview from "../Components/EpaggelmatiesComponent/JobofferReview";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FIREBASE_DB} from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebase';
import { use } from "react";

function MainPGU(props) {
  const navigate = useNavigate();  
  const location = useLocation();  

  const handleSearchRedirect = () => {
    if (location.pathname !== '/anazitisi') {
        navigate('/anazitisi');  
    }
  };

  // get if user is logged in
  const [uuid, setUuid] = useState(null);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
          }
      });
      return () => unsubscribe();
  }, []);

  // get users from firebase
  const [userData, setUserData] = useState([]);
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user')); // Query all users
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUserData(users);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

  // Match the user's id with the user id
  const [user, setUser] = useState({});
  useEffect(() => {
      if (userData.length > 0) {
          const user = userData.find((user) => user.userId === uuid);
          setUser(user);
      }
  }
  , [userData, uuid]);
  console.log(user);

  const [ntantades, setNtantades] = useState([]);
  const [ntanta, setNtanta] = useState({});
  const uid = 2; //? Get the user id from the session
  useEffect(() => {
      fetch("/data/ntantades.json")
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then((data) => {
              setNtantades(data);
          })
          .catch((error) => {
              console.error("Error fetching JSON:", error);
          });
  }, []);

  // Match the babysitter's id with the user id
  useEffect(() => {
      if (ntantades.length > 0) {
          const ntanta = ntantades.find((ntanta) => ntanta.uid === uid);
          setNtanta(ntanta);
      }
  }, [ntantades, uid]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>
      <Header user={user} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img style={{ marginRight: "8px", position: "relative", zIndex: 1 }} src="/hero1.avif" width="100%" height="500vh" alt="" />
        </div>
        <div style={{ backgroundColor: "white", position: "relative", zIndex: 2, display: "flex", width: "50%", justifyContent: "center", margin: "0 auto",
                     flexDirection: "column", border: "1px solid black", borderRadius: "15px", height: "20vh", marginTop: "-10vh" }}>
          <h6 style={{ textAlign: "center" }}>Βρείτε τον/την επαγγελματία που σας ταιριάζει!</h6>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%" }}>
            <div style={{ display: "flex", width: "30%", outline: "1px solid black", marginLeft: "10%", borderRadius: "15px", height: "5vh" }}>
            <Link to="/anazitisi" className="nav-link" style={{background: "none",border: "none",padding: 0,cursor: "pointer",width: "100%",display: "flex",alignItems: "center",justifyContent: "space-between",
              textDecoration: "none", 
            }}
            onClick={handleSearchRedirect} 
            >
            <span style={{ fontWeight: 100, marginLeft: "3%"}}>
              Βρείτε αυτό που ψάχνετε
            </span>
            <img
              src="/search (1).svg"
              alt="Search"
              style={{ width: "24px", height: "24px", marginRight: "3%" }}
            />
          </Link>
            </div>
            <Link to="/epaggelmaties" className="nav-link" style={{background: "none",border: "none",padding: 0,cursor: "pointer",width: "30%",display: "flex",alignItems: "center",justifyContent: "space-between", textDecoration: "none" }}>
              <span style={{ marginRight: "10%", textDecoration: "underline" }}>Βρείτε εργασία</span>
            </Link>
            
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
          <img style={{ height: "25vh" }} src="/progress.png" alt="" />
        </div>
        <div style={{ marginLeft: "2vh" }}><h6>Δείτε ενδεικτικές αγγελίες για εργασία:</h6></div>
        <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex", gap: "5vh", justifyContent: "center" }}>
          <JobofferReview id={1}/>
          <JobofferReview id={4}/>
          <JobofferReview id={5}/>
        </div>

      <div>
        <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ποιοι έχουν δικαίωμα εγγραφής στο πρόγραμμα ως κηδεμόνες;</Accordion.Header>
            <Accordion.Body>
              <span style={{width:"80%"}} >
                Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να πληρείτε τα ακόλουθα κριτήρια:
                <br />
                <ul style={{listStyleType:"disc"}}>
                <li>Το ετήσιο ατομικό εισόδημά σας να μην υπερβαίνει το ποσό των 24.000 € για το φορολογικό έτος 2024 (για εισοδήματα που αποκτήθηκαν από 01/01/2024 έως 31/12/2024).</li>
                <li>Να είστε εργαζόμενη/ος ή άνεργη εγγεγραμμένη στα μητρώα της ΔΥΠΑ (Προσοχή! H ανεργία αφορά μόνο στη μητέρα που υποβάλλει αίτηση).</li>
                <li>Να μην τελείτε υπό καθεστώς άδειας μητρότητας ή άδειας πατρότητας ή άδειας ανατροφής τέκνου ή γονικής άδειας ή ειδικής παροχής προστασίας μητρότητας ή να μην έχετε διακόψει ή αναστείλει την επαγγελματική σας δραστηριότητα.</li>
                Να έχετε ανήλικο τέκνο δύο (2) μηνών έως δύο (2) ετών και έξι (6) μηνών.
                <li>Η διεύθυνση διαμονής σας να είναι εντός των Δήμων που συμμετέχουν στην Πιλοτική εφαρμογή της Δράσης.</li>
                </ul>
              </span>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div>
        <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"1.5vh"}}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ποιοι έχουν δικαίωμα εγγραφής στο πρόγραμμα ως επαγγελματίες;</Accordion.Header>
            <Accordion.Body>
              <span>
                Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να:
                <br />
                <ul style={{listStyleType:"disc"}}>
                <li>Να έχετε συμπληρώσει το 18ο έτος της ηλικίας σας.</li>
                <li>Να είστε Έλληνας ή αλλοδαπός πολίτης που διαμένει νόμιμα στην Ελλάδα και έχει πρόσβαση στην αγορά εργασίας.</li>
                </ul>
              </span>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

        <Footer />
      </div>
    </div>
  );
}

export default MainPGU;
