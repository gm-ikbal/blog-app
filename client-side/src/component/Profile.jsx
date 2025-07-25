


/* eslint-disable no-unused-vars */
import { TextInput, Button, Alert, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure
}
    from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        password: '',
        profilePicture: currentUser?.profilePicture || '',
    })

    // Update form data when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || '',
                email: currentUser.email || '',
                password: '',
                profilePicture: currentUser.profilePicture || '',
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(updateUserStart())
        setSuccessMessage('')

        try {
            // Create update object with only changed fields
            const updateData = {};
            
            if (formData.username && formData.username !== currentUser?.username) {
                updateData.username = formData.username;
            }
            if (formData.email && formData.email !== currentUser?.email) {
                updateData.email = formData.email;
            }
            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password;
            }
            if (formData.profilePicture && formData.profilePicture !== currentUser?.profilePicture) {
                updateData.profilePicture = formData.profilePicture;
            }
            
            // Only send request if there are changes
            if (Object.keys(updateData).length === 0) {
                setSuccessMessage('No changes to update');
                return;
            }
            
            const res = await fetch(`/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(updateUserSuccess(data))
                setSuccessMessage('Profile updated successfully!')
                // Reset password field and update form with new data
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    username: data.username || prev.username,
                    email: data.email || prev.email,
                    profilePicture: data.profilePicture || prev.profilePicture
                }))
            } else {
                setSuccessMessage(data.message || 'Failed to update profile');
            }
        }
        catch (error) {
            dispatch(updateUserFailure(error))
            setSuccessMessage('Error updating profile');
        }
    }

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                dispatch(deleteUserSuccess())
                setSuccessMessage('Account deleted successfully!')
                setShowModal(false)
            }
        }
        catch (error) {
            dispatch(deleteUserFailure(error))
        }
    }

    const handleSignOut = async () => {
        dispatch(signOutStart())
        try {
            const res = await fetch(`/user/signout`, {
                method: 'POST',
            })
            if (res.ok) {
                dispatch(signOutSuccess())
                setSuccessMessage('Signed out successfully!')
                navigate('/')
            }
        }
        catch (error) {
            dispatch(signOutFailure(error))
        }
    }



    const filePickerRef = useRef(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile])

    const getProfileImageUrl = () => {
        if (imageFileUrl) {
            return imageFileUrl;
        }
        if (currentUser?._id) {
            return `/image/profile/${currentUser._id}`;
        }
        return currentUser?.profilePicture || '';
    };

    const handleImageError = (e) => {
        // Fallback to default profile picture if image fails to load
        e.target.src = currentUser?.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D';
    };

    const uploadImage = async () => {
        if (!imageFile) return;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
            console.log('Uploading image...', imageFile.name);
            const res = await fetch('/image/upload', {
                method: 'POST',
                body: formData,
            });
            
            console.log('Response status:', res.status);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Upload failed:', errorText);
                setSuccessMessage('Failed to upload image: ' + res.status);
                return;
            }
            
            const data = await res.json();
            console.log('Upload response:', data);
            
            if (data.success) {
                setSuccessMessage('Image uploaded successfully!');
                // Force a re-render by updating the image URL
                setImageFileUrl(URL.createObjectURL(imageFile));
            } else {
                setSuccessMessage('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setSuccessMessage('Error uploading image: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex items-center gap-4">

                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={filePickerRef}
                    />
                </div>

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative" onClick={() => filePickerRef.current.click()}>
                    <img
                        src={getProfileImageUrl()}
                        alt="user"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                        onError={handleImageError}
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div className="text-white text-sm">Uploading...</div>
                        </div>
                    )}
                </div>

                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextInput
                    type='text'
                    id='email'
                    placeholder='email'
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"> Update</Button>

                {currentUser?.isAdmin && (
                    <Link to={'/createpost'}>
                        <Button
                            type='button'
                            className='w-full flex items-center justify-center gap-2 border-2 bg-gradient-to-r from-white-500 to-black-500 text-grey-600'
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>

            {successMessage && (
                <Alert className="mt-5" color="success">
                    {successMessage}
                </Alert>
            )}

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <ModalHeader />
                <ModalBody>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursore-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
                <span className='cursore-pointer' onClick={handleSignOut}>Sign Out</span>
            </div>

        </div>

    )
}
