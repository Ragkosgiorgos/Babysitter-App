import React from "react";

function Footer() {
    return (
      <footer style={{ backgroundColor: '#343a40', color: 'white', padding: '3px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontSize: '14px' }}>
        <div style={{ textAlign: 'left', marginLeft:"15px" }}>
            <p style={{ margin: '0' }}> ΕΠΙΚΟΙΝΩΝΙΑ:</p>
            <p style={{ margin: '0' }}> 2107777777</p>
            <p style={{ margin: '0' }}> rand@gov.gr</p>

        </div>

        <div style={{ textAlign: 'center' }}>
            <p> Copyright  &copy; 2024 GOV</p>
        </div>

        <div style={{ textAlign: 'right', marginRight:"15px" }}>
            <p  style={{ textAlign: 'left'}}>Όροι χρήσης κηδεμόνα</p>
            <p>Όροι χρήσης Επαγγελματία</p>

        </div>
      </footer>
    );
}

export default Footer;
