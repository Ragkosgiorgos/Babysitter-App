import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import EventIcon from '@mui/icons-material/Event';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../config/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

function ViewJobPost() {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    // Check if user is logged in, get the user's UUID and fetch user data
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
            const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
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

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({});
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState({});
    const [ratings, setRatings] = useState([]);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [epistoles, setEpistoles] = useState([]);
    const [filteredEpistoles, setFilteredEpistoles] = useState([]);

    useEffect(() => {
        fetch("/data/aggelies.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            const post = posts.find((post) => post.id === id);
            setPost(post);
        }
    }, [posts, id]);

    useEffect(() => {
        fetch("/data/ntantades.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setProfiles(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (profiles.length > 0 && post && post.uid) {
            const profile = profiles.find((profile) => profile.uid === post.uid);
            setProfile(profile);
        }
    }, [profiles, post]);

    useEffect(() => {
        fetch("/data/ratings.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setRatings(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (ratings.length > 0 && profile && profile.uid) {
            const filteredRatings = ratings.filter((rating) => rating.id_b === profile.uid);
            setFilteredRatings(filteredRatings);
        }
    }, [ratings, post, profile]);

    useEffect(() => {
        fetch("/data/epistoles.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setEpistoles(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (epistoles.length > 0 && profile && profile.uid) {
            const filteredEpistoles = epistoles.filter((epistole) => epistole.id_b === profile.uid);
            setFilteredEpistoles(filteredEpistoles);
        }
    }, [epistoles, post, profile]);

    const handleReturn = () => {
        window.history.back();
    };

    const handleFileClick = (link) => {
        window.open(link, "_blank");
    };

    const handleViewRating = (r_id) => {
        navigate(`/epaggelmaties/ratings/preview-aksiologisis?id=${r_id}`);
    };

    const TruncatedText = ({ text }) => {
        const maxLength = 150;

        const truncate = (str, length) => {
        if (str.length <= length) return str;

        const truncated = str.slice(0, length); // Initial truncation
        const lastSpaceIndex = truncated.lastIndexOf(" "); // Find last space before cutoff
        return str.slice(0, lastSpaceIndex) + "...";
        };

        const truncatedText = truncate(text, maxLength);

        return <p>{truncatedText}</p>;
    };

    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          age--;
        }
        return age;
    };

    if (!profile || !post || !user) {
        //? Error frame
        return null;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
    
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                <Breadcrumbs />

                <div style={{ display: "flex", flex: 1, justifyContent: "center", marginTop: "5vh" }}>
                    <div style={{ display: "flex", flex: 1, marginLeft: "15%",   borderRadius: "2vh" }}>
                        <img src={profile.img} className="d-inline-block align-top" alt="" width={"300vw"} height={"300vh"} 
                            style={{ marginTop: "3vh", borderRadius: "2%" }} />
                    </div>
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", marginRight: "20%" }}>
                        <h2><b>{profile.name} {profile.surname}</b> ({calculateAge(profile.birthDate)})</h2>
                        <h4>{post.description}</h4>
                        <Link to={`/epaggelmaties/aitisi-endiaferontos?ntanta=${profile.uid}`}>
                            <button className="btn btn-primary" style={{ width: "20vw", marginTop: "2vh" }}>
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
                                {post.area}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <SchoolIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {profile.education}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <DirectionsCarIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {post.car ? "Διαθέτει" : "Δεν διαθέτει"} μεταφορικό μέσο
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <WorkHistoryIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {profile.workExperience}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <EventIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {post.days}
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
                                        {TruncatedText({ text: rating.comment })}
                                    </p>
                                    <button style={{ width: "3vw", height: "3vh", borderRadius: "5%", fontSize: "12px" }}
                                            onClick = {() => handleViewRating(rating.id)}>
                                        Προβολή
                                    </button>
                                </Carousel.Item>
                                
                            ))}
                        </Carousel>}

                    </div>

                </div>
                
                <button style={{ width: "7vw", height: "4vh", marginTop: "2vh", marginLeft: "4vh", borderRadius: "5%" }} onClick={handleReturn}>
                    Επιστροφή
                </button>

                <Footer />
        
            </div>
  
        </div>
    );
}

export default ViewJobPost;
