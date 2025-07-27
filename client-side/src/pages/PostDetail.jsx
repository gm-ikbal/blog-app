import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import PostCard from '../component/PostCard';
import CommentSection from '../component/CommentSection';
import CallToAction from '../component/CalltoAction';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [recentPosts, setRecentPosts] = useState([]);



    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/post/getpost/${slug}`);
                const data = await res.json();

                if (res.ok) {
                    setPost(data.post);
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

        const fetchRecentPosts = async () => {
            try {
                const res = await fetch('/post/recent?limit=6');
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.error('Error fetching recent posts:', error);
            }
        };

        if (slug) {
            fetchPost();
            fetchRecentPosts();
        }
    }, [slug]);

    const handleDeletePost = async () => {
        if (!post) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/post/deletepost/${post._id}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                navigate('/');
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Something went wrong');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
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
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            {/* Post Header with Edit/Delete buttons */}
            <div className='flex justify-between items-start mt-10 p-3 max-w-2xl mx-auto w-full'>
                <h1 className='text-3xl font-serif lg:text-4xl flex-1'>
                    {post.title}
                </h1>
                {/* {canEditPost && (
                    <div className='flex gap-2 ml-4'>
                        <Link to={`/update-post/${post._id}`}>
                            <Button size='sm' color='gray' className='flex items-center gap-1'>
                                <HiOutlinePencil size={16} />
                                Edit
                            </Button>
                        </Link>
                        {canDeletePost && (
                            <Button 
                                size='sm' 
                                color='failure' 
                                className='flex items-center gap-1'
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <HiOutlineTrash size={16} />
                                Delete
                            </Button>
                        )}
                    </div>
                )} */}
            </div>

            <Link to={`/search?q=${encodeURIComponent(post.category)}`} className='self-center mt-5'>
                <Button color='teal-500' pill size='xs' className='text-white bg-teal-500'>
                    {post.category}
                </Button>
            </Link>
            <img
                src={post.image}
                alt={post.title}
                className='mt-10 p-3 max-h-[600px] w-full object-cover'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>
                    {(post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div
                className='p-3 max-w-2xl mx-auto w-full post-content text-gray-200'
                dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />

            {recentPosts.length > 0 && (
                <div className='flex flex-col  items-center mb-5'>
                    <h1 className='text-xl mt-5 text-white'>Recent articles</h1>
                    <div className='grid grid-cols-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                        {recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Header>Delete Post</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-white leading-relaxed text-white text-white">
                            Are you sure you want to delete this post?
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        color="failure" 
                        onClick={handleDeletePost}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Spinner size="sm" /> : 'Delete'}
                    </Button>
                    <Button color="light" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
} 