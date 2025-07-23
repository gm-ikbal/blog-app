import React from 'react'
import { Navbar, NavbarLink, NavbarCollapse } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { TextInput } from 'flowbite-react'
import { AiOutlineSearch } from 'react-icons/ai'  
import { Button } from 'flowbite-react'
import { FaMoon } from 'react-icons/fa'


export default function Header() {
  return (
    <div className="!bg-white">
      <Navbar
        className="!border-b-2"
      >
           <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
          <span className='px-4 py-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg text-gray-800'>
       Blogify
        </span>

      </Link>

      <form>
        <TextInput
        type='text'
        placeholder='Search...'
        rightIcon = {AiOutlineSearch}
        className = 'hidden lg:inline'
        />
      </form>

      <Button className='lg:hidden w-12 h-10' color='gray' pill>
        <AiOutlineSearch/>
      </Button>

      <div className="flex gap-2 md:order-2">
    {/* <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
      <FaMoon/>
    </Button> */}

    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md">
      <Link to='/sign-in'>
        Sign In
      </Link>
    </Button>



      </div>

      <NavbarCollapse>
      <NavbarLink as={Link} to="/">Home</NavbarLink>
      <NavbarLink as={Link} to="/about">About</NavbarLink>
      {/* <NavbarLink as={Link} to="/">Home</NavbarLink> */}

    </NavbarCollapse>
      </Navbar>
    </div>
  )
}
