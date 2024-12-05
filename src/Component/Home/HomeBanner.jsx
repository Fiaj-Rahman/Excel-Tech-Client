import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaPlaneDeparture, FaPlaneArrival, FaDollarSign } from 'react-icons/fa'; // Flight-related icons

const HomeBanner = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 2000, once: false });
  }, []);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const handleSlideChange = () => {
    AOS.refresh();
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background and Overlay */}
      <div className="absolute inset-0 bg-cover h-full bg-center bg-fixed" style={{ backgroundImage: 'url(./homeBanner.jpg)' }} />
      <div className="absolute inset-0 bg-black bg-opacity-70" /> {/* Darker overlay */}

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSlideChange={handleSlideChange}
        className="mySwiper h-full"
      >
        {/* Slide 1: Book Your Next Flight */}
        <SwiperSlide className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-lg shadow-lg">
            <FaPlaneDeparture className="mb-4 h-12 w-12 text-white" /> {/* Departure Icon */}
            <h2 data-aos="fade-up" data-aos-delay="200" className="text-white text-5xl font-semibold mb-2">
              Book Your Next Flight
            </h2>
            <p data-aos="fade-up" data-aos-delay="400" className="text-white text-lg mb-4 max-w-md">
              Find and book your next flight to top destinations with ease and convenience.
            </p>
          </div>
        </SwiperSlide>

        {/* Slide 2: Affordable Airfare */}
        <SwiperSlide className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-lg shadow-lg">
            <FaPlaneArrival className="mb-4 h-12 w-12 text-white" /> {/* Arrival Icon */}
            <h2 data-aos="fade-up" data-aos-delay="200" className="text-white text-5xl font-semibold mb-2">
              Affordable Airfare Deals
            </h2>
            <p data-aos="fade-up" data-aos-delay="400" className="text-white text-lg mb-4 max-w-md">
              Explore the best airfare deals and discounts to save on your next flight.
            </p>
          </div>
        </SwiperSlide>

        {/* Slide 3: Flexible Payment Options */}
        <SwiperSlide className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-lg shadow-lg">
            <FaDollarSign className="mb-4 h-12 w-12 text-white" /> {/* Payment Icon */}
            <h2 data-aos="fade-up" data-aos-delay="200" className="text-white text-5xl font-semibold mb-2">
              Flexible Payment Options
            </h2>
            <p data-aos="fade-up" data-aos-delay="400" className="text-white text-lg mb-4 max-w-md">
              Enjoy flexible payment plans and make booking flights more affordable.
            </p>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Progress Indicator */}
      <div className="autoplay-progress absolute bottom-4 right-4 flex items-center justify-center">
        <svg viewBox="0 0 48 48" ref={progressCircle} className="w-12 h-12 text-white">
          <circle cx="24" cy="24" r="20" className="stroke-current text-blue-500 opacity-60"></circle>
        </svg>
        <span ref={progressContent} className="absolute text-white text-sm font-semibold"></span>
      </div>
    </div>
  );
};

export default HomeBanner;
