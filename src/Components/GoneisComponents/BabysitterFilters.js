import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function BabysitterFilters(props) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedEducation, setSelectedEducation] = useState(""); 

  const [fullTimeChecked, setFullTimeChecked] = useState(false);
  const [partTimeChecked, setPartTimeChecked] = useState(false);

  const [timeMondayFrom, setTimeMondayFrom] = useState(null);
  const [timeMondayTo, setTimeMondayTo] = useState(null);
  const [timeTuesdayFrom, setTimeTuesdayFrom] = useState(null);
  const [timeTuesdayTo, setTimeTuesdayTo] = useState(null);
  const [timeWednesdayFrom, setTimeWednesdayFrom] = useState(null);
  const [timeWednesdayTo, setTimeWednesdayTo] = useState(null);
  const [timeThursdayFrom, setTimeThursdayFrom] = useState(null);
  const [timeThursdayTo, setTimeThursdayTo] = useState(null);
  const [timeFridayFrom, setTimeFridayFrom] = useState(null);
  const [timeFridayTo, setTimeFridayTo] = useState(null);
  const [timeSaturdayFrom, setTimeSaturdayFrom] = useState(null);
  const [timeSaturdayTo, setTimeSaturdayTo] = useState(null);
  const [timeSundayFrom, setTimeSundayFrom] = useState(null);
  const [timeSundayTo, setTimeSundayTo] = useState(null);

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

  const age = [
    "0,5",
    "0,6",
    "0,7",
    "0,8",
    "0,9",
    "1.0",
    "1.1",
    "1.2",
    "1.3",
    "1.4",
    "1.5",
    "1.6",
    "1,7",
    "1,8",
    "1,9",
    "2.0",
    "2.1",
    "2.2",
    "2.3",
    "2.4",
    "2.5",
  ];

  const education = [
    "Πρωτοβάθμια",
    "Δευτεροβάθμια",
    "Τριτοβάθμια"
  ]

  // Handle changes for city and age dropdowns
  const handleCityChange = (event) => setSelectedCity(event.target.value);
  const handleAgeChange = (event) => setSelectedAge(event.target.value);
  const handleEducationChange = (event) => setSelectedEducation(event.target.value);

  const handleFullTimeChange = (event) => setFullTimeChecked(event.target.checked);
  const handlePartTimeChange = (event) => setPartTimeChecked(event.target.checked);

  const handleClearAll = () => {
    setSelectedCity("");
    setSelectedAge("");
    setFullTimeChecked(false);
    setPartTimeChecked(false);
    setSelectedEducation("");

    setTimeMondayFrom(null);
    setTimeMondayTo(null);
    setTimeTuesdayFrom(null);
    setTimeTuesdayTo(null);
    setTimeWednesdayFrom(null);
    setTimeWednesdayTo(null);
    setTimeThursdayFrom(null);
    setTimeThursdayTo(null);
    setTimeFridayFrom(null);
    setTimeFridayTo(null);
    setTimeSaturdayFrom(null);
    setTimeSaturdayTo(null);
    setTimeSundayFrom(null);
    setTimeSundayTo(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "30%",height:"100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "10%", marginLeft: "40px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h4 style={{fontWeight:"bold"}}>Φίλτρα αναζήτησης</h4>
            <button
              style={{ backgroundColor: "white", border: "1px solid white" }} onClick={handleClearAll}>
                <h8 style={{ marginLeft: "10px", marginTop: "1vh", textDecoration:"underline" }}>Καθαρισμός</h8>
            </button>
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Χρονος Απασχόλησης</h6>
            <FormControlLabel
              control={<Checkbox checked={fullTimeChecked} onChange={handleFullTimeChange} />}
              label="Πλήρης"
            />
            <FormControlLabel
              control={<Checkbox checked={partTimeChecked} onChange={handlePartTimeChange} />}
              label="Μερική"
            />
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Περιοχή Διαμονής</h6>
            <FormControl fullWidth style={{ marginTop: "1vh", fontSize:"5%" }}>
              <InputLabel id="area-select-label"></InputLabel>
              <Select
                labelId="area-select-label"
                value={selectedCity}
                onChange={handleCityChange}
                style={{ width: "80%" }}
                displayEmpty
              >
                {selectedCity === "" && <MenuItem value="" disabled>Επιλέξτε Περιοχή</MenuItem>}
                {areasOfGreece.map((area) => (
                  <MenuItem key={area} value={area.toLowerCase()}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Ηλικία παιδιού</h6>
            <FormControl fullWidth style={{ marginTop: "1vh" }}>
              <InputLabel id="age-select-label"></InputLabel>
              <Select
                labelId="age-select-label"
                value={selectedAge}
                onChange={handleAgeChange}
                style={{ width: "80%" }}
                displayEmpty
              >
                {selectedAge === "" && <MenuItem value="" disabled>Επιλέξτε Ηλικία</MenuItem>}
                {age.map((item) => (
                  <MenuItem key={item} value={item.toLowerCase()}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ marginTop: "2vh", display: "flex", flexDirection: "column" }}>
            <h6 style={{fontWeight:"bold"}}>Ημέρες και ώρες</h6>
              <div style={{ marginTop: "1vh", display: "flex", flexDirection: "column", gap: "10px" , width:"80%"}}>
                {[
                  { day: "Δευτέρα", from: timeMondayFrom, to: timeMondayTo, setFrom: setTimeMondayFrom, setTo: setTimeMondayTo },
                  { day: "Τρίτη", from: timeTuesdayFrom, to: timeTuesdayTo, setFrom: setTimeTuesdayFrom, setTo: setTimeTuesdayTo },
                  { day: "Τετάρτη", from: timeWednesdayFrom, to: timeWednesdayTo, setFrom: setTimeWednesdayFrom, setTo: setTimeWednesdayTo },
                  { day: "Πέμπτη", from: timeThursdayFrom, to: timeThursdayTo, setFrom: setTimeThursdayFrom, setTo: setTimeThursdayTo },
                  { day: "Παρασκευή", from: timeFridayFrom, to: timeFridayTo, setFrom: setTimeFridayFrom, setTo: setTimeFridayTo },
                  { day: "Σάββατο", from: timeSaturdayFrom, to: timeSaturdayTo, setFrom: setTimeSaturdayFrom, setTo: setTimeSaturdayTo },
                  { day: "Κυριακή", from: timeSundayFrom, to: timeSundayTo, setFrom: setTimeSundayFrom, setTo: setTimeSundayTo },
                ].map(({ day, from, to, setFrom, setTo }) => (
                  <div key={day} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <h8>{day}</h8>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <TimePicker
                        label="Από"
                        value={from}
                        onChange={(newValue) => setFrom(newValue)}
                        renderInput={(params) => <input {...params} />}
                      />
                      <TimePicker
                        label="Έως"
                        value={to}
                        onChange={(newValue) => setTo(newValue)}
                        renderInput={(params) => <input {...params} />}
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </LocalizationProvider>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Εκπαίδευση</h6>
            <FormControl fullWidth style={{ marginTop: "1vh" }}>
              <InputLabel id="education-select-label"></InputLabel>
              <Select
                labelId="education-select-label"
                value={selectedEducation}
                onChange={handleEducationChange}
                style={{ width: "80%" }}
                displayEmpty
              >
                {selectedEducation === "" && <MenuItem value="" disabled>Επιλέξτε Εκπαίδευση</MenuItem>}
                {education.map((edu) => (
                  <MenuItem key={edu} value={edu.toLowerCase()}>
                    {edu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
      </div>
    </div>
  );
}

export default BabysitterFilters;
