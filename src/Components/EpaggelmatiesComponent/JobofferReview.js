import React, { useState, useEffect } from "react";
import Loader from "./../Loader";
import { useNavigate } from "react-router-dom";
import { TruncatedText, capitalizeWords } from "../../Utils/Methods/index";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebase";

function JobofferReview(props) {
    const navigate = useNavigate();
    const job_id = props.id;

    const [loading, setLoading] = useState(true);
    const [aggelia, setAggelia] = useState({});
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const q = query(collection(FIREBASE_DB, 'aggelies'), where('id', '==', job_id));
                const querySnapshot = await getDocs(q);
                const posts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAggelia(posts[0]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    } , [job_id]);

    const handleSearchRedirect = () => {
        navigate(`/anazitisi/viewPost?id=${job_id}`);
    };

    if (loading) {
        return <Loader />;
    }

    if (!aggelia && !loading) {
        navigate("/404");
    }

    return (
        <div
        style={{
            border: "1px solid black",
            borderRadius: "15px",
            margin: "10px",
            padding: "10px",
            width: "20%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "300px",
        }}
        >
        <div>
            <span style={{ marginLeft: "4%" }}>
            <b>Περιοχή:</b> {capitalizeWords(aggelia.area)}
            </span>
            <div
            style={{
                borderBottom: "1px solid #000",
                marginTop: "10px",
            }}
            ></div>
            <span
            style={{
                marginLeft: "4%",
                marginTop: "5%",
            }}
            >
            {TruncatedText(aggelia.description || "")}
            </span>
        </div>
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            }}
        >
            
            <button style={{ borderRadius: "10px", width: "60%" }} onClick={handleSearchRedirect}>
                <span>Δείτε την αγγελία</span>
            </button>
        </div>
        </div>
    );
}

export default JobofferReview;
