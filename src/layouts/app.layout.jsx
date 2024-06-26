import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "../components/Header"
import { Button } from "@/components/ui/button"


const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen container' >
        <Header/>
        {/* body */}
        <Outlet/>
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10 ">
        Made with ❤️ by Shivam Sikotra
      </div>
    </div>
  )
}

export default AppLayout