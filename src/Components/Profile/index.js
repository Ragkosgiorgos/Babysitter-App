import './index.css';
import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH , FIREBASE_DB} from '../../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { convertDateFormat } from '../../Utils/Methods';

export default function Profile() {
    const [email, setEmail] = useState(null);
    const [userId, setUserId] = useState(null); // Store the user ID
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // For all
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [afm, setAfm] = useState('');
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [property, setProperty] = useState('');

    // For parents
    const [childFirstName, setChildFirstName] = useState('');
    const [childLastName, setChildLastName] = useState('');
    const [childBirthDate, setChildBirthDate] = useState('');
    const [childAmka, setChildAmka] = useState('');

    // For babysitters
    const [education, setEducation] = useState('');
    const [img, setImg] = useState(false);
    const [description, setDescription] = useState('');

    const [formMessage, setFormMessage] = useState('');
    const [userData, setUserData] = useState([]); // State for fetched user data

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setEmail(user.email);
                setUserId(user.uid); // Store the user's UID
            } else {
                setEmail(null);
                setUserId(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserData(); // Fetch user data only after the user_id is available
        }
    }, [userId]);

    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');
        
        try {
            const payload = {
                // For all
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
                afm: afm,
                area: area,
                address: address,
                phone: phone,
                email: email,
                property: property,
                
                // For parents
                childFirstName: childFirstName,
                childLastName: childLastName,
                childBirthDate: childBirthDate,
                childAmka: childAmka,
                
                // For babysitters
                education: education,
                description: description,
                img: img,
                
                userId: userId, // Add the user's UID
                createdAt: new Date(),
            }
            
            await addDoc(collection(FIREBASE_DB, 'user'), payload);

            setFormMessage('Data submitted successfully!');
            setFirstName('');
            setLastName('');
            setBirthDate('');
            setAfm('');
            setArea('');
            setAddress('');
            setPhone('');
            setProperty('');
            setChildFirstName('');
            setChildLastName('');
            setChildBirthDate('');
            setChildAmka('');
            setEducation('');
            setImg('');
            setDescription('');
            fetchUserData(); // Refresh user data after submission
        } catch (error) {
            console.error('Error adding document:', error);
            setFormMessage('Error submitting data. Please try again.');
        }
    };

    const fetchUserData = async () => {
        try {
            const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', userId)); // Query only data matching the user's UID
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserData(users);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='courses'>
            <h1>Welcome</h1>
            {email ? <p>Your email: {email}</p> : <p>No user logged in</p>}
            <button onClick={handleLogout}>Logout</button>
            <h2>Submit User Data</h2>
            <form onSubmit={handleFormSubmit} className="data-form">
                <div className="form-row">
                    <label>Ιδιότητα:</label>
                    <select
                        value={property}
                        onChange={(e) => setProperty(e.target.value)}
                        required
                    >
                        <option value="">Select</option>
                        <option value="parent">Κηδεμόνας</option>
                        <option value="babysitter">Επαγγελματίας</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Όνομα:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Επίθετο:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Ημερομηνία γέννησης:</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>ΑΦΜ:</label>
                    <input
                        type="text"
                        value={afm}
                        onChange={(e) => setAfm(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Πόλη:</label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                    >
                        <option value="">Επιλέξτε</option>
                        <option value="athens">Αθήνα</option>
                        <option value="thessaloniki">Θεσσαλονίκη</option>
                        <option value="patra">Πάτρα</option>
                        <option value="heraklion">Ηράκλειο</option>
                        <option value="larissa">Λάρισα</option>
                        <option value="volos">Βόλος</option>
                        <option value="ioannina">Ιωάννινα</option>
                        <option value="kavala">Καβάλα</option>
                        <option value="chania">Χανιά</option>
                        <option value="rhodes">Ρόδος</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Διεύθυνση:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Τηλέφωνο:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        readOnly
                    />
                </div>
                {property === 'parent' && (
                    <>
                        <div className="form-row">
                            <label>Όνομα παιδιού:</label>
                            <input
                                type="text"
                                value={childFirstName}
                                onChange={(e) => setChildFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>Επίθετο παιδιού:</label>
                            <input
                                type="text"
                                value={childLastName}
                                onChange={(e) => setChildLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>Ημερομηνία γέννησης παιδιού:</label>
                            <input
                                type="date"
                                value={childBirthDate}
                                onChange={(e) => setChildBirthDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <label>ΑΜΚΑ παιδιού:</label>
                            <input
                                type="text"
                                value={childAmka}
                                onChange={(e) => setChildAmka(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                {property === 'babysitter' && (
                    <>
                        <div className="form-row">
                            <label>Εκπαίδευση:</label>
                            <select
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                required
                            >
                                <option value="">Επιλέξτε</option>
                                <option value="none">Καμία</option>
                                <option value="primary-school">Δημοτικό</option>
                                <option value="middle-school">Γυμνάσιο</option>
                                <option value="high-school">Λύκειο</option>
                                <option value="university">Πανεπιστήμιο</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Περιγραφή:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='form-row'>
                            <label>Φωτογραφία:</label>
                            <input
                                type='file'
                                onChange={(e) => setImg(e.target.files[0] ? true : false)}
                            />
                        </div>
                    </>
                )}
                <button type="submit">Submit</button>
                {formMessage && <p>{formMessage}</p>}
            </form>
            <h2>User Data</h2>
            {userData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Property</th>
                            <th>Birth Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.property}</td>
                                <td>{convertDateFormat(user.birthDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No user data found</p>
            )}
        <button onClick={() => navigate('/')} className='back'>Αρχική σελίδα</button>
        </div>
    );
}
