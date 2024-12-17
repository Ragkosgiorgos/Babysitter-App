import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function JobofferReview(props) {
    const job_id = props.id;

    const [aggelies, setAggelies] = useState([]);
    const [aggelia, setAggelia] = useState({});

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

    const navigate = useNavigate();
    const handleSearchRedirect = () => {
        navigate(`/goneis/anazitisi/${job_id}`);
    }

    useEffect(() => {
        fetch("/data/aggelies.json")
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAggelies(data);
        })
        .catch((error) => {
            console.error("Error fetching JSON:", error);
        });
    }, []);

    useEffect(() => {
        if (aggelies.length > 0) {
        const aggelia = aggelies.find((aggelia) => aggelia.id === job_id);
        setAggelia(aggelia || {});
        }
    }, [aggelies, job_id]);

    return (
        <div
        style={{
            border: "1px solid black",
            borderRadius: "15px",
            margin: "10px",
            padding: "10px",
            width: "23%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "300px",
        }}
        >
        <div>
            <span style={{ marginLeft: "4%" }}>
            <b>Περιοχή:</b> {aggelia.area}
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
            {TruncatedText({ text: aggelia.description || "" })}
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
