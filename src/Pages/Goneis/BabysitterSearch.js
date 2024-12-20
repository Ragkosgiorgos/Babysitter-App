import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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

    // Capitalize the first letter of each word
    function capitalizeWords(str) {
      if (str === undefined || str === null) {
          return '';
      }
      return str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }

  const applyFilters = (fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar) => {
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
      filtered = filtered.filter(profile => profile.profile.education === capitalizeWords(selectedEducation));
    }

    if (hasCar) {
      filtered = filtered.filter(profile => profile.car === true);
    }

    setFilteredPosts(filtered);
  };

  const resetFilters = () => {
    setFilteredPosts(matchedPosts);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePageChange = (event, value) => {
    setStartFrom((value - 1) * postsPerPage);
    handleScrollToTop();
  }

  const [startFrom, setStartFrom] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const handleChangeRowsPerPage = (event) => {
    setPostsPerPage(parseInt(event.target.value, 10));
    setStartFrom(0);
  };

  function rowsPerPageSelection() {
    return (
      <div style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
        <p style={{ marginRight: "1em" }}>Αγγελίες ανά σελίδα:</p>
        <select value={postsPerPage} onChange={handleChangeRowsPerPage} style={{ marginBottom: "1em", marginRight: "1em" }}>
          {<option value={5}>5</option>}
          {<option value={10}>10</option>}
          {<option value={20}>20</option>}
          {<option value={50}>50</option>}
        </select>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header log="not_connected" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Breadcrumbs />

        <div style={{ display: "flex", flex: 1 }}>
          <BabysitterFilters applyFilters={applyFilters} resetFilters={resetFilters} />

          <div style={{ flex: 1, padding: "1em" }}>
            {rowsPerPageSelection()}
            <div style={{ flex: 1, padding: "1em" }}>
              
              <Stack spacing={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {filteredPosts.slice(startFrom, startFrom + postsPerPage).map(({ profile, ...post }) => (
                  <JobPosting
                    key={post.id}
                    post={post}
                    profile={profile}
                  />
                ))}
              </Stack>

            </div>

            <Pagination 
                count={Math.ceil(filteredPosts.length / postsPerPage)} 
                onChange={handlePageChange}
                style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1em" }}
            />
          </div>
        </div>

        <Footer />

      </div>

    </div>
  );
}
      
export default BabysitterSearch;
