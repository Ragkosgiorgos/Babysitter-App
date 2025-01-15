import React from "react";

const PageCard = ({ title, url }) => {
    const handleRedirect = () => {
        window.location.href = url;
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#007bc1", width: "25%", 
                borderRadius: "10px", margin: "auto", boxShadow: "0 0 10px rgba(0,0,0,0.1)", cursor: "pointer", height: "7vh", fontSize: "30px", fontWeight: "bold", position: "relative" }}
            onClick={handleRedirect}
        >
            <span
                style={{ cursor: "pointer", color: "white", fontWeight: "bold", transition: "color 0.3s, font-size 0.3s" }}
                onMouseEnter={(e) => { e.target.style.color = "black"; e.target.style.fontSize = "35px"; }}
                onMouseLeave={(e) => { e.target.style.color = "white"; e.target.style.fontSize = "30px"; }}
            >
                {title}
            </span>
        </div>
    );
}

export default PageCard;
