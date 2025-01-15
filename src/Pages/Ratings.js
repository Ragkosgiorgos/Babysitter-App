import React, { useState, useEffect } from 'react';
import GonRatingMain from './Goneis/Ratings/GonRatingMain';
import EpaggRatingMain from './Epaggelmaties/Ratings/EpaggRatingMain';
import Loader from '../Components/Loader';
import { useNavigate } from 'react-router-dom';
import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Ratings() {
    const navigate = useNavigate();

    // Fetch the user's data from the database (babysitter)
    const [uuid, setUuid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUuid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    useEffect(() => {
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
            const querySnapshot = await getDocs(q);
            const profiles = querySnapshot.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data(),
            }));
            setProfile(profiles[0]);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }

    fetchUserData();
    }, [uuid]);

    if (loading) {
        return <Loader />;
    }

    if (!profile) {
        navigate('/login'); 
    }

    return (
        <div>
            {
            profile?.property === 'babysitter' ?
            <EpaggRatingMain />
            : <GonRatingMain />
            }
        </div>
    );
}

export default Ratings;
