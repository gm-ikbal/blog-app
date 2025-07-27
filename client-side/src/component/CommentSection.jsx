import React ,{useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import { Textarea, Button, Alert } from 'flowbite-react'

export default function CommentSection({ postId }) {
    const {currentUser} = useSelector((state) => state.user)
    const [comments, setComments] = useState([])    
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
   
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/comment/getcomments/${postId}`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        
        if (postId) {
            fetchComments();
        }
    }, [postId]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
          return;
        }
        try {
          setIsLoading(true)
          const res = await fetch(`/comment/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: comment,
              postId,
              userId: currentUser.id,
            }),
          });
          const data = await res.json();
          setIsLoading(false)
          if (res.ok) {
            setComment('');
            setError(null);
            setComments([data, ...comments]);
          } else {
            setError(data.message || 'Failed to create comment');
          }
        } catch (error) {
          setError(error.message);
        }
      };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
       {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500">
            <p>Sign in as: </p>
            <img src={currentUser.profilePicture} alt='profile' className='w-10 h-10 rounded-full object-covered' />
            <Link to={`/dashboard?tab=profile`} className='text-xs text-cyan-500'>
            @{currentUser.email}
            </Link>
        </div>
       ):(
        <div className='text-sm text-teal-500 my-5'>
            You need to sign in to comment
            <Link to={`/signin`} className=' hover:underline text-blue-500' >
            Sign in
            </Link>
        </div>
       )}

       {currentUser && (
        <>
        <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
            <Textarea 
            placeholder='Add a comment' 
            rows={3}
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-sm text-gray-500'>{200 - comment.length} charectors remaining</p>
                <Button outlined color='teal'  disabled={isLoading} type='submit'>{isLoading ? 'Submitting...' : 'Submit'}</Button>
            </div>
           
        </form>
        {error && <Alert color='red'>{error}</Alert>}
        </>
       )}
       
       {/* Display existing comments */}
       <div className='mt-8'>
           <h3 className='text-lg font-semibold mb-4'>Comments ({comments.length})</h3>
           {comments.length === 0 ? (
               <p className='text-gray-500'>No comments yet. Be the first to comment!</p>
           ) : (
               <div className='space-y-4'>
                   {comments.map((comment) => (
                       <div key={comment._id} className='border border-gray-200 rounded-lg p-4'>
                           <div className='flex items-center gap-2 mb-2'>
                               <span className='font-medium text-gray-700'>User</span>
                               <span className='text-sm text-gray-500'>
                                   {new Date(comment.createdAt).toLocaleDateString()}
                               </span>
                           </div>
                           <p className='text-gray-800'>{comment.content}</p>
                       </div>
                   ))}
               </div>
           )}
       </div>
      
    </div>
  )
}
