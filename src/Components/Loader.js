import React, { useEffect } from 'react';

const Loader = () => {
    const loadingCircleStyle = {
        width: '50px',
        height: '50px',
        border: '5px solid #e0e0e0',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    useEffect(() => {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(
            `@keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }`,
            styleSheet.cssRules.length
        );
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={loadingCircleStyle}></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loader;
