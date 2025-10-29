import React from 'react'
import Sidebar from '../components/Sidebar'
import Report from '../components/Report'

const Analytics = () => {
    return (
        <div className="flex h-screen bg-gradient-to-b from-cyan-100 to-purple-200 p-6">
            <Sidebar />
            <div>
                <div className='mt-10'> {/* div of main content */}
                   <Report grade={75} correct={8} incorrect={0} skipped={0}/>
                   
                </div>
            </div>
        </div>

    )
}

export default Analytics