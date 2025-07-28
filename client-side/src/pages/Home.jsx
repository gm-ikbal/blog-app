import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import PostCard from '../component/PostCard';
import { HiOutlineArrowRight, HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch('/post/recent?limit=6');
                const data = await res.json();
                
                if (res.ok) {
                    setPosts(data.posts);
                } else {
                    setError('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-3 max-w-6xl mx-auto min-h-screen'>
                <h1 className='text-center text-3xl my-7 font-semibold text-red-500'>
                    {error}
                </h1>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-teal-400 via-teal-700 to-teal-400 text-white py-20'>
                <div className='max-w-6xl mx-auto px-4 text-center'>
                    <h1 className='text-5xl font-bold mb-6'>
                        Welcome to Our Blog
                    </h1>
                    <p className='text-xl mb-8 max-w-2xl mx-auto'>
                        Discover amazing stories, insights, and knowledge shared by our community of writers and developers.
                    </p>
                    <div className='flex gap-4 justify-center'>
                        {currentUser ? (
                            <Link to='/createpost'>
                                <Button size='lg' color='teal-500'>
                                    Create Post
                                </Button>
                            </Link>
                        ) : (
                            <Link to='/signup'>
                                <Button size='lg' color='light'>
                                    Get Started
                                </Button>
                            </Link>
                        )}
                        {/* <Link to='/about'>
                            <Button size='lg' outline color='light'>
                                Learn More
                            </Button>
                        </Link> */}
                    </div>
                </div>
            </div>

            {/* Featured Posts Section */}
            <div className='max-w-6xl mx-auto px-4 py-16'>
                <div className='flex justify-between items-center mb-12'>
                    <div>
                        <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                            Latest Articles
                        </h2>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Stay updated with our most recent posts and insights
                        </p>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <Link to='/signup'>
                            <Button color='teal-500' className='flex items-center gap-2 bg-gradient-to-r from-teal-300 via-teal-700 to-teal-300 text-white'>
                                Join Our Community
                                <HiOutlineArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className='text-center py-12'>
                        <h3 className='text-xl text-gray-600 dark:text-gray-400 mb-4'>
                            No posts available yet
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Be the first to create amazing content!
                        </p>
                    </div>
                ) : (
                  
                    <div className="grid grid-cols-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
               
                )}
            </div>

            {/* Call to Action Section */}
            <div className='bg-gradient-to-r from-teal-400 via-teal-700 to-teal-400 text-white py-16'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    <h2 className='text-3xl font-bold text-gray-400 dark:text-gray-200 mb-4'>
                        Ready to Share Your Story?
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
                        Join our community of writers and developers. Share your knowledge, experiences, and insights with the world.
                    </p>
                    <div className='flex gap-4 justify-center'>
                        {currentUser ? (
                            <Link to='/createpost'>
                                <Button size='lg' color='teal-500'>
                                    Create Post
                                </Button>
                            </Link>
                        ) : (
                            <Link to='/signup'>
                                <Button size='lg' color='light'>
                                    Start Writing
                                </Button>
                            </Link>
                        )}
                       
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className='max-w-6xl mx-auto px-4 py-16'>
                <h2 className='text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12'>
                    Why Choose Our Platform?
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='text-center'>
                        <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <HiOutlineUser size={24} className='text-blue-600' />
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Community Driven</h3>
                        <p className='text-gray-600'>
                            Connect with like-minded individuals and share your knowledge with a growing community.
                        </p>
                    </div>
                    <div className='text-center'>
                        <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <HiOutlineCalendar size={24} className='text-green-600' />
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Regular Updates</h3>
                        <p className='text-gray-600'>
                            Stay informed with fresh content and insights from our community of writers.
                        </p>
                    </div>
                    <div className='text-center'>
                        <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <HiOutlineArrowRight size={24} className='text-purple-600' />
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>Easy Publishing</h3>
                        <p className='text-gray-600'>
                            Simple and intuitive interface to create and publish your content quickly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
