import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";

// Helper function to capitalize first letter of each word
function capitalizeWords(str) {
  if (str === undefined || str === null) {
    return ''; // Return an empty string if the value is undefined or null
  }
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function BabysitterSearch() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    fetch("/data/ntantades.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfiles(data);
        setFilteredProfiles(data); // Initially, display all profiles
      })
      .catch((error) => {
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  const applyFilters = (
    fullTimeChecked,
    partTimeChecked,
    selectedLocation,
    selectedAge,
    selectedEducation,
    timeSlots
  ) => {
    console.log("Filters Applied: ", { fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, timeSlots });

    let filtered = profiles;

    // Filter by Χρόνος Απασχόλησης
    if (fullTimeChecked || partTimeChecked) {
      filtered = filtered.filter(profile =>
        (fullTimeChecked && profile.Apasxolisi === "Πλήρης") ||
        (partTimeChecked && profile.Apasxolisi === "Μερική")
      );
    }

    // Filter by Περιοχή Διαμονής
    if (selectedLocation) {
      filtered = filtered.filter(profile => profile.Polh.toLowerCase() === selectedLocation.toLowerCase());
    }
    
    // Filter by Ηλικία Παιδιού
    if (selectedAge) {
      filtered = filtered.filter(profile => {
        const minAge = parseFloat(profile.hlikia_apo);
        const maxAge = parseFloat(profile.hlikia_ews);
        return selectedAge >= minAge && selectedAge <= maxAge;
      });
    }

    // Filter by Εκπαίδευση
    if (selectedEducation) {
      filtered = filtered.filter(profile => profile.education === selectedEducation);
    }

    // Filter by Time Slots (if available)
    if (timeSlots) {
      filtered = filtered.filter((profile) => {
        return Object.keys(timeSlots).every((day) => {
          const { from, to } = timeSlots[day];
          if (from && to) {
            const profileFrom = profile[`time_${day}_from`];
            const profileTo = profile[`time_${day}_to`];
            return (
              (profileFrom >= from && profileTo <= to) ||
              (profileFrom <= to && profileTo >= from)
            );
          }
          return true; // If no time slots are selected for a day, do not filter
        });
      });
    }

    setFilteredProfiles(filtered);
  };

  const resetFilters = () => {
    // Reset the filtered profiles to all profiles when clearing filters
    setFilteredProfiles(profiles);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column",minHeight:"185vh" }}>
    <Header log="not_connected" />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <Breadcrumbs />
      <div style={{ display: "flex", flex: 1 }}>
        {/* Filters Section */}
        <BabysitterFilters
          applyFilters={applyFilters} // Pass the applyFilters function here
          resetFilters={resetFilters} // Pass the resetFilters function here
        />
        {/* Job Postings Section */}
        <div style={{ flex: 1, padding: "1em" }}>
          {filteredProfiles.map((profile) => (
            <JobPosting
              key={profile.id}
              profile={{
                ...profile,
                apasxolisi: capitalizeWords(profile.apasxolisi),
                area: capitalizeWords(profile.area),
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
</div>

  );
}

export default BabysitterSearch;

