import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs.js";
import Loader from "../../../Components/Loader.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../config/firebase.js'

function MainSymbolaiaGoneisPGU() {
  const navigate = useNavigate();

  // Check if user is logged in, get the user's UUID and fetch user data
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [babysitters, setBabysitters] = useState([]);
  const[profile,setProfile] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (uuid) {
      console.log("Fetching user data for uuid:", uuid); // Log uuid to ensure it is set correctly
      fetchUserData();
    }
  }, [uuid]); // Runs when uuid changes
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const q = query(collection(FIREBASE_DB, "user"), where("userId", "==", uuid));
      const querySnapshot = await getDocs(q);
      const profiles = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  
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
                const rawEndDate = contract.endDate.trim();

                // Split the date string into day, month, and year
                const [day, month, year] = rawEndDate.split('/');
                const dateObj = new Date(`${year}-${month}-${day}`);  // Format it as YYYY-MM-DD for the native Date object

                if (isNaN(dateObj.getTime())) {
                  continue;  // Skip this contract if the date is invalid
                }

                const endDate = dayjs(dateObj);  // Convert back to Day.js object if needed

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
    try {
      const q = query(
        collection(FIREBASE_DB, 'ratings'),
        where('id_p', '==', uuid),
        where('id_b', '==', babysitterId)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const ratingDoc = querySnapshot.docs[0];
        return ratingDoc.id;
      }

      return null;
    } catch (error) {
      console.error('Error fetching rating:', error);
      return null;
    }
  };

  const [error, setError] = useState(null);

  const handleNewContract = (childBirthDate) => {
    // Split the birthdate string (DD/MM/YYYY) into day, month, and year
    const [day, month, year] = childBirthDate.split('/');

    // Create a new Date object using the parsed values
    const birthDate = new Date(year, month - 1, day);

    // Get the current date
    const currentDate = new Date();

    // Calculate the full years
    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();

    // Calculate the full months difference
    let ageMonths = currentDate.getMonth() - birthDate.getMonth();

    // If the child hasn't had their birthday yet this year, adjust the years and months
    if (ageMonths < 0 || (ageMonths === 0 && currentDate.getDate() < birthDate.getDate())) {
        ageYears--;
        ageMonths += 12; // Adjust months to be positive
    }

    // Calculate the fraction of the year completed
    const age = ageYears + ageMonths / 12;

    if (age.toFixed(2) < 0.5 || age.toFixed(2) > 2.5) {
      setError("Η ηλικία του παιδιού πρέπει να είναι μεταξύ 0.5 και 2.5 ετών.");
    } else {
      setError(null);
      navigate('/neo-symbolaio');
    }
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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα Συμφωνητικά μου</h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%",flexDirection:"column" }}>
            {/* Display error message if error exists */}
            {error && (
                <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
                    {error}
                </div>
            )}

            <button 
                style={{ height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}
                onClick={() => handleNewContract(profile.childBirthDate)} 
            >
                Δημιουργία νέου συμφωνητικού
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
