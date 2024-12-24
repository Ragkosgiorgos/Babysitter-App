import React from "react";

function CreateRating() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ flex: 1 }}>
        <Breadcrumbs />
      </div>

      <Footer />
    </div>
  );
}

export default CreateRating;
