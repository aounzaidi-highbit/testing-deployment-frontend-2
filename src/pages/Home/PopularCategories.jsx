import React, { useEffect, useState, useRef } from "react";
// import Vector from "../../assets/images/vector-category.png";
import cloths from "../../assets/icons/cloths.svg";
import { getAllCategories } from "../../services/business";
import { setupAxios } from "../../utils/axiosClient";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../../utils/helper";

const PopularCategories = () => {
  const [category, setCategory] = useState([]);
  const sliderRef = useRef(null);

  const getCategories = async () => {
    setupAxios();
    try {
      const res = await getAllCategories();
      setCategory(res?.data?.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center ">
        <div className="w-full h-[65vh] 2xl:h-[55vh] bg-Primary shadow-box-shadow"></div>
        <div className="absolute flex justify-center items-center w-full mt-8 pt-6"
          data-aos-delay="300"
          data-aos="zoom-in">
          <h2 className="text-[#ffffff] text-center">
            <span className="text-xl lg:text-2xl block font-bold mb-1">
              Popular Categories
            </span>
            <span className="text-2xl lg:text-4xl font-semibold relative">
              Browse Top Categories
              {/* <img
                className="flex justify-end absolute right-0 -bottom-5 h-[28px]"
                src={Vector}
                alt="arrow" /> */}
            </span>
          </h2>
        </div>

        <div className="absolute max-w-[69%] mt-28 flex items-center ml-30 xsm:max-w-[90%] p-10 2xl:mt-40">
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-white p-0 rounded-full w-10 text-4xl font-bold text-Primary hover:shadow-box-shadow"
            style={{ transform: "translateY(-50%)" }}>
            &lt;
          </button>
          <div
            ref={sliderRef}
            className="flex overflow-x-scroll scrollbar-hide gap-6 p-6 max-w-full mx-4 justify-start">
            {category.map((item) => (
              <Link
                key={item?.id}
                to={`/business-list?category=${item?.name}`}
                onClick={() => window.scrollTo(0, 0)}
                className="rounded-md shadow-box-shadow hover:animate-grow ">
                <div className="bg-white max-h-[200px] min-h-[200px] rounded-md flex items-center justify-center flex-col w-44">
                  <div className="flex justify-center items-center w-full h-full">
                    <img src={cloths} alt="cloths" className="mb-4" />
                  </div>
                  <div className="">
                    <h2 className="text-[16px] text-center font-bold mb-1 text-Primary w-full h-full flex justify-center items-center">
                      {capitalizeWords(item?.name)}
                    </h2>
                    <p className="text-[#9B9B9B] mx-auto text-center text-[15px] font-medium">
                      {item.brand_count || 0}<br />{item.brand_count === 1 ? ' Brand' : ' Brands'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-white p-0 rounded-full w-10 text-4xl font-bold text-Primary hover:shadow-box-shadow"
            style={{ transform: "translateY(-50%)" }}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
export default PopularCategories;
