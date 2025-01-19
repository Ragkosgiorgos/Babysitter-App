import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Breadcrumbs from "../Components/Breadcrumbs";
import Loader from "../Components/Loader";
import { calculateAge, capitalizeWords } from "../Utils/Methods/index";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import SchoolIcon from "@mui/icons-material/School";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import { FaBirthdayCake } from "react-icons/fa";
import { FIREBASE_DB } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function ViewJobPost() {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const [post, setPost] = useState(null);
    const [profile, setProfile] = useState(null);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch post data
                const postQuery = query(collection(FIREBASE_DB, "aggelies"), where("id", "==", id));
                const postQuerySnapshot = await getDocs(postQuery);
                const posts = postQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const fetchedPost = posts[0];
                setPost(fetchedPost);

                if (!fetchedPost?.uid) {
                    console.warn("Post UID is missing or invalid.");
                    return;
                }

                // Fetch profile data
                const profileQuery = query(collection(FIREBASE_DB, "user"), where("userId", "==", fetchedPost.uid));
                const profileQuerySnapshot = await getDocs(profileQuery);
                const profiles = profileQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProfile(profiles[0]);

                // Fetch ratings data
                const ratingsQuery = query(collection(FIREBASE_DB, "ratings"), where("id_b", "==", fetchedPost.uid));
                const ratingsQuerySnapshot = await getDocs(ratingsQuery);
                const ratings = ratingsQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFilteredRatings(ratings);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Return to the previous page
    const handleReturn = () => window.history.back();

    // Handle contact button click and navigate to the edit page
    const handleContact = () => navigate(`/goneis/profile/aitiseis-endiaferontos/edit?b_id=${profile.userId}`);

    // Open the mail
    const handleFileClick = (link) => window.open(link, "_blank");

    if (loading) {
        return <Loader />;
    }

    if (!loading && (!profile || !post)) {
        navigate("/404");
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                <Breadcrumbs />

                <div style={{ display: "flex", justifyContent: "center", marginTop: "3vh" }}>
                    <div style={{ width: "80%", display: "flex", gap: "1vw" }}>
                        {/* Left Column - Properties */}
                        <div style={{ width: "25%", borderRight: "1px solid #ccc", paddingRight: "1vw" }}>
                            <h4 style={{ textDecoration: "underline" }}>Πληροφορίες Αγγελίας</h4>
                            <p>
                                <HomeIcon /> {post.accomodation ? <span style={{textDecoration: "underline"}}>Παρέχει</span> : <span style={{textDecoration: "underline"}}>Δεν παρέχει</span>} το σπίτι του για φιλοξενία.
                            </p>
                            <p>
                                <AccessTimeIcon /> <span style={{textDecoration: "underline"}}>{post.time}</span> απασχόληση.
                            </p>
                            <p>
                                <PlaceIcon /> <span style={{textDecoration: "underline"}}>Περιοχή:</span> {capitalizeWords(post.area)}.
                            </p>
                            <p>
                                <SchoolIcon /> <span style={{textDecoration: "underline"}}>Εκπαίδευση:</span> {profile.education}.
                            </p>
                            <p>
                                <DirectionsCarIcon /> {post.car === "Ναι" ? <span style={{textDecoration: "underline"}}>Διαθέτει</span> : <span style={{textDecoration: "underline"}}>Δεν διαθέτει</span>} μεταφορικό μέσο.
                            </p>
                            <p>
                                <EventIcon /> <span style={{textDecoration: "underline"}}>Διαθεσιμότητα:</span>{" "}
                                {post.dates === "Καθημερινές"
                                    ? "τις καθημερινές"
                                    : post.dates === "Σαββατοκύριακο"
                                    ? "τα Σαββατοκύριακα"
                                    : "όλη την εβδομάδα"}
                            </p>
                            <p>
                                <FaBirthdayCake /> <span style={{textDecoration: "underline"}}>Αναλαμβάνει</span> παιδιά από{" "}
                                {post.ageFrom === post.ageTo
                                    ? post.ageFrom === 0.5
                                        ? "6 μηνών"
                                        : `${post.ageFrom} ετών`
                                    : `${post.ageFrom} έως ${post.ageTo} ετών`}
                                .
                            </p>
                        </div>

                        {/* Right Column - Ratings and Letters */}
                        <div style={{ width: "75%" }}>
                            {/* Profile Info */}
                            <div style={{ display: "flex", alignItems: "center", gap: "2vw", marginBottom: "2vh", flexDirection: "column" }}>
                                <div
                                    style={{
                                        backgroundColor: "#D9EAFD",
                                        borderRadius: "50%",
                                        width: "80px",
                                        height: "80px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        border: "2px solid black",
                                    }}
                                >
                                    <img
                                        src={
                                            profile.img
                                                ? profile.gender === "Άντρας"
                                                    ? "/images/men_profile.webp"
                                                    : profile.gender === "Γυναίκα" ? "/images/women_profile.webp" 
                                                    : "/images/default_profile.png"
                                                : "/images/default_profile.png"
                                        }
                                        alt="Profile"
                                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                    />
                                </div>
                                <h3>
                                    <b>
                                        {profile.firstName} {profile.lastName}
                                    </b>{" "}
                                    ({calculateAge(profile.birthDate)} ετών)
                                </h3>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "2vw", marginBottom: "2vh", flexDirection: "column" }}>
                                <Rating name="read-only" value={profile.totalRatingAvg} readOnly style={{ fontSize: "30px" }} />
                                <button
                                    style={{
                                        height: "40px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        borderRadius: "5px",
                                        width: "150px",
                                        cursor: "pointer",
                                        border: "1px solid #333",
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                                    }}
                                    onClick={handleContact}
                                >
                                    Κλείστε Ραντεβού
                                </button>
                            </div>

                            {/* Letters Section */}
                            <div style={{ marginTop: "4vh" }}>
                                <h4 style={{ textDecoration: "underline" }}>Συστατικές Επιστολές</h4>
                                {profile.systatikes === 0 ? (
                                    <p>Δεν υπάρχουν επιστολές!</p>
                                ) : (
                                    Array.from({ length: profile.systatikes }, (_, index) => (
                                        <div key={index} style={{ marginBottom: "1vh" }}>
                                            <span
                                                style={{ fontSize: "16px", cursor: "pointer", color: "blue", marginLeft: "1.5vw" }}
                                                onClick={() => handleFileClick(`epistoles_link_${index + 1}`)}
                                            >
                                                Επιστολή {index + 1}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Ratings Section */}
                            <div style={{ marginTop: "4vh" }}>
                                <h4 style={{ textDecoration: "underline" }}>Αξιολογήσεις</h4>
                                {filteredRatings.length === 0 ? (
                                    <p>Δεν υπάρχουν αξιολογήσεις!</p>
                                ) : (
                                    filteredRatings.map((rating, index) => (
                                        <div
                                            key={rating.id}
                                            style={{ marginBottom: "1vh", borderBottom: "1px solid #ccc", padding: "1vh" }}
                                        >
                                            <Rating name="read-only" value={rating.rating} readOnly />
                                            <p>{rating.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                        margin: "2vh auto",
                    }}
                    onClick={handleReturn}
                >
                    Επιστροφή
                </button>
            </div>
            <Footer />
        </div>
    );
}

export default ViewJobPost;
