import Header from "../../components/header";

import CarryOutTractions from "./components/carry-out-transaction";

import AboutUs from "./components/about-us";

import HeroSection from "./components/hero-section";
import WhatWeDoSection from "./components/what-we-do-section";

function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <WhatWeDoSection />
      

      <AboutUs />
      <CarryOutTractions />


    </>
  );
}

export default HomePage;
