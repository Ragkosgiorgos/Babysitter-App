import React, { useState, useEffect, useMemo } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumbs from "../../Components/Breadcrump";
import BabysitterFilters from "../../Components/GoneisComponents/BabysitterFilters";
import JobPosting from "../../Components/EpaggelmatiesComponent/JobPosting";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { capitalizeWords, handleScrollToTop } from "../../Utils/Methods/index";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from "../../config/firebase";
import { useLocation } from "react-router-dom";
import Loader from "../../Components/Loader";

function BabysitterSearch() {
  const location = useLocation();
  const { area, age } = location.state;

  const [loading, setLoading] = useState(true);
  const [matchedPosts, setMatchedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [startFrom, setStartFrom] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profilesSnapshot, postsSnapshot] = await Promise.all([
          getDocs(query(collection(FIREBASE_DB, 'user'))),
          getDocs(query(collection(FIREBASE_DB, 'aggelies'), where('status', '==', 'Δημοσιευμένη')))
        ]);

        const profiles = profilesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const posts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          profile: profiles.find(profile => profile.userId === doc.data().uid),
        }));

        setMatchedPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply the needed filters to the posts (matched with profiles)
  const applyFilters = (fullTimeChecked, partTimeChecked, selectedLocation, selectedAge, selectedEducation, hasCar, weekdays, weekends, accomodationS) => {
    const filtered = matchedPosts.filter(post => {
      if (fullTimeChecked && post.time !== "Πλήρης") return false;
      if (partTimeChecked && post.time !== "Μερική") return false;
      if (selectedLocation && post.area.toLowerCase() !== selectedLocation.toLowerCase()) return false;
      if (selectedAge) {
        const minAge = parseFloat(post.ageFrom);
        const maxAge = parseFloat(post.ageTo);
        if (selectedAge === "από 6 μηνών έως και 1 έτους" && (!(minAge === 0.5 && maxAge >= 1))) return false
        if (selectedAge === "από 1 έτους έως και 2 ετών" && (!(minAge <= 1 && maxAge >= 2))) return false;
        if (selectedAge === "από 2 ετών έως και 2.5 ετών" && (!(minAge <= 2 && maxAge === 2.5))) return false;
      }
      if (selectedEducation && post.profile?.education !== capitalizeWords(selectedEducation)) return false;
      if (hasCar && post.car !== hasCar) return false;
      if (weekdays && !weekends && !["Καθημερινές", "Και τα δύο"].includes(post.dates)) return false;
      if (weekends && !weekdays && !["Σαββατοκύριακο", "Και τα δύο"].includes(post.dates)) return false;
      if (accomodationS && post.accomodation !== accomodationS) return false;

      return true;
    });

    setFilteredPosts(filtered);
  };

  const resetFilters = () => {
    setFilteredPosts(matchedPosts);
  };

  const handlePageChange = (event, value) => {
    setStartFrom((value - 1) * postsPerPage);
    handleScrollToTop();
  };

  const handleChangeRowsPerPage = (event) => {
    setPostsPerPage(parseInt(event.target.value, 10));
    setStartFrom(0);
  };

  const rowsPerPageSelection = () => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
      <p style={{ marginRight: "1em" }}>Αγγελίες ανά σελίδα:</p>
      <select value={postsPerPage} onChange={handleChangeRowsPerPage} style={{ marginBottom: "1em", marginRight: "1em" }}>
        {[5, 10, 20, 50].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>
  );

  const visiblePosts = useMemo(() => filteredPosts.slice(startFrom, startFrom + postsPerPage), [filteredPosts, startFrom, postsPerPage]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", flex: 1 }}>
          <BabysitterFilters applyFilters={applyFilters} resetFilters={resetFilters} ageR={age} areaR={area} />
          <div style={{ flex: 1, padding: "1em" }}>
            {rowsPerPageSelection()}
            <div style={{ flex: 1, padding: "1em" }}>
              <Stack spacing={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {visiblePosts.map(({ profile, ...post }) => (
                  <JobPosting key={post.id} post={post} profile={profile} />
                ))}
              </Stack>
              {filteredPosts.length === 0 && <h3 style={{ textAlign: "center", marginTop: "2em" }}>Δεν βρέθηκαν αγγελίες</h3>}
            </div>
            {filteredPosts.length > 0 && (
              <Pagination 
                count={Math.ceil(filteredPosts.length / postsPerPage)} 
                onChange={handlePageChange}
                style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1em" }}
              />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default BabysitterSearch;
