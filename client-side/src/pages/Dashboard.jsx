import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../component/SideBar';
import Profile from '../component/Profile';
import DashPosts from '../component/DashPosts';
import DashUsers from '../component/DashUsers';
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <SideBar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <Profile />}
      {/* posts... */}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
    </div>
  );
}
