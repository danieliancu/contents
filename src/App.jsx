import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import Menu from "./Menu"; // Importăm componenta Menu

const App = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // productie:
        // const response = await fetch("/api/articles");

        // local:
        const response = await fetch("http://localhost:5000/articles");
        const result = await response.json();

        if (response.ok) {
          const shuffledData = shuffleArray(result.data);
          setAllData(shuffledData);
          setFilteredData(shuffledData);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Request failed");
      }
    };

    fetchAllData();
  }, []);

  const handleFilter = (source) => {
    setSelectedSource(source);
    if (source === "all") {
      setFilteredData([...allData]); // Creează un array nou
    } else {
      const filtered = allData.filter((item) => item.source === source);
      setFilteredData([...filtered]); // Creează un array nou
    }
  };
  

  return (
    <div>
      <Menu
        selectedSource={selectedSource}
        handleFilter={handleFilter}
      />

      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}



      {filteredData.length > 4 && (
        <div className="container grid-layout">
    {console.log("Filtered data for Carousel:", filteredData.slice(0, 4))}

          {filteredData.length > 0 && (
            <div className="carousel-wrapper">
              <Carousel key={selectedSource} items={filteredData.slice(0, 4)} />
            </div>
          )}

{filteredData.slice(4).map((item, index) => (
  <div className="container-news" key={index}>
    {item.imgSrc && (
      <img
        src={item.imgSrc}
        alt={item.text || "Image"}
        className="news-image"
      />
    )}
    <strong className="news-source">{item.source}</strong>
    {item.href && (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        <h3>{item.text}</h3>
      </a>
    )}
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default App;
