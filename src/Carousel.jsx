import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items }) => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Afișează 2 știri simultan
    slidesToScroll: 1, // Derulează câte 1 știre
    arrows: true,
    autoplay: true, // Activează derularea automată
    autoplaySpeed: 3000, // Interval de 3 secunde între tranziții (3000 ms)    
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Slider {...carouselSettings}>
        {items.map((item, index) => {
          return (
            <div key={index}>
              <div
                className="slick-art"
                style={{
                  position: "relative", // Permite poziționarea absolută a textului
                  height: "300px", // Înălțimea containerului
                  borderRadius: "10px", // Colțuri rotunjite
                  overflow: "hidden", // Ascunde orice depășește marginea
                }}
              >
                {/* Imaginea */}
                <img
                  src={item.imgSrc}
                  alt={item.text || "Image"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ajustează imaginea să umple containerul
                    display: "block", // Elimină spațiul gol dintre elemente inline-block
                  }}
                />
  
                {/* Textul afișat peste imagine */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0px", // Poziționat în partea de jos
                    left: "0px", // Aliniere stânga
                    color: "white", // Text alb
                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))", // Degrade de la negru la transparent
                    padding: "10px", // Spațiere interioară
                    borderRadius: "0 0 5px 5px", // Colțuri rotunjite
                    minWidth: "100%", // Evită depășirea marginii
                  }}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none", // Elimină sublinierea
                      color: "white", // Text alb
                    }}
                  >
                    <strong style={{ display: "block", fontSize: "16px" }}>
                      {item.source}
                    </strong>
                    <h3 style={{ margin: "5px 0" }}>
                      {item.text}
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
  
};

// Modificare export cu React.memo pentru optimizare
export default React.memo(Carousel, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items);
});
