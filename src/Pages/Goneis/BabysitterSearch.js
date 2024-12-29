import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { capitalizeWords } from "../../Utils/Methods/index";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from "../../config/firebase";

function BabysitterSearch() {
  const [profiles, setProfiles] = useState([]);
  const [matchedPosts, setMatchedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch profiles and posts from Firebase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const q = query(collection(FIREBASE_DB, 'user'));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profiles);
      }  catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(FIREBASE_DB, 'aggelies'), where('status', '==', 'Δημοσιευμένη'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatchedPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
  
  // Match each post with its corresponding profile
  matchedPosts.forEach(post => {
    const profile = profiles.find(profile => profile.userId === post.uid);
    post.profile = profile;
  });

  // Apply filters to the posts
  const applyFilters = (fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends) => {
    let filtered = matchedPosts;

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
      if (hasCar === "Ναι") {
        filtered = filtered.filter(post => post.car === hasCar);
      }
    }

    // If the user has selected the weekdays or weekends option, filter the posts accordingly
    // If both options are selected, no filtering is needed
    if (weekdays && !weekends) {
      filtered = filtered.filter(post => post.dates === "Καθημερινές" || post.dates === "Και τα δύο");
    } else if (weekends && !weekdays) {
      filtered = filtered.filter(post => post.dates === "Σαββατοκύριακο" || post.dates === "Και τα δύο");
    } else if (weekdays && weekends) {
      filtered = filtered.filter(post => post.dates === "Και τα δύο");
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

  // Change num of page displayed from pagination
  const handlePageChange = (event, value) => {
    setStartFrom((value - 1) * postsPerPage);
    handleScrollToTop();
  }

  const [startFrom, setStartFrom] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);

  // Change num of posts displayed per page
  const handleChangeRowsPerPage = (event) => {
    setPostsPerPage(parseInt(event.target.value, 10));
    setStartFrom(0);
  };

  // User can select how many posts to display per page
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
      <Header />

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

              {
                filteredPosts.length === 0 &&
                <h3 style={{ textAlign: "center", marginTop: "2em" }}>Δεν βρέθηκαν αγγελίες</h3>
              }

            </div>

            { filteredPosts.length > 0 &&
            <Pagination 
                count={Math.ceil(filteredPosts.length / postsPerPage)} 
                onChange={handlePageChange}
                style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1em" }}
            /> }
          </div>
        </div>

        <Footer />

      </div>

    </div>
  );
}
      
export default BabysitterSearch;
