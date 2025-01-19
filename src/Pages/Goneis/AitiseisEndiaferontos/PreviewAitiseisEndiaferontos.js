import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../config/firebase";

function PreviewAitiseisEndiaferontosPGU(props) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [user, setUser] = useState({});
  const [aitisi, setAitisi] = useState({});

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!uuid) return;
      try {
        setLoading(true);
        const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUser(users[0] || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uuid]);

  // Fetch application data
  useEffect(() => {
    const fetchAitiseisData = async () => {
      if (!uuid || !id) return;
      try {
        setLoading(true);
        const q = query(
          collection(FIREBASE_DB, "aitiseis_endiaferontos"),
          where("id", "==", id),
          where("UserId", "==", uuid)
        );
        const querySnapshot = await getDocs(q);
        const aitiseis = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAitisi(aitiseis[0] || {});
      } catch (error) {
        console.error("Error fetching application data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAitiseisData();
  }, [uuid, id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Breadcrumbs />
        <div style={{ textAlign: "center", marginTop: "1%" }}>
          <h2>Η αίτησή σας δημοσιεύτηκε με επιτυχία!</h2>
          <h4>Μπορείτε να δείτε την αίτησή σας στην κατηγορία <a href="/goneis/profile/aitiseis-endiaferontos"> "Οι αιτήσεις ενδιαφέροντός μου" </a></h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "2%",
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ece7f2",
                borderRadius: "2%",
                justifyContent: "center",
                padding: "2%",
              }}
            >
              <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
                <b> Τα προσωπικά σας στοιχεία </b>
              </h2>
              <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                <b>Όνομα:</b> {user.firstName}
              </h4>
              <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }} />
              <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                <b>Επίθετο:</b> {user.lastName}
              </h4>
              <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }} />
              <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                <b>Αριθμός κινητού τηλεφώνου:</b> {user.phone}
              </h4>
              <hr style={{ width: "100%", marginTop: "0%", marginBottom: "0%" }} />
              <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                <b>Email:</b> {user.email}
              </h4>
            </div>
          </div>
          
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ece7f2",
              borderRadius: "2%",
              width: "60%",
              justifyContent: "center",
              marginLeft: "20%",
              padding: "2%",
            }}
          >
            <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
              <b>Τα στοιχεία της αίτησης</b>
            </h2>
            <h5 style={{ fontWeight: "bold", marginTop: "3%" }}> Μήνυμα </h5>
            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
              {aitisi.description}
            </div>
            <h5 style={{ fontWeight: "bold" }}> Ημερομηνία και ώρα συνάντησης </h5>
            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
              {aitisi.date}
            </div>
            <h5 style={{ fontWeight: "bold" }}> Ημερομηνία γέννησης παιδιού </h5>
            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
              {user.childBirthDate}
            </div>
            <h5 style={{ fontWeight: "bold" }}> Φύλο παιδιού </h5>
            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
              {aitisi.gender}
            </div>
            <h5 style={{ fontWeight: "bold" }}> Επιθυμητός τρόπος επικοινωνίας </h5>
            <div style={{ display: "flex", flexDirection: "row", gap: "5%", marginLeft: "5%", marginBottom: "5%" }}>
              {aitisi.tropos_synantisis}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
            gap: "40%",
          }}
        >
          <button
            style={{
              height: "5%",
              backgroundColor: "#2b8cbe",
              color: "white",
              borderRadius: "5%",
              width: "12%",
              cursor: "pointer",
              border: "1px solid #333",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
              marginLeft: "70%",
            }}
            onClick={() => navigate(`/goneis/profile/aitiseis-endiaferontos`)}
          >
            Επιστροφή
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PreviewAitiseisEndiaferontosPGU;
