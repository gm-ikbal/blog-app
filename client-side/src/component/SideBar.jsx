import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';
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
          {currentUser && currentUser.isAdmin && (
          <SidebarItem
            as={Link}
            to="/dashboard?tab=posts"
            active={tab === 'posts'}
            icon={HiDocumentText}
          >
            Posts
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
