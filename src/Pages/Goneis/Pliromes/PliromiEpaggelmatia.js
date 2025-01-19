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
import { updateDoc,doc } from 'firebase/firestore';

function PliromiEpaggelmatia() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [epaggelmatias, setEpaggelmatias] = useState([]);
  const [babysitterChoice, setBabysitterChoice] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);


  // Get the logged-in user's UUID
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
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
                      where('status', '==', 'Σε ισχύ')
                  );
                  const querySnapshot = await getDocs(q);
                  const contracts = querySnapshot.docs.map((doc) => ({
                      id: doc.id,
                      ...doc.data(),
                  }));
                  setContracts(contracts);
              } catch (error) {
                  console.error('Error fetching contracts:', error);
              } finally {
                  setLoading(false);
              }
          };
          fetchContracts();
      }
  }, [uuid]);

  // Fetch babysitters related to the contracts
  useEffect(() => {
      if (contracts.length > 0) {
          const fetchBabysitters = async () => {
              try {
                  const babysitterIds = contracts.map((contract) => contract.id_b);

                  if (babysitterIds.length === 0) return;

                  const q = query(
                      collection(FIREBASE_DB, 'user'),
                      where('userId', 'in', babysitterIds)
                  );

                  const querySnapshot = await getDocs(q);
                  const babysitters = querySnapshot.docs.map((doc) => doc.data());
                  setEpaggelmatias(babysitters);
              } catch (error) {
                  console.error('Error fetching babysitters:', error);
              }
          };
          fetchBabysitters();
      }
  }, [contracts]);

  // Set the selected contract based on babysitter choice
  useEffect(() => {
      if (babysitterChoice) {
          const contractForBabysitter = contracts.find(
              (contract) => contract.id_b === babysitterChoice
          );
          if (contractForBabysitter) {
              setSelectedContract(contractForBabysitter);
          }
      }
  }, [babysitterChoice, contracts]);

  // Fetch all payments for the selected babysitter
  useEffect(() => {
      if (uuid && babysitterChoice) {
          const fetchPayments = async () => {
              setLoading(true);
              try {
                  const q = query(
                      collection(FIREBASE_DB, 'payments'),
                      where('id_p', '==', uuid),
                      where('id_b', '==', babysitterChoice),
                      where('Paid','==','False'),
                  );
                  const querySnapshot = await getDocs(q);
                  const paymentsList = querySnapshot.docs.map((doc) => ({
                      id: doc.id,
                      ...doc.data(),
                  }));
                  setPayments(paymentsList);
              } catch (error) {
                  console.error('Error fetching payments:', error);
              } finally {
                  setLoading(false);
              }
          };
          fetchPayments();
      }
  }, [uuid, babysitterChoice]);

  const handlePayment = async () => {
    if (!selectedPayment) return;

    // Set loading state to true while updating payment
    setLoading(true);
    setIsSubmitting(true)

    try {
        // Get the payment document reference
        const paymentDocRef = doc(FIREBASE_DB, 'payments', selectedPayment);

        // Update the payment status to "True"
        await updateDoc(paymentDocRef, {
            Paid: "True",  // Update the Paid field to "True"
        });

        // Fetch updated payments to reflect the changes
        const fetchPayments = async () => {
            try {
                const q = query(
                    collection(FIREBASE_DB, 'payments'),
                    where('id_p', '==', uuid),
                    where('id_b', '==', babysitterChoice),
                    where('Paid', '==', 'False')
                );
                const querySnapshot = await getDocs(q);
                const paymentsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPayments(paymentsList);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        // Refresh the payments list
        fetchPayments();

    } catch (error) {
        console.error('Error updating payment status:', error);
    } finally {
        setLoading(false);  // Set loading to false after the operation is complete
        setIsSubmitting(false)
    }
};

  // Steps definition
  const steps = [
      'Επιλογή babysitter',
      'Eπιβεβαίωση χρόνου εργασίας',
      'Πληρωμή',
  ];

  const goToNextStep = () => {
    if (currentStep === 0) {
      // Validate babysitter selection in step 0
      if (!babysitterChoice) {
        setIsSubmitting(true);  // Show error message if no babysitter is selected
      } else {
        setIsSubmitting(false);  // Clear error message if babysitter is selected
        setCurrentStep(currentStep + 1);  // Move to step 1
      }
    } else if (currentStep === 1) {
      // Validate payment selection in step 1
      if (!selectedPayment) {
        setIsSubmitting(true);  // Show error message if no payment is selected
      } else {
        setIsSubmitting(false);  // Clear error message if payment is selected
        setCurrentStep(currentStep + 1);  // Move to step 2
      }
    }
  };
  
  
  
  
  

  const goToPreviousStep = () => {
      if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
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
                <b>Επιλέξτε τον babysitter που θέλετε να πληρώσετε</b>
              </h2>
              <div>
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
              {!babysitterChoice && isSubmitting&&(
                <p style={{ color: "red",textAlign:"center" }}>
                    Παρακαλώ επιλέξτε babysitter
                </p>
            )}
              </div>
            </div>
            </div>
          );
          case 1:
            return (
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "2%",
                        backgroundColor: "#ece7f2",
                        borderRadius: "2%",
                        width: "60%",
                        justifyContent: "center",
                        marginLeft: "20%",
                        padding: "2%",
                    }}>
                        <h2 style={{ textAlign: "left", textDecoration: "underline" }}>
                            <b>Πληρωμές</b>
                        </h2>
                        <div>
                        {loading ? (
                            <p>Φόρτωση πληρωμών...</p>
                        ) : payments.length > 0 ? (
                            <select
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    marginTop: "10px",
                                }}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                            >
                                <option value="">Επιλέξτε πληρωμή</option>
                                {payments
                                    .filter(payment => {
                                        // Parse the endPeriod (DD/MM/YYYY) into a valid Date object
                                        const endDate = payment.endPeriod.split('/');
                                        const endDateObj = new Date(`${endDate[2]}-${endDate[1]}-${endDate[0]}`);
                                        return endDateObj < new Date();  // Compare the parsed date with the current date
                                    })
                                    .map((payment) => (
                                        <option key={payment.id} value={payment.id}>
                                            Περίοδος: {payment.startPeriod} - {payment.endPeriod}
                                        </option>
                                    ))}
                            </select>
                        ) : (
                            <p>Δεν βρέθηκαν πληρωμές για τον επιλεγμένο babysitter.</p>
                        )}
                        {!selectedPayment && isSubmitting &&(
                          <p style={{ color: "red",textAlign:"center" }}>
                              Παρακαλώ επιλέξτε περίοδο πληρωμής
                          </p>
                      )}
                        </div>
                    </div>
                </div>
            );
        
        
      case 2:
        return (
            <div style={{ textAlign: "center" }}>
   
    {loading ? (
        <Loader />
    ) : selectedPayment ? (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
            <span> Ο babysitter πληρώθηκε και ο κωδικός πληρωμής είναι #{selectedPayment} .</span>
        </div>
    ) : (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "2%", backgroundColor: "#ece7f2", borderRadius: "2%", width: "60%", justifyContent: "center", marginLeft: "20%", padding: "2%" }}>
            <span>Υποβάλλετε το συμφωνητικό για να λάβετε τον κωδικό.</span>
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
              onClick={() => {
                window.history.back();
            }}
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
              onClick={goToNextStep}
            >
              Επόμενο
            </button>
            </>
            
          ) : currentStep === steps.length - 1 ? (
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
                onClick={() => {
                    navigate('/dashboard/Pliromes');  
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
                    handlePayment();
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
