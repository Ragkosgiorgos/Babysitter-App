import React from "react";
import Header from "../../Components/Header";
import Breadcrumbs from "../../Components/Breadcrump";
import JobofferReview from "../../Components/EpaggelmatiesComponent/JobofferReview";
import Accordion from 'react-bootstrap/Accordion';
import Footer from "../../Components/Footer";

function MainEpaggelmatiesPGU(props){

    return(
        <div>
            <Header />
            <Breadcrumbs />
            <div style={{ marginLeft: "2vh",marginTop:"6vh" }}><h6>Δείτε αγγελίες άλλων babysitter:</h6></div>
            <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex", gap: "5vh", justifyContent: "center" }}>
                <JobofferReview id={1}/>
                <JobofferReview id={2}/>
                <JobofferReview id={3}/>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                <img style={{ height: "33vh" }} src="/progressBabysitter.png" alt="" />
            </div>
            <div>
                <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"1.5vh"}}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Ποιοι έχουν δικαίωμα εγγραφής στο πρόγραμμα ως επαγγελματίες;</Accordion.Header>
                    <Accordion.Body>
                    <span>
                        Για να έχετε τη δυνατότητα να συμμετάσχετε στο πρόγραμμα ‘Νταντάδες της Γειτονιάς’, θα πρέπει να:
                        <br />
                        <ul style={{listStyleType:"disc"}}>
                        <li>Να έχετε συμπληρώσει το 18ο έτος της ηλικίας σας.</li>
                        <li>Να είστε Έλληνας ή αλλοδαπός πολίτης που διαμένει νόμιμα στην Ελλάδα και έχει πρόσβαση στην αγορά εργασίας.</li>
                        <li>Να πληρείτε τις τις προϋποθέσεις που βρίσκονται στον παρακάτω σύνδεσμο[link].</li>
                        </ul>
                    </span>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
            </div>
            <div>
                <Accordion defaultActiveKey="0" style={{width:"90%", margin:"auto", marginTop:"1.5vh"}}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Διαδικασία εύρεσης εργασίας</Accordion.Header>
                    <Accordion.Body>
                    <span>
                        Αφού εγγραφείται στο Μητρώο Επιμελητών/τριών και δημιουργήσετε το προφιλ σας μπορείτε:
                        <br />
                        <ul style={{listStyleType:"disc"}}>
                        <li>Να αναρτήσετε μια αγγελία με τα προσωπικά σας στοιχεία και τις συνθήκες εργασίας τις οποίες αναζητείτε (πχ.ημέρες και ώρες εργασίας, ηλικία παιδιού κλπ.)</li>
                        <li>Να διαθέσει ημέρες και ώρες για ραντεβού με κηδεμόνες που ενδιαφέρονται για συνεργασία. Οι συναντήσεις αυτές μπορού να να γίνουν είτε διαδικτυακά,είτε διά ζώσης</li>
                        <li>Εφόσον συμφωνήσετε με τον κηδεμόνα για όλες τις λεπτομέρειες της συνεργασίας σας (διάρκεια, ημέρες και ώρες εργασίας, χώρος εργασίας κλπ.), ο κηδεμόνας
                        συντάσει και υπογράφει το συμβόλαιο. Έπειτα, θα εμφανιστεί στη δική σας λίστα συμβολαίων και θα πρέπει να το υπογράψετε και εσείς.</li>
                        <li>Στο τέλος κάθε μήνα εργασίας, ο κηδεμόνας επιβεβαιώνει την εργασία σας και σας καταβάλλεται αυτόματα το αντίστοιχο voucher στη λίστα των πληρωμών σας. </li>
                        </ul>
                    </span>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
            </div>
            <Footer/>
        </div>
    );

}
export default MainEpaggelmatiesPGU;
