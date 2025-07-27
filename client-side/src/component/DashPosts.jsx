import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/post/getposts?userId=${currentUser._id}&skip=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts([...userPosts, ...data.posts]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok) {
                setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
                setShowDeleteModal(false);
                setPostIdToDelete(null);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    const isValidImageData = (imageData) => {
        if (!imageData) return false;
        if (typeof imageData !== 'string') return false;
        if (imageData.startsWith('data:image/')) return true;
        if (imageData.startsWith('http')) return true;
        if (imageData.startsWith('/uploads/')) return true;
        return false;
    };
    const getImageSrc = (post) => {
        if (isValidImageData(post.image)) {
            return post.image;
        }
        return 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png';
    };
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-full'>
                        <TableHead>
                            <TableHeadCell>Date updated</TableHeadCell>
                            <TableHeadCell>Post image</TableHeadCell>
                            <TableHeadCell>Post title</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                            <TableHeadCell>
                                <span>Edit</span>
                            </TableHeadCell>
                        </TableHead>

                        {userPosts.map((post) => (
                            <TableBody key={post._id} className='divide-y'>
                                <TableRow>
                                    <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={getImageSrc(post)}
                                                alt={post.title}
                                                className='w-20 h-20 object-cover bg-gray-500'
                                                onError={(e) => {
                                                    console.error('Image failed to load for post:', post.title);
                                                    console.error('Image data length:', post.image ? post.image.length : 'No image');
                                                    console.error('Image data starts with:', post.image ? post.image.substring(0, 50) : 'No image');
                                                    console.error('Is valid base64:', post.image ? post.image.startsWith('data:image/') : false);
                                                    console.error('Is valid image data:', isValidImageData(post.image));
                                                    e.target.src = 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png';
                                                }}
                                                onLoad={() => console.log('Image loaded successfully:', post.title)} />
                                        </Link>
                                    </TableCell>
                                    <TableCell className='font-medium text-gray-500 dark:text-gray-300'>{post.title}</TableCell>
                                    <TableCell className='font-medium text-gray-500 dark:text-gray-300'>{post.category}</TableCell>
                                    <TableCell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer'
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setPostIdToDelete(post._id);
                                            }}>
                                            Delete
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className='text-teal-600 hover:underline cursor-pointer'>
                                                Edit
                                            </span>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                    {showMore && (
                        <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                            Show More
                        </button>
                    )}
                    <Modal
                        show={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        popup
                        size='md'
                    >
                        <ModalHeader />
                        <ModalBody>
                            <div className='text-center'>
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                    Are you sure you want to delete this post?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='failure' onClick={handleDeletePost}>
                                        Yes
                                    </Button>
                                    <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </>) : (
                <p className='text-center text-gray-500'>You have no posts yet</p>
            )}
        </div>
    )
}
