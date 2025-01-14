import React from "react";

function Footer() {
    return (
      <footer style={{ backgroundColor: '#2E86AB', color: 'white', padding: '3px 0', display: 'flex', 
                      justifyContent: 'space-between', alignItems: 'center',fontSize: '14px', marginTop: '4vh' }}>
        <div style={{ textAlign: 'left', marginLeft:"15px", marginTop:"0.2vh" }}>
            <p style={{ margin: '0' }}> Επικοινωνία:</p>
            <p style={{ margin: '0' }}> 2100000000</p>
            <p style={{ margin: '0' }}> rand@gov.gr</p>
        </div>

        <div style={{ textAlign: 'center', marginTop:"2vh" }}>
            <p> Copyright  &copy; 2024 GOV</p>
        </div>

        <div style={{ textAlign: 'right', marginRight:"15px", marginTop:"2vh" }}>
        </div>
      </footer>
    );
}

export default Footer;
