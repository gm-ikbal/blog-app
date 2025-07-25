import React from 'react'
import { Navbar, 
  NavbarLink, 
  NavbarCollapse, 
  Dropdown, 
  Avatar,
  DropdownHeader, 
  DropdownDivider, 
  DropdownItem } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { TextInput } from 'flowbite-react'
import { AiOutlineSearch } from 'react-icons/ai'
import { Button } from 'flowbite-react'
import { FaMoon } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Header() {
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch();

  const handleSignout = async () => {

  }
  return (
    <div className="!bg-white">
      <Navbar
        className="!border-b-2"
      >
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold light:text-white'
        >
          <span className='px-4 py-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg text-gray-800'>
            Blogify
          </span>

        </Link>

        <form>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className='lg:hidden w-12 h-10' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            label={
              <Avatar
                alt='useravatar'
                img={currentUser.profilPicture}
                rounded>
              </Avatar>
            }
          >
    <DropdownHeader>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Sign In
            </Button>
          </Link>

        )}
        {/* <div className="flex gap-2 md:order-2">
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill 
          onClick={()=> dispatch(toggleTheme())}>
      <FaMoon/>
    </Button>


        </div> */}
       
      </Navbar>
    </div>
  )
}
