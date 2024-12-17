import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from "react-router-dom";


function AddRantevouPGU() {
  const [profiles, setProfiles] = useState([]); // Initialize as an empty array

  const navigate = useNavigate(); 
  

  useEffect(() => {
    fetch("/data/rantevou.json")
      .then((response) => {
        console.log("Response:", response); // Debug the response object
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse as JSON
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setProfiles(data); // Update the state
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  const today = dayjs();

  const isInPast = (date) => (date.get('year') < dayjs().get('year')) || (date.get('year') == dayjs().get('year') && date.get('month') < dayjs().get('month')) || (date.get('year') == dayjs().get('year') && date.get('month') == dayjs().get('month') && date.get('date') < dayjs().get('date'));

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header log="not_connected" />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Προσθήκη διαθέσιμου ραντεβού</h2>
              <Tooltip title={
                              <div style={{ display: "flex", justifyContent: "center", gap: "5%", flexDirection:"column" }}>
                                {/* <div><  style={{ cursor: "pointer" }} />: στοιχεία ραντεβού</div> */}
                                <div><DeleteForeverIcon style={{ cursor: "pointer" }}  />: διαγραφή ραντεβού</div>
                              </div>} placement="top" style={{marginTop:"3%"}}>
                  <Button> <InfoIcon /> </Button>
                </Tooltip>
            </div>
            {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", marginLeft: "70%" }}>
              
              <button style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", border: "none", 
                                borderRadius: "5px", cursor: "pointer", border: "3px solid #333", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)" }}>
                Προσθήκη διαθέσιμου ραντεβού
              </button>
              
            </div> */}

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>

              <table style={{ width: "50%", backgroundColor: "#D9EAFD", textAlign: "center", borderRadius:"10px" }}>

                <tbody>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['Ημερομηνία και ώρα']}>
                        <DemoItem label="Ημερομηνία και ώρα">
                        <DateTimePicker defaultValue={today} shouldDisableYear={isInPast} />
                        </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="end"
                    >
                    <FormControlLabel
                    value="bottom"
                    control={<Radio />}
                    label="Διαδικτυακά"
                    labelPlacement="end"
                    />
                    <FormControlLabel value="end" control={<Radio />} label="Δια ζώσης" />
                    </RadioGroup>
                </FormControl>
                </tbody>
              </table>

            </div>
                    
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", gap: "50%" }}>
                    <button onClick={()=> navigate(-1)} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Προηγούμενο</button>
                    <button onClick={()=> navigate(-1)} style={{  height: "3%", backgroundColor: "green", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Προσθήκη</button>
            </div>
            
          </div>

        </div>
      </div>
      
      <div>
        <Footer />
      </div>
      
    </div>
  );
}

export default AddRantevouPGU;
