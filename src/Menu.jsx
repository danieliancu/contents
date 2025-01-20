import React from "react";

const Menu = ({ selectedSource, handleFilter }) => {
    return (
      <div className="menu">
        <div>
          <h1><a href="index.html" style={{ letterSpacing:"-1px", color: "black" }}>contents</a></h1>
        </div>
        <div>
          <button
            style={{ background: "red", color: "white", padding:"0 5px" }}
            onClick={() => handleFilter("all")}
            className={selectedSource === "all" ? "active" : ""}
          >
            Toate știrile
          </button>
          <button
            className={`button-large ${selectedSource === "g4media" ? "active" : ""}`}
            onClick={() => handleFilter("g4media")}
            style={{
              background: "url(https://www.g4media.ro/wp-content/themes/g4m/logo_g4_vectorial_live.svg)",
            }}
          ></button>
          <button
            className={`button-large ${selectedSource === "hotnews" ? "active" : ""}`}
            onClick={() => handleFilter("hotnews")}
            style={{
              background: "url(https://hotnews.ro/wp-content/themes/hotnews/public/images/hotnews_header.svg)",
              backgroundColor: "#2145ac",
            }}
          ></button>
          <button
            className={selectedSource === "spotmedia" ? "active" : ""}
            onClick={() => handleFilter("spotmedia")}
            style={{
              background: "url(https://spotmedia.ro/wp-content/uploads/2018/04/spot_logo_90x90.png)",
            }}
          ></button>
          <button
            className={`button-large ${selectedSource === "ziare" ? "active" : ""}`}
            onClick={() => handleFilter("ziare")}
            style={{
              background: "url(https://ziareromania.ro/img/header/logo-ziare-com2.svg)",
            }}
          ></button>
          <button
            className={selectedSource === "digi24" ? "active" : ""}
            onClick={() => handleFilter("digi24")}
            style={{
              background: "url(https://www.digi24.ro/static/theme-repo/bin/images/digi24-logo.svg)",
            }}
          ></button>
          <button
            className={selectedSource === "libertatea" ? "active" : ""}
            onClick={() => handleFilter("libertatea")}
            style={{
              background: "url(https://static4.libertatea.ro/wp-content/themes/libertatea-nineteen/assets/images/logo.svg)",
            }}
          ></button>
          <button
            className={selectedSource === "stirileprotv" ? "active" : ""}
            onClick={() => handleFilter("stirileprotv")}
            style={{
              background:
                "url(https://play-lh.googleusercontent.com/Tw2ok8HE4-lfiwEMWPBYl403U6pCdxNrEqnb37t15a3CgGYrMaV_2SzjV1j4Zd0C02o=w240-h480-rw)",
            }}
          ></button>
          <button
            className={selectedSource === "news" ? "active" : ""}
            onClick={() => handleFilter("news")}
            style={{
              background:
                "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQowlrBpv-wM8tPM-5kecd_vUG4IpXTG5kYaQ&s)",
            }}
          ></button>
          <button
            className={`button-large ${selectedSource === "gsp" ? "active" : ""}`}
            onClick={() => handleFilter("gsp")}
            style={{
              background:
                "url(https://www.gsp.ro/assets/images/logo-gsp-2025.svg)",
                backgroundColor: "#e90a0a"                
            }}
          ></button> 
          <button
            className={`button-large ${selectedSource === "prosport" ? "active" : ""}`}
            onClick={() => handleFilter("prosport")}
            style={{
              background:
                "url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/New_ProSport.svg/2560px-New_ProSport.svg.png)"
            }}
          ></button>                    
        </div>
      </div>
    );
  };
  
  export default Menu;
  