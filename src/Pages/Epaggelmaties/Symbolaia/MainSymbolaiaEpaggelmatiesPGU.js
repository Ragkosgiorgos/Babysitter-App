import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
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
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";


function MainSymbolaiaEpaggelmatiesPGU() {
  const navigate = useNavigate();
  
  const [contracts, setContracts] = useState([]);
  const [parents, setParents] = useState([]);
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

          const today = dayjs();
          for (const contract of fetchedContracts) {
            const rawEndDate = contract.endDate.trim()

            const [day, month, year] = rawEndDate.split('/');
                const dateObj = new Date(`${year}-${month}-${day}`);

                if (isNaN(dateObj.getTime())) {
                  console.error(`Invalid end date for contract ${contract.id}: ${rawEndDate}`);
                  continue;  // Skip this contract if the date is invalid
                }

                const endDate = dayjs(dateObj);

            if (endDate.isBefore(today) && contract.status === "Σε ισχύ") {
              // Update contract status in Firestore
              const contractDoc = doc(FIREBASE_DB, "contracts", contract.id);
              await updateDoc(contractDoc, { status: "Ολοκληρώθηκε" });

              // Update the local state
              contract.status = "Ολοκληρώθηκε";
            }
          }

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

    const fetchParents = async () => {
      try {
        setLoading(true);
        const parentsRef = collection(FIREBASE_DB, 'user');
        const querySnapshot = await getDocs(parentsRef, where("property", "==", "parent"));
        const fetchedParents = querySnapshot.docs.map(doc => ({
          userId: doc.id,
          ...doc.data()
        }));
        setParents(fetchedParents);
      } catch (error) {
        console.error("Error fetching parents: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchParents();
  }, []);

  const findParentName = (parentId) => {
    const parent = parents.find(parent => parent.userId === parentId);
    return parent ? parent.firstName + " " + parent.lastName : "Άγνωστο";
  };

  const handleRedirect = (contractId) => {
    navigate(`apantisi/${contractId}`); 
  };

  const handleRedirectView = (contractId) => {
    navigate(`/epaggelmaties/symbolaia/provoli/${contractId}`); 
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

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                <Loader />
              ) : (
                <table style={{ width: "70%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                  <thead style={{ lineHeight: "2em" }}>
                    <tr style={{ borderBottom: "2px solid #333" }}>
                      <th>Περίοδος Συμβολαίου</th>
                      <th>Ονοματεπώνυμο κηδεμόνα</th>
                      <th>Κατάσταση συμβολαίου</th>
                      <th>Ενέργειες</th>
                      <></>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 ? (
                      <tr><td colSpan="3">Δεν υπάρχουν συμβόλαια.</td></tr>
                    ) : (
                      contracts.map((contract, index) => (
                        <tr key={contract.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2.5em" }}>
                          <td>{contract.startDate} - {contract.endDate}</td>
                          <td>{findParentName(contract.id_p)}</td>
                          <td style={{
                            color: contract.status === "Σε ισχύ" ? "green" :
                                   contract.status === "Σε αναμονή" ? "#f28c28" : 
                                   contract.status === "Απορρίφθηκε" ? "red" : "black"
                           }}>
                              {contract.status}
                          </td>
                
                          <td style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "0.5em", gap: "10px" }}>
                            {contract.status === "Σε αναμονή" ? (
                              <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleRedirect(contract.id)}>
                                Απάντηση
                              </span>
                            ) : (
                              <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleRedirectView(contract.id)}>
                                Προβολή
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}{contracts.length === 0 && (
                      <tr>
                        <td colSpan={3}>Δεν υπάρχουν συμβόλαια</td>
                      </tr>
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
