import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PostEditRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Allow access if user is logged in (post creator check will be done in the component)
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to='/signin'/>
  );
} 