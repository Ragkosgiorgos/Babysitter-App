import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import { Carousel } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import { calculateAge, capitalizeWords, TruncatedText } from "../../Utils/Methods/index";
import { FIREBASE_DB } from "../../config/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

function ViewJobPost() {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const [post, setPost] = useState(null);
    const [profile, setProfile] = useState(null);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [filteredEpistoles, setFilteredEpistoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch post data
                const postQuery = query(collection(FIREBASE_DB, 'aggelies'), where('id', '==', id));
                const postQuerySnapshot = await getDocs(postQuery);
                const posts = postQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const fetchedPost = posts[0];
                setPost(fetchedPost);

                if (!fetchedPost?.uid) {
                    console.warn('Post UID is missing or invalid.');
                    return; // Exit early if no UID is available
                }

                // Fetch profile data
                const profileQuery = query(collection(FIREBASE_DB, 'user'), where('userId', '==', fetchedPost.uid));
                const profileQuerySnapshot = await getDocs(profileQuery);
                const profiles = profileQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProfile(profiles[0]);

                // Fetch ratings data
                const ratingsQuery = query(collection(FIREBASE_DB, 'ratings'), where('id_b', '==', fetchedPost.uid));
                const ratingsQuerySnapshot = await getDocs(ratingsQuery);
                const ratings = ratingsQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFilteredRatings(ratings);

                // Fetch epistoles data
                const epistolesQuery = query(collection(FIREBASE_DB, 'epistoles'), where('id_b', '==', fetchedPost.uid));
                const epistolesQuerySnapshot = await getDocs(epistolesQuery);
                const epistoles = epistolesQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFilteredEpistoles(epistoles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleReturn = () => {
        window.history.back();
    };

    const handleFileClick = (link) => {
        window.open(link, "_blank");
    };

    const handleViewRating = (r_id) => {
        navigate(`/epaggelmaties/ratings/preview-aksiologisis?id=${r_id}`);
    };

    if (!profile || !post) {
        navigate('/404');
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
    
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                <Breadcrumbs />

                <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", marginTop: "4vh" }}>

                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2vw" }}>
                            <h6 style={{ backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
                                {profile.img ? "Photo" : "No photo"}
                            </h6>
                            <h3><b>{profile.firstName} {profile.lastName}</b> ({calculateAge(profile.birthDate)} ετών)</h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "60%", marginTop: "2vh", marginBottom: "2vh" }}>
                            <h6> <b style={{ textDecoration: "underline" }}>Περιγραφή:</b> {post.description} </h6>
                        </div>

                        <Link to={`/epaggelmaties/aitisi-endiaferontos?ntanta=${profile.userId}`}>
                            <button className="btn btn-primary" style={{ width: "20vw", marginTop: "2vh", marginBottom: "2vh" }}>
                                Επικοινωνία
                            </button>
                        </Link>

                    </div>

                </div>

                <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "row", textAlign: "center", marginTop: "4vh" }}>
                    
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b style={{textDecoration:"underline"}}>Συστατικές επιστολές</b></span>
                        <ul style={{marginTop:"2vh"}}>
                            {filteredEpistoles.length === 0 ? <h6 style={{marginTop:"2vh"}}>Δεν υπάρχουν επιστολές!</h6> : ""}
                            {filteredEpistoles.map((epistole, index) => (
                                <li key={epistole.id} style={{marginBottom:"2vh"}}>
                                    <span style={{ fontSize:"20px", cursor:"pointer", color:"blue" }} onClick={() => handleFileClick(epistole.link)}>
                                        {`Επιστολή ${index + 1}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b style={{textDecoration:"underline"}}>Πληροφορίες</b></span>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%" }}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <HomeIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                Ο επαγγελματίας {post.accomodation ? "παρέχει" : "δεν παρέχει"} το σπίτι του για φιλοξενία
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <AccessTimeIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {post.time} απασχόληση
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <PlaceIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {capitalizeWords(post.area)}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <SchoolIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {profile.education}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <DirectionsCarIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {post.car === "Ναι" ? "Διαθέτει" : "Δεν διαθέτει"} μεταφορικό μέσο
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <EventIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {post.dates}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b style={{textDecoration:"underline"}}>Αξιολογήσεις</b></span>
                        {filteredRatings.length === 0 ? <h5 style={{marginTop:"4vh"}}>Δεν υπάρχουν αξιολογήσεις!</h5> : 
                        <Carousel data-bs-theme="dark" style={{ width: "20vw", height: "30vh", marginTop: "2vh" }}>
                            {filteredRatings.map((rating) => (
                                <Carousel.Item key={rating.id}>
                                    <h3>Βαθμολογία: {rating.rating}</h3>
                                    <p style={{ width:"70%", textAlign:"center", margin:"auto" }}>
                                        {TruncatedText(rating.comment)}
                                    </p>
                                    <button style={{ borderRadius: "5%", fontSize: "12px" }}
                                            onClick = {() => handleViewRating(rating.id)}>
                                        Προβολή
                                    </button>
                                </Carousel.Item>
                                
                            ))}
                        </Carousel>}

                    </div>

                </div>
                
                <button style={{ height: "5%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5%", width: "12%", cursor: "pointer", border: "1px solid #333", 
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", marginLeft: "4%", marginTop: "2%" }} onClick={handleReturn}>
                    Επιστροφή
                </button>

                <Footer />
        
            </div>
  
        </div>
    );
}

export default ViewJobPost;
