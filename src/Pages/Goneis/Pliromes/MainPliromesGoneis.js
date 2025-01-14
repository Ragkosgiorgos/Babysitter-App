import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH,FIREBASE_DB } from '../../../config/firebase';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

import Loader from '../../../Components/Loader';
import { Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReplayIcon from '@mui/icons-material/Replay';

function MainPliromesGoneis() {
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
          const q = query(collection(FIREBASE_DB, 'payments'), where('id_p', '==', uuid),where('Paid','==','True'));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setContracts(posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts(); // Fetch posts when component mounts
    }
  }, [uuid]); // Runs when UUID changes

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
  const handleNewPayment = () => {
    navigate('/goneis/symbolaia/pliromes/nea-pliromi');
  };

  const handleRedirect = (contractId) => {
    navigate(`provoli/${contractId}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'column', overflow: 'auto', minHeight: '100vh' }}>
      <div>
        <Header />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            {"breadcrambs"}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
                <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '3%' }}>Οι πληρωμές μου</h2>
            </div>


            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%', marginLeft: '70%' }}>
              <button
                style={{
                  height: '3%',
                  backgroundColor: '#2b8cbe',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  border: '3px solid #333',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                }}
                onClick={handleNewPayment}
              >
                Δημιουργία νεας πληρωμής
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
              <table style={{ width: '80%', backgroundColor: '#D9EAFD', textAlign: 'center', borderRadius: '10px' }}>
                <thead style={{ lineHeight: '2em' }}>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th>Κωδικός συμβολαίου</th>
                    <th>Κωδικός Πληρωμής</th>
                    <th>Ονοματεπώνυμο επαγγελματία</th>
                    <th > Περίοδος πληρωμης</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.id_c}</td>
                      <td>{contract.id}</td>
                      <td>{findProfessionalName(contract.id_b)}</td>
                      <td>Απο {contract.startPeriod} Εως {contract.endPeriod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MainPliromesGoneis;
