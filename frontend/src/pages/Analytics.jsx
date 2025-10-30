import React from 'react'
import Sidebar from '../components/Sidebar'
import Report from '../components/Report'
import Leaderboard from '../components/Leaderboard'


const Analytics = () => {
    return (
        <div className="flex h-screen bg-gradient-to-b from-cyan-100 to-purple-200">
    <Sidebar />
    <div className="flex-1 p-6 overflow-y-auto">
        <div className='mt-10'>
            <Report grade={75} correct={8} incorrect={0} skipped={0}/>
            <Leaderboard/>
        </div>
    </div>
</div>

    )
}

export default Analytics