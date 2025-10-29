import React from 'react'

const Report = ({grade,correct,incorrect,skipped}) => {
  return (
    <div>

         <div className='h-[50px] w-[197px] flex justify-center items-center ml-[100px] mb-[20px] rounded-[30px] border-1 border-[#0000005E] bg-white'>
                        <p className='text-[22px] font-semibold text-[#000000A1]'>Test Mode</p>
                    </div>
                    <div className="flex justify-center items-center ml-[100px] border-3 border-gray-200 shadow-[0_6px_6px_-1px_rgba(0,0,0,0.3)] rounded-[20px] h-[527px] bg-white w-[1112px]">
                        <div className='bg-white w-[800px] h-[400px]'>
                            <div className='flex bg-white h-[148px]  w-[444px]'>
                                <img className='h-[148px] w-[148px]' src="trophy.png" alt="trophy" />
                                <div className='flex flex-col'>
                                    <p className='text-[28px] font-semibold'>Quiz Complete !</p>
                                    <p className='text-[25px] mt-2 text-[#00000094]'> Your Grade : {grade}% </p>
                                    <div className='border border-[#0000005E]  w-[240px] h-[45px] rounded-[30px] flex justify-center items-center mt-3 bg-[#A57BE6]'>
                                        <p className='text-[22px] text-white'>Back to Dashboard</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-between w-[770px] gap-6 px-4 mt-5 h-[221px]'>
                                <div className='w-[256.67px] flex flex-col justify-center items-center h-[221px] bg-white rounded-[25px]  shadow-[0_4px_8px_rgba(0,0,0,0.1)]'>
                                    <img className='w-[97px] h-[97px]' src="check.png" alt="correct" />
                                    <p className='text-[25px] font-semibold'>{correct}</p>
                                    <p className='text-[20px] text-[#00000080]'>correct</p>
                                </div>
                                <div className='w-[256.67px] flex flex-col justify-center items-center h-[221px] bg-white rounded-[25px]  shadow-[0_4px_8px_rgba(0,0,0,0.1)]'>
                                    <img className='w-[97px] h-[97px]' src="cross.png" alt="correct" />
                                    <p className='text-[25px] font-semibold'>{incorrect} </p>
                                    <p className='text-[20px] text-[#00000080]'>incorrect</p>
                                </div>
                                <div className='w-[256.67px] flex flex-col justify-center items-center h-[221px] bg-white rounded-[25px]  shadow-[0_4px_8px_rgba(0,0,0,0.1)]'>
                                    <div className="flex items-end space-x-1 h-16">
                                        {/* Bar 1 */}
                                        <div className="w-3 bg-gradient-to-t from-purple-300 to-purple-500 rounded-sm h-4"></div>

                                        {/* Bar 2 */}
                                        <div className="w-3 bg-gradient-to-t from-purple-300 to-purple-500 rounded-sm h-8"></div>

                                        {/* Bar 3 */}
                                        <div className="w-3 bg-gradient-to-t from-purple-300 to-purple-500 rounded-sm h-6"></div>

                                        {/* Bar 4 */}
                                        <div className="w-3 bg-gradient-to-t from-purple-300 to-purple-500 rounded-sm h-10"></div>

                                        {/* Bar 5 */}
                                        <div className="w-3 bg-gradient-to-t from-purple-300 to-purple-500 rounded-sm h-16"></div>
                                    </div>
                                    <p className='text-[25px] font-semibold'>{skipped}</p>
                                    <p className='text-[20px] text-[#00000080]'>skipped</p>
                                </div>



                            </div>
                        </div>
                    </div>
    </div>
  )
}

export default Report