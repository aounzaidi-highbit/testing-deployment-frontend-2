import React from 'react'
import { circleIcon } from '../../services/images'

const About = () => {
  return (
    <div>
      <div className="bg-Secondary p-10">
        <div className="">
          <div className="grid lg:grid-cols-2 gap-6 place-items-center">
            <div className="">
              <h2 className="text-5xl lg:text-6xl 2xl:text-7xl mb-6 lg:mb-8 lg:w-[100%]">
                <span className="font-bold inline-block relative pb-3 text-Primary">
                  Better Things
                  <br />
                </span>{" "}And
                <span className="font-normal block mt-4">Better Solution </span>
              </h2>
              <p className="text-[#464F54] lg:text-xl">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <button className="bg-Primary hover:bg-Hover text-xl lg:text-2xl font-bold p-3 rounded-md text-white mt-4">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center lg:my-16">
        <h2 className="text-center">
          <span className="text-Primary text-xl lg:text-2xl block font-bold mb-1">
            Working Process
          </span>
          <span className="text-2xl lg:text-4xl font-light relative">
            How <span className="text-Primary font-black">IT </span>  Working
            {/* <img
              className="flex justify-end absolute right-0 -bottom-5 h-[28px]"
              src={Vector}
              alt="arrow"
            /> */}
          </span>
        </h2>
      </div>

      <div className="px-32 w-full gap-20 flex justify-around lg:my-32 mb-26 ">
        <div className="w-full h-[292.27px] rounded-md px-6 overflow-hidden shadow-box-shadow">
          <div className="flex justify-center items-center mt-[20px]">
            {/* <img src={workIcon} alt="contact-icon" className=' absolute z-10 mt-24' width="40px" /> */}
          </div>
          <div className="text mt-[7rem] text-center">
            <p className='my-2 font-bold text-center text-Primary'>Find Interesting Businesses</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia corporis nobis cumque! Lorem ipsum dolor sit, amet consectetur </p>
          </div>
        </div>

        <div className="w-full h-[292.27px] rounded-md flex flex-col text-center px-6  overflow-hidden shadow-box-shadow">
          <div className="flex justify-center items-center mt-6">
            {/* <img src={contactIcon} alt="contact-icon" className=' absolute z-10 mt-24 filter invert-100' /> */}
            <img src={circleIcon} alt="circleIcon" className='absolute mt-24' width='65px' />
            {/* <img src={phone} alt="phone" className='absolute mt-24' width='45px' /> */}
          </div>
          <div className="text mt-[6rem] text-center">
            <p className='my-2 font-bold text-center text-Primary'>Contact Few Owner</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia corporis nobis cumque! Lorem ipsum dolor sit, amet consectetur </p>
          </div>
        </div>

        <div className="w-full h-[292.27px] rounded-md px-6 overflow-hidden shadow-box-shadow">
          <div className="flex justify-center items-center mt-[20px] ">
            {/* <img src={calanderIcon} alt="contact-icon" className=' absolute z-10 mt-24 ' /> */}
          </div>
          <div className="text mt-[7rem] text-center">
            <p className='my-2 font-bold text-center text-Primary'>Make A Reservation</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia corporis nobis cumque! Lorem ipsum dolor sit, amet consectetur </p>
          </div>
        </div>
        {/* shadow-box-shadow */}
        {/* border-2 border-black */}
      </div>

    </div>
  )
}

export default About