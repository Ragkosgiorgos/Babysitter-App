import React, { useState, useRef, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumbs from '../Breadcrumbs';
import ProgressTracker from '../ProgressTracker';
import { handleScrollToTop } from '../../Utils/Methods';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { el } from 'date-fns/locale'; // Greek locale
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getDocs, query, where } from 'firebase/firestore';

// Register Greek locale
registerLocale('el', el);

export default function Register() {
    const navigate = useNavigate();

    // Form steps
    const [step, setStep] = useState(1);
    const [error, setError] = useState({});
    const [submit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    // Step 1
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Step 2
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [afm, setAfm] = useState('');
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [property, setProperty] = useState('');

    const areasOfGreece = [
        "Αθήνα",
        "Θεσσαλονίκη",
        "Πάτρα",
        "Ηράκλειο",
        "Λάρισα",
        "Βόλος",
        "Ιωάννινα",
        "Καβάλα",
        "Χανιά",
        "Ρόδος",
    ];

    //? Restrictions for the form fields
    // - Email: Required, valid email, email not already in use
    // - Password: Required, at least 6 characters
    // - Confirm Password: Required, must match the password
    // - First Name: Required, only letters
    // - Last Name: Required, only letters
    // - Birth Date: Required, user > 18 years old and not allow dates in the future
    // - AFM: Required, 9 digits
    // - Area: Required
    // - Address: Required
    // - Phone: Required, 10 digits
    // - Property: Required

    const auth = getAuth();
    
    async function checkEmailExists(email) {
        try {
            setLoading(true);
            const q = query(collection(FIREBASE_DB, "user"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const profiles = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
            }));
            return profiles.length > 0;
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }

    const validateForm = async () => {
        const newErrors = {};
        setSubmit(true);
    
        if (step === 1) {
            if (!email) {
                newErrors.email = 'Το email είναι υποχρεωτικό.';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Λάθος μορφή email.';
            } else {
                // Wait for the email check to complete
                const emailExists = await checkEmailExists(email);
                if (emailExists) {
                    newErrors.email = 'Το email χρησιμοποιείται ήδη.';
                }
            }
    
            if (!password) {
                newErrors.password = 'Ο κωδικός πρόσβασης είναι υποχρεωτικός.';
            } else if (password.length < 6) {
                newErrors.password = 'Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες.';
            }
    
            if (!confirmPassword) {
                newErrors.confirmPassword = 'Η επιβεβαίωση κωδικού είναι υποχρεωτική.';
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Οι κωδικοί πρόσβασης δεν ταιριάζουν.';
            }
        }
    
        if (step === 2) {
            // Other step 2 validations here...
        }
    
        setError(newErrors);
    
        // If no errors, return true; otherwise, return false
        return Object.keys(newErrors).length === 0;
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setError({});
    
        const valid = await validateForm();
    
        if (step === 3 && valid) {
            try {
                setLoading(true);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                // Add user data to Firestore
                await addDoc(collection(FIREBASE_DB, 'user'), {
                    email,
                    firstName,
                    lastName,
                    birthDate,
                    afm,
                    area,
                    address,
                    phone,
                    property,
                    gender: '',
                    img: false,
                    createdAt: new Date(),
                    userId: user.uid,
                });
    
                setLoading(false);
                navigate('/login');
            } catch (error) {
                console.error('Error registering user:', error);
                setError({ general: matchError(error.message) });
            } finally {
                setLoading(false);
            }
        } else if (valid) {
            setStep(step + 1);
        } else {
            handleScrollToTop();
        }
    };    

    const steps = [
        "Στοιχεία Εισόδου",
        "Προσωπικά Στοιχεία",
        "Ολοκλήρωση Εγγραφής",
    ];

    const matchError = (error) => {console.log(error);
        const errorMessages = {
            "Firebase: Error (auth/email-already-in-use).": "Το email χρησιμοποιείται ήδη.",
            "Firebase: Error (auth/invalid-email).": "Λάθος μορφή email.",
            "Firebase: Error (auth/weak-password).": "Ο κωδικός πρόσβασης είναι πολύ αδύναμος.",
            "Firebase: Error (auth/too-many-requests).": "Το σύστημα δεν μπορεί να ικανοποιήσει το αίτημά σας αυτή τη στιγμή. Παρακαλώ προσπαθείστε αργότερα.",
        };
        handleScrollToTop();
        return errorMessages[error] || "Κάτι πήγε στραβά. Προσπαθήστε ξανά.";
    };

    return (
        <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
            <Header />

            <Breadcrumbs />

            <ProgressTracker steps={steps} activeStep={step - 1} />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleRegister} style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', padding: '30px', width: '100%', maxWidth: '400px', 
                                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    
                    <h2 style={{ fontSize: '24px', color: '#2E86AB' }}> Δημιουργία Λογαριασμού </h2>
                    <h5 style={{ fontSize: '12px', marginBottom: '20px', color: '#2E86AB', textDecoration: 'underline' }}> Με * τα υποχρεωτικά πεδία </h5>

                    {error.general && (
                        <p style={{ 
                            backgroundColor: '#fce4e4', color: '#d32f2f', padding: '10px', borderRadius: '8px', 
                            border: '1px solid #f8d7da', marginBottom: '20px', fontSize: '14px', textAlign: 'center'
                        }}>
                            {error.general}
                        </p>
                    )}

                    {step === 1 && (
                        <>
                        {/* Email */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Email*</label>
                            <input
                                placeholder="πχ. dimitris@test.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.email ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.email && <p style={{ color: 'red', fontSize: '14px' }}>{error.email}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Κωδικός Πρόσβασης*</label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Κωδικός πρόσβασης"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${error.password ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#2E86AB',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                                </button>
                            </div>
                            {error.password && <p style={{ color: 'red', fontSize: '14px' }}>{error.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Επιβεβαίωση Κωδικού*</label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    placeholder="Επιβεβαιώστε τον κωδικό πρόσβασης"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${error.confirmPassword ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#2E86AB',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {showPasswordConfirm ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                                </button>
                            </div>
                            {error.confirmPassword && <p style={{ color: 'red', fontSize: '14px' }}>{error.confirmPassword}</p>}
                        </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                        {/* First Name */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Όνομα*</label>
                            <input
                                type="text"
                                placeholder="Όνομα"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.firstName ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.firstName && <p style={{ color: 'red', fontSize: '14px' }}>{error.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Επώνυμο*</label>
                            <input
                                type="text"
                                placeholder="Επώνυμο"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.lastName ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.lastName && <p style={{ color: 'red', fontSize: '14px' }}>{error.lastName}</p>}
                        </div>

                        {/* Birth Date */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>
                                Ημερομηνία Γέννησης*
                            </label>
                            <div style={{ position: 'relative' }}>
                                <DatePicker
                                    selected={birthDate}
                                    onChange={(date) => setBirthDate(date)}
                                    locale="el"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Επιλέξτε ημερομηνία"
                                    maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                />
                                {error.birthDate && <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error.birthDate}</p>}
                            </div>
                        </div>

                        {/* AFM */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>ΑΦΜ*</label>
                            <input
                                type="text"
                                placeholder="ΑΦΜ"
                                value={afm}
                                onChange={(e) => setAfm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.afm ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.afm && <p style={{ color: 'red', fontSize: '14px' }}>{error.afm}</p>}
                        </div>

                        {/* Area */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Περιοχή*</label>
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.area ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            >
                                <option value="">Επιλέξτε Περιοχή</option>
                                {areasOfGreece.map((areaName, index) => (
                                    <option key={index} value={areaName}>
                                        {areaName}
                                    </option>
                                ))}
                            </select>
                            {error.area && <p style={{ color: 'red', fontSize: '14px' }}>{error.area}</p>}
                        </div>

                        {/* Address */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Διεύθυνση*</label>
                            <input
                                type="text"
                                placeholder="Διεύθυνση"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.address ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.address && <p style={{ color: 'red', fontSize: '14px' }}>{error.address}</p>}
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Τηλέφωνο*</label>
                            <input
                                type="text"
                                placeholder="Τηλέφωνο"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.phone ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            />
                            {error.phone && <p style={{ color: 'red', fontSize: '14px' }}>{error.phone}</p>}
                        </div>

                        {/* Property */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Ιδιότητα*</label>
                            <select
                                value={property}
                                onChange={(e) => setProperty(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${error.property ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            >
                                <option value="">Επιλέξτε Ιδιότητα</option>
                                <option value="parent">Κηδεμόνας</option>
                                <option value="babysitter">Babysitter</option>
                            </select>
                            {error.property && <p style={{ color: 'red', fontSize: '14px' }}>{error.property}</p>}
                        </div>
                        </>
                    )}

                    {step === 3 && (
                        <div>
                            {/* Babysitter specific fields */}
                            {/* Education */}
                            {/* Experience */}
                            {/* Languages */}
                            {/* Skills */}
                            {/* Certifications */}
                            {/* Availability */}
                            {/* Price */}
                            {/* Services */}
                            {/* Parent specific fields */}
                            {/* Child info */}
                            {/* Child info */}
                            {/* Child info */}
                            {/* Child info */}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#2E86AB',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => {e.target.style.fontSize = "18px"; }}
                        onMouseLeave={(e) => {e.target.style.fontSize = "16px"; }}
                    >
                        {loading ? (step === 4 ? 'Εγγραφή...' : 'Επόμενο') : 'Επόμενο'}
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#333' }}>
                        Έχετε ήδη λογαριασμό; <a href="/login" style={{ color: '#2E86AB', textDecoration: 'underline', fontWeight: 'bold' }}>Σύνδεση</a>
                    </p>
                </form>
            </div>

            <Footer />
        </div>
    );
}
