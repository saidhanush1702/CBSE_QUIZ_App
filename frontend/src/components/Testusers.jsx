import React from 'react'
import { useState, useEffect } from 'react'
import img from "./../assets/react.svg"

const Testusers = () => {

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

      <div className="w-[711px] bg-transparent left-[200px] h-[882px] rounded-[70px] absolute  top-1/2 transform -translate-y-1/2  flex flex-col items-center">
      {/* image source to be given here */}
      <img src=""  className='w-[176px] mt-30 h-[175px] rounded-[50%] bg-black ' />
      <h1 className="font-bold mt-5 text-[30px] text-center">Players name</h1>
      </div>

      <div className="w-[711px]  overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[882px] rounded-[70px] absolute right-[200px] top-1/2 transform -translate-y-1/2 bg-white flex flex-col items-center">
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