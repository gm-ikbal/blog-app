/* eslint-disable no-unused-vars */
import { TextInput, Button } from 'flowbite-react';
import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

const filePickerRef = useRef(null);
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
                        src={ imageFileUrl || currentUser["profile Picture"]}
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
