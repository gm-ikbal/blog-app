import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Button, Alert } from 'flowbite-react';

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { getProfileImageUrlWithFallback, handleImageError } from '../utils/imageUtils';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice';

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userIdToMakeAdmin, setUserIdToMakeAdmin] = useState(null);
    const [showMakeAdminModal, setShowMakeAdminModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);
    
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/user/getuser?userId=${currentUser._id}&skip=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers([...users, ...data.users]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/user/deleteuser/${userIdToDelete}/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.filter((user) => user._id !== userIdToDelete));
                setSuccessMessage('User has been deleted successfully!');
                setShowDeleteModal(false);
                setUserIdToDelete(null);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleMakeAdmin = async () => {
        try {
            const res = await fetch(`/user/makeadmin/${userIdToMakeAdmin}`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (res.ok) {
                // Update the user's admin status in local state
                setUsers(users.map(user => 
                    user._id === userIdToMakeAdmin 
                        ? { ...user, isAdmin: true }
                        : user
                ));
                
                // If the current user was made admin, update Redux state
                if (userIdToMakeAdmin === currentUser._id) {
                    dispatch(updateUserSuccess({ ...currentUser, isAdmin: true }));
                }
                
                setSuccessMessage('User has been made admin successfully!');
                setShowMakeAdminModal(false);
                setUserIdToMakeAdmin(null);
            }
        } catch (error) {
            console.log(error.message);
        }
    }



    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/user/getuser?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
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
            {successMessage && (
                <Alert className='mb-4' color='success'>
                    {successMessage}
                </Alert>
            )}
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-full'>
                        <TableHead>
                            <TableHeadCell>Date Created</TableHeadCell>
                            <TableHeadCell>user Image</TableHeadCell>
                            <TableHeadCell>User Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Admin</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                            <TableHeadCell>Make Admin</TableHeadCell>
                        </TableHead>

                        {users.map((user) => (
                            <TableBody key={user._id} className='divide-y'>
                                <TableRow>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        
                                            <img src={getProfileImageUrlWithFallback(user)}
                                                alt={user.username}
                                                className='w-20 h-20 object-cover bg-gray-500 rounded-full'
                                                onError={(e) => handleImageError(e, user)}
                                            />
                                    </TableCell>
                                    <TableCell className='font-medium text-gray-500 dark:text-gray-300'>{user.name}</TableCell>
                                    <TableCell className='font-medium text-gray-500 dark:text-gray-300'>{user.email}</TableCell>
                                    <TableCell className='font-medium text-gray-500 dark:text-gray-300'>{user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}</TableCell>
                                    <TableCell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer'
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setUserIdToDelete(user._id);
                                            }}>
                                            Delete
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {!user.isAdmin && (
                                            <span className='font-medium text-teal-500 hover:underline cursor-pointer'
                                                onClick={() => {
                                                    setShowMakeAdminModal(true);
                                                    setUserIdToMakeAdmin(user._id);
                                                }}>
                                                Make Admin
                                            </span>
                                        )}
                                        {user.isAdmin && (
                                            <span className='font-medium text-gray-400 cursor-not-allowed'>
                                                Already Admin
                                            </span>
                                        )}
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
                                    Are you sure you want to delete this user?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='failure' onClick={handleDeleteUser}>
                                        Yes
                                    </Button>
                                    <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal
                        show={showMakeAdminModal}
                        onClose={() => setShowMakeAdminModal(false)}
                        popup
                        size='md'
                    >
                        <ModalHeader />
                       
                        <ModalBody>
                            <div className='text-center'>
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                    Are you sure you want to make this user an admin?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='success' onClick={handleMakeAdmin}>
                                        Yes
                                    </Button>
                                    <Button color='gray' onClick={() => setShowMakeAdminModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                
                </>) : (
                <p className='text-center text-gray-500'>You have no users yet</p>
            )}
        </div>
    )
}
