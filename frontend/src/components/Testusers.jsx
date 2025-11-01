import React from 'react'
import { useState, useEffect } from 'react'



const Testusers = ({ playerimage, playername, id, children }) => {

  let data = [
    { "name": "Alex", "level": 10 },
    { "name": "Jordan", "level": 9 },
    { "name": "Taylor", "level": 8 },
    { "name": "Casey", "level": 7 },
    { "name": "Morgan", "level": 6 },
    { "name": "Riley", "level": 5 },
    { "name": "Jamie", "level": 4 },
    { "name": "Drew", "level": 3 },
    { "name": "Avery", "level": 2 },
    { "name": "Sam", "level": 1 }
  ]


  return (


    <div className="flex h-screen bg-gradient-to-b from-cyan-100 to-purple-200">

      <div className="w-full bg-transparent flex items-center justify-between  border border-[#71717166] h-[100px] px-6">
        {/* Left Icon */}
        <div className='ml-10'>
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.66003 17.6899L22.87 30.0601C23.54 30.6401 23.88 31.3798 23.88 32.2798C23.88 33.1798 23.54 33.92 22.87 34.5C22.2 35.08 21.3499 35.3799 20.3199 35.3799C19.2899 35.3799 18.44 35.08 17.77 34.5L1 19.9102C0.64 19.5902 0.37998 19.2499 0.22998 18.8799C0.0799805 18.5099 0 18.1099 0 17.6899C0 17.2599 0.0699805 16.87 0.22998 16.5C0.38998 16.13 0.64 15.7802 1 15.4702L17.77 0.870117C18.44 0.290117 19.2899 0 20.3199 0C21.3499 0 22.2 0.290117 22.87 0.870117C23.54 1.45012 23.88 2.18984 23.88 3.08984C23.88 3.98984 23.54 4.73006 22.87 5.31006L8.66003 17.6899Z" fill="#2F237F" />
          </svg>
        </div>

        {/* Center Text */}
        <p className="text-[30px] text-[#2F237F] font-semibold text-center">
          Science & Technology Quiz
        </p>

        {/* Right Icon (for symmetry) */}
        <div className='mr-10 w-[65px] h-[58px]'>
          <img src="logo.png" alt="smaranAI" />
        </div>
      </div>


      <div className="w-[711px] overflow-y-auto bg-transparent mt-15 left-[200px] h-[882px] rounded-[70px] absolute  top-1/2 transform -translate-y-1/2  flex flex-col items-center">
        {/* image source to be given here */}
        <img src="" className='w-[176px] mt-30 h-[175px] rounded-[50%] bg-black ' />
        <h1 className="font-bold mt-5 text-[30px] text-center">Players name</h1>
        {children}
      </div>

      <div className="w-[711px] mt-15  overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[882px] rounded-[70px] absolute right-[200px] top-1/2 transform -translate-y-1/2 bg-white flex flex-col items-center">
        <div className="flex  h-[31px] justify-center items-center mt-10">
          <h1 className="font-bold text-[30px] text-center">Players (3/6)</h1>
        </div>
        <div className='mt-10'></div>
        {
          data.map((items, ix) => (
            <div key={ix}>
              <div className='w-[619px] hover:bg-[#C0E1FF] mt-2 border-3 border-gray-200 shadow-[0_8px_6px_-1px_rgba(0,0,0,0.3)] h-[106px] rounded-[50px] flex flex-row items-center p-5'>
                {/*image to be rendered here*/} <img className='w-[80px] h-[80px] rounded-[50%] bg-black '>

                </img>

                <div className='flex flex-col ml-5'>

                  <p className="relative text-[25px] font-bold">{items.name}</p>
                  <p className="relative text-[25px] text-[#8C919B] ">{items.level}</p>
                </div>

              </div>
            </div>

          ))
        }
      </div>


    </div>





  )
}

export default Testusers