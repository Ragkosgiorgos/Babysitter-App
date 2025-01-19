import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import Loader from "../../../Components/Loader";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../config/firebase";
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
    navigate(`/dashboard/Symfwnitika/apantisi/${contractId}`); 
  };

  const handleRedirectView = (contractId) => {
    navigate(`/dashboard/Symfwnitika/provoli/${contractId}`); 
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
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Τα Συμφωνητικά μου</h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              {loading ? (
                <Loader />
              ) : (
                <table style={{ width: "70%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", tableLayout: "fixed" }}>
                  <thead style={{ lineHeight: "1.2em" }}>
                    <tr style={{ borderBottom: "2px solid #333" }}>
                      <th style={{ padding: "10px" }}>Περίοδος Συμβολαίου</th>
                      <th style={{ padding: "10px" }}>Ονοματεπώνυμο κηδεμόνα</th>
                      <th style={{ padding: "10px" }}>Κατάσταση συμβολαίου</th>
                      <th style={{ padding: "10px" }}>Ενέργειες</th>
                      <></>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 ? (
                      <tr><td colSpan="4">Δεν υπάρχουν συμβόλαια.</td></tr>
                    ) : (
                      contracts.map((contract, index) => (
                        <tr key={contract.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2em" }}>
                          <td style={{ padding: "10px" }}>{contract.startDate} - {contract.endDate}</td>
                          <td style={{ padding: "10px" }}>{findParentName(contract.id_p)}</td>
                          <td style={{
                            padding: "10px",color: contract.status === "Σε ισχύ" ? "green" :
                                   contract.status === "Σε αναμονή" ? "#f28c28" : 
                                   contract.status === "Απορρίφθηκε" ? "red" : "black"
                           }}>
                              {contract.status}
                          </td>
                
                          <td style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "0.5em", gap: "10px" }}>
                            {contract.status === "Σε αναμονή" ? (
                              <span style={{ cursor: "pointer", textDecoration: "underline",padding: "10px" }} onClick={() => handleRedirect(contract.id)}>
                                Απάντηση
                              </span>
                            ) : (
                              <span style={{ cursor: "pointer", textDecoration: "underline",padding: "10px" }} onClick={() => handleRedirectView(contract.id)}>
                                Προβολή
                              </span>
                            )}
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
