import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';  // Import useNavigate and useLocation

function Header(props) {
    const navigate = useNavigate();  
    const location = useLocation();  

    const handleGoneisRedirect = () => {
        if (location.pathname !== '/goneis') {
            navigate('/goneis');  
        }
    };

    const handleEpaggelmatiesRedirect = () => {
        if (location.pathname !== '/epaggelmaties') {
            navigate('/epaggelmaties');  
        }
    };

    if (props.log === 'connected') {
        return (
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2E86AB' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <img
                            style={{ marginRight: '8px' }}
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt=""
                        />
                        <a className="navbar-brand" href="/" style={{ color: 'white' }}>
                            Νταντάδες της Γειτονιάς
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div
                        className="collapse navbar-collapse ms-auto"
                        id="navbarNavDropdown"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: '5%',
                        }}
                    >
                        <ul className="navbar-nav" style={{ display: 'flex', flexDirection: 'row', listStyleType: 'none' }}>
                            <li className="nav-item">
                                <a
                                    className={props.act !== 'job' ? 'nav-link' : 'nav-link active'}
                                    href="/user/profile"
                                    style={{ color: 'white' }}
                                >
                                    Βρείτε εργασία
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown ms-3" style={{marginRight:"1%"}}>
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Ηλιάνα Τσουρέα
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                            <li>
                                <a className="dropdown-item" href="#">
                                    Το προφίλ μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Το Βιογραφικό μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Οι Αγγελίες μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Τα ραντεβού μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Τα Συμβόλαιά μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Οι Πληρωμές μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Οι Αξιολογήσεις μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#" style={{ color: 'red' }}>
                                    Αποσύνδεση
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    } else if (props.log === 'not_connected') {
        return (
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2E86AB' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <img
                            style={{ marginRight: '8px' }}
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt=""
                        />
                        <a className="navbar-brand" href="/" style={{ color: 'white' }}>
                            Νταντάδες της Γειτονιάς
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div
                        className="collapse navbar-collapse ms-auto"
                        id="navbarNavDropdown"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: '5%',
                        }}
                    >
                        <ul className="navbar-nav" style={{ display: 'flex', flexDirection: 'row', listStyleType: 'none' }}>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'goneis' ? 'nav-link' : 'nav-link active'}
                                    to="/goneis"
                                    style={{ color: 'white' }}
                                    onClick={handleGoneisRedirect}  
                                >
                                    Βρείτε babysitter
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'job' ? 'nav-link' : 'nav-link active'}
                                    to="/epaggelmaties"
                                    style={{ color: 'white' }}
                                    onClick={handleEpaggelmatiesRedirect}  
                                >
                                    Βρείτε εργασία
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown ms-3">
                        <button style={{ marginRight: '8px', borderRadius: '15%' }}>Σύνδεση</button>
                        <button style={{ marginRight: '8px', borderRadius: '15%' }}>Εγγραφή</button>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;

