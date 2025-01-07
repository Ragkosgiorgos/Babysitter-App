import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import ReplayIcon from '@mui/icons-material/Replay';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../config/firebase.js'

function MainSymbolaiaGoneisPGU() {
  const navigate = useNavigate();

  // Check if user is logged in, get the user's UUID and fetch user data
  const [uuid, setUuid] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
              setUuid(user.uid);
          }
      });
      return () => unsubscribe();
  }, []);

  const [user, setUser] = useState({});
  const fetchUserData = async () => {
      try {
          const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', uuid));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setUser(users[0]);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  fetchUserData();

    // Fetch the job posts' data
    const [contracts, setContracts] = useState([]);
    const fetchPosts = async () => {
    try {
        setLoading(true);
        const q = query(collection(FIREBASE_DB, 'contracts'), where('id_p', '==', uuid));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setContracts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    finally {
      setLoading(false);
    }
    };
    useEffect(() => {
      fetchPosts(); // Fetch posts when component mounts
    }, [uuid]); // Runs when UUID changes

    if (loading) {
      return <div>Loading...</div>; // Show loading message or spinner
    }

  const handleNewContract = () => {
    navigate('/neo-symbolaio');
  };

  const handleRedirect = (contractId) => {
    navigate(`provoli/${contractId}`); 
  };

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

              <table style={{ width: "80%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius: "10px" }}>
                <thead style={{ lineHeight: "2em" }}>
                  <tr style={{ borderBottom: "2px solid #333" }}>
                    <th>Κωδικός συμβολαίου</th>
                    <th>Ονοματεπώνυμο επαγγελματία</th>
                    <th>Κατάσταση συμβολαίου</th>
                    <th>Αξιολόγηση</th>
                    <th style={{width:"150px"}}></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    { contracts.map((contract) => (
                        <tr>
                            <td>{contract.id}</td>
                            <td>{/*//? */}</td>
                            <td>{contract.status}</td>
                            <td>Προβολή</td>
                            <DeleteForeverIcon style={{ cursor: "pointer", marginLeft: "10px", color: "black" }}/>
                            <ReplayIcon style={{ cursor: "pointer", marginLeft: "10px"}} />
                            <VisibilityIcon style={{ cursor: "pointer",marginLeft:"10px" }} onClick={() => handleRedirect(contract.id)}/>
                        </tr>
                    ))}
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
