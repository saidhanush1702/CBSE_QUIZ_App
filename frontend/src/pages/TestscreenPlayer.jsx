import React from 'react'
import Testusers from '../components/Testusers'

const TestscreenPlayer = () => {
    return (
        <Testusers playername="name" playerimage="img" testid="someid">
            <p className='font-semibold text-[20px] text-[#8C919B] mt-5'>Player</p>
            <div className='relative w-[471px] mt-10 bg-white rounded-[50px] h-[80px] flex justify-center items-center'>
                <p className='text-[26px] text-[#8C919B]'>testid_here</p>

                <img
                    className='h-[32px] w-[32px] absolute right-6 cursor-pointer'
                    src="copy.png"
                    alt="copy"
                />
            </div>
            <div className='w-[471px] mt-10 bg-[#9823F5] text-center rounded-[50px] h-[80px] flex justify-center items-center'>
                <p className='text-[26px] text-white '>Join Quiz</p> <br />
            </div>
            <div className='w-[471px] mt-10 bg-[#8C919B87] text-center rounded-[50px] h-[80px] flex justify-center items-center'>
                <p className='text-[26px] text-white '>Start Quiz</p> <br />
            </div>

        </Testusers>
    )
}

export default TestscreenPlayer