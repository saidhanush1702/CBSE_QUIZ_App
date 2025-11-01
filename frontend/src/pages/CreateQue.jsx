import React from 'react'

const CreateQue = () => {
    return (
        <div className='bg-[linear-gradient(to_bottom,#A8E6CF,#FFFFFF,#C398E5)] min-h-screen'>
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

            <div className='flex flex-row mt-10 ml-35   gap-20'>
                <div className='w-[853px] h-[886px]  bg-white rounded-[100px] border border-gray-300 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>

                    <div className='px-15'>
                        <h1 className='text-[35px]  pt-10 pb-3 font-semibold'>Question Data</h1>
                        <h1 className='text-[27px]   py-1 text-[#8C919B]'>Question Text</h1>
                        <div className='relative w-[734px]'>
                            <input
                                type='text'
                                placeholder='Enter question here'
                                className='w-full text-[25px] h-[60px] rounded-[20px] border border-gray-300 text-gray-500 px-4 pr-12 shadow-[0_8px_6px_-1px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-gray-400'
                            />

                            <img
                                src={'edit.png'}
                                alt='edit'
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer opacity-70 hover:opacity-100'
                            />
                        </div>
                        <h1 className='text-[27px]   py-5 text-[#8C919B]'>Options</h1>
                        <div className="flex justify-center items-center">
                            <div className="w-[734px] h-[182px] rounded-[10px] border border-gray-300 text-gray-500 shadow-[0_8px_6px_-1px_rgba(0,0,0,0.3)] flex justify-center items-center">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">

                                    {/* Input 1 */}
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            className='w-[345px] h-[58px] rounded-[10px] bg-[#C0E1FF] border border-gray-300 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400'
                                        />
                                        <img
                                            src={'edit.png'}
                                            alt='edit'
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100'
                                        />
                                    </div>

                                    {/* Input 2 */}
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            className='w-[345px] h-[58px] rounded-[10px] bg-[#C0E1FF] border border-gray-300 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400'
                                        />
                                        <img
                                            src={'edit.png'}
                                            alt='edit'
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100'
                                        />
                                    </div>

                                    {/* Input 3 */}
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            className='w-[345px] h-[58px] rounded-[10px] bg-[#C0E1FF] border border-gray-300 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400'
                                        />
                                        <img
                                            src={'edit.png'}
                                            alt='edit'
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100'
                                        />
                                    </div>

                                    {/* Input 4 */}
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            className='w-[345px] h-[58px] rounded-[10px] bg-[#C0E1FF] border border-gray-300 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400'
                                        />
                                        <img
                                            src={'edit.png'}
                                            alt='edit'
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100'
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* Category, Difficulty, Format Dropdowns */}
                        <div className="flex space-x-2 mb-4 mt-10">
                            {/* Category */}
                            <select
                                defaultValue=""
                                className="border w-[234px] h-[52px] text-[20px] border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="" disabled>
                                    Category
                                </option>
                                <option value="science">Science</option>
                                <option value="math">Math</option>
                                <option value="history">History</option>
                            </select>

                            {/* Difficulty */}
                            <select
                                defaultValue=""
                                className="border border-black w-[234px] h-[52px] text-[20px] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="" disabled>
                                    Difficulty
                                </option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            {/* Format */}
                            <select
                                defaultValue=""
                                className="border border-black w-[234px] h-[52px] text-[20px] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="" disabled>
                                    Format
                                </option>
                                <option value="mcq">MCQ</option>
                                <option value="truefalse">True/False</option>
                                <option value="shortanswer">Short Answer</option>
                            </select>
                        </div>

                        <div className="flex justify-between mt-20">
                            <button className="bg-gray-100 w-[226px] text-[23px] h-[53px] hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full text-sm transition">
                                Add Questions +
                            </button>
                            <div className="space-x-2">
                                <button className="bg-gray-400 w-[122px] text-[23px] h-[53px] hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md text-sm transition">
                                    Delete
                                </button>
                                <button className="bg-teal-200 w-[122px] text-[23px] h-[53px] hover:bg-teal-300 text-teal-800 font-medium py-2 px-4 rounded-md text-sm transition">
                                    Submit
                                </button>
                            </div>
                        </div>



                    </div>

                </div>




                <div className='w-[659px] h-[888px]  bg-white rounded-[50px] border border-gray-300 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>

                </div>

            </div>

        </div>
    )
}

export default CreateQue