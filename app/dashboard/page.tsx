"use client"
import React, { useState } from 'react'
import SearchSection from './-components/SearchSection'
import TemplateListSection from './-components/TemplateListSection'

function Dashboard() {
  const[userSearchInput,setUserSearchinput] = useState<string>()
  return (
    <div>
      <SearchSection
      onSearchInput = {(value:string)=>setUserSearchinput(value)}
      />
      <TemplateListSection userSearchInput = {userSearchInput}/>
    </div>
  )
}

export default Dashboard