import React from 'react'
import Logo from "@/components/global/Logo"
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'> 
      <Logo />
      {children}
    </div>
  )
}

export default layout;

