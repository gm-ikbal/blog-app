import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Spinner, TextInput } from 'flowbite-react';
import PostCard from '../component/PostCard';
import { HiOutlineSearch, HiOutlineArrowLeft } from 'react-icons/hi';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchTerm(query);
            handleSearch(query);
        }
    }, [searchParams]);

    const handleSearch = async (term) => {
        if (!term.trim()) {
            setPosts([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/post/search?searchTerm=${encodeURIComponent(term)}&limit=20`);
            const data = await res.json();
            
            if (res.ok) {
                setPosts(data.posts);
            } else {
                setError('Failed to search posts');
            }
        } catch (error) {
            console.error('Error searching posts:', error);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setPosts([]);
        setSearchParams({});
    };

    return (
        <div className='min-h-screen'>
            {/* Search Header */}
            <div className='bg-white dark:bg-[rgb(16,23,42)] border-b border-gray-200 dark:border-gray-700'>
                <div className='max-w-6xl mx-auto px-4 py-6'>
                    <div className='flex items-center gap-4 mb-6'>
                        <Link to='/' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'>
                            <HiOutlineArrowLeft size={24} />
                        </Link>
                        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>Search Posts</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='max-w-2xl'>
                        <div className='flex gap-2'>
                            <TextInput
                                type='text'
                                placeholder='Search posts by title or content...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className='flex-1'
                            />
                            <Button 
                                type='submit'
                                color='blue' 
                                disabled={loading}
                                className='flex items-center gap-2'
                            >
                                <HiOutlineSearch size={16} />
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                            {searchTerm && (
                                <Button 
                                    color='gray' 
                                    outline 
                                    onClick={clearSearch}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Search Results */}
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <Spinner size='xl' />
                    </div>
                ) : error ? (
                    <div className='text-center py-12'>
                        <h3 className='text-xl text-red-600 dark:text-red-400 mb-4'>
                            {error}
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Please try again later
                        </p>
                    </div>
                ) : searchTerm ? (
                    <div>
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                                Search Results
                            </h2>
                            <p className='text-gray-600 dark:text-gray-400'>
                                {posts.length > 0 
                                    ? `Found ${posts.length} post${posts.length === 1 ? '' : 's'} matching "${searchTerm}"`
                                    : `No posts found matching "${searchTerm}"`
                                }
                            </p>
                        </div>

                        {posts.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <HiOutlineSearch size={24} className='text-gray-400 dark:text-gray-500' />
                                </div>
                                <h3 className='text-xl text-gray-600 dark:text-gray-400 mb-2'>
                                    No results found
                                </h3>
                                <p className='text-gray-500 dark:text-gray-400 mb-4'>
                                    Try searching with different keywords
                                </p>
                                <Button color='blue' onClick={clearSearch}>
                                    Clear Search
                                </Button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <div className='bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <HiOutlineSearch size={24} className='text-blue-600 dark:text-blue-400' />
                        </div>
                        <h3 className='text-xl text-gray-600 dark:text-gray-400 mb-2'>
                            Start Searching
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Enter keywords to find posts by title or content
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
