import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs.js";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Loader from "../../../Components/Loader.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import ReplayIcon from '@mui/icons-material/Replay';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase.js'
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";

function MainSymbolaiaGoneisPGU() {
  const navigate = useNavigate();

  // Check if user is logged in, get the user's UUID and fetch user data
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [babysitters, setBabysitters] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch the job posts' data
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    if (uuid) {
      const fetchPosts = async () => {
        try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, 'contracts'), where('id_p', '==', uuid));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const today = dayjs();
          for (const contract of posts) {
            const endDate = dayjs(contract.endDate, "MM/DD/YYYY"); 
            if (endDate.isBefore(today) && contract.status === "Σε ισχύ") {
              // Update contract status in Firestore
              const contractDoc = doc(FIREBASE_DB, "contracts", contract.id);
              await updateDoc(contractDoc, { status: "Ολοκληρώθηκε" });

              // Update the local state
              contract.status = "Ολοκληρώθηκε";
            }
          }
            setContracts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        finally {
          setLoading(false);
        }
      };
      fetchPosts(); // Fetch posts when component mounts
    }
  }, [uuid]); // Runs when UUID changes

  // Fetch babysitter data
  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const babysitterRef = collection(FIREBASE_DB, 'user');
        const querySnapshot = await getDocs(query(babysitterRef, where("property", "==", "babysitter")));
        const babysitterData = querySnapshot.docs.map(doc => ({
          userId: doc.id,
          ...doc.data(),
        }));
        setBabysitters(babysitterData);
      } catch (error) {
        console.error("Error fetching babysitters:", error);
      }
    };

    fetchBabysitters();
  }, []);

  // Find the babysitter's full name based on their ID
  const findProfessionalName = (babysitterId) => {
    const babysitter = babysitters.find(b => b.userId === babysitterId);
    return babysitter ? `${babysitter.firstName} ${babysitter.lastName}` : "Άγνωστο";
  };

  const findReviewId = async (babysitterId) => {
    console.log("Fetching rating for:", { uuid, babysitterId }); // Debug log
  
    try {
      const q = query(
        collection(FIREBASE_DB, 'ratings'),
        where('id_p', '==', uuid),
        where('id_b', '==', babysitterId)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const ratingDoc = querySnapshot.docs[0];
        console.log("Rating found:", ratingDoc.id); // Debug log
        return ratingDoc.id;
      }
  
      console.log("No rating found");
      return null;
    } catch (error) {
      console.error('Error fetching rating:', error);
      return null;
    }
  };
  


  const handleNewContract = () => {
    navigate('/neo-symbolaio');
  };

  const handleRedirect = (contractId) => {
    navigate(`provoli/${contractId}`); 
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column" }}>

          <div style={{ flex: 1 }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα συμβόλαια μου</h2>
              <Tooltip title={
                <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection: "column" }}>
                  <div><VisibilityIcon style={{ cursor: "pointer" }} onClick={()=> handleRedirect(contracts.id)} />: προβολή συμβολαίου</div>
                  <div><DeleteForeverIcon style={{ cursor: "pointer",color:"black" }} />: διαγραφή συμβολαίου</div>
                  <div><ReplayIcon
                        style={{ cursor: "pointer", marginLeft: "10px" }}/>:Ανανέωση συμβολαίου</div>
                </div>
              } placement="top" style={{ marginTop: "3%" }}>
                <Button> <InfoIcon /> </Button>
              </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>  
                <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white",
                    borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}
                    onClick={handleNewContract}>
                    Δημιουργία νέου συμβολαίου
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "70%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                <thead style={{ lineHeight: "2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Περίοδος Συμβολαίου</th>
                    <th>Ονοματεπώνυμο babysitter</th>
                    <th>Κατάσταση συμβολαίου</th>
                    <th>Αξιολόγηση</th>
                    <th>Συμβόλαιο</th>
                  </tr>
                </thead>
                <tbody>
                    { contracts.map((contract) => (
                        <tr>
                            <td>{contract.startDate} - {contract.endDate}</td>
                            <td>{findProfessionalName(contract.id_b)}</td>
                            <td style={{
                              color: contract.status === "Σε ισχύ" ? "green" :
                                     contract.status === "Σε αναμονή" ? "#f28c28" : 
                                     contract.status === "Απορρίφθηκε" ? "red" : "black"
                                     
                             }}>
                                {contract.status}
                            </td>
                            <td>
                            {(contract.status === "Σε ισχύ" || contract.status === "Ολοκληρώθηκε") &&
                              <span 
                                style={{ cursor: "pointer", textDecoration: "underline" }} 
                                onClick={async () => {
                                  const ratingId = await findReviewId(contract.id_b);
                                  if (ratingId) {
                                    navigate(`/ratings/previewAksiologisi?id=${ratingId}`);
                                  } 
                                }}
                              >
                                Προβολή
                              </span>
                            }
                            </td>
                            <td>
                              <span 
                                style={{ cursor: "pointer", textDecoration: "underline"}} 
                                onClick={() => handleRedirect(contract.id)}
                              >
                                Προβολή
                              </span>
                            </td>
                        </tr>
                    ))}
                    {contracts.length === 0 && (
                      <tr>
                        <td colSpan={4}>Δεν υπάρχουν συμβόλαια</td>
                      </tr>
                    )}
                </tbody>
              </table>

            </div>

          </div>

        </div>

      </div>

      <div>
        <Footer />
      </div>

    </div>
  );
}

export default MainSymbolaiaGoneisPGU;
