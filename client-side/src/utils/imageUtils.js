// Utility functions for handling profile images

export const getProfileImageUrl = (userId) => {
  if (userId) {
    return `/image/profile/${userId}`;
  }
  return 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D';
};

export const getProfileImageUrlWithFallback = (currentUser) => {
  if (currentUser?._id) {
    return `/image/profile/${currentUser._id}`;
  }
  return currentUser?.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D';
};

export const handleImageError = (e, currentUser) => {
  // Fallback to default profile picture if image fails to load
  e.target.src = currentUser?.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D';
}; 