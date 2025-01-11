import React, { useState,useEffect } from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';
import ProgressTracker from '../../../Components/ProgressTracker'; // Assuming you have this component
import { FIREBASE_AUTH,FIREBASE_DB } from '../../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { addDoc, setDoc } from 'firebase/firestore';
import Loader from '../../../Components/Loader';
import { useNavigate } from 'react-router-dom';

function PliromiEpaggelmatia() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [uuid, setUuid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [epaggelmatias, setEpaggelmatias] = useState([]);
    const [babysitterChoice, setBabysitterChoice] = useState('');
    const [selectedContract, setSelectedContract] = useState(null);
  
    // Get the logged-in user's UUID
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          setUuid(user.uid);
          console.log(uuid)
        }
      });
      return () => unsubscribe();
    }, []);
  
    // Fetch all completed contracts for the logged-in user
    useEffect(() => {
      if (uuid) {
        const fetchContracts = async () => {
          setLoading(true);
          try {
            const q = query(
              collection(FIREBASE_DB, 'contracts'),
              where('id_p', '==', uuid),
              where('status', '==', 'Ολοκληρώθηκε')
            );
            const querySnapshot = await getDocs(q);
            const contracts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setContracts(contracts);
            console.log(contracts)
          } catch (error) {
            console.error('Error fetching contracts:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchContracts();
      }
    }, [uuid]);
  
    useEffect(() => {
        if (contracts.length > 0) {
          const fetchBabysitters = async () => {
            try {
              // Extract babysitter IDs from contracts
              const babysitterIds = contracts.map((contract) => contract.id_b);
              console.log('Babysitter IDs:', babysitterIds);  // Log babysitter IDs
      
              // Ensure babysitterIds is not empty
              if (babysitterIds.length === 0) {
                console.log('No babysitter IDs found.');
                return;
              }
      
              // Fetch babysitters whose userId matches any id_b from the contracts
              const q = query(
                collection(FIREBASE_DB, 'user'),
                where('userId', 'in', babysitterIds)
              );
      
              const querySnapshot = await getDocs(q);
      
              // Check if query returned any documents
              if (querySnapshot.empty) {
                console.log('No babysitters found for these IDs.');
              } else {
                // Log each document's data
                querySnapshot.docs.forEach((doc) => {
                  console.log(doc.id, doc.data()); // Log each document's ID and fields
                });
      
                // Map the data to return the full user data, not just the name
                const babysitters = querySnapshot.docs.map((doc) => {
                  const data = doc.data();
                  return data;  // Return the entire user data
                });
      
                console.log('Fetched babysitters:', babysitters);  // Log the fetched babysitter data
                setEpaggelmatias(babysitters);
              }
            } catch (error) {
              console.error('Error fetching babysitters:', error);
            }
          };
      
          fetchBabysitters();
        }
      }, [contracts]);

      useEffect(() => {
        if (babysitterChoice) {
          const contractForBabysitter = contracts.find((contract) => contract.id_b === babysitterChoice);
          if (contractForBabysitter) {
            setSelectedContract(contractForBabysitter); // Store contract details
            console.log('Selected contract:', contractForBabysitter);
          }
        }
      }, [babysitterChoice, contracts]);
      

  // Steps definition
  const steps = [
    'Επιλογή επαγγελματία',
    'Eπιβεβαίωση χρόνου εργασίας',
    'Πληρωμή',
  ];

  // Handlers for step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentdId] = useState(null);
      // Submit contract
      const submitPayment = async () => {
        setIsSubmitting(true);
        try {
            setLoading(true);
            const contractData = {
                id_p: uuid,
                id_b: selectedContract.id_b,
                id_c: selectedContract.id,
                date: new Date().toLocaleDateString(),
            };

            const ratingsRef = collection(FIREBASE_DB, 'payments');
            const docRef = await addDoc(ratingsRef, contractData);

            const documentId = docRef.id;
            await setDoc(docRef, { id: documentId }, { merge: true });

            setPaymentdId(documentId); // Save contract ID
        } catch (error) {
            console.error('Error adding document:', error);
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 10%",
                flexDirection: "column",
            }}
        >
            
            <div
              style={{
                backgroundColor: "#ece7f2",
                borderRadius: "2%",
                padding: "2%",
                height: "20vh",
                textAlign: "center",
                marginBottom: "20px",width:"70%",alignContent:"center",textAlign:"center"
              }}
            >
              <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                <b>Επιλέξτε τον επαγγελματία που θέλετε να πληρώσετε</b>
              </h2>
              <select
                style={{ width: "50%", height: "30px" }}
                onChange={(e) => setBabysitterChoice(e.target.value)}
                value={babysitterChoice}
              >
                <option value="" disabled>Επιλέξτε νταντά</option>
                {epaggelmatias.map((babysitter) => (
                  <option key={babysitter.userId} value={babysitter.userId}>
                    {babysitter.firstName} {babysitter.lastName}
                  </option>
                ))}
              </select>
            </div>
            </div>
          );
      case 1:
        return ( <div style={{ textAlign: "center" }}>
            <div style={{display: "flex",flexDirection: "column",marginTop: "2%",backgroundColor: "#ece7f2",borderRadius: "2%",width: "60%",justifyContent: "center",marginLeft: "20%",padding: "2%",}}>
                <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                    <b>Πιστοποιήση ολοκλήρως εργασίας</b>
                </h2>
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div>
                        <b>Ημερομηνία έναρξης</b> {selectedContract.startDate}
                        </div>
                    </div>
                </h4>
                <hr />
                <h4 style={{ textAlign: "left", marginTop: "3%", marginLeft: "6%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div>
                            <b>Ημερομηνία λήξς</b> {selectedContract.endDate}
                        </div>
                        
                     </div>
                </h4>
                <hr />  
            </div>
        </div>);
      case 2:
        return (
            <div style={{ textAlign: "center" }}>
   
    {loading ? (
        <Loader />
    ) : paymentId ? (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
            <span> Ο επαγγελματίας πληρώθηκε και ο κωδικός πληρωμής είναι #{paymentId} .</span>
        </div>
    ) : (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
            <span>Υποβάλλετε το συμβόλαιο για να λάβετε τον κωδικό.</span>
        </div>
    )}
</div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ flex: 1 }}>
        <ProgressTracker steps={steps} activeStep={currentStep} />

        {renderStepContent()}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2%',
            gap: '50%',
            marginBottom: '10px',
          }}
        >
          {currentStep === 0 ? (
            // First step: Only "Επόμενο"
            <button
              style={{
                height: '3%',
                backgroundColor: '#2b8cbe',
                color: 'white',
                borderRadius: '5px',
                marginTop: '2%',
                width: '12%',
              }}
              onClick={goToNextStep}
            >
              Επόμενο
            </button>
          ) : currentStep === steps.length - 1 ? (
            // Last step: "Προηγούμενο" and "Επιστροφή"
            <>
              <button
                style={{
                  height: '3%',
                  backgroundColor: '#2b8cbe',
                  color: 'white',
                  borderRadius: '5px',
                  marginTop: '2%',
                  width: '12%',
                }}
                onClick={goToPreviousStep}
              >
                Προηγούμενο
              </button>

              <button
                style={{
                  height: '3%',
                  backgroundColor: '#2b8cbe',
                  color: 'white',
                  borderRadius: '5px',
                  marginTop: '2%',
                  width: '12%',
                }}
                onClick={() => {
                    navigate('/goneis/symbolaia/pliromes');  
                    console.log('Επιστροφή');
                  }}
              >
                Επιστροφή
              </button>
            </>
          ) : (
            // Middle steps: "Προηγούμενο" and "Επόμενο"
            <>
              <button
                style={{
                  height: '3%',
                  backgroundColor: '#2b8cbe',
                  color: 'white',
                  borderRadius: '5px',
                  marginTop: '2%',
                  width: '12%',
                }}
                onClick={goToPreviousStep}
              >
                Προηγούμενο
              </button>

              <button
                style={{
                  height: '3%',
                  backgroundColor: '#2b8cbe',
                  color: 'white',
                  borderRadius: '5px',
                  marginTop: '2%',
                  width: '12%',
                }}
                onClick={() => {
                    // Handle submission action here
                    submitPayment();
                    goToNextStep();
                }}

              >
                Πληρωμή
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PliromiEpaggelmatia;
