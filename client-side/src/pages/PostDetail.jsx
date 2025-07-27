import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'flowbite-react';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/post/getposts?slug=${slug}`);
                const data = await res.json();
                
                if (res.ok) {
                    if (data.posts && data.posts.length > 0) {
                        setPost(data.posts[0]);
                    } else {
                        setError('Post not found');
                    }
                } else {
                    setError(data.message || 'Failed to fetch post');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const isValidImageData = (imageData) => {
        if (!imageData) return false;
        if (typeof imageData !== 'string') return false;
        if (imageData.startsWith('data:image/')) return true;
        if (imageData.startsWith('http')) return true;
        if (imageData.startsWith('/uploads/')) return true;
        return false;
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-3 max-w-4xl mx-auto min-h-screen'>
                <h1 className='text-center text-3xl my-7 font-semibold text-red-500'>
                    {error}
                </h1>
            </div>
        );
    }

    if (!post) {
        return (
            <div className='p-3 max-w-4xl mx-auto min-h-screen'>
                <h1 className='text-center text-3xl my-7 font-semibold'>
                    Post not found
                </h1>
            </div>
        );
    }

    return (
        <div className='p-3 max-w-4xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>
                {post.title}
            </h1>
            
            <div className='flex gap-2 my-2 justify-center'>
                <span className='bg-slate-100 rounded-full px-2 py-1 text-sm'>
                    {post.category}
                </span>
            </div>
            
            <div className='my-2 text-slate-500 text-center'>
                <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            {post.image && isValidImageData(post.image) && (
                <div className='my-4'>
                    <img
                        src={post.image}
                        alt={post.title}
                        className='w-full h-96 object-cover rounded-lg'
                        onError={(e) => {
                            console.error('Image failed to load for post:', post.title);
                            e.target.style.display = 'none';
                        }}
                        onLoad={() => console.log('Image loaded successfully:', post.title)}
                    />
                </div>
            )}
            
            <div 
                className='post-content my-4'
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </div>
    );
} 