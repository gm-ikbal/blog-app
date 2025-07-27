import './App.css'; // Make sure this is imported
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from './redux/user/userSlice';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Project';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Header from './component/Header';
import FooterCom from './component/FooterCom';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './component/PrivateRoute';
import Post from './pages/Post';
import UpdatedPost from './pages/UpdatedPost';
import PostDetail from './pages/PostDetail';
import OnlyAdminPrivateRoute from './component/onlyAdminRoutes';
import PostEditRoute from './component/PostEditRoute';
import ScrollToTop from './component/ScrollTotop';
import Search from './pages/Search';

function AppContent() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/user/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          dispatch(signInSuccess(data));
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      }
    };

    // Only check if no current user (to avoid unnecessary requests)
    if (!currentUser) {
      checkAuthStatus();
    }
  }, [dispatch, currentUser]);

  return (
    <div className="app-wrapper">
      <Header />
      <ScrollToTop />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route element={<PrivateRoute />}>
            <Route path="/createpost" element={<Post />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<PostEditRoute />}>
            <Route path="/update-post/:postid" element={<UpdatedPost />} />
          </Route>
        </Routes>
      </main>

      <FooterCom />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
