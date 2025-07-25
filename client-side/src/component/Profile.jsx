


/* eslint-disable no-unused-vars */
import { TextInput, Button, Alert, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [successMessage]);

    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        password: '',
        profilePicture: currentUser?.profilePicture || '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(updateUserStart())
        setSuccessMessage('') // Clear any previous success message

        try {
            const res = await fetch(`/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(updateUserSuccess(data))
                setSuccessMessage('Profile updated successfully!')
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    username: '',

                }))
            }
        }
        catch (error) {
            dispatch(updateUserFailure(error))
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

    const uploadImage = async () => {
        console.log("uploadin..")
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

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    <img
                        src={imageFileUrl || currentUser?.profilePicture}
                        alt="user"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                    />
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
                <span className='cursore-pointer'>Sign Out</span>
            </div>

        </div>

    )
}
