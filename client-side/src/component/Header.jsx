import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar, 
  NavbarLink, 
  NavbarCollapse, 
  Dropdown, 
  Avatar,
  DropdownHeader, 
  DropdownDivider, 
  DropdownItem,
  TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { FaMoon } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'

import { useDispatch, useSelector } from 'react-redux'

import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';
import { getProfileImageUrlWithFallback, handleImageError } from '../utils/imageUtils';

export default function Header() {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    dispatch(signOutStart())
    try {
        const res = await fetch(`/user/signout`, {
            method: 'POST',
        })
        if (res.ok) {
            dispatch(signOutSuccess())
            navigate('/signin')
        }
    }
    catch (error) {
        dispatch(signOutFailure(error))
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="!bg-white">
      <Navbar
        className="!border-b-2"
      >
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold light:text-white'
        >
          <span className='px-4 py-2 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 rounded-lg text-black'>
            Blogify
          </span>

        </Link>
        <form onSubmit={handleSearch} className='hidden lg:block'>
          <TextInput
            type='text'
            placeholder='Search posts...'
            rightIcon={AiOutlineSearch}
            className='w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Button 
          className='lg:hidden w-12 h-10' 
          color='gray' 
          pill
          onClick={handleSearch}
        >
          <AiOutlineSearch />
        </Button>
        {currentUser && (
          <Link to='/createpost'>
            <Button  color='teal-500' className='hidden md:inline-flex text-white bg-teal-500'>
              Create Post
            </Button>
          </Link>
        )}
        
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            label={
              <Avatar
                alt='useravatar'
                img={getProfileImageUrlWithFallback(currentUser)}
                rounded
                onError={(e) => handleImageError(e, currentUser)}>
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
            <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button className="bg-gradient-to-r from-teal-600 via-teal-800 to-teal-300 text-white">
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
