import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess,signInFailure } from '../redux/user/userSlice';
import { useDispatch ,useSelector} from 'react-redux';
import { useState } from 'react';
import OAuth from '../component/OAuth';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const {loading, error:errorMessage } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all fields"));
    }
    try {
      dispatch(signInStart());  
      const res = await fetch("/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      
    } catch (error) {
      dispatch(signInFailure(error.message));
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
            <span className="px-2 py-1  bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 rounded-lg text-black">
              Sign
            </span>
             in
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can Sign In with your email and password.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              className="bg-gradient-to-r from-teal-600 via-teal-800 to-teal-300 text-white "
            >
              {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>

                ) : ("Sign In")
              }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an Account?</span>
            <Link to="/signup" className="text-teal-500">
              Sign Up
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
