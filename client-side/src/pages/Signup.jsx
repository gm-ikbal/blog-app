/* eslint-disable no-unused-vars */
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import OAuth from '../component/OAuth';


export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      setLoading(true)
      const res = await fetch("/user/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Signup failed");
      } else {
        setErrorMessage(null);
        setFormData({});
        navigate("/signin");
      }

      setLoading(false)
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Sign Up
            </span>
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>

            <div>
              <div className="mb-1 block ">
                <label htmlFor="username" className="text-gray-400 font-bold">Your username</label>
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}

              />
            </div>

            <div>
              <div className="mb-1 block ">
                <label htmlFor="email" className="text-gray-400 font-bold">Your email</label>
              </div>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="mb-1 block ">
                <label htmlFor="password" className="text-gray-400 font-bold">Your Password</label>
              </div>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>

                ) : ("Sign Up")
              }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}

        </div>
      </div>
    </div>
  );
}
