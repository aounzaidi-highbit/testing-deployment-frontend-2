import React, { useEffect, useState, useRef } from "react";
import Vector from "../../assets/images/vector-category.png";
import cloths from "../../assets/images/cloths.png";
import bgCategories from "../../assets/images/bg-categories.png";
import { getAllCategories } from "../../services/categories";
import { setupAxios } from "../../utils/axiosClient";
import Loader from "../../components/Loader/loader";
import NoData from "../../components/noData/noData";
import { Link } from "react-router-dom";

export default function PopularCategories() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategories = async () => {
    setupAxios();
    try {
      setLoading(false);
      const res = await getAllCategories();
      setCategory(res?.data?.results);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -207, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 207, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-[40vh] relative mb-60">
      {category?.length === 0 ? (
        setTimeout(() => {
          <NoData />;
        }, 3000)
      ) : (
        <div className="flex flex-col items-center ">
          <img src={bgCategories} alt="Categories-Image" className="w-full xl:h-[70vh] h-[60vh] 2xl:h-[60vh] bg-[#287BB7] " />

          <div className="absolute flex justify-center items-center w-full mt-8 pt-6 "
            data-aos-delay="300"
            data-aos="zoom-in"
          >
            <h2 className="text-[#ffffff] text-center">
              <span className="text-xl lg:text-2xl block font-bold mb-1">
                Popular Categories
              </span>
              <span className="text-2xl lg:text-4xl font-semibold relative">
                <span className=" font-black"> Browse Top </span> Categories
                <img
                  className="flex justify-end absolute right-0 -bottom-5 h-[28px]"
                  src={Vector}
                  alt="arrow"
                />
              </span>
            </h2>
          </div>

          <div className="absolute max-w-[79%] mt-28 flex items-center ml-30 p-10 2xl:mt-40">
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 bg-white p-0 rounded-full w-10 text-4xl font-bold text-[#287BB7] hover:shadow-box-shadow"
              style={{ transform: "translateY(-50%)" }}
            >
              &lt;
            </button>
            <div
              ref={sliderRef}
              className="flex overflow-x-scroll scrollbar-hide gap-6 p-6 max-w-full mx-4 justify-center"
            >
              {loading ? (
                <Loader />
              ) : (
                category.map((item) => (
                  <Link
                    key={item?.id}
                    to={`/businessList?category=${item?.name}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="rounded-md shadow-box-shadow hover:animate-grow "
                  >
                    <div
                      className="bg-white max-h-[200px] min-h-[200px] rounded-md flex items-center justify-center flex-col p-8 w-44 "
                    >
                      <div className="flex justify-center items-center w-full h-full">
                        <img src={cloths} alt="cloths" className="mb-4" />
                      </div>
                      <div className="">
                        <h2 className="text-[16px] text-center font-bold mb-1 gradient w-full h-full flex justify-center items-center">
                          {capitalizeWords(item?.name)}
                        </h2>
                        <p className="text-[#9B9B9B] mx-auto text-center text-[15px] font-medium">
                          607 Items
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 bg-white p-0 rounded-full w-10 text-4xl font-bold text-[#287BB7] hover:shadow-box-shadow"
              style={{ transform: "translateY(-50%)" }}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
