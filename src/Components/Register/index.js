import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumbs from '../Breadcrumbs';
import ProgressTracker from '../ProgressTracker';
import { handleScrollToTop } from '../../Utils/Methods';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/el';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FIREBASE_DB } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
dayjs.extend(customParseFormat);

export default function Register() {
    const navigate = useNavigate();

    // Form steps
    const [step, setStep] = useState(1);
    const [error, setError] = useState({});
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
    const [gender, setGender] = useState('');
    const [afm, setAfm] = useState('');
    const [area, setArea] = useState('');
    const [phone, setPhone] = useState('');
    const [property, setProperty] = useState('');

    // Step 3
    const [education, setEducation] = useState('');

    const [childFirstName, setChildFirstName] = useState('');
    const [childLastName, setChildLastName] = useState('');
    const [childBirthDate, setChildBirthDate] = useState('');
    const [childGender, setChildGender] = useState('');

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

    const educationOpt = [
        "Κανένα",
        "Δημοτικό",
        "Γυμνάσιο",
        "Λύκειο",
        "Πανεπιστήμιο",
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

    const parsedDate = birthDate
        ? dayjs(birthDate, 'DD/MM/YYYY')
        : null;
    
    const parsedChildDate = childBirthDate
        ? dayjs(childBirthDate, 'DD/MM/YYYY')
        : null;

    const handleDateChange = (newValue) => {
        if (newValue) {
            const formattedDate = newValue.format('DD/MM/YYYY');
            handleChangeValue('birthDate', formattedDate);
        }
    };

    const handleChildDateChange = (newValue) => {
        if (newValue) {
            const formattedDate = newValue.format('DD/MM/YYYY');
            handleChangeValue('childBirthDate', formattedDate);
        }
    }

    const validateForm = async () => {
        const newErrors = {};
    
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
            if (!firstName) {
                newErrors.firstName = 'Το όνομα είναι υποχρεωτικό.';
            } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(firstName)) {
                newErrors.firstName = 'Το όνομα πρέπει να περιέχει μόνο γράμματα.';
            }

            if (!lastName) {
                newErrors.lastName = 'Το επώνυμο είναι υποχρεωτικό.';
            } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(lastName)) {
                newErrors.lastName = 'Το επώνυμο πρέπει να περιέχει μόνο γράμματα.';
            }

            if (!birthDate) {
                newErrors.birthDate = 'Η ημερομηνία γέννησης είναι υποχρεωτική.';
            } else {
                const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
                if (age < 18) {
                    newErrors.birthDate = 'Πρέπει να είστε άνω των 18 ετών.';
                }
            }

            if (!afm) {
                newErrors.afm = 'Το ΑΦΜ είναι υποχρεωτικό.';
            } else if (!/^\d{9}$/.test(afm)) {
                newErrors.afm = 'Το ΑΦΜ πρέπει να αποτελείται από 9 ψηφία.';
            }

            if (!area) {
                newErrors.area = 'Η περιοχή είναι υποχρεωτική.';
            }

            if (!phone) {
                newErrors.phone = 'Το τηλέφωνο είναι υποχρεωτικό.';
            } else if (!/^\d{10}$/.test(phone)) {
                newErrors.phone = 'Το τηλέφωνο πρέπει να αποτελείται από 10 ψηφία.';
            }

            if (!property) {
                newErrors.property = 'Η ιδιότητα είναι υποχρεωτική.';
            }
        } else if (step === 3) {
            if (property === 'babysitter') {
                if (!education) {
                    newErrors.education = 'Η εκπαίδευση είναι υποχρεωτική.';
                }
            } else if (property === 'parent') {
                if (!childFirstName) {
                    newErrors.childFirstName = 'Το όνομα του παιδιού είναι υποχρεωτικό.';
                } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(childFirstName)) {
                    newErrors.childFirstName = 'Το όνομα του παιδιού πρέπει να περιέχει μόνο γράμματα.';
                }

                if (!childLastName) {
                    newErrors.childLastName = 'Το επώνυμο του παιδιού είναι υποχρεωτικό.';
                } else if (!/^[a-zA-Zα-ωΑ-ΩάέήίόύώΆΈΉΊΌΎΏϊϋΐΰ]+$/.test(childLastName)) {
                    newErrors.childLastName = 'Το επώνυμο του παιδιού πρέπει να περιέχει μόνο γράμματα.';
                }

                if (!childBirthDate) {
                    newErrors.childBirthDate = 'Η ημερομηνία γέννησης του παιδιού είναι υποχρεωτική.';
                } else  {
                    const age = new Date().getFullYear() - new Date(childBirthDate).getFullYear();
                    if (age < 0.5 || age > 2.5) {
                        newErrors.childBirthDate = 'Το παιδί πρέπει να είναι από 6 μηνών έως 2.5 ετών.';
                    }
                }

                if (!childGender) {
                    newErrors.childGender = 'Το φύλο του παιδιού είναι υποχρεωτικό.';
                }
            }
        }
    
        setError(newErrors);
    
        // If no errors, return true; otherwise, return false
        return Object.keys(newErrors).length === 0;
    };

    // Sets the value of the input field
    const handleChangeValue = (name, value) => {
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'birthDate':
                setBirthDate(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'afm':
                setAfm(value);
                break;
            case 'area':
                setArea(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'property':
                setProperty(value);
                break;
            case 'education':
                setEducation(value);
                break;
            case 'childFirstName':
                setChildFirstName(value);
                break;
            case 'childLastName':
                setChildLastName(value);
                break;
            case 'childBirthDate':
                setChildBirthDate(value);
                break;
            case 'childGender':
                setChildGender(value);
                break;
            default:
                break;
        }
        setError({});
    }
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setError({});
    
        const valid = await validateForm();

        if (step === 4) {
            navigate('/dashboard');
        }
    
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
                    birthDate: dayjs(birthDate).format('DD/MM/YYYY'),
                    afm,
                    area,
                    phone,
                    property,
                    gender,
                    img: false,
                    createdAt: new Date(),
                    userId: user.uid,

                    // For babysitters
                    education,
                    systatikes: 0,
                    totalRatingAvg: 0,
                    ratingsCount: 0,

                    // For parents
                    childFirstName,
                    childLastName,
                    childBirthDate: childBirthDate ? dayjs(childBirthDate).format('DD/MM/YYYY') : null,
                    childGender,
                });
    
                setLoading(false);
                setError({});
                setStep(step + 1);
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
        "Στοιχεία Iδιότητας",
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
                    { step !== 4 && <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}> Βήμα {step} - {steps[step - 1]} </p> }
                    { step !== 4 && <h5 style={{ fontSize: '12px', marginBottom: '20px', color: '#2E86AB', textDecoration: 'underline' }}> Με * τα υποχρεωτικά πεδία </h5>}

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
                                onChange={(e) => handleChangeValue('email', e.target.value)}
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
                                    onChange={(e) => handleChangeValue('password', e.target.value)}
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
                                    onChange={(e) => handleChangeValue('confirmPassword', e.target.value)}
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
                                onChange={(e) => handleChangeValue('firstName', e.target.value)}
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
                                onChange={(e) => handleChangeValue('lastName', e.target.value)}
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
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                                    <DatePicker
                                    value={parsedDate}
                                    onChange={handleDateChange}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { placeholder: 'Επιλέξτε ημερομηνία', sx: { border: `1px solid ${error.birthDate ? 'red' : '#ddd'}` } }}}
                                    maxDate={dayjs().subtract(1, 'day')}
                                    />
                                </LocalizationProvider>
                                {error.birthDate && <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error.birthDate}</p>}
                            </div>
                        </div>

                        {/* Gender */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Φύλο*</label>
                            <select
                                value={gender}
                                onChange={(e) => handleChangeValue('gender', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${!gender ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            >
                                <option value="">Επιλέξτε Φύλο</option>
                                <option value="Άντρας">Άντρας</option>
                                <option value="Γυναίκα">Γυναίκα</option>
                                <option value="Άλλο">Άλλο</option>
                            </select>
                            {!gender && <p style={{ color: 'red', fontSize: '14px' }}>Η επιλογή φύλου είναι υποχρεωτική.</p>}
                        </div>

                        {/* AFM */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>ΑΦΜ*</label>
                            <input
                                type="text"
                                placeholder="ΑΦΜ"
                                value={afm}
                                onChange={(e) => handleChangeValue('afm', e.target.value)}
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
                                onChange={(e) => handleChangeValue('area', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${!area ? 'red' : '#ddd'}`,
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
                            {!area && <p style={{ color: 'red', fontSize: '14px' }}> Η επιλογή περιοχής είναι υποχρεωτική. </p>}
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Τηλέφωνο*</label>
                            <input
                                type="text"
                                placeholder="Τηλέφωνο"
                                value={phone}
                                onChange={(e) => handleChangeValue('phone', e.target.value)}
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
                                onChange={(e) => handleChangeValue('property', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: `1px solid ${!property ? 'red' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                }}
                            >
                                <option value="">Επιλέξτε Ιδιότητα</option>
                                <option value="parent">Κηδεμόνας</option>
                                <option value="babysitter">Babysitter</option>
                            </select>
                            {!property && <p style={{ color: 'red', fontSize: '14px' }}> Η επιλογή ιδιότητας είναι υποχρεωτική. </p>}
                        </div>
                        </>
                    )}

                    {step === 3 && property === 'babysitter' && (
                        <>
                            {/* Education */}
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Εκπαίδευση*</label>
                                <select
                                    value={education}
                                    onChange={(e) => handleChangeValue('education', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${!education ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                >
                                    <option value="">Επιλέξτε Επίπεδο Εκπαίδευσης</option>
                                    {educationOpt.map((educationName, index) => (
                                        <option key={index} value={educationName}>
                                            {educationName}
                                        </option>
                                    ))}
                                </select>
                                {!education && <p style={{ color: 'red', fontSize: '14px' }}> Η επιλογή εκπαίδευσης είναι υποχρεωτική. </p>}
                            </div>
                        </>
                    )}

                    {step === 3 && property === 'parent' && (
                        <>
                            {/* Child First Name */}
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Όνομα παιδιού*</label>
                                <input
                                    type="text"
                                    placeholder="Όνομα"
                                    value={childFirstName}
                                    onChange={(e) => handleChangeValue('childFirstName', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${error.childFirstName ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                                {error.childFirstName && <p style={{ color: 'red', fontSize: '14px' }}>{error.childFirstName}</p>}
                            </div>

                            {/* Child Last Name */}
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Επώνυμο παιδιού*</label>
                                <input
                                    type="text"
                                    placeholder="Επώνυμο"
                                    value={childLastName}
                                    onChange={(e) => handleChangeValue('childLastName', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${error.childLastName ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                                {error.childLastName && <p style={{ color: 'red', fontSize: '14px' }}>{error.childLastName}</p>}
                            </div>

                            {/* Child Birth Date */}
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>
                                    Ημερομηνία Γέννησης*
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="el">
                                        <DatePicker
                                        value={parsedChildDate}
                                        onChange={handleChildDateChange}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { placeholder: 'Επιλέξτε ημερομηνία', sx: { border: `1px solid ${error.childBirthDate ? 'red' : '#ddd'}` } }}}
                                        maxDate={dayjs().subtract(1, 'day')}
                                        />
                                    </LocalizationProvider>
                                    {error.childBirthDate && <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error.childBirthDate}</p>}
                                </div>
                            </div>

                            {/* Child Gender */}
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Φύλο παιδιού*</label>
                                <select
                                    value={childGender}
                                    onChange={(e) => handleChangeValue('childGender', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: `1px solid ${error.childGender ? 'red' : '#ddd'}`,
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                >
                                    <option value="">Επιλέξτε Φύλο</option>
                                    <option value="Άντρας">Άντρας</option>
                                    <option value="Γυναίκα">Γυναίκα</option>
                                </select>
                                {error.childGender && <p style={{ color: 'red', fontSize: '14px' }}>{error.childGender}</p>}
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h3 style={{ color: 'black', marginBottom: '20px', fontSize: "20px" }}>Η εγγραφή ολοκληρώθηκε με επιτυχία!</h3>
                        </>
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
                        {loading ? (step === 3 ? 'Εγγραφή...' : 'Επόμενο...') : (step === 3 ? 'Εγγραφή' : (step === 4 ? 'Στην Αρχική σας' : 'Επόμενο'))}
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#333' }}>
                        {step === 1 ?
                            <span>Έχετε ήδη λογαριασμό; <a href="/login" style={{ color: '#2E86AB', textDecoration: 'underline', fontWeight: 'bold' }}>Σύνδεση</a></span>
                            : " "
                        }
                    </p>
                </form>
            </div>

            <Footer />
        </div>
    );
}
