import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full h-20 border-b' >
      <h1>Logo</h1>
      <div>
        <Link href={"/"} >
            <span>Navbar</span>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
