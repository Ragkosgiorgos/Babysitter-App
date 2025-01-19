import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Accordion from 'react-bootstrap/Accordion';
import JobofferReview from "../Components/EpaggelmatiesComponent/JobofferReview";
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Carousel } from 'react-bootstrap';
import { FIREBASE_DB } from "../config/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

function MainPGU() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(FIREBASE_DB, "aggelies"), where("status", "==", "Δημοσιευμένη"));
        const postQuerySnapshot = await getDocs(q);
        const posts = postQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } 
    }
    fetchPosts();
  }, []);

  const areasOfGreece = [
    "Αθήνα",
    "Θεσσαλονίκη",
    "Πάτρα",
    "Ηράκλειο",
    "Λάρισα",
    "Βόλος",
    "Ιωάννινα",
    "Καβάλα",
    "Χανιά",
    "Ρόδος",
  ];

  const ages = [
    "από 6 μηνών έως και 1 έτους",
    "από 1 έτους έως και 2 ετών",
    "από 2 ετών έως και 2.5 ετών",
  ];

  const handleSearchRedirect = () => {
    navigate('/anazitisi', { state: { area: area, age: age } });
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>

      <Header />

      <div style={{ flex: 1, overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <img style={{ position: "relative", zIndex: 1 }} src="/images/babysitter.jpg" width="100%" height="500vh" alt="" />
        </div>

        <div style={{ backgroundColor: "white", position: "relative", zIndex: 2, display: "flex", width: "60%", justifyContent: "center", margin: "0 auto",
                     flexDirection: "column", border: "1px solid black", borderRadius: "15px", height: "20vh", marginTop: "-10vh" }}>

          <div style={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold", textDecoration: "underline" }}>
              Βρείτε τον/την babysitter που σας ταιριάζει!
          </div>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2.5vh"}}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "30%", marginLeft: "2vh" }}>
              <h6> Επιλογή περιοχής </h6>
              <FormControl fullWidth style={{ marginTop: "1vh", fontSize:"5%" }}>
                <InputLabel id="area-select-label"></InputLabel>
                <Select
                  labelId="area-select-label"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{ width: "80%" }}
                  displayEmpty
                >
                  {<MenuItem value="">Επιλέξτε Περιοχή</MenuItem>}
                  {areasOfGreece.map((area) => (
                    <MenuItem key={area} value={area.toLowerCase()}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "30%" }}>
              <h6> Επιλογή ηλικίας παιδιού </h6>
              <FormControl fullWidth style={{ marginTop: "1vh" }}>
                <InputLabel id="age-select-label"></InputLabel>
                <Select
                  labelId="age-select-label"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{ width: "80%" }}
                  displayEmpty
                >
                  {<MenuItem value="">Επιλέξτε Ηλικία</MenuItem>}
                  {ages.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "20%" }}>
              <button style={{ backgroundColor: "#2b8cbe", color: "white", border: "none", borderRadius: "5px", width: "80%", height: "30%", marginTop: "2vh" }} onClick={handleSearchRedirect}>
                <h6 style={{ marginLeft: "10px", marginTop: "1vh", textDecoration:"underline" }}>Αναζήτηση</h6>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
          <img style={{ height: "25vh" }} src="/progressBabysitter.png" alt="" />
        </div>

        <div style={{ textAlign: "center", marginTop: "5vh" }}><h3><b>Δείτε ενδεικτικές αγγελίες για εργασία:</b></h3></div>

        <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex", gap: "5vh", justifyContent: "center" }}>
          <Carousel
            data-bs-theme="dark"
            style={{ width: "90%", height: "40vh", margin: "auto", justifyContent: "center" }}
          >
            {/* Group posts into sets of 3 */}
            {posts.reduce((acc, post, index) => {
              if (index % 3 === 0) {
                acc.push(posts.slice(index, index + 3));
              }
              return acc;
            }
            , []).map((postSet, index) => (
              <Carousel.Item key={index}>
                <div style={{ display: "flex", justifyContent: "center", gap: "5vh" }}>
                  {postSet.map((post) => (
                    <JobofferReview key={post.id} id={post.id} />
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
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
                <li>Να έχετε ανήλικο τέκνο δύο (2) μηνών έως δύο (2) ετών και έξι (6) μηνών.</li>
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
            <Accordion.Header>Ποιοι έχουν δικαίωμα εγγραφής στο πρόγραμμα ως babysitter;</Accordion.Header>
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
