import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

// Mapping English terms to Greek translations
const translations = {
  ratings: "Αξιολογήσεις",
  home: "Αρχική",
  posts: "Αγγελίες",
  login: "Σύνδεση",
  register: "Εγγραφή",
  profiles: "Προφίλ",
  goneis: "Κηδεμόνες",
  khdemones: "Κηδεμόνες",
  Home: "Αρχική",
  anazitisi: "Αναζήτηση",
  viewPost: "Προβολή αγγελίας",
  previewAksiologisi: "Προβολή αξιολόγησης",
  epaggelmaties: "Babysitters",
  viografiko: "Βιογραφικό",
  aggelies: "Αγγελίες",
  previewAggelias: "Προβολή αγγελίας",
  dashboard: "Dashboard",
  add: "Προσθήκη",
  rantevou: "Ραντεβού",
  available: "Διαθέσιμα",
  Symfwnitika: "Συμφωνητικά",
  Pliromes: "Πληρωμές",
  edit: "Επεξεργασία",
  proepiskopisi: "Προεπισκόπηση",
  babysitters: "Babysitters",
  view: "Προβολή",
  aitiseisEndiaferontos: "Αιτήσεις ενδιαφέροντος",
  neaPliromi: "Δημιουργία",
  apantisi: "Απάντηση",
};

function Breadcrumbs() {
  const location = useLocation();
  const { contractId } = useParams(); // Use useParams to capture dynamic parameters
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" style={{ marginTop: '10px', marginLeft: '20px' }}>
      <ol className="breadcrumb" style={{ marginBottom: '0' }}>
        <li className="breadcrumb-item">
          <Link to="/">Αρχική</Link>
        </li>
        {pathnames.map((value, index) => {
          // Skip the dynamic parameter (`contractId`) in the breadcrumb
          if (value === contractId) return null;

          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const translatedValue = translations[value] || value;

          return (
            <React.Fragment key={to}>
              {index !== pathnames.length - 1 ? (
                <li className="breadcrumb-item">
                  <Link to={to}>{translatedValue}</Link>
                </li>
              ) : (
                <li className="breadcrumb-item active" aria-current="page">
                  {translatedValue}
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
