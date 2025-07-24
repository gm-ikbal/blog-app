import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';

export default function Foot() {
  return (
    <footer className='border border-t-8 border-teal-500 p-6'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Blogify
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <h4 className='font-bold mb-2'>About</h4>
              <div className='flex flex-col gap-1'>
                <a href='https://www.100jsprojects.com' target='_blank' rel='noopener noreferrer' className='hover:underline'>100 JS Projects</a>
                <a href='/about' target='_blank' rel='noopener noreferrer' className='hover:underline'>Cleverly's Blog</a>
              </div>
            </div>
            <div>
              <h4 className='font-bold mb-2'>Follow us</h4>
              <div className='flex flex-col gap-1'>
                <a href='https://www.github.com' target='_blank' rel='noopener noreferrer' className='hover:underline'>Github</a>
                <a href='#' className='hover:underline'>Discord</a>
              </div>
            </div>
            <div>
              <h4 className='font-bold mb-2'>Legal</h4>
              <div className='flex flex-col gap-1'>
                <a href='#' className='hover:underline'>Privacy Policy</a>
                <a href='#' className='hover:underline'>Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
        </div>
        <hr className='my-4 border-t-2 border-teal-500' />
        <div className='w-full flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-sm'>&copy; {new Date().getFullYear()} </span>
          <div className='flex gap-6 mt-4 sm:mt-0 sm:justify-center'>
            <a href='#'><BsFacebook size={20} /></a>
            <a href='#'><BsInstagram size={20} /></a>
            <a href='#'><BsTwitter size={20} /></a>
            <a href='https://github.com/codinglcleverly'><BsGithub size={20} /></a>
            <a href='#'><BsDribbble size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
} 