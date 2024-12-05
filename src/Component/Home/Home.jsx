import React from "react";
import HomeBanner from "./HomeBanner";
import ServiceOffers from "./ServiceOffers";
import FlightShow from "./FlightShow";
import FlightSearch from "./FlightSearch";

const Home = () =>{
    return(
        <div>
            <HomeBanner></HomeBanner>
            <FlightSearch></FlightSearch>
            <FlightShow></FlightShow>
            <ServiceOffers></ServiceOffers>
        </div>
    )
}

export default Home;