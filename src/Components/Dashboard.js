import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrump';
import Loader from './Loader';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Not allow entry to not logged in users/ redirect to login page
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
