import React from 'react'
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
 const auth =  getAuth(app);
 const navigate = useNavigate();

 const dispatch = useDispatch();
  const handleGoogleClick =async()=>{
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({prompt: 'select_account'})
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/user/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/dashboard')
            }
        } catch (error) {
            console.log(error);
        }
  }
  return (
<Button
  type="button"
 onClick={handleGoogleClick}
  className="w-full flex items-center justify-center gap-2 border-2 bg-gradient-to-r from-white-500 to-black-500 text-grey-600"
>        
<AiFillGoogleCircle className='w-6 h-6'/> 
Continue with Google   
</Button>
  )
}
