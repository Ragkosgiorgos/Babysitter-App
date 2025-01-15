import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Accordion from 'react-bootstrap/Accordion';
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Link, useNavigate } from 'react-router-dom';  

function MainGoneisPGU(props){
    const navigate = useNavigate(); 

    const handleSearchRedirect = () => {
        navigate('/anazitisi');  
    };
    
    return(
        <div style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>
            <div style={{marginBottom:"30px"}}>
                <Header />
            </div>

            <div style={{marginLeft:"20px"}}>
                <Breadcrumbs />
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ backgroundColor: "white", position: "relative", zIndex: 2, marginTop: "-10vh", display: "flex", width: "50%", justifyContent: "center", margin: "0 auto", flexDirection: "column", border: "1px solid black", borderRadius: "15px", height: "20vh" }}>
                    <h6 style={{ textAlign: "center" }}>Βρείτε τον/την babysitter που σας ταιριάζει!</h6>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "3%" }}>
                        <div style={{ display: "flex", width: "30%", outline: "1px solid black", marginLeft: "10%", borderRadius: "15px", height: "5vh" }}>
                            <Link to="/anazitisi" className="nav-link" style={{background: "none",border: "none",padding: 0,cursor: "pointer",width: "100%",display: "flex",alignItems: "center",justifyContent: "space-between",
                                    textDecoration: "none", }} onClick={handleSearchRedirect} >
                                <span style={{ fontWeight: 100, marginLeft: "3%" }}>
                                    Βρείτε αυτό που ψάχνετε
                                </span>
                                <img
                                    src="/search (1).svg"
                                    alt="Search"
                                    style={{ width: "24px", height: "24px" }}
                                />
                            </Link>
                        </div>
                        <span style={{ marginRight: "10%", textDecoration: "underline" }}>Βρείτε εργασία</span>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                    <img style={{ height: "25vh" }} src="/progress.png" alt="" />
                </div>
                <div>
                    <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>ΠΟΙΟΙ ΕΧΟΥΝ ΔΙΚΑΙΩΜΑ ΕΓΓΡΑΦΗΣ ΣΤΟ ΠΡΟΓΡΑΜΜΑ ΩΣ ΚΗΔΕΜΟΝΕΣ;</Accordion.Header>
                        <Accordion.Body>
                        <span style={{width:"80%"}} >
                            Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να πληρείτε τα ακόλουθα κριτήρια:
                            <br />
                            <ul style={{listStyleType:"disc"}}>
                            <li>Το ετήσιο ατομικό εισόδημά σας να μην υπερβαίνει το ποσό των 24.000 € για το φορολογικό έτος 2024 (για εισοδήματα που αποκτήθηκαν από 01/01/2024 έως 31/12/2024).</li>
                            <li>Να είστε εργαζόμενη/ος ή άνεργη εγγεγραμμένη στα μητρώα της ΔΥΠΑ (Προσοχή! H ανεργία αφορά μόνο στη μητέρα που υποβάλλει αίτηση).</li>
                            <li>Να μην τελείτε υπό καθεστώς άδειας μητρότητας ή άδειας πατρότητας ή άδειας ανατροφής τέκνου ή γονικής άδειας ή ειδικής παροχής προστασίας μητρότητας ή να μην έχετε διακόψει ή αναστείλει την επαγγελματική σας δραστηριότητα.</li>
                            Να έχετε ανήλικο τέκνο δύο (2) μηνών έως δύο (2) ετών και έξι (6) μηνών.
                            <li>Η διεύθυνση διαμονής σας να είναι εντός των Δήμων που συμμετέχουν στην Πιλοτική εφαρμογή της Δράσης.</li>
                            </ul>
                        </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                </div>
                <div>
                    <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>ΔΙΑΔΙΚΑΣΙΑ ΕΥΡΕΣΗΣ ΕΠΠΑΓΕΛΑΜΤΙΑ</Accordion.Header>
                        <Accordion.Body>
                        <span style={{width:"80%"}} >
                        Για να βρείτε τον/την babysitter που σας ταιριάζει θα πρέπει να ολοκληρώσετε τα εξής βήματα:
                            <br />
                            <ul style={{listStyleType:"disc"}}>
                            <li>Βεβαιωθείτε ότι πληρείτε τα κριτήρια επιλεξιμότητας και εγγραφείτε στο πρόγραμμα.</li>
                            <li>Βρείτε τον/την babysitter που σας ταιριάζει.</li>
                            <li>Κάντε μία αίτηση ενδιφέροντος συνεργασίας και κανονίστε ένα ραντεβού (διαδικτυακά ή δια ζώσης) με τον/την babysitter της επιλογής σας.</li>
                            <li>Υπογράψτε μέσω της πλατφόρμας μας ένα συμφωνητικό συνεργασίας.</li>
                            <li>Στο τέλος κάθε μήνα, επιβεβαιώστε την ολοκλήρωση της μηνιαίας συνεργασίας με τον/την babysitter ώστε να καταβληθεί αυτόματα το αντίστοιχο voucher.
                            </li>
                            </ul>
                        </span>
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                </div>
                <div>
                    <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"2.5vh"}}>
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
                            <p>- Μπορείτε να συνεργαστείτε μόνο με εναν babysitter ανά κάθε χρονική στιγμή. Παρόλα αυτά, όσο έχετε ενεργά συμβόλαια μπορείτε να προγραμματίσετε
                            τις επόμενες συνεργασίες σας.</p>
                            <li style={{fontWeight:"bold"}}>Μπορώ να συνεργαστώ με κάποιον babysitter για να προσέχει και τα δύο (ή περισσότερα) παιδιά μου;</li>
                            <p> - Όχι, κάθε babysitter έχει ευθύνη για ένα και μόνο παιδί, ακόμη και αν αφορά το ίδιο συμβόλαιο / την ίδια οικογένεια.</p>
                            <li style={{fontWeight:"bold"}}>Πως πραγματοποιείται το ραντεβού με τον babysitter;</li>
                            <p> - Το ραντεβού γνωριμίας με τον babysitter μπορεί να γίνει είτε διαδικτυακά είτε δια ζώσης.</p>
                            <li style={{fontWeight:"bold"}}>Οι ημέρες και ώρες εργασίας ορίζονται εγγράφως;</li>
                            <p>- Οι ημέρες και ώρες εργασίας του babysitter ορίζονται αυστηρά στο συμβόλαιο που υπογράφεται και από τις δύο πλευρές και καθορίζει αυστηρά την 
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
                <Footer/>
            </div>
        </div>
    );
}

export default MainGoneisPGU;
