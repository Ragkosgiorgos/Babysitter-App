import React, { useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import { useState } from "react";

function ViewJobPost() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({});
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        fetch("/data/aggelies.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            const post = posts.find((post) => post.id === id);
            setPost(post);
        }
    }, [posts, id]);

    useEffect(() => {
        fetch("/data/ntantades.json")
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setProfiles(data);
            })
            .catch((error) => {
                console.error("Error fetching JSON:", error);
            });
    }, []);

    useEffect(() => {
        if (profiles.length > 0 && post && post.uid) {
            const profile = profiles.find((profile) => profile.uid === post.uid);
            setProfile(profile);
        }
    }, [profiles, post]);

    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          age--;
        }
        return age;
    };

    if (!profile || !post) {
        //? Error frame
        return null;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header log="not_connected" />
    
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", flex: 1, justifyContent: "center", marginTop: "5vh" }}>
                <div style={{ display: "flex", flex: 1, marginLeft: "5%",   borderRadius: "2vh" }}>
                    <img src={profile.img} className="d-inline-block align-top" alt="" width={"200vw"} height={"200vh"} style={{ marginTop: "3vh" }} />
                </div>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", marginRight: "20%" }}>
                    <h2><b>{profile.name} {profile.surname}</b> ({calculateAge(profile.birthDate)})</h2>
                    <h4>{post.description}</h4>
                </div>
            </div>
    
            <Footer />
    
            </div>
  
        </div>
    );
}

export default ViewJobPost;
