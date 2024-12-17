import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";

function BabysitterSearch() {
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [matchedPosts, setMatchedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

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
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  }, []);

  useEffect(() => { // Match posts and profiles by uid
    if (profiles.length > 0 && posts.length > 0) {
      const matched = posts
        .map((post) => {
          const profile = profiles.find((p) => p.uid === post.uid && post.status === "Δημοσιευμένη");
          if (profile) {
            return { ...post, profile }; // Combine post and profile data
          } else {
            return null; // Exclude unmatched posts
          }
        })
        .filter(Boolean); // Remove unmatched posts

      // Sort posts by date published (newest first)
      matched.sort((a, b) => new Date(b.date) - new Date(a.date));

      setMatchedPosts(matched);
      setFilteredPosts(matched);
    }
  }, [profiles, posts]);

  const applyFilters = (fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, timeSlots) => {
    let filtered = matchedPosts;

    // Filter logic remains the same as before...
    if (fullTimeChecked || partTimeChecked) {
      filtered = filtered.filter(post =>
        (fullTimeChecked && post.time === "Πλήρης") ||
        (partTimeChecked && post.time === "Μερική")
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(post => post.area.toLowerCase() === selectedLocation.toLowerCase());
    }

    if (selectedAge) {
      filtered = filtered.filter(post => {
        const minAge = parseFloat(post.ageFrom);
        const maxAge = parseFloat(post.ageTo);
        return selectedAge >= minAge && selectedAge <= maxAge;
      });
    }

    if (selectedEducation) {
      filtered = filtered.filter(profile => profile.education === selectedEducation);
    }

    if (timeSlots) {
      /*filtered = filtered.filter((post) => {
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
          return true;
        });
      });*/
    }

    setFilteredPosts(filtered);
  };

  const resetFilters = () => {
    setFilteredPosts(matchedPosts);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "185vh" }}>
      <Header log="not_connected" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Breadcrumbs />

        <div style={{ display: "flex", flex: 1 }}>
          <BabysitterFilters applyFilters={applyFilters} resetFilters={resetFilters} />

          <div style={{ flex: 1, padding: "1em" }}>
            {filteredPosts.map(({ profile, ...post }) => (
              <JobPosting
                key={post.id}
                post={post}
                profile={profile}
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
