import React, { useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

function ViewJobPost() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({});
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState({});

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

    const handleFileClick = () => {
        // Opens the file in a new tab
        window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
    };

    if (!profile || !post) {
        //? Error frame
        return null;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="not_connected" />
    
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

                <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "row", marginLeft: "7vh" }}>
                    
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: "2%", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b>Συστατικές επιστολές</b></span>
                        {/*//? List of recommendation letter */}
                        <ul>
                            <li style={{ cursor: "pointer" }}>
                                <span onClick={handleFileClick} style={{ color: "blue" }}>
                                    Επιστολή 1
                                </span>
                            </li>
                        </ul>

                    </div>

                    <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: "2%", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b>Πληροφορίες</b></span>
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
                                {post.transport ? "Διαθέτει" : "Δεν διαθέτει"} μεταφορικό μέσο
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                <WorkHistoryIcon style={{ width: "2.5vw", height: "2.5vh" }} />
                                {profile.workExperience}
                            </div>

                        </div>
                        
                    </div>

                    <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: "2%", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}><b>Αξιολογήσεις</b></span>
                        {/*//?List of ratings*/}
                        {/*rating.count > 0 ? div : "Den yparoxun aksiologiseis"*/}
                        <Carousel data-bs-theme="dark" style={{ width: "100%", height: "100%" }}>
                            <Carousel.Item>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    //? Aksiologisi
                                </div>
                            </Carousel.Item>
                        </Carousel>

                    </div>

                </div>
        
                <Footer />
        
            </div>
  
        </div>
    );
}

export default ViewJobPost;
