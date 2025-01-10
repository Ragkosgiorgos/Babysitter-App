import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loader from './Loader';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase';

function Header(props) {
    const navigate = useNavigate();
    const location = useLocation();

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
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
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
            finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, [uuid]);

    const handleUnsubscribe = () => {
        const handleLogout = async () => {
            try {
                setLoading(true);
                await signOut(FIREBASE_AUTH);
                navigate('/');
            } catch (error) {
                console.error('Error logging out:', error);
            } finally {
                setLoading(false);
            }
        };

        handleLogout();
        navigate('/');
        window.location.reload();
    };

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

    if (loading) {
        return <Loader />;
    }

    if (user && user.property === 'babysitter') {
        return (
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2E86AB' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <img
                            style={{ marginRight: '8px' }}
                            src="/favicon_hero.png"
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
                        <ul className="navbar-nav" style={{ display: 'flex', flexDirection: 'row', listStyleType: 'none', gap: "50px" }}>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'goneis' ? 'nav-link' : 'nav-link active'}
                                    to="/goneis"
                                    style={{ color: 'white' }}
                                    onClick={handleGoneisRedirect}  
                                >
                                    Κηδεμόνες
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'job' ? 'nav-link' : 'nav-link active'}
                                    to="/epaggelmaties"
                                    style={{ color: 'white' }}
                                    onClick={handleEpaggelmatiesRedirect}  
                                >
                                    Babysitters
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown ms-3">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            data-bs-boundary="viewport"
                            aria-expanded="false"
                            style={{ backgroundColor: "white", color: "black" }}
                        >
                            {user.firstName} {user.lastName}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            <li>
                                <a className="dropdown-item" href="/epaggelmaties/profile">
                                    Το Προφίλ μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Το Βιογραφικό μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/aggelies">
                                    Οι Αγγελίες μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Τα Ραντεβού μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/epaggelmaties/symbolaia">
                                    Τα Συμβόλαιά μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Οι Πληρωμές μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/epaggelmaties/ratings">
                                    Οι Αξιολογήσεις μου
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="/#"
                                    style={{ color: "red", borderTop: "2px solid #333" }}
                                    onClick={handleUnsubscribe}
                                >
                                    Αποσύνδεση
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    } else if (user && user.property === 'parent') {
        return (
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2E86AB' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <img
                            style={{ marginRight: '8px' }}
                            src="/favicon_hero.png"
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
                        <ul className="navbar-nav" style={{ display: 'flex', flexDirection: 'row', listStyleType: 'none', gap: "50px" }}>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'goneis' ? 'nav-link' : 'nav-link active'}
                                    to="/goneis"
                                    style={{ color: 'white' }}
                                    onClick={handleGoneisRedirect}  
                                >
                                    Κηδεμόνες
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'job' ? 'nav-link' : 'nav-link active'}
                                    to="/epaggelmaties"
                                    style={{ color: 'white' }}
                                    onClick={handleEpaggelmatiesRedirect}  
                                >
                                    Babysitters
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown ms-3">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            data-bs-boundary="viewport"
                            aria-expanded="false"
                            style={{ backgroundColor: "white", color: "black" }}
                        >
                            {user.firstName} {user.lastName}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            <li>
                                <a className="dropdown-item" href="/goneis/profile">
                                    Το Προφίλ μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/goneis/symbolaia">
                                    Τα Συμβόλαιά μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/#">
                                    Οι Πληρωμές μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/goneis/ratings">
                                    Οι Αξιολογήσεις μου
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/goneis/profile/aitiseis-endiaferontos">
                                    Οι Αιτήσεις ενδιαφέροντός μου
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="/#"
                                    style={{ color: "red", borderTop: "2px solid #333" }}
                                    onClick={handleUnsubscribe}
                                >
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
                <div
                    className="container-fluid"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Logo and Brand Name */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            style={{ marginRight: '8px' }}
                            src="/favicon_hero.png"
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
                            style={{ marginLeft: '10px' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    {/* Navbar Links and Buttons */}
                    <div
                        className="collapse navbar-collapse"
                        id="navbarNavDropdown"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '140px',
                        }}
                    >
                        {/* Navbar Links */}
                        <ul
                            className="navbar-nav"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                listStyleType: 'none',
                                margin: 0,
                                padding: 0,
                                gap: '30px',
                            }}
                        >
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'goneis' ? 'nav-link' : 'nav-link active'}
                                    to="/goneis"
                                    style={{ color: 'white' }}
                                    onClick={handleGoneisRedirect}
                                >
                                    Κηδεμόνες
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={props.act !== 'job' ? 'nav-link' : 'nav-link active'}
                                    to="/epaggelmaties"
                                    style={{ color: 'white' }}
                                    onClick={handleEpaggelmatiesRedirect}
                                >
                                    Babysitters
                                </Link>
                            </li>
                        </ul>

                        {/* Login and Register Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    border: '1px solid white',
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Σύνδεση
                            </button>
                            <button
                                style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    border: '1px solid white',
                                }}
                                onClick={() => navigate('/register')}
                            >
                                Εγγραφή
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;

