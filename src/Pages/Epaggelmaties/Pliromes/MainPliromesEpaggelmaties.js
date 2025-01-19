import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../config/firebase';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';
import Loader from '../../../Components/Loader';
import Breadcrumbs from '../../../Components/Breadcrumbs';

function MainPliromesEpaggelmaties() {
  const navigate = useNavigate();

  // Check if user is logged in, get the user's UUID and fetch user data
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [contracts, setContracts] = useState([]);

  // Check user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUuid(user.uid);
      } else {
        navigate("/login");
    }
    });
    return () => unsubscribe();
  }, []);

  // Fetch parent users
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        const parentsRef = collection(FIREBASE_DB, 'user');
        const q = query(parentsRef, where('property', '==', 'parent'));
        const querySnapshot = await getDocs(q);
        const fetchedParents = querySnapshot.docs.map((doc) => ({
          userId: doc.id,
          ...doc.data(),
        }));
        setParents(fetchedParents);
      } catch (error) {
        console.error('Error fetching parents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  // Fetch the job posts' data
  useEffect(() => {
    if (uuid) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const q = query(collection(FIREBASE_DB, 'payments'), where('id_b', '==', uuid),where('Paid','==','True'));
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

      fetchPosts();
    }
  }, [uuid]);

  const findParentName = (parentId) => {
    const parent = parents.find((parent) => parent.userId === parentId);
    return parent ? `${parent.firstName} ${parent.lastName}` : 'Άγνωστο';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        minHeight: '100vh',
      }}
    >
      <div>
        <Header />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <Breadcrumbs/>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2%',
              }}
            >
              <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '3%' }}>
                Οι πληρωμές μου
              </h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px", tableLayout: "fixed" }}>
                <thead style={{ lineHeight: '1.2em' }}>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ padding: "10px" }}>Κηδεμόνας</th>
                    <th style={{ padding: "10px" }}>Κωδικός Voucher</th>
                    <th style={{ padding: "10px" }}>Περίοδος πληρωμής</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} style={{ borderTop: "0.2px solid #333", lineHeight: "2em" }}>
                      <td style={{ padding: "10px" }}>{findParentName(contract.id_p)}</td>
                      <td style={{ padding: "10px" }}>{contract.id}</td>
                      <td style={{ padding: "10px" }}>{contract.startPeriod} - {contract.endPeriod}</td>
                    </tr>
                  ))}
                  {contracts.length === 0 && (
                      <tr>
                        <td colSpan={3}>Δεν υπάρχουν πληρωμές</td>
                      </tr>
                    )}
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

export default MainPliromesEpaggelmaties;
