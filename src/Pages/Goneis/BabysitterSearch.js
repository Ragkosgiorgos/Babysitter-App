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
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);

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
      })
      .catch((error) => {
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/data/aggelies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
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
    let filtered = posts;

    // Filter by Χρόνος Απασχόλησης
    if (fullTimeChecked || partTimeChecked) {
      filtered = filtered.filter(post =>
        (fullTimeChecked && post.time === "Πλήρης") ||
        (partTimeChecked && post.time === "Μερική")
      );
    }

    // Filter by Περιοχή Διαμονής
    if (selectedLocation) {
      filtered = filtered.filter(post => post.area.toLowerCase() === selectedLocation.toLowerCase());
    }
    
    // Filter by Ηλικία Παιδιού
    if (selectedAge) {
      filtered = filtered.filter(post => {
        const minAge = parseFloat(post.ageFrom);
        const maxAge = parseFloat(post.ageTo);
        return selectedAge >= minAge && selectedAge <= maxAge;
      });
    }

    // Filter by Εκπαίδευση
    if (selectedEducation) {
      filtered = filtered.filter(profile => profile.education === selectedEducation);
    }

    // Filter by Time Slots (if available)
    if (timeSlots) {
      filtered = filtered.filter((post) => {
        return Object.keys(timeSlots).every((day) => {
          const { from, to } = timeSlots[day];
          if (from && to) {
            const postFrom = post[`time_${day}_from`];
            const postTo = post[`time_${day}_to`];
            return (
              (postFrom >= from && postTo <= to) ||
              (postFrom <= to && postTo >= from)
            );
          }
          return true; // If no time slots are selected for a day, do not filter
        });
      });
    }

    setFilteredPosts(filtered);
  };

  const resetFilters = () => {
    setFilteredPosts(posts);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column",minHeight:"185vh" }}>

    <Header log="not_connected" />

    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>

      <Breadcrumbs />

      <div style={{ display: "flex", flex: 1 }}>

        <BabysitterFilters
            applyFilters={applyFilters}
            resetFilters={resetFilters}
        />

        <div style={{ flex: 1, padding: "1em" }}>

          {filteredPosts.map((post) => (
            <JobPosting
              key={post.id}
              post={post}
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

