
import Header from "../../Components/Header";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Accordion from 'react-bootstrap/Accordion';
import Footer from "../../Components/Footer";
import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainEpaggelmatiesPGU(){
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/dashboard/aggelies');
    };

    return(
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <Breadcrumbs />

            <div style={{
                marginTop: "6vh", 
                marginBottom: "20px", 
                padding: "20px", 
                borderRadius: "8px", 
                textAlign: "center", 
                fontSize: "18px",
                fontWeight: "bold",
            }}>
                <h2>Ψάχνετε εργασία ως Babysitter;</h2>
                <p style={{ fontSize: "16px", fontWeight: "normal", margin: "15px 0" }}>
                    Δημιουργήστε την προσωπική σας αγγελία.
                    Μπορείτε να επιλέξετε τις ώρες, τις ημέρες και τις συνθήκες που σας ταιριάζουν. 
                    Εύκολα και γρήγορα!
                </p>
 
                <div style={{ marginTop: "25px" }}>
                  <button onClick={handleClick} style={{
                    padding: "12px 25px", 
                    backgroundColor: "#007bff", 
                    color: "#fff", 
                    textDecoration: "none", 
                    borderRadius: "5px", 
                    fontWeight: "bold", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease-in-out"
                  }}>
                    Δημιουργία Αγγελίας
                  </button>
                </div>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                <img style={{ height: "25vh" }} src="/progressBabysitter.png" alt="" />
              </div>
              <div>
                <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"1.5vh"}}>
                <Accordion.Item eventKey="null">
                    <Accordion.Header>Ποιοι έχουν δικαίωμα εγγραφής στο πρόγραμμα ως babysitter;</Accordion.Header>
                    <Accordion.Body>
                    <span>
                        Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να:
                        <br />
                        <ul style={{listStyleType:"disc"}}>
                        <li>Να έχετε συμπληρώσει το 18ο έτος της ηλικίας σας.</li>
                        <li>Να είστε Έλληνας ή αλλοδαπός πολίτης που διαμένει νόμιμα στην Ελλάδα και έχει πρόσβαση στην αγορά εργασίας.</li>
                        <li>Να μην έχετε κατοχυρωθεί και ως κηδεμόνας.</li>
                        </ul>
                    </span>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
              </div>
              <div>
                <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"1.5vh"}}>
                <Accordion.Item eventKey="null">
                    <Accordion.Header>Διαδικασία εύρεσης εργασίας και πληρωμής</Accordion.Header>
                    <Accordion.Body>
                    <span>
                        Αφού εγγραφείται στο Μητρώο Επιμελητών/τριών και δημιουργήσετε το προφιλ σας μπορείτε:
                        <br />
                        <ul style={{listStyleType:"disc"}}>
                        <li>Να αναρτήσετε μια αγγελία με τα προσωπικά σας στοιχεία και τις συνθήκες εργασίας τις οποίες αναζητείτε (πχ.ημέρες και ώρες εργασίας, ηλικία παιδιού κλπ.)</li>
                        <li>Να διαθέσει ημέρες και ώρες για ραντεβού με κηδεμόνες που ενδιαφέρονται για συνεργασία. Οι συναντήσεις αυτές μπορού να να γίνουν είτε διαδικτυακά,είτε διά ζώσης</li>
                        <li>Εφόσον συμφωνήσετε με τον κηδεμόνα για όλες τις λεπτομέρειες της συνεργασίας σας (διάρκεια, ημέρες και ώρες εργασίας, χώρος εργασίας κλπ.), ο κηδεμόνας
                        συντάσει και υπογράφει το συμφωνητικό. Έπειτα, θα εμφανιστεί στη δική σας λίστα συμφωνητικών και θα πρέπει να το υπογράψετε και εσείς.</li>
                        <li>Ο/Η babysitter υποδεικνύει τον τραπεζικό λογαριασμό στον οποίο ο κηδεμόνας καταβάλει την αμοιβή και στο τέλος κάθε μήνα εργασίας, 
                          ο κηδεμόνας επιβεβαιώνει την εργασία σας και σας καταβάλλεται αυτόματα το αντίστοιχο voucher στη λίστα των πληρωμών σας. </li>
                        </ul>
                    </span>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
              </div>
              <div>
                    <Accordion defaultActiveKey="null" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>FAQ</Accordion.Header>
                        <Accordion.Body>
                        <span style={{width:"80%"}} >
                            <br />
                            <ul style={{listStyleType:"disc"}}>
                            <li style={{fontWeight:"bold"}}>Οι babysitter πόσα παιδιά να επιμελούν ταυτοχρόνως;</li>
                            <p>-Μέχρι τρία παιδιά αν το πολύ ένα από αυτά είναι κάτω του ενός έτους ή μέχρι δύο για παιδιά νεότερα του ενός έτους.(Προσοχή!
                               Στις παραπάνω προϋποθέσεις συμπεριλαμβάνονται και τα παιδιά του/της babysitter εφόσον είναι έως 2,5 ετών.)
                            </p>
                            <li style={{fontWeight:"bold"}}>Τι χρειάζεται για να εγγραφώ ως babysitter;</li>
                            <p>-Χρειάζεται ένα email,κάποια προσωπικά σας στοιχεία όπως : Ονοματεπώνυμο , Φύλο , Ημερομηνία Γέννησης , ΑΦΜ , Περιοχή και Τηλέφωνο καθώς και το 
                              επίπεδο εκπαίδευσής σας.
                            </p>
                            <li style={{fontWeight:"bold"}}>Υπάρχει δυνατότητα επικοινωνίας για επιπλέον διευκρινίσεις;</li>
                            <p>- Για οποιαδήποτε περαιτέρω διευκρίνιση κι επίλυση τυχόν προβλημάτων, απευθυνθείτε στα:
                            (τηλ.: 210 3258 080, 210 3258 090, e-mail: ntantades@yeka.gr).
                            </p>
                            </ul>
                        </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                </div>
            </div>
            <Footer/>

        </div>
    );
}

export default MainEpaggelmatiesPGU;
