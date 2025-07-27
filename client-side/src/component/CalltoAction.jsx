import { Button } from 'flowbite-react';

export default function CallToAction() {
    return (
        <div className='flex border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center'>
            <div className='flex-1 justify-center flex flex-col'>
                <h2 className='text-2xl'>
                    Your Voice, Amplified Across the World — Write Freely, Inspire Globally
                </h2>
                <p className='text-gray-500 my-2'>
                    Write with purpose. Publish with power. Connect with readers everywhere.
                </p>
                <a
                    href='https://www.100jsprojects.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                </a>
            </div>
            <div className='flex-1 p-7'>
                <img src='https://cm.magefan.com/magefan_blog/blog-apps.png' />
            </div>
        </div>
    );
}
