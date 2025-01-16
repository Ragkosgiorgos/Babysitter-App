import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumbs from '../Breadcrumbs';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH } from '../../config/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        if (!email && !password) {
            setError('Συμπληρώστε τα πεδία email και κωδικό πρόσβασης');
            return;
        } else if (!email) {
            setError('Συμπληρώστε το email');
            return;
        } else if (!password) {
            setError('Συμπληρώστε τον κωδικό πρόσβασης');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(matchError(error.message));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser) {
                navigate('/dashboard');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const matchError = (error) => {
        const errorMessages = {
            "Firebase: Error (auth/invalid-credential).": "Λάθος email ή κωδικός πρόσβασης!",
            "Firebase: Error (auth/user-not-found).": "Λάθος email ή κωδικός πρόσβασης!",
            "Firebase: Error (auth/wrong-password).": "Λάθος κωδικός πρόσβασης!",
            "Firebase: Error (auth/invalid-email).": "Λάθος μορφή email!",
            "Firebase: Error (auth/too-many-requests).": "Πολλά αιτήματα σύνδεσης. Προσπαθήστε αργότερα!",
        };
        return errorMessages[error] || "Κάτι πήγε στραβά. Προσπαθήστε ξανά.";
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', backgroundColor: 'white', color: '#333' }}>
            <Header />
            <Breadcrumbs />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
                <form onSubmit={handleLogin} style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', padding: '30px', width: '100%', maxWidth: '400px', 
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#2E86AB' }}> Καλωσήρθατε! </h2>

                    {error && (
                        <p style={{ 
                            backgroundColor: '#fce4e4', color: '#d32f2f', padding: '10px', borderRadius: '8px', 
                            border: '1px solid #f8d7da', marginBottom: '20px', fontSize: '14px', textAlign: 'center'
                        }}>
                            {error}
                        </p>
                    )}

                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Email</label>
                        <input type="" placeholder="πχ. dimitris@test.com" value={email} onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
                    </div>

                    <div style={{ marginBottom: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2E86AB' }}>Password</label>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Κωδικός πρόσβασης" value={password} onChange={(e) => setPassword(e.target.value)} 
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: 'none', border: 'none', color: '#2E86AB', cursor: 'pointer',
                                    fontSize: '18px', marginLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 20px', backgroundColor: '#2E86AB', border: 'none', color: 'white', fontSize: '16px',
                                             borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {
                            loading ? 
                                <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #2E86AB', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> 
                            : 'Σύνδεση'
                        }
                    </button>
                    <hr />
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#333' }}>
                        Δεν έχετε λογαριασμό; <a href="/register" style={{ color: '#2E86AB', textDecoration: 'underline', fontWeight: 'bold' }}>Εγγραφή</a>
                    </p>

                </form>
            </div>
            <Footer />
        </div>
    );
}
