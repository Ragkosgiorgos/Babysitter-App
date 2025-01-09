import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Radio from '@mui/material/Radio';
import { capitalizeWords } from "../../Utils/Methods";

function BabysitterFilters({ applyFilters, resetFilters, ageR, areaR, accomodationR, dayR }) {
  const [selectedLocation, setSelectedLocation] = useState(areaR || "");
  const [selectedAge, setSelectedAge] = useState(ageR || "");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedAccomodation, setSelectedAccomodation] = useState(() =>
    accomodationR === "στον χώρο μου"
      ? "Όχι"
      : accomodationR === "στον χώρο του επαγγελματία"
      ? "Ναι"
      : ""
  );  

  const [fullTimeChecked, setFullTimeChecked] = useState(false);
  const [partTimeChecked, setPartTimeChecked] = useState(false);

  const [weekdays, setWeekdays] = useState(capitalizeWords(dayR) === "Καθημερινές" || dayR === "και τα δύο");
  const [weekends, setWeekends] = useState(capitalizeWords(dayR) === "Σαββατοκύριακο" || dayR === "και τα δύο");

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
    "Δημοτικό",
    "Γυμνάσιο",
    "Λύκειο",
    "Πανεπιστήμιο",
  ];

  // Handle changes for city and age dropdowns
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, event.target.value, selectedAge, selectedEducation, hasCar, weekdays, weekends, selectedAccomodation);
  };

  const handleAgeChange = (event) => {
    setSelectedAge(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, event.target.value, selectedEducation, hasCar, weekdays, weekends, selectedAccomodation);
  };

  const handleEducationChange = (event) => {
    setSelectedEducation(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, event.target.value, hasCar, weekdays, weekends, selectedAccomodation);
  };

  const handleFullTimeChange = (event) => {
    setFullTimeChecked(event.target.checked);
    applyFilters(event.target.checked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends, selectedAccomodation);
  };

  const handlePartTimeChange = (event) => {
    setPartTimeChecked(event.target.checked);
    applyFilters(fullTimeChecked, event.target.checked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends, selectedAccomodation);
  };

  const handleCarChange = (event) => {
    setHasCar(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, event.target.value, weekdays, weekends, selectedAccomodation);
  }

  const handleWeekdaysChange = (event) => {
    setWeekdays(event.target.checked);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, event.target.checked, weekends, selectedAccomodation);
  };

  const handleWeekendsChange = (event) => {
    setWeekends(event.target.checked);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, event.target.checked, selectedAccomodation);
  }
  const handleAccomodationChange = (event) => {
    setSelectedAccomodation(event.target.value);
    applyFilters(fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends, event.target.value);
  }

  const handleClearAll = () => {
    setSelectedLocation("");
    setSelectedAge("");
    setFullTimeChecked(false);
    setPartTimeChecked(false);
    setWeekdays(false);
    setWeekends(false);
    setSelectedEducation("");
    setSelectedAccomodation("");
    setHasCar("");
    resetFilters();
  };

  useEffect(() => {
    applyFilters(
      fullTimeChecked,
      partTimeChecked,
      selectedLocation,
      selectedAge,
      selectedEducation,
      hasCar,
      weekdays,
      weekends,
      selectedAccomodation
    );
  }, []); // This will run only on the initial render  

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
          <h6 style={{fontWeight:"bold"}}>Ημέρες</h6>
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
          <FormControlLabel
            control={<Radio checked={hasCar === "Ναι"} onChange={handleCarChange} value={"Ναι"} />}
            label="Ναι"
          />
          <FormControlLabel
            control={<Radio checked={hasCar === "Όχι"} onChange={handleCarChange} value={"Όχι"} />}
            label="Όχι"
          />
        </div>
        <div style={{ marginTop: "2vh" }}>
          <h6 style={{fontWeight:"bold"}}>Φιλοξενία</h6>
            <FormControlLabel
              control={<Radio checked={selectedAccomodation === "Όχι"} onChange={handleAccomodationChange} value={"Όχι"} />}
              label="Στον χώρο μου"
            />
            <FormControlLabel
              control={<Radio checked={selectedAccomodation === "Ναι"} onChange={handleAccomodationChange} value={"Ναι"} />}
              label="Στον χώρο του επαγγελματία"
            />
        </div>
      </div>
    </div>
  );
}

export default BabysitterFilters;
