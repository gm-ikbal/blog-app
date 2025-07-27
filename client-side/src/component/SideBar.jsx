import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiPlus,
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';
import { getProfileImageUrlWithFallback, handleImageError } from '../utils/imageUtils';
export default function SideBar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);


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
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
   <Sidebar className="w-full md:w-56">
      {/* User Profile Section */}
      <div className="flex flex-col items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
          <img
            src={getProfileImageUrlWithFallback(currentUser)}
            alt="user"
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, currentUser)}
          />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentUser?.username || 'User'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentUser?.email || 'user@example.com'}
          </p>
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
            {currentUser?.isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
      </div>
      
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col gap-1'>
          <SidebarItem
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser.isAdmin ? 'Admin' : 'User'}
            labelColor="dark"
          >
            Profile
          </SidebarItem>
          
          <SidebarItem
            as={Link}
            to="/createpost"
            icon={HiPlus}
          >
            Create Post
          </SidebarItem>
          
          <SidebarItem
            as={Link}
            to="/dashboard?tab=posts"
            active={tab === 'posts'}
            icon={HiDocumentText}
          >
            My Posts
          </SidebarItem>
          
          {currentUser && currentUser.isAdmin && (
            <SidebarItem
              as={Link}
              to="/dashboard?tab=users"
              active={tab === 'users'}
              icon={HiOutlineUserGroup}
            >
              Users
            </SidebarItem>
          )}

          <SidebarItem
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
