import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";

function EditRantevouPGU() {

  const navigate = useNavigate();

  const today = dayjs();

  const isInPast = (date) => (date.get('year') < dayjs().get('year'))|| (date.get('year') === dayjs().get('year') && date.get('month') < dayjs().get('month')) || (date.get('year') === dayjs().get('year') && date.get('month') === dayjs().get('month') && date.get('date') < dayjs().get('date'));

  return (
    <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "column", overflow: "auto", minHeight: "100vh" }}>
      <div>
        <Header />

        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>

          <div style={{ flex: 1, overflowY: "auto" }}>

            <Breadcrumbs />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center", marginTop: "3%" }}>Επεξεργασία διαθέσιμου ραντεβού</h2>
            </div>

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
                    <button onClick={()=> navigate(-1)} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Επιστροφή</button>
                    <button onClick={()=> navigate(-1)} style={{  height: "3%", backgroundColor: "#2b8cbe", color: "white", borderRadius: "5px", marginTop: "2%", width: "12%", }}>Αποθήκευση</button>
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

export default EditRantevouPGU;
