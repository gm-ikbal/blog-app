import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import PostCard from '../component/PostCard';
//import CommentSection from '../component/CommentSection';
import CallToAction from '../component/CalltoAction';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();
    const [recentPosts, setRecentPosts] = useState([]);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/post/getposts?slug=${slug}`);
                const data = await res.json();
                
                if (res.ok) {
                    if (data.posts && data.posts.length > 0) {
                        setPost(data.posts[0]);
                        setRecentPosts(data.posts.slice(1, 6));
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
    if (loading)
        return (
          <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
          </div>
        );
      return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
          <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
          </h1>
          <Link
            to={`/search?category=${post && post.category}`}
            className='self-center mt-5'
          >
            <Button color='gray' pill size='xs'>
              {post && post.category}
            </Button>
          </Link>
          <img
            src={post && post.image}
            alt={post && post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
          />
          <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
          </div>
          {/* <CommentSection postId={post._id} /> */}
    
          <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recent articles</h1>
            <div className='flex flex-wrap gap-5 mt-5 justify-center'>
              {recentPosts &&
                recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          </div>
        </main>
      );
} 