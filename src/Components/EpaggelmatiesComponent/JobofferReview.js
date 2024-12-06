import React from "react";

function JobofferReview(props){

return(
    <div style={{ borderRadius: "10px", backgroundColor: "#d3d3d3", height: "35vh", width: "20%", paddingTop: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                <span style={{ marginLeft: "4%" }}>Τίτλος</span>
                <div style={{ borderBottom: "1px solid #000", marginTop: "10px" }}></div>
                <span style={{ marginLeft: "4%" }}>Περιγραφή</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                <button style={{ borderRadius: "10px", width: "70%" }}>
                    <span>Δείτε την αγγελία</span>
                </button>
                </div>
    </div>
);

}

export default JobofferReview;