import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import React, { useState, useEffect } from "react";
import Loader from '../../Components/Loader';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { calculateAge, capitalizeWords, TruncatedText } from "../../Utils/Methods/index";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../config/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

function Viografiko() {
    const navigate = useNavigate();

    const [uuid, setUuid] = useState("");
    const [profile, setProfile] = useState({});
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, []);

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
                    setDescription(posts[0].description);
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
            }
            fetchRatings();
        }
    }, [uuid]);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const saveDescription = async () => {
        if (description !== profile.description) {
            try {
                setLoading(true);
                await updateDoc(doc(FIREBASE_DB, 'user', profile.id), {
                    description: description,
                });
            } catch (error) {
                console.error('Error updating document:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    // Create a ul with as li as the number of systatikes that redirect to the file dummy.pdf
    const viewDummyMails = () => {
        let mails = [];
        for (let i = 0; i < profile.systatikes; i++) {
            mails.push(
                <a key={i} href="/dummy.pdf" target="_blank" rel="noreferrer">
                        Επιστολή {i + 1}
                </a>
            );
        }

        return mails;
    }

    const handleViewRating = (r_id) => {
        navigate(`/epaggelmaties/ratings/previewAksiologisi?id=${r_id}`);
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
                        <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", marginTop: "2vh" }}>

                            <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2vw" }}>
                                    <h6 style={{ backgroundColor: "#D9EAFD", borderRadius: "50%", width: "80px", height: "80px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid black" }}>
                                    {profile.img ? 
                                    (profile.gender === "Άντρας" ? <img src="/images/men_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> : 
                                    <img src="/images/women_profile.webp" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />)
                                    : <img src="/images/default_profile.png" alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
                                    </h6>
                                    <h3><b>{profile.firstName} {profile.lastName}</b> ({calculateAge(profile.birthDate)} ετών)</h3>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "60%", marginTop: "2vh", marginBottom: "2vh" }}>
                                    <h6> <b style={{ textDecoration: "underline" }}>Περιγραφή:</b></h6>
                                    <textarea style={{ width: "100%", height: "100px", resize: "none", border: "1px solid black", backgroundColor: "#D9EAFD", padding: "10px", borderRadius: "10px" }}
                                    value={description} onChange={handleDescriptionChange} />
                                    <button className="btn btn-primary" 
                                        style={{ marginTop: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "10px", cursor: "pointer" }} 
                                        onClick={saveDescription}>
                                        Αποθήκευση
                                    </button>
                                </div>

                            </div>

                        </div>

                        <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", marginTop: "2vh" }}>
                            <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "row", textAlign: "center", marginTop: "1vh" }}>
                                <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                    <span style={{ fontSize: "20px" }}><b style={{textDecoration:"underline"}}>Συστατικές επιστολές</b></span>
                                    {profile.systatikes === 0 ? <h6 style={{marginTop:"2vh"}}>Δεν υπάρχουν επιστολές!</h6> : viewDummyMails()}
                                </div>
                            </div>

                            <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
                                <span style={{ fontSize: "20px" }}><b style={{textDecoration:"underline"}}>Αξιολογήσεις</b></span>
                                {ratings.length === 0 ? <h5 style={{marginTop:"4vh"}}>Δεν υπάρχουν αξιολογήσεις!</h5> : 
                                <Carousel data-bs-theme="dark" style={{ width: "20vw", height: "30vh", marginTop: "2vh" }}>
                                    {ratings.map((rating) => (
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