import { TextInput, Button } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
     const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          //ref={filePickerRef}
          hidden
        />               
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img
                        src={currentUser["profile Picture"]}
                        alt="user"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                    />
                </div>

                <TextInput type='text' id='username' placeholder='username'
                    defaultValue={currentUser.username} />
                <TextInput type='text' id='email' placeholder='email'
                    defaultValue={currentUser.email} />
                <TextInput type='text' id='password' placeholder='password'
                />
                <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"> Update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursore-pointer'>Delete Account</span>
                <span className='cursore-pointer'>Sign Out</span>
            </div>

        </div>

    )
}
