import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
    return (
        <div className='p-10 flex flex-col justify-center items-center text-white' style={{ backgroundImage: "url('/web-bg3 (1).jpg')" }}>
          <h2 className='p-5 pb-20 rounded-full text-4xl font-extrabold px-4 text-center 
   text-transparent bg-clip-text bg-gradient-to-r from-[#B9A77D] via-[#A08E65] to-[#CBBFA1]'>
  CREATE SMARTER, NOT HARDER <br />  
  <span className="font-semibold">- let AI bring your content to life</span>
</h2>
          <h2 className='text-4xl pt-20 font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500 '>Browse all Templates</h2>
          <p className='text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500'>What Would you Like to create today ??</p>
          <div className='w-full flex justify-center items-center'>
            <div className='flex gap-2 items-center p-2 border rounded bg-white my-5 w-[50%]'>
              <Search className="text-[#B9A77D]" />
                <input type="text" placeholder='Search...' 
                onChange={(event)=>onSearchInput(event.target.value)}
                className='bg-transparent-md w-full outline-none text-black'/>
            </div>
          </div>
        </div>
      )
}

export default SearchSection 