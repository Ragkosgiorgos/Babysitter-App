import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Header(props) {
if(props.log === 'connected')
    {
    return (
        <nav class="navbar navbar-expand-lg" style={{ backgroundColor: '#6C6A6A' }}>
            <div class="container-fluid" style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                    <img style={{marginRight:"8px"}} src="/logo192.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                    <a class="navbar-brand" href="#" style={{color: "white"}}>Νταντάδες της Γειτονιάς</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                    <div class="collapse navbar-collapse ms-auto" id="navbarNavDropdown" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",marginRight:"5%" }}>
                        <ul class="navbar-nav" style={{ display: "flex", flexDirection: "row", listStyleType: "none" }}>
                            <li class="nav-item">
                                <a class={props.act !== 'babysitter' ? "nav-link" : "nav-link active"} aria-current="page" href="/user" style={{color: "white"}}>Βρείτε babysitter</a>
                            </li>
                            <li class="nav-item">
                                <a class={props.act !== 'job' ? "nav-link" : "nav-link active"} href="/user/profile" style={{color: "white"}}>Βρείτε εργασία</a>
                            </li>
                            
                            </ul>
                        </div>
                    <div className="dropdown ms-3">
                        <button 
                            className="btn btn-secondary dropdown-toggle" 
                            type="button" 
                            id="dropdownMenuButton" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                        Ηλιάνα Τσουρέα
                        </button>
                        <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                            <li><a className="dropdown-item" href="#">Το προφίλ μου</a></li>
                            <li><a className="dropdown-item" href="#">Το Βιογραφικό μου</a></li>
                            <li><a className="dropdown-item" href="#">Οι Αγγελίες μου</a></li>
                            <li><a className="dropdown-item" href="#">Τα ραντεβού μου</a></li>
                            <li><a className="dropdown-item" href="#">Τα Συμβόλαιά μου</a></li>
                            <li><a className="dropdown-item" href="#">Οι Πληρωμές μου</a></li>
                            <li><a className="dropdown-item" href="#">Οι Αξιολογήσεις μου</a></li>
                            <li ><a className="dropdown-item" href="#" style={{ color: 'red' }} >Αποσύνδεση</a></li>
                        </ul>
                    </div>
            </div>
        </nav>
        );   
    }
else if(props.log === 'not_connected')
{
    return (
        <nav class="navbar navbar-expand-lg" style={{ backgroundColor: '#6C6A6A' }}>
            <div class="container-fluid" style={{display:"flex",justifyContent:"space-between"}}>
                <div>
                    <img style={{marginRight:"8px"}} src="/logo192.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                    <a class="navbar-brand" href="#" style={{color: "white"}}>Νταντάδες της Γειτονιάς</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                    <div class="collapse navbar-collapse ms-auto" id="navbarNavDropdown" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",marginRight:"5%" }}>
                        <ul class="navbar-nav" style={{ display: "flex", flexDirection: "row", listStyleType: "none" }}>
                            <li class="nav-item">
                                <a class={props.act !== 'babysitter' ? "nav-link" : "nav-link active"} aria-current="page" href="/user" style={{color: "white"}}>Βρείτε babysitter</a>
                            </li>
                            <li class="nav-item">
                                <a class={props.act !== 'job' ? "nav-link" : "nav-link active"} href="/user/profile" style={{color: "white"}}>Βρείτε εργασία</a>
                            </li>
                            
                            </ul>
                        </div>
                    <div className="dropdown ms-3">
                        <button style={{marginRight:"8px",borderRadius:"15%"}}>
                        Σύνδεση
                        </button>
                        <button style={{marginRight:"8px",borderRadius:"15%"}}>
                        Εγγραφή
                        </button>
                    </div>
            </div>
        </nav>
        );   
}
}
export default Header;


