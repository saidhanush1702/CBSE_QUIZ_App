import React from 'react'

const Leaderboard = () => {
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
        <div className="flex flex-col mt-7 ml-[100px] border-3 border-gray-200 shadow-[0_6px_6px_-1px_rgba(0,0,0,0.3)] rounded-[20px] h-[527px] bg-white w-[1112px] p-5">
            <p className="text-[26px] text-[#0000007D] font-semibold mb-4">Leaderboard</p>
            <div className="overflow-y-auto ml-5 h-[350px] [scrollbar-width:none]  [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-[1010px]">
                {data.map((items, ix) => (
                    <div
                        key={ix}
                        className="w-[1010px] hover:bg-[#C0E1FF] mt-2 border-3 border-gray-200 shadow-[0_8px_6px_-1px_rgba(0,0,0,0.3)] h-[106px] rounded-[50px] flex flex-row items-center p-5"
                    > {/** IMAGE URLS HEREEEEE */}
                        <img className="w-[80px] h-[80px] rounded-[50%] bg-black" />
                        <div className="flex flex-col ml-5">
                            <p className="text-[25px] font-bold">{items.name}</p>
                            <p className="text-[25px] text-[#8C919B]">{items.level}</p>
                        </div>
                        <img className="w-[60px] h-[60px] rounded-[50%] bg-purple-200 ml-auto" />
                    </div>
                ))}
            </div>
            <div className=' w-full h-[80px] flex justify-center items-center'>
                <div className='w-[216px] h-[40px] border-3 border-gray-200 shadow-[0_8px_6px_-1px_rgba(0,0,0,0.3)] font-semibold text-[#000000A8] bg-white rounded-[30px] flex justify-center items-center'>
                    <p>See All</p>
                </div>
            </div>
        </div>

    )
}

export default Leaderboard