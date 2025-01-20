import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Accordion from 'react-bootstrap/Accordion';
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from 'react-router-dom';

function MainGoneisPGU(){
    const navigate = useNavigate();

    const handleSearchRedirect = () => {
      navigate('/anazitisi', { state: { area: "", age: "" } });
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
                <h2>Ψάχνετε Babysitter για το παιδί σας;</h2>
                <p style={{ fontSize: "16px", fontWeight: "normal", margin: "15px 0" }}>
                  Εμπιστευτείτε τους/τις babysitter μας για την φροντίδα και ασφάλεια του παιδιού σας.
                </p>
          
                <div style={{ marginTop: "25px" }}>
                  <button onClick={handleSearchRedirect} style={{
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
                    Αναζήτηση babysitter
                  </button>
                </div>
              </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                    <img style={{ height: "25vh" }} src="/progressBabysitter.png" alt="" />
                </div>
                <div>
                    <Accordion defaultActiveKey="null" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Ποιοι έχουν δικαίωμα συμμετοχής ως Κηδεμόνες;</Accordion.Header>
                        <Accordion.Body>
                        <span style={{width:"80%"}} >
                            Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να πληρείτε τα ακόλουθα κριτήρια:
                            <br />
                            <ul style={{listStyleType:"disc"}}>
                            <li>Το ετήσιο ατομικό εισόδημά σας να μην υπερβαίνει το ποσό των 24.000 € για το φορολογικό έτος 2024 (για εισοδήματα που αποκτήθηκαν από 01/01/2024 έως 31/12/2024).</li>
                            <li>Να είστε εργαζόμενη/ος ή άνεργη εγγεγραμμένη στα μητρώα της ΔΥΠΑ (Προσοχή! H ανεργία αφορά μόνο στη μητέρα που υποβάλλει αίτηση).</li>
                            <li>Να μην τελείτε υπό καθεστώς άδειας μητρότητας ή άδειας πατρότητας ή άδειας ανατροφής τέκνου ή γονικής άδειας ή ειδικής παροχής προστασίας μητρότητας ή να μην έχετε διακόψει ή αναστείλει την επαγγελματική σας δραστηριότητα.</li>
                            <li>Να έχετε ανήλικο τέκνο δύο (2) μηνών έως δύο (2) ετών και έξι (6) μηνών.</li>
                            <li>Η διεύθυνση διαμονής σας να είναι εντός των Δήμων που συμμετέχουν στην Πιλοτική εφαρμογή της Δράσης.</li>
                            </ul>
                        </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                </div>
                <div>
                    <Accordion defaultActiveKey="null" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Διαδικασία εύρεσης babysitter</Accordion.Header>
                        <Accordion.Body>
                        <span style={{width:"80%"}} >
                            Για να βρείτε τον/την/το babysitter που σας ταιριάζει θα πρέπει να ολοκληρώσετε τα εξής βήματα:
                            <br />
                            <ul style={{listStyleType:"disc"}}>
                            <li>Βεβαιωθείτε ότι πληρείτε τα κριτήρια επιλεξιμότητας και εγγραφείτε στο πρόγραμμα.</li>
                            <li>Βρείτε τον/την/το babysitter που σας ταιριάζει.</li>
                            <li>Κάντε μία αίτηση ενδιφέροντος συνεργασίας και κανονίστε ένα ραντεβού (διαδικτυακά ή δια ζώσης) με τον/την/το babysitter της επιλογής σας.</li>
                            <li>Υπογράψτε μέσω της πλατφόρμας μας ένα συμφωνητικό συνεργασίας.</li>
                            <li>Στο τέλος κάθε μήνα, επιβεβαιώστε την ολοκλήρωση της μηνιαίας συνεργασίας με τον/την/το babysitter ώστε να καταβληθεί αυτόματα το αντίστοιχο voucher.
                            </li>
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
                            <li style={{fontWeight:"bold"}}>Χρειάζεται να καταβάλλω κάποιο μέρος της πληρωμής του babysitter;</li>
                            <p>- Όχι, η πληρωμή γίνεται εξ ολοκλήρου από τη πλατφόρμα μέσω πίστωσης voucher στον babysitter. </p>
                            <li style={{fontWeight:"bold"}}>Με ποιο τρόπο θα καταβάλλεται το ποσό του voucher;</li>
                            <p>- Μετά από κάθε επικύρωση της μηνιαίας συνεργασίας των δύο πλευρών από τον κηδεμόνα, το σύστημα θα καταβάλλει αυτόματα το αντίστοιχο voucher
                            στον/ην babysitter.</p>
                            <li style={{fontWeight:"bold"}}>Μπορώ να συνεργάζομαι ταυτόχρονα με πολλούς/ες babysitters;</li>
                            <p>- Μπορείτε να συνεργαστείτε μόνο με εναν babysitter ανά κάθε χρονική στιγμή. Παρόλα αυτά, όσο έχετε ενεργά συμφωνητικά μπορείτε να προγραμματίσετε
                            τις επόμενες συνεργασίες σας.</p>
                            <li style={{fontWeight:"bold"}}>Μπορώ να συνεργαστώ με κάποιον babysitter για να προσέχει και τα δύο (ή περισσότερα) παιδιά μου;</li>
                            <p> - Όχι, κάθε babysitter έχει ευθύνη για ένα και μόνο παιδί, ακόμη και αν αφορά το ίδιο συμφωνητικό / την ίδια οικογένεια.</p>
                            <li style={{fontWeight:"bold"}}>Πως πραγματοποιείται το ραντεβού με τον babysitter;</li>
                            <p> - Το ραντεβού γνωριμίας με τον babysitter μπορεί να γίνει είτε διαδικτυακά είτε δια ζώσης.</p>
                            <li style={{fontWeight:"bold"}}>Οι ημέρες και ώρες εργασίας ορίζονται εγγράφως;</li>
                            <p>- Οι ημέρες και ώρες εργασίας του babysitter ορίζονται αυστηρά στο συμφωνητικό που υπογράφεται και από τις δύο πλευρές και καθορίζει αυστηρά την 
                            πληρωμή του babysitter.</p>
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

export default MainGoneisPGU;
