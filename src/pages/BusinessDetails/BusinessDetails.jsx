import React, { useEffect, useRef, useState } from "react";
import star from "../../assets/images/star-details.svg";
import world from "../../assets/images/world.png";
import reviewIcon from "../../assets/images/review-icon.png";
import Vector from "../../assets/images/Vector.png";
import mariaProfile from "../../assets/images/maria.png";
import calander from "../../assets/images/calander.png";
import linkIcon from "../../assets/images/link-icon.png";
import fullStar from "../../assets/images/full-star.png";
import halfStarImage from "../../assets/images/half-star.png";
import blankStar from "../../assets/images/blank-star.png";
import facebook from "../../assets/images/facebook.png";
import instagram from "../../assets/images/instagram.png";
import OurListed from "../Home/OurListed";
import { useParams } from "react-router-dom";
import { getSingleProfiles, reviewGet } from "../../services/business";
import { setupAxios } from "../../utils/axiosClient";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AddReview from "./AddReview";
import { SignIn } from "../SignIn";
import copyIcon from '../../assets/images/copy.png';
import tickIcon from "../../assets/images/tick.png";

export default function BusinessDetails() {
  const { bussiness } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allReview, setAllReview] = useState([]);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [highRatingReviews, setHighRatingReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const [reviews, setReviews] = useState([]);
  const year = currentDate.getFullYear();
  const [buttonText, setButtonText] = useState('Share');
  const [icon, setIcon] = useState(copyIcon);
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setButtonText('Link Copied');
      setIcon(tickIcon);

      setTimeout(() => {
        setButtonText('Share');
        setIcon(copyIcon);
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = allReview.slice(indexOfFirstReview, indexOfLastReview);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const totalPages = Math.ceil(allReview.length / reviewsPerPage);
  const [ratingPercentages, setRatingPercentages] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const month = monthNames[currentDate.getMonth()];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {

    getReviews();

  }, [bussiness]);

  useEffect(() => {
    getProfile();
    getReviews();
  }, []);

  const getProfile = async () => {
    setupAxios();
    try {
      const res = await getSingleProfiles(bussiness);
      setProfile(res?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  const [reviewFetchDate, setReviewFetchDate] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalReviews = reviews.length;

      // Log the reviews array to check its structure
      console.log("Reviews Array:", reviews);

      const ratingCounts = reviews.reduce((acc, review) => {
        if (review.rating) {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
        } else {
          console.warn("Review without rating found:", review);
        }
        return acc;
      }, {});

      // Log ratingCounts for debugging
      console.log("Rating Counts:", ratingCounts);

      const ratingPercentages = {
        5: ((ratingCounts[5] || 0) / totalReviews) * 100,
        4: ((ratingCounts[4] || 0) / totalReviews) * 100,
        3: ((ratingCounts[3] || 0) / totalReviews) * 100,
        2: ((ratingCounts[2] || 0) / totalReviews) * 100,
        1: ((ratingCounts[1] || 0) / totalReviews) * 100,
      };

      console.log("Rating Percentages:", ratingPercentages);

      setRatingPercentages(ratingPercentages);
    } else {
      console.log("No reviews found.");
    }
  }, [reviews]);

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getReviews = async () => {
    setLoadingReview(true);
    setupAxios();
    try {
      // Fetch reviews using the updated API
      const res = await reviewGet(Number(bussiness));

      // The reviews are now inside res.data.ratings
      const reviews = res?.data?.ratings || [];
      console.log("reviews = ", reviews);

      // No need for filtering, as the brand_profile is already specific in the API response
      const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);

      // Calculate and set the average rating
      setAverageRating(res?.data?.average_rating || 0);

      // Set total review count from API response
      setTotalReviews(res?.data?.rating_count || 0);

      // Update state with the sorted reviews
      setReviews(sortedReviews);
      setAllReview(sortedReviews);
      setReviewFetchDate(new Date());
    } catch (error) {
      console.error(error);
      // Handle errors: clear reviews and reset state
      setAllReview([]);
      setTotalReviews(0);
      setAverageRating(0);
    } finally {
      setLoadingReview(false);
    }
  };

  const [slidesPerView, setSlidesPerView] = useState(1);

  // Function to determine slidesPerView based on window size
  const updateSlidesPerView = () => {
    const width = window.innerWidth;
    if (width < 500) {
      setSlidesPerView(1.3); // 1 slide for small screens
    } else if (width < 640) {
      setSlidesPerView(1.75); // 2 slides for medium screens
    } else if (width < 1024) {
      setSlidesPerView(2); // 2.5 slides for large screens
    } else
      setSlidesPerView(2.5); // 2.5 slides for large screens
  };

  // Effect to set up the event listener and handle initial load
  useEffect(() => {
    updateSlidesPerView(); // Set initial slidesPerView based on current window size
    window.addEventListener('resize', updateSlidesPerView); // Update on resize

    return () => {
      window.removeEventListener('resize', updateSlidesPerView); // Clean up the listener
    };
  }, []);

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      const firstInitial = names[0].charAt(0).toUpperCase();
      const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
      return `${firstInitial}${lastInitial}`;
    }
  };

  const modifyWebsiteUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
  };

  const renderStars = (rating) => {
    const fullStarsCount = Math.floor(rating);
    const halfStarNeeded = rating % 1 !== 0;
    const emptyStarsCount = 5 - fullStarsCount - (halfStarNeeded ? 1 : 0);

    const fullStars = Array(fullStarsCount).fill(<img src={fullStar} alt="full-star" className="w-4" />);

    const halfStar = halfStarNeeded ? <img src={halfStarImage} alt="half-star" className="w-4" /> : null;

    const emptyStars = Array(emptyStarsCount).fill(<img src={blankStar} alt="empty-star" className="w-4" />);

    return [...fullStars, halfStar, ...emptyStars];
  };

  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReadMore = (reviewId) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId], // Toggle between true/false
    }));
  };

  return (
    <>
      <div className="mt-28">
        < div className="mx-auto flex flex-col justify-between items-center gap-4 my-10 lg:mb-10 lg:mt-20 p-4 lg:py-8 rounded-[10px] xsm:w-[100%] w-[70%] bg-[#e7f1f7]" >
          <div className="-mt-28">
            <img src={profile.logo} alt="image" className="w-[120px] md:w-[150px] h-[120px] rounded-full md:h-[150px] border-4 border-[#287BB7]" />
          </div>
          <h2 className="text-[25px] md:text-[28px]">
            <span className="font-bold gradient"> {profile?.name}</span>
          </h2>
          <div className="flex flex-col items-center md:flex-row justify-center gap-5 md:gap-14 lg:justify-center lg:gap-28 w-full">
            <div className="items-center xsm:text-center">
              <div className="items-center">
                <div className="flex">
                  <span className="bg-[#287BB7] font-bold text-white rounded-lg p-2 mx-1">{averageRating.toFixed(1) || "0"}</span>
                  <div>
                    <div className="flex xsm:justify-center">{renderStars(averageRating)}</div>
                    <h6 className="font-normal text-[#8D8D8D]">
                      <div> ({`${totalReviews} Reviews` || "0 Reviews"})</div>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center">
                <a target={profile.website} href={modifyWebsiteUrl(profile.website)}>
                  {/* <img src={worldOuter} alt="world-outer" className="w-10 -mt-2" /> */}
                  <img src={world} alt="world" className="w-8 lg:w-10 ml-1" />
                </a>
              </div>
              <div className="">
                <h2 className="text-[15px] font-light leading-5">
                  Live <span className="font-bold gradient"> Site </span>
                </h2>
                <p className="text-[#666666]">{profile.website}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 w-full">
            <button className=" flex items-center justify-center border bg-[#287BB7] w-[50%] lg:w-[20%] h-16 p-6 rounded-[10px]"
              onClick={() => document.getElementById('dropReview').scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex justify-center w-[100%] items-center">
                <img src={reviewIcon} alt="review-icon" className="w-12 lg:w-16 filter invert" />
                <span className="text-white lg:font-bold text-sm lg:text-lg">
                  Write Review
                </span>
              </span>
            </button>
            <button className=" flex items-center justify-center border border-[#287BB7] w-[50%] lg:w-[20%] h-16 p-6 rounded-[10px] bg-white"
              onClick={handleShareClick}>
              <span className="flex items-center gap-1 md:gap-4 ">
                <img src={icon} alt="save" className="w-7 lg:w-10" />
                <span className="text-[#287BB7] font-bold lg:text-lg">
                  {buttonText}
                </span>
              </span>
            </button>
          </div>
        </div >
        <div className="flex justify-center items-center my-0 lg:my-16">
          <h2 className="text-[#000000] text-center">
            <span className="text-xl lg:text-2xl block font-bold mb-1 gradient">
              Followers
            </span>
            <span className="text-2xl lg:text-4xl font-light relative">
              <span className="gradient font-black">Top </span> Brand in one
              place
              <img
                className="flex justify-end absolute right-0 -bottom-5 h-[28px]"
                src={Vector}
                alt="arrow"
              />
            </span>
          </h2>
        </div>
      </div>
      <div className="">
        <div className="grid sm:grid-cols-2 ">
          <div className="">
            <div className="flex flex-col justify-center items-center">
              <div className="my-12">
                <img src={facebook} alt="brand-icon" className="w-[120px] md:w-[150px] rounded-full h-[120px] md:h-[150px]" />
                <img src={profile.logo} alt="brand-icon" className="-mt-8 ml-24 w-[30px] md:w-[50px] rounded-full h-[30px] md:h-[50px] border-2  border-[#287BB7]" />
              </div>
              <h2 className="text-[#000000] text-center">
                <span className="text-xl lg:text-2xl block font-bold mb-1">
                  {profile?.name}
                </span>
                <span className="flex flex-col text-2xl lg:text-4xl font-light relative items-center">
                  <span><span className="gradient font-black">Facebook </span>Followers</span>
                  <a href={profile.facebook} className="flex items-center" target="_blank">
                    <img src={linkIcon} alt="link-icon" className="w-[16px] h-[16px]" />
                    <span className="text-sm mx-1 text text-[#287BB7] hover:text-[#4ea0db] font-bold">Visit Facebook</span>
                  </a>
                </span>
              </h2>
              <div className="flex justify-center items-center flex-col py-4 lg:py-10">
                <h2 className="gradient font-black text-xl lg:text-4xl">
                  {profile?.facebook_followers}
                </h2>
                <p className="font-light text-black">{profile?.name}</p>
              </div>
            </div>
            <div className="lg:w-[80%] mx-auto box-shadow2 rounded-[10px]">
            </div>
          </div>
          <div className="lg:border-l-2 border-[#287BB7]">
            <div className="flex flex-col justify-center items-center">
              <div className="my-12">
                <img src={instagram} alt="brand-icon" className="w-[120px] md:w-[150px] rounded-full h-[120px] md:h-[150px]" />
                <img src={profile.logo} alt="brand-icon" className="-mt-8 ml-24 w-[30px] md:w-[50px] rounded-full h-[30px] md:h-[50px] border-2  border-[#287BB7]" />
              </div>                  <h2 className="text-[#000000] text-center">
                <span className="text-xl lg:text-2xl block font-bold mb-1">
                  {profile?.name}
                </span>
                <span className="flex flex-col text-2xl items-center lg:text-4xl font-light relative">
                  <span><span className="gradient font-black">Instagram </span>Followers</span>
                  <a href={profile.insta} className="flex items-center" target="_blank">
                    <img src={linkIcon} alt="link-icon" className="w-[16px] h-[16px]" />
                    <span className="text-sm mx-1 text text-[#287BB7] hover:text-[#4ea0db] font-bold">Visit Instagram</span>
                  </a>
                </span>
              </h2>
              <div className="flex justify-center items-center flex-col py-4 lg:py-10">
                <h2 className="gradient font-black text-xl lg:text-4xl">
                  {profile?.insta_followers}
                </h2>
                <p className="font-light text-black">{profile?.name}</p>
              </div>
            </div>
            <div className="lg:w-[80%] mx-auto box-shadow2 rounded-md">
            </div>
          </div>
        </div>
      </div>
      <div className="container px-0 mb-60">
        <div className=" flex w-full h-[50vh] my-20 md:my-40 ">
          <h2 className="text-xl md:text-2xl xl:text-3xl font-normal xsm:text-center xsm:ml-28 absolute text-white mt-3 xl:mt-52 ml-10">
            <span className="font-bold "> Recommended </span><br /> Reviews
          </h2>
          <div className="xsm:w-full w-[50%] h-[65vh] lg:w-[35%] rounded-3xl bg-[#287BB7]"></div>
          <div className="mt-20 xsm:mt-20 ml-20 lg:ml-52 xsm:ml-16 xl:ml-80 w-[80%] lg:w-[70%] xl:w-[65%] absolute bg-transparent">
            <Swiper
              modules={[Navigation]}
              spaceBetween={50}
              slidesPerView={slidesPerView}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              className="multiple-slide-carousel swiper-container relative"
            >
              {reviews.slice(0, 5).map((review, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div className="bg-white shadow-box-shadow border-4 rounded-3xl h-80 flex flex-col p-6 w-[110%] md:w-full">
                    <div
                      className={`p-1 mb-2 text-[#747474] min-h-52 max-h-52 ${review.description.length > 250 ? "overflow-y-scroll" : "overflow-y-auto"
                        }`}
                    >
                      {review.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="border-2 rounded-full w-14 h-14 flex justify-center items-center text-xl border-[#287BB7]">
                        {getInitials(review.user.name || "Anonymous")}
                      </div>
                      <div className="flex flex-col lg:text-lg font-bold">
                        <p>{capitalizeWords(review.user.first_name + " " + review.user.last_name || "Anonymous")}</p>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>


            <div className="absolute flex  m-auto left-0 right-0 w-fit mt-12 gap-4">
              <button
                ref={prevRef}
                className="!w-12 !h-12 !p-2 text-[50px] bg-[#287BB7] text-white flex justify-center items-center rounded-full"
                aria-label="Previous Slide">
                &lt;
              </button>
              <button
                ref={nextRef}
                className="!w-12 !h-12 !p-2 text-[50px] bg-[#287BB7] text-white flex justify-center items-center border rounded-full "
                aria-label="Next Slide">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f3f8fb] rounded-lg pt-20">
        <div className="p-4">
          <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row justify-center items-center">
            <div className="w-[60%] text-center lg:text-left justify-center items-center lg:w-[50%] px-4">
              <div className="">
                <h2 className="xsm:text-2xl text-4xl font-normal">
                  <span className="font-bold gradient"> Over All </span> Rating
                </h2>
                <div className="flex justify-center lg:justify-start items-center gap-2">
                  <span className="text-[#737072] text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {renderStars(averageRating)}
                  </div>
                </div>
              </div>
              <h6 className="text-[#737072] font-normal text-xl lg:text-2xl mb-3">
                {`(${totalReviews} Reviews)`}
              </h6>
              <p className="text-[#BBBBBB] xsm:text-lg text-xl">
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
            <div className="">
              <div className=" xsm:text-[16px] flex xsm:gap-2 gap-8 items-center mb-8 text-2xl font-bold text-[#737072]">
                5 Stars
                <div className="flex justify-center items-center xsm:gap-2 gap-4">
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                </div>
                ({ratingPercentages[5].toFixed(0)}%)
              </div>
              <div className="xsm:text-[16px] flex xsm:gap-2 gap-8 items-center mb-8 text-2xl font-bold text-[#737072]">
                4 Stars
                <div className="flex justify-center items-center xsm:gap-2 gap-4">
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                </div>
                ({ratingPercentages[4].toFixed(0)}%)
              </div>
              <div className="xsm:text-[16px] flex xsm:gap-2 gap-8 items-center mb-8 text-2xl font-bold text-[#737072]">
                3 Stars
                <div className="flex justify-center items-center xsm:gap-2 gap-4">
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                </div>
                ({ratingPercentages[3].toFixed(0)}%)
              </div>
              <div className="xsm:text-[16px] flex xsm:gap-2 gap-8 items-center mb-8 text-2xl font-bold text-[#737072]">
                2 Stars
                <div className="flex justify-center items-center xsm:gap-2 gap-4">
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                </div>
                ({ratingPercentages[2].toFixed(0)}%)
              </div>
              <div className="xsm:text-[16px] flex xsm:gap-2 gap-8 items-center mb-8 text-2xl font-bold text-[#737072]">
                1 Stars
                <div className="ml-[6px] flex justify-center items-center xsm:gap-2 gap-4">
                  <img src={fullStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                  <img src={blankStar} alt="star-image" className="xsm:w-6" />
                </div>
                ({ratingPercentages[1].toFixed(0)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* show review */}
      <div className="">
        {/* Profile details can be displayed here if necessary */}
        <div className="py-20 flex-col  mx-auto px-2 rounded-2xl text-justify  bg-[#f3f8fb]">
          {/* Render reviews */}
          {loadingReview ? (
            <p>Loading reviews...</p>
          ) : (
            currentReviews.map((review) => {
              const isExpanded = expandedReviews[review.id];
              const truncatedDescription = review.description.substring(0, 180);

              return (
                <div key={review.id} className="flex flex-col my-4 shadow-box-shadow p-4 bg-white rounded-xl w-[90%] md:w-[70%] mx-auto">
                  {console.log("data of review is = " + JSON.stringify(review))}
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <div className="border-2 rounded-full w-10 md:w-14 h-10 md:h-14 flex justify-center items-center text-xl md:text-2xl border-[#287BB7]">
                        {getInitials(review.user.first_name || "A")}
                      </div>
                      <div className="">
                        <label className="ml-1 font-bold text-[16px] md:text-xl">{capitalizeWords(review.user.first_name + " " + review.user.last_name || "Anonymous")}</label>
                        <div className="flex xsm:w-3 md:gap-1 ml-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#888686] flex justify-center text-[15px] xsm:text-[12px]">
                      <img src={calander} alt="calander-icon" className="md:w-6 md:h-5 w-3 h-3 mt-[1px] mr-1" />
                      {reviewFetchDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="ml-1 my-2 text-sm md:text-lg text-[#888686]">
                    <p>
                      {isExpanded ? review.description : truncatedDescription}
                      {review.description.length > 100 && (
                        <button onClick={() => toggleReadMore(review.id)} className="text-blue-500">
                          {isExpanded ? " Read Less" : "... Read More"}
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div className="pagination-controls flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

        </div >

        <div className="dropReview container" id="dropReview">
          <h3 className="text-xl lg:text-3xl mt-28 mb-8">
            <span className="font-black gradient"> Drop </span>
            <span className=" font-bold" >Your Review</span>
          </h3>
          {isAuthenticated ? (
            <AddReview />
          ) : (
            <SignIn brandId={bussiness} text={"To Post Review"} customStyles={{ backgroundColor: 'white', height: '75vh' }}
            />
          )}
        </div>
      </div >

      <OurListed />
    </>
  );
}
