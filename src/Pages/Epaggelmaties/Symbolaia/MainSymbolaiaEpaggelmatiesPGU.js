import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Loader from "../../../Components/Loader";
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";

function MainSymbolaiaEpaggelmatiesPGU() {
  const navigate = useNavigate();
  
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);

        // Get the current user
        onAuthStateChanged(FIREBASE_AUTH, async (user) => {
          if (user) {
            // Fetch contracts related to the logged-in babysitter
            const contractsRef = collection(FIREBASE_DB, 'contracts');
            const q = query(contractsRef, where("id_b", "==", user.uid)); // Filter contracts by babysitter's user ID
            const querySnapshot = await getDocs(q);

            const fetchedContracts = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setContracts(fetchedContracts); // Update state with the fetched contracts
          }
        });
      } catch (error) {
        console.error("Error fetching contracts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleRedirect = (contractId) => {
    navigate(`apantisi/${contractId}`); 
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
                  <div><VisibilityIcon style={{ cursor: "pointer" }} />: προβολή συμβολαίου</div>
                  <div><DeleteForeverIcon style={{ cursor: "pointer" }} />: διαγραφή συμβολαίου</div>
                  <div><ArrowForwardIcon style={{cursor: "pointer" }}/>Απάντηση συμβολαίου</div>
                </div>
              } placement="top" style={{ marginTop: "3%" }}>
                <Button> <InfoIcon /> </Button>
              </Tooltip>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              {loading ? (
                <p>Loading contracts...</p> // Loading indicator
              ) : (
                <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                  <thead style={{ lineHeight: "2em" }}>
                    <tr style={{ borderBottom: "2px solid #333" }}>
                      <th>Κωδικός συμβολαίου</th>
                      <th>Ονοματεπώνυμο κηδεμόνα</th>
                      <th>Κατάσταση συμβολαίου</th>
                      <></>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 ? (
                      <tr><td colSpan="3">Δεν υπάρχουν συμβόλαια.</td></tr>
                    ) : (
                      contracts.map((contract) => (
                        <tr key={contract.id}>
                          <td>{contract.id}</td>
                          <td>{contract.id_p}</td> {/* Assuming "id_p" is the guardian's name */}
                          <td>
                            {contract.status} 
                            {
                              contract.status === "Σε αναμονή" ? (
                                <ArrowForwardIcon
                                  style={{ cursor: "pointer", marginLeft: "50px" }} 
                                  onClick={() => handleRedirect(contract.id)} 
                                />
                              ) : (
                                <VisibilityIcon
                                  style={{ cursor: "pointer", marginLeft: "50px" }} 
                                  onClick={() => handleRedirect(contract.id)} 
                                />
                              )
                            }
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
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

export default MainSymbolaiaEpaggelmatiesPGU;
