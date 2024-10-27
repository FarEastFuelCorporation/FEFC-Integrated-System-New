import page1 from "../../../images/Handbook/00A.jpg";
import page2 from "../../../images/Handbook/00B.jpg";
import page3 from "../../../images/Handbook/00C.jpg";
import page4 from "../../../images/Handbook/00D.jpg";
import page5 from "../../../images/Handbook/00E.jpg";
import page6 from "../../../images/Handbook/01.jpg";
import page7 from "../../../images/Handbook/02.jpg";
import page8 from "../../../images/Handbook/03.jpg";
import page9 from "../../../images/Handbook/04.jpg";
import page10 from "../../../images/Handbook/05.jpg";
import page11 from "../../../images/Handbook/06.jpg";
import page12 from "../../../images/Handbook/07.jpg";
import page13 from "../../../images/Handbook/08.jpg";
import page14 from "../../../images/Handbook/09.jpg";
import page15 from "../../../images/Handbook/10.jpg";
import page16 from "../../../images/Handbook/11.jpg";
import page17 from "../../../images/Handbook/12.jpg";
import page18 from "../../../images/Handbook/13.jpg";
import page19 from "../../../images/Handbook/14.jpg";
import page20 from "../../../images/Handbook/15.jpg";
import page21 from "../../../images/Handbook/16.jpg";
import page22 from "../../../images/Handbook/17.jpg";
import page23 from "../../../images/Handbook/18.jpg";
import page24 from "../../../images/Handbook/19.jpg";
import page25 from "../../../images/Handbook/20.jpg";
import page26 from "../../../images/Handbook/21.jpg";
import page27 from "../../../images/Handbook/22.jpg";
import page28 from "../../../images/Handbook/23.jpg";
import page29 from "../../../images/Handbook/24.jpg";
import page30 from "../../../images/Handbook/25.jpg";
import page31 from "../../../images/Handbook/26.jpg";
import page32 from "../../../images/Handbook/27.jpg";
import page33 from "../../../images/Handbook/28.jpg";
import page34 from "../../../images/Handbook/29.jpg";
import page35 from "../../../images/Handbook/30.jpg";
import page36 from "../../../images/Handbook/31.jpg";
import page37 from "../../../images/Handbook/32.jpg";
import page38 from "../../../images/Handbook/33.jpg";
import page39 from "../../../images/Handbook/34.jpg";
import page40 from "../../../images/Handbook/35.jpg";
import page41 from "../../../images/Handbook/36.jpg";
import page42 from "../../../images/Handbook/37.jpg";
import page43 from "../../../images/Handbook/38.jpg";
import page44 from "../../../images/Handbook/39.jpg";
import page45 from "../../../images/Handbook/40.jpg";
import page46 from "../../../images/Handbook/41.jpg";
import page47 from "../../../images/Handbook/42.jpg";
import page48 from "../../../images/Handbook/43.jpg";
import page49 from "../../../images/Handbook/44.jpg";
import page50 from "../../../images/Handbook/45.jpg";
import page51 from "../../../images/Handbook/46.jpg";
import page52 from "../../../images/Handbook/47.jpg";
import page53 from "../../../images/Handbook/48.jpg";
import page54 from "../../../images/Handbook/49.jpg";
import page55 from "../../../images/Handbook/50.jpg";
import page56 from "../../../images/Handbook/51.jpg";
import page57 from "../../../images/Handbook/52.jpg";
import page58 from "../../../images/Handbook/53.jpg";
import page59 from "../../../images/Handbook/54.jpg";
import page60 from "../../../images/Handbook/55.jpg";
import page61 from "../../../images/Handbook/56.jpg";
import page62 from "../../../images/Handbook/57.jpg";
import page63 from "../../../images/Handbook/58.jpg";
import page64 from "../../../images/Handbook/59.jpg";
import page65 from "../../../images/Handbook/60.jpg";
import page66 from "../../../images/Handbook/61.jpg";
import page67 from "../../../images/Handbook/62.jpg";
import page68 from "../../../images/Handbook/63.jpg";
import page69 from "../../../images/Handbook/64.jpg";
import page70 from "../../../images/Handbook/65.jpg";
import page71 from "../../../images/Handbook/66.jpg";
import page72 from "../../../images/Handbook/67.jpg";
import page73 from "../../../images/Handbook/68.jpg";
import page74 from "../../../images/Handbook/69.jpg";
import page75 from "../../../images/Handbook/70.jpg";
import page76 from "../../../images/Handbook/71.jpg";
import page77 from "../../../images/Handbook/72.jpg";
import page78 from "../../../images/Handbook/73.jpg";
import page79 from "../../../images/Handbook/74.jpg";
import page80 from "../../../images/Handbook/75.jpg";
import page81 from "../../../images/Handbook/76.jpg";
import page82 from "../../../images/Handbook/77.jpg";
import page83 from "../../../images/Handbook/78.jpg";
import page84 from "../../../images/Handbook/79.jpg";
import page85 from "../../../images/Handbook/80.jpg";
import page86 from "../../../images/Handbook/81.jpg";
import page87 from "../../../images/Handbook/82.jpg";
import page88 from "../../../images/Handbook/83.jpg";
import page89 from "../../../images/Handbook/84.jpg";
import page90 from "../../../images/Handbook/85.jpg";

import React, { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import FlipPage from "react-flip-page"; // Assuming you're using a library for the flip effect

const HandbookComponent = () => {
  const theme = useTheme(); // Get the theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Use the theme breakpoint for mobile

  const images = [
    page1,
    page2,
    page3,
    page4,
    page5,
    page6,
    page7,
    page8,
    page9,
    page10,
    page11,
    page12,
    page13,
    page14,
    page15,
    page16,
    page17,
    page18,
    page19,
    page20,
    page21,
    page22,
    page23,
    page24,
    page25,
    page26,
    page27,
    page28,
    page29,
    page30,
    page31,
    page32,
    page33,
    page34,
    page35,
    page36,
    page37,
    page38,
    page39,
    page40,
    page41,
    page42,
    page43,
    page44,
    page45,
    page46,
    page47,
    page48,
    page49,
    page50,
    page51,
    page52,
    page53,
    page54,
    page55,
    page56,
    page57,
    page58,
    page59,
    page60,
    page61,
    page62,
    page63,
    page64,
    page65,
    page66,
    page67,
    page68,
    page69,
    page70,
    page71,
    page72,
    page73,
    page74,
    page75,
    page76,
    page77,
    page78,
    page79,
    page80,
    page81,
    page82,
    page83,
    page84,
    page85,
    page86,
    page87,
    page88,
    page89,
    page90,
  ];
  const spreads = [];
  spreads.push([null, images[0]]); // First page as right with left blank
  for (let i = 1; i < images.length; i += 2) {
    spreads.push([images[i], images[i + 1]]);
  }

  const defaultWidth = "1056px"; // Fixed width for large screens
  const defaultHeight = "816px"; // Fixed height for large screens

  // State for dynamic dimensions
  const [dynamicWidth, setDynamicWidth] = useState(defaultWidth);
  const [dynamicHeight, setDynamicHeight] = useState(defaultHeight);

  // Recalculate dynamic dimensions
  useEffect(() => {
    const calculateDimensions = () => {
      if (isMobile) {
        const actualWidth = window.innerWidth - 40; // Consider padding/margins if needed
        const scaledHeight = (816 / 528) * actualWidth; // Maintain aspect ratio
        setDynamicWidth(`${actualWidth}px`);
        setDynamicHeight(`${scaledHeight}px`);
      } else {
        setDynamicWidth(defaultWidth);
        setDynamicHeight(defaultHeight);
      }
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions); // Update on resize

    return () => {
      window.removeEventListener("resize", calculateDimensions); // Clean up
    };
  }, [isMobile]); // Rerun effect when `isMobile` changes

  const containerWidth = isMobile ? dynamicWidth : defaultWidth;
  const containerHeight = isMobile ? dynamicHeight : defaultHeight;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        width: containerWidth,
        height: containerHeight,
      }}
      className="flip-page"
    >
      <FlipPage
        orientation="horizontal"
        uncutPages={true}
        flipOnTouch={true}
        style={{
          width: containerWidth,
          height: containerHeight,
          backgroundColor: "none",
        }}
      >
        {isMobile
          ? images.map((image, index) => (
              <div key={index} style={{ width: "100%", height: "100%" }}>
                <img
                  src={image}
                  alt={`Page ${index + 1}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ))
          : spreads.map((spread, index) => (
              <div
                key={index}
                style={{ display: "flex", width: "100%", height: "100%" }}
              >
                <div
                  style={{ width: isMobile ? "100%" : "50%", height: "100%" }}
                >
                  {index === 0 ? (
                    <div
                      style={{
                        backgroundColor: "none",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    spread[0] && (
                      <img
                        src={spread[0]}
                        alt={`Page ${index * 2 + 1}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                    )
                  )}
                </div>
                <div
                  style={{ width: isMobile ? "100%" : "50%", height: "100%" }}
                >
                  {spread[1] ? (
                    <img
                      src={spread[1]}
                      alt={`Page ${index * 2 + 2}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: "none",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
      </FlipPage>
    </div>
  );
};

export default HandbookComponent;
