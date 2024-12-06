import React, {useState} from "react";
import { Checkbox, FormControlLabel } from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


function BabysitterFilters(props){
    
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedAge, setSelectedAge] = useState("");

    const [fullTimeChecked, setFullTimeChecked] = useState(false);
    const [partTimeChecked, setPartTimeChecked] = useState(false);

    const [timeMonday, setTimeMonday] = useState(null);
    const [timeTuesday, setTimeTuesday] = useState(null);
    const [timeWednesday, setTimeWednesday] = useState(null);
    const [timeThursday, setTimeThursday] = useState(null);
    const [timeFriday, setTimeFriday] = useState(null);
    const [timeSaturday, setTimeSaturday] = useState(null);
    const [timeSunday, setTimeSunday] = useState(null);

    const areasOfGreece = [
        'Αθήνα',
        'Θεσσαλονίκη',
        'Πάτρα',
        'Ηράκλειο',
        'Λάρισα',
        'Βόλος',
        'Ιωάννινα',
        'Καβάλα',
        'Χανιά',
        'Ρόδος'
      ];

    const age = [
        '0,5',
        '0,6',
        '0,7',
        '0,8',
        '0,9',
        '1.0',
        '1.1',
        '1.2',
        '1.3',
        '1.4',
        '1.5',
        '1.6',
        '1,7',
        '1,8',
        '1,9',
        '2.0',
        '2.1',
        '2.2',
        '2.3',
        '2.4',
        '2.5',

    ];

    // Handle changes for city and age dropdowns
    const handleCityChange = (event) => setSelectedCity(event.target.value);
    const handleAgeChange = (event) => setSelectedAge(event.target.value);

    const handleFullTimeChange = (event) => setFullTimeChecked(event.target.checked);
    const handlePartTimeChange = (event) => setPartTimeChecked(event.target.checked);
    
    return(
        <div style={{ display: 'flex', flexDirection: 'column', height: "70vh",width:"30%" }}  >
        <div style={{display: 'flex', flexDirection: 'column',marginTop:'10%',marginLeft:'40px'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <h4>Φίλτρα αναζήτησης</h4>
            <button style={{backgroundColor:"white", border: "1px solid white"}} onClick={() => {
                setSelectedCity("");
                setSelectedAge("");
                setFullTimeChecked(false); // Uncheck full-time checkbox
                setPartTimeChecked(false); // Uncheck part-time checkbox
              }}>
            <h7 style={{marginLeft:'10px',marginTop:'1vh'}} >Καθαρισμός</h7>
            </button>
            </div>
            <div style={{marginTop:'2vh'}}>
                <h4>Χρονος Απασχόλησης</h4>
                <FormControlLabel control={<Checkbox checked={fullTimeChecked} onChange={handleFullTimeChange} />} label="Πλήρης"/>
                <FormControlLabel control={<Checkbox checked={partTimeChecked} onChange={handlePartTimeChange} />} label="Μερική"/>
            </div>
            <div style={{ marginTop: "2vh" }}>
                <h4>Περιοχή Διαμονής</h4>
                <FormControl fullWidth style={{ marginTop: "1vh" }}>
                <InputLabel id="area-select-label"></InputLabel>
                <Select labelId="area-select-label" value={selectedCity} onChange={handleCityChange} style={{ width: "80%" }} displayEmpty>
                    {selectedCity === "" && (<MenuItem value="" disabled>Επιλέξτε Περιοχή</MenuItem>)}
                    {areasOfGreece.map((area) => (
                    <MenuItem key={area} value={area.toLowerCase()}>
                        {area}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </div>
            <div style={{ marginTop: "2vh" }}>
                <h4>Ηλικία παιδιού</h4>
                <FormControl fullWidth style={{ marginTop: "1vh" }}>
                    <InputLabel id="age-select-label"></InputLabel>
                    <Select labelId="age-select-label" value={selectedAge} onChange={handleAgeChange} style={{ width: "80%" }} displayEmpty>
                        {selectedAge === "" && ( <MenuItem value="" disabled> Επιλέξτε Ηλικία </MenuItem>)}
                        {age.map((item) => (
                            <MenuItem key={item} value={item.toLowerCase()}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div style={{ marginTop: "2vh", display:"flex", flexDirection:"column" }}>
                <h4>Ημέρες και ώρες</h4>
                <div style={{ marginTop: "1vh", display:"flex", flexDirection:"column" }}>
                    <h8>Δευτέρα</h8>
                    <h8>Τρίτη</h8>
                    <h8>Τετάρτη</h8>
                    <h8>Πέμπτη</h8>
                    <h8>Παρασκευή</h8>
                    <h8>Σάββατο</h8>
                    <h8>Κυριακή</h8>
                </div>
            </div>
        </div>
    </div>
    );
}

export default BabysitterFilters;