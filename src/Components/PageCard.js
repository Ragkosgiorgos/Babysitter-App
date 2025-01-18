import React from "react";
import { useNavigate } from "react-router-dom";

const PageCard = ({ title, url }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (title === "Αναζήτηση") {
            navigate('/anazitisi', { state: { area: "", age: "" } });
        } else {
            window.location.href = url;
        }
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#007bc1", width: "24%", 
                borderRadius: "10px", margin: "auto", boxShadow: "0 0 10px rgba(0,0,0,0.1)", cursor: "pointer", height: "7vh", fontSize: "20px", fontWeight: "bold", position: "relative" }}
            onClick={handleRedirect}
        >
            <span
                style={{ cursor: "pointer", color: "white", fontWeight: "bold", transition: "color 0.3s, font-size 0.3s" }}
                onMouseEnter={(e) => { e.target.style.color = "black"; e.target.style.fontSize = "25px"; }}
                onMouseLeave={(e) => { e.target.style.color = "white"; e.target.style.fontSize = "20px"; }}
            >
                {title}
            </span>
        </div>
    );
}

export default PageCard;
