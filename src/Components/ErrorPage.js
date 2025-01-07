import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
    const navigate = useNavigate();

    const handleExit = () => {
        navigate("/");
    };

    return (
        <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
            <Header />

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#F8D7DA", flex: 1, padding: "20px" }}>
                
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
                    <img 
                        src="images/baby_crying.png"
                        alt="Crying child" 
                        style={{
                            width: "500px",
                            height: "auto",
                        }} 
                    />
                </div>

                {/* Text below the image */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ fontSize: "3em", color: "#721C24", fontWeight: "bold" }}>Ουπς! Κάτι πήγε στραβά...</h1>
                        <p style={{ fontSize: "1.5em", color: "#721C24" }}>Φαίνεται πως χάθηκες στη σελίδα μας. Μην ανησυχείς, συμβαίνει και στους καλύτερους από εμάς.</p>
                    </div>
                    <div>
                        <button
                            style={{ fontSize: "1.2em", backgroundColor: "#28a745", color: "white", padding: "10px 20px", borderRadius: "5px",
                                     border: "none", cursor: "pointer", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", marginTop: "30px" }}
                            onClick={handleExit}
                        >
                            Πήγαινέ με πίσω στην αρχική σελίδα
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ErrorPage;
