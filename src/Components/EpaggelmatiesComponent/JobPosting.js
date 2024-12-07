import React from "react";

function JobPosting(props){

    return(

        <div style={{marginTop:"5vh",marginLeft:"12%",backgroundColor:"#D3D3D3",width:"50%",height:"35vh"}}>
            <div  style={{display:"flex",flexDirection:"column"}}>    
                <div style={{display:"flex",flexDirection:"row"}}>
                <img style={{ marginRight: '8px' }}src="/logo192.png"width="100"height="100"className="d-inline-block align-top"alt=""/>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <h3>Hliana Tsourea</h3>
                        <div style={{display:"flex",flexDirection:"column",marginLeft:"6%"}}>
                            <h6>Poli: Athina</h6>
                            <h6>Ilikia: 21</h6>
                            <h6>Filoxenia ston xwro mou: oxi</h6>
                            <h6>Xronos apasxolisis: Meriki</h6>
                            <h6>Ekpaideysi: Deuterobathmia</h6>
                        </div>
                    </div>
                </div>
                <button style={{ alignSelf: "center", marginTop: "auto", width: "40%",marginTop:"5px" }}> Δείτε περισσότερα!</button>
            </div>
        </div>
    );

}

export default JobPosting;