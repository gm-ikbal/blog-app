import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Textarea, Button, Alert } from 'flowbite-react'
import Comment from './Comment'
import { getProfileImageUrlWithFallback } from '../utils/imageUtils'

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user)
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [visibleComments, setVisibleComments] = useState(9)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/comment/getcomments/${postId}`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                    setShowMore(data.length > 9);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleShowMore = () => {
        setVisibleComments(prev => prev + 9);
        if (visibleComments + 9 >= comments.length) {
            setShowMore(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch(`/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setComment('');
                setError(null);
                setComments([data, ...comments]);
                setShowMore(comments.length + 1 > 9);
            } else {
                setError(data.message || 'Failed to create comment');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentUpdate = (updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment._id === updatedComment._id ? updatedComment : comment
            )
        );
    };

    const handleCommentDelete = (commentId) => {
        setComments(prevComments => {
            const newComments = prevComments.filter(comment => comment._id !== commentId);
            setShowMore(newComments.length > 9);
            return newComments;
        });
    };

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500">
                    <p>Sign in as: </p>
                    <img src={getProfileImageUrlWithFallback(currentUser)} alt='profile' className='w-10 h-10 rounded-full object-covered' />
                    <Link to={`/dashboard?tab=profile`} className='text-xs text-cyan-500'>
                        @{currentUser.email}
                    </Link>
                </div>
            ) : (
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
                            <p className='text-sm text-gray-500'>{200 - comment.length} characters remaining</p>
                            <Button outlined color='teal' disabled={isLoading} type='submit'>{isLoading ? 'Submitting...' : 'Submit'}</Button>
                        </div>

                    </form>
                    {error && <Alert color='red'>{error}</Alert>}
                </>
            )}

            {/* Display existing comments */}
            <div className='mt-8'>
                {comments.length === 0 ? (
                    <p className='text-sm my-5 text-white'>No comments yet!</p>
                ) : (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1 text-white'>
                            <p>Comments</p>
                            <div className='border border-gray-400 py-1 px-2 rounded-sm text-white'>
                                <p>{comments.length}</p>
                            </div>
                        </div>
                        {comments.slice(0, visibleComments).map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onCommentUpdate={handleCommentUpdate}
                                onCommentDelete={handleCommentDelete}
                            />
                        ))}
                        {showMore && (
                            <div className='text-center mt-4'>
                                <Button
                                    color='teal-500'
                                    outline
                                    onClick={handleShowMore}
                                    className='w-full bg-teal-500 text-white'
                                >
                                    Show More Comments
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}
