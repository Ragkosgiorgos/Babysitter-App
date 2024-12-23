import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';  // Import useNavigate and useLocation
import { signOut } from 'firebase/auth';  // Import signOut
import { FIREBASE_AUTH } from '../config/firebase';  // Import the Firebase authentication instance

function Header(props) {
    const user = props.user;
    let name = '';
    let surname = '';
    let property = '';
    if (user) {
        name = user.firstName;
        //surname = user.surname;
        property = user.property;
    }

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
    
    const handleUnsubscribe = () => {
        const handleLogout = async () => {
                try {
                    await signOut(FIREBASE_AUTH);
                    navigate('/');
                } catch (error) {
                    console.error('Error logging out:', error);
                }
            };

        handleLogout();
        navigate('/');
        window.location.reload();
    };

    if (user && property === 'babysitter') {
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
                    <div className="dropdown ms-3" style={{marginRight:"5%"}}>
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ backgroundColor: "white", color: "black" }}
                        >
                            {name} {surname}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                            <li>
                                <a className="dropdown-item"  href={`/epaggelmaties/profile?uid=${props.uid}`}>
                                    Το Προφίλ μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Το Βιογραφικό μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href={`/aggelies?uid=${props.uid}`}>
                                    Οι Αγγελίες μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Τα Ραντεβού μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Τα Συμβόλαιά μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Οι Πληρωμές μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href={`/epaggelmaties/ratings?uid=${props.uid}`}>
                                    Οι Αξιολογήσεις μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#" style={{ color: 'red', borderTop: "2px solid #333" }} onClick={handleUnsubscribe}>
                                    Αποσύνδεση
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    } else if (user && property === 'parent') {
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
                    <div className="dropdown ms-3" style={{marginRight:"1%"}}>
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ backgroundColor: "white", color: "black" }}
                        >
                            {name} {surname}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                            <li>
                                <a className="dropdown-item" href={`/goneis/profile?uid=${props.uid}`}>
                                    Το Προφίλ μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/aggelies">
                                    Οι Αγγελίες μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Τα Συμβόλαιά μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Οι Πληρωμές μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href={`/goneis/ratings?uid=${props.uid}`}>
                                    Οι Αξιολογήσεις μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#" style={{ color: 'red', borderTop: "2px solid #333" }} onClick={handleUnsubscribe}>
                                    Αποσύνδεση
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    } else if (!user) {
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
                        <button style={{ marginRight: '8px', borderRadius: '15%' }} onClick={() => navigate('/login')}>
                            Σύνδεση
                        </button>
                        <button style={{ marginRight: '8px', borderRadius: '15%' }} onClick={() => navigate('/register')}>
                            Εγγραφή
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;

