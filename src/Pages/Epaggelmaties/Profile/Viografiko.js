import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from '../../../Components/Loader';
import { calculateAge, TruncatedText } from "../../../Utils/Methods/index";
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import ClearIcon from '@mui/icons-material/Clear';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

function Viografiko() {
    const navigate = useNavigate();

    const [uuid, setUuid] = useState("");
    const [profile, setProfile] = useState({});
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's uuid
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

    // Fetch user data & ratings from the database
    useEffect(() => {
        if (uuid) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
                    const querySnapshot = await getDocs(q);
                    const posts = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setProfile(posts[0]);
                    if (posts[0].property !== "babysitter") {
                        navigate("/");
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();

            const fetchRatings = async () => {
                try {
                    setLoading(true);
                    const q = query(collection(FIREBASE_DB, 'ratings'), where('id_b', '==', uuid));
                    const querySnapshot = await getDocs(q);
                    const posts = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setRatings(posts);
                } catch (error) {
                    console.error('Error fetching ratings:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRatings();
        }
    }, [uuid, navigate]);

    // Handle recommendation letters display
    const viewDummyMails = () => {
        let mails = [];
        for (let i = 0; i < profile.systatikes; i++) {
            mails.push(
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a href="/dummy.pdf" target="_blank" rel="noreferrer">
                        Επιστολή {i + 1}
                    </a>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "red",
                            fontSize: "16px",
                        }}
                        onClick={() => handleDelete(i)}
                    >
                        <ClearIcon />
                    </button>
                </div>
            );
        }
        return mails;
    };

    // Delete a mail from the profile
    const handleDelete = async (index) => {
        try {
            setLoading(true);
            await updateDoc(doc(FIREBASE_DB, 'user', profile.id), {
                systatikes: profile.systatikes - 1,
            });
            setProfile((prevProfile) => ({
                ...prevProfile,
                systatikes: prevProfile.systatikes - 1,
            }));
        } catch (error) {
            console.error('Error deleting mail:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new mail to the profile
    const handleAddMail = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            await updateDoc(doc(FIREBASE_DB, 'user', profile.id), {
                systatikes: profile.systatikes + 1,
            });
            setProfile((prevProfile) => ({
                ...prevProfile,
                systatikes: prevProfile.systatikes + 1,
            }));
        } catch (error) {
            console.error('Error adding mail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewRating = (r_id) => {
        navigate(`/ratings/previewAksiologisi?id=${r_id}`);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
            <div>
                <Header />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1 }}>
                        <Breadcrumbs />

                        <h1 style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline" }}>Το Βιογραφικό μου</h1>

                        <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", marginTop: "4vh" }}>
                            <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2vw" }}>
                                    <h6 style={{ backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
                                        {profile.img ? 
                                            (profile.gender === "Άντρας" ? 
                                                <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                                                : profile.gender === "Γυναίκα" ? <img src="/images/women_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                                                : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                                            ) : 
                                            <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                                        }
                                    </h6>
                                    <h3><b>{profile.firstName} {profile.lastName}</b> ({calculateAge(profile.birthDate)} ετών)</h3>
                                </div>
                                <Rating name="read-only" value={profile.totalRatingAvg} readOnly style={{ marginTop: "1vh", fontSize: "30px" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", marginTop: "2vh" }}>
                            <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "column", textAlign: "center", marginTop: "1vh" }}>
                                <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                    <span style={{ fontSize: "20px" }}><b style={{ textDecoration: "underline" }}>Συστατικές επιστολές</b></span>
                                    {profile.systatikes === 0 ? <h6 style={{ marginTop: "2vh" }}>Δεν υπάρχουν επιστολές!</h6> : viewDummyMails()}
                                </div>
                                <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                    <button 
                                        style={{ 
                                            marginTop: "10px", 
                                            backgroundColor: "green", 
                                            color: "white", 
                                            borderRadius: "5px", 
                                            cursor: "pointer", 
                                            border: "1px solid #333", 
                                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", 
                                            fontSize: "15px" 
                                        }}
                                        onClick={() => document.getElementById("fileInput").click()}
                                    >
                                        Επιλογή συστατικής επιστολής
                                    </button>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: "none" }}
                                        onChange={handleAddMail}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontSize: "20px" }}><b style={{ textDecoration: "underline" }}>Αξιολογήσεις</b></span>
                                {ratings.length === 0 ? <h5 style={{ marginTop: "4vh" }}>Δεν υπάρχουν αξιολογήσεις!</h5> : 
                                    <Carousel
                                        data-bs-theme="dark"
                                        style={{ width: "90%", maxWidth: "400px", height: "300px", margin: "2vh auto" }}
                                    >
                                        {ratings.map((rating) => (
                                            <Carousel.Item key={rating.id} style={{ textAlign: "center", padding: "20px" }}>
                                                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Βαθμολογία: {rating.rating}</h3>
                                                <p style={{ fontSize: "1rem", margin: "auto", maxWidth: "90%" }}>
                                                    {TruncatedText(rating.comment)}
                                                </p>
                                                <button
                                                    style={{
                                                        borderRadius: "5px",
                                                        fontSize: "14px",
                                                        padding: "10px 15px",
                                                        marginTop: "90px",
                                                        border: "1px solid #333",
                                                        cursor: "pointer",
                                                        backgroundColor: "#007bff",
                                                        color: "white",
                                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                    onClick={() => handleViewRating(rating.id)}
                                                >
                                                    Προβολή
                                                </button>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                }
                            </div>
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

export default Viografiko;
