import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Button, Textarea, Alert } from 'flowbite-react'
import { HiOutlineThumbUp, HiThumbUp, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

export default function Comment({ comment, onCommentUpdate, onCommentDelete }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.numberOfLikes || 0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
        
        // Check if current user has liked this comment
        if (currentUser && comment.likes && comment.likes.includes(currentUser._id)) {
            setIsLiked(true);
        }
    }, [comment, currentUser]);

    const handleLike = async () => {
        if (!currentUser) {
            setError('Please sign in to like comments');
            return;
        }

        try {
            const endpoint = isLiked ? `/comment/unlike/${comment._id}` : `/comment/like/${comment._id}`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                setIsLiked(!isLiked);
                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                setError(null);
            } else {
                const data = await res.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to update like');
        }
    };

    const handleEdit = async () => {
        if (!editedContent.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/comment/edit/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedContent }),
            });

            if (res.ok) {
                const updatedComment = await res.json();
                onCommentUpdate(updatedComment);
                setIsEditing(false);
                setError(null);
            } else {
                const data = await res.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to update comment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setIsLoading(true);
            try {
                const res = await fetch(`/comment/delete/${comment._id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    onCommentDelete(comment._id);
                    setError(null);
                } else {
                    const data = await res.json();
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to delete comment');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const canEdit = currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);
    const canDelete = currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img 
                    src={user.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'} 
                    alt='profile' 
                    className='w-10 h-10 rounded-full bg-gray-200 object-cover' 
                />
            </div>
            <div className='flex-1'>
                <div className='flex items-center gap-1 mb-2'>
                    <span className='font-bold text-xs'>{user ? `@${user.username}` : 'anonymous user'}</span>
                    <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                
                {isEditing ? (
                    <div className='space-y-2'>
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={3}
                            maxLength={200}
                        />
                        <div className='flex gap-2'>
                            <Button size='xs' onClick={handleEdit} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button size='xs' color='gray' onClick={() => {
                                setIsEditing(false);
                                setEditedContent(comment.content);
                                setError(null);
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className='text-gray-800 mb-2'>{comment.content}</p>
                )}
                
                {error && <Alert color='failure' className='mb-2'>{error}</Alert>}
                
                <div className='flex items-center gap-4'>
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 text-xs ${
                            isLiked ? 'text-blue-500' : 'text-gray-500'
                        } hover:text-blue-500 transition-colors`}
                        disabled={!currentUser}
                    >
                        {isLiked ? <HiThumbUp size={16} /> : <HiOutlineThumbUp size={16} />}
                        <span>{likeCount}</span>
                    </button>
                    
                    {canEdit && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors'
                        >
                            <HiOutlinePencil size={16} />
                            <span>Edit</span>
                        </button>
                    )}
                    
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors'
                            disabled={isLoading}
                        >
                            <HiOutlineTrash size={16} />
                            <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
