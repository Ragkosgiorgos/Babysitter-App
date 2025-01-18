import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Loader from './Loader';
import PageCard from './PageCard';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const [uuid, setUuid] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, []);
    
    const [user, setUser] = useState({});
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
                }
                finally {
                    setLoading(false);
                }
            };
        
            fetchUserData();
        } else {
            setUser(null);
        }
    }, [uuid]);

    const handleUnsubscribe = () => {
        const handleLogout = async () => {
            try {
                setLoading(true);
                await signOut(FIREBASE_AUTH);
                navigate('/');
            } catch (error) {
                console.error('Error logging out:', error);
            } finally {
                setLoading(false);
            }
        };

        handleLogout();
        navigate('/');
        window.location.reload();
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
            <div>
                <Header />

                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div style={{ flex: 1}}>

                        <Breadcrumbs />

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", marginTop: "7vh" }}>
                            <span style={{ fontSize: "2rem", fontWeight: "bold" }}> {user?.firstName} {user?.lastName} </span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10vh" }}>
                            <PageCard title="Προφίλ" url="/dashboard/profiles" />

                            { user?.property === 'babysitter' ?
                                <div>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "3vh" }}>
                                        <PageCard title="Το Βιογραφικό μου" url="/dashboard/viografiko" />
                                        <PageCard title="Οι Αγγελίες μου" url="/dashboard/aggelies" />
                                        <PageCard title="Τα Ραντεβού μου" url="/epaggelmaties/rantevou" />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "3vh"}}>
                                        <PageCard title="Τα Συμφωνητικά μου" url="/epaggelmaties/symbolaia" />
                                        <PageCard title="Οι Αξιολογήσεις μου" url="/ratings" />
                                        <PageCard title="Οι Πληρωμές μου" url="/epaggelmaties/pliromes" />
                                    </div>
                                </div>

                                : 
                                <div>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "3vh" }}>
                                        <PageCard title="Τα Ραντεβού μου" url="/epaggelmaties/rantevou" />
                                        <PageCard title="Αναζήτηση" url="/anazitisi" onClick={() => navigate('/anazitisi', { state: { area: "", age: "" } })} />
                                        <PageCard title="Αιτήσεις Ενδιαφέροντος" url="/goneis/profile/aitiseis-endiaferontos" />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "3vh"}}>
                                        <PageCard title="Τα Συμφωνητικά μου" url="/goneis/symbolaia" />
                                        <PageCard title="Οι Πληρωμές μου" url="/goneis/symbolaia/pliromes" />
                                        <PageCard title="Οι Αξιολογήσεις μου" url="/ratings" />
                                    </div>
                                </div>
                            }
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "15vh" }}>
                            <button 
                                onClick={handleUnsubscribe} 
                                style={{ padding: "10px 20px", fontSize: "1.5rem", fontWeight: "bold", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Αποσύνδεση
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
};

export default Dashboard;
