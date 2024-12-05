import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();  


  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" style={{ marginTop: '10px' }}>
      <ol className="breadcrumb" style={{ marginBottom: '0' }}>
        <li className="breadcrumb-item">
          <Link to="/">Home</Link> 
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;  
          return (
            <React.Fragment key={to}>
              {index !== pathnames.length - 1 ? (
                <>
                  <li className="breadcrumb-item">
                    <Link to={to}>{value}</Link>
                  </li>
                  <li className="breadcrumb-item" aria-hidden="true">
                    <span>  </span>
                  </li>
                </>
              ) : (
                <li className="breadcrumb-item active" aria-current="page">
                  {value}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;




