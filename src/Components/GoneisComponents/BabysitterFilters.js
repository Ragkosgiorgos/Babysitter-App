import React, { useState } from "react";
import { Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Radio from '@mui/material/Radio';

function BabysitterFilters({ applyFilters, resetFilters }) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");

  const [fullTimeChecked, setFullTimeChecked] = useState(false);
  const [partTimeChecked, setPartTimeChecked] = useState(false);

  const [weekdays, setWeekdays] = useState(false);
  const [weekends, setWeekends] = useState(false);

  const [hasCar, setHasCar] = useState(false);

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
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
  ];

  const education = [
    "Πρωτοβάθμια",
    "Δευτεροβάθμια",
    "Τριτοβάθμια"
  ];

  // Handle changes for city and age dropdowns
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, event.target.value, selectedAge, selectedEducation, hasCar);
  };

  const handleAgeChange = (event) => {
    setSelectedAge(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, event.target.value, selectedEducation, hasCar);
  };

  const handleEducationChange = (event) => {
    setSelectedEducation(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, event.target.value, hasCar, weekdays, weekends);
  };

  const handleFullTimeChange = (event) => {
    setFullTimeChecked(event.target.checked);
    applyFilters(event.target.checked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends);
  };

  const handlePartTimeChange = (event) => {
    setPartTimeChecked(event.target.checked);
    applyFilters(fullTimeChecked, event.target.checked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends);
  };

  const handleCarChange = (event) => {
    setHasCar(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, event.target.value, weekdays, weekends);
  }

  const handleWeekdaysChange = (event) => {
    setWeekdays(event.target.checked);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, event.target.checked, weekends);
  };

  const handleWeekendsChange = (event) => {
    setWeekends(event.target.checked);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, event.target.checked);
  }

  const handleClearAll = () => {
    setSelectedLocation("");
    setSelectedAge("");
    setFullTimeChecked(false);
    setPartTimeChecked(false);
    setWeekdays(false);
    setWeekends(false);
    setSelectedEducation("");
    setHasCar(false);
    resetFilters();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "10%", marginLeft: "40px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h4 style={{fontWeight:"bold"}}>Φίλτρα αναζήτησης</h4>
            <button
              style={{ backgroundColor: "white", border: "1px solid white" }} onClick={handleClearAll}>
                <h6 style={{ marginLeft: "10px", marginTop: "1vh", textDecoration:"underline" }}>Καθαρισμός</h6>
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
                value={selectedLocation}
                onChange={handleLocationChange}
                style={{ width: "80%" }}
                displayEmpty
              >
                {<MenuItem value="">Επιλέξτε Περιοχή</MenuItem>}
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
                {<MenuItem value="">Επιλέξτε Ηλικία</MenuItem>}
                {age.map((item) => (
                  <MenuItem key={item} value={item.toLowerCase()}>
                    {item} ετών
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Ημέρες και ώρες</h6>
          <FormControlLabel
            control={<Checkbox checked={weekdays} onChange={handleWeekdaysChange} />}
            label="Καθημερινές"
          />
          <FormControlLabel
            control={<Checkbox checked={weekends} onChange={handleWeekendsChange} />}
            label="Σαββατοκύριακο"
          />
        </div>
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
                {<MenuItem value="">Επιλέξτε Εκπαίδευση</MenuItem>}
                {education.map((edu) => (
                  <MenuItem key={edu} value={edu.toLowerCase()}>
                    {edu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Μεταφορικό μέσο</h6>
          <Radio
            checked={hasCar}
            onChange={handleCarChange}
            value="Ναι"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'Ναι' }}
          />
          Ναι
          <Radio
            checked={!hasCar}
            onChange={handleCarChange}
            value="Όχι"
            name="radio-buttons"
            inputProps={{ 'aria-label': 'Όχι' }}
          />
          Όχι

        </div>
      </div>
    </div>
  );
}

export default BabysitterFilters;
