import React, { useState } from 'react'
import { Select, TextInput, FileInput, Button, Alert, Spinner } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function Post() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    content: '',
  });
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    handlePublish(e);
  }
  const handlePublish = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Submitting form data:', {
        title: formData.title,
        category: formData.category,
        imageLength: formData.image ? formData.image.length : 'No image',
        contentLength: formData.content ? formData.content.length : 'No content'
      });
      const res = await fetch('/post/createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Post slug:', data.post?.slug);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        if (data.post && data.post.slug) {
          navigate(`/post/${data.post.slug}`);
        } else if (data.post && data.post._id) {
          // Fallback to using post ID if slug is not available
          navigate(`/post/${data.post._id}`);
        } else {
          console.error('No slug or ID found in response:', data);
          setPublishError('Post created but navigation failed');
        }
      }
    } catch (error) {
      setPublishError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setImageUploadError('File size must be less than 10MB');
        setFile(null);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setImageUploadError('Please select an image file');
        setFile(null);
        return;
      }

      setFile(file);
      setImageUploadError(null);
    }
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setImageUploadProgress(0);
    setImageUploadError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setImageUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch('/post-image/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload failed:', errorText);
        setImageUploadError('Failed to upload image');
        setImageUploadProgress(0);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setImageUploadProgress(100);
        console.log('Image URL length:', data.imageUrl ? data.imageUrl.length : 'No URL');
        console.log('Image URL preview:', data.imageUrl ? data.imageUrl.substring(0, 100) + '...' : 'No URL');
        setFormData(prev => ({
          ...prev,
          image: data.imageUrl
        }));
        setImageUploadError(null);

        // Reset progress after a short delay
        setTimeout(() => {
          setImageUploadProgress(0);
        }, 1000);
      } else {
        setImageUploadError('Failed to upload image');
        setImageUploadProgress(0);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploadError('Error uploading image: ' + error.message);
      setImageUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className='p-3 max-w-3xl mx-auto  min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput
              type='text'
              placeholder='Title'
              required
              id='title'
              className='flex-1'
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value='uncategorized'>Select a category</option>
              <option value='javascript'>JavaScript</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <div className='flex-1'>
              <FileInput
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={isUploading}
              />
              {file && (
                <div className='mt-2 text-sm text-gray-600'>
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            <Button
              type='button'
              size='sm'
              outline
              onClick={handleUploadImage}
              disabled={isUploading || !file}
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            >
              {imageUploadProgress > 0 ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                    styles={{
                      path: {
                        stroke: '#8b5cf6',
                      },
                      text: {
                        fill: '#ffffff',
                        fontSize: '12px',
                      },
                    }}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>

          {/* Preview of selected image before upload */}
          {file && !formData.image && (
            <div className='relative'>
              <img
                src={URL.createObjectURL(file)}
                alt='preview'
                className='w-full h-48 object-cover rounded-lg'
              />
              <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm'>
                Preview
              </div>
            </div>
          )}
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData.image && (
            <div className='relative'>
              <img
                src={formData.image}
                alt='upload'
                className='w-full h-72 object-cover rounded-lg'
                onError={(e) => {
                  console.error('Image failed to load in preview');
                  e.target.style.display = 'none';
                }}
              />
              <Button
                type='button'
                size='sm'
                color='failure'
                className='absolute top-2 right-2'
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: '' }));
                  setFile(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='h-72 mb-12'
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}

          />
          {isLoading ? (
            <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" disabled={isUploading}>
              <Spinner />
            </Button>
          ) : (
            <Button type='submit' className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" disabled={isUploading}>
              Publish
            </Button>
          )}
          {publishError && (
            <Alert className='mt-5' color='failure'>
              {publishError}
            </Alert>
          )}
          {publishSuccess && (
            <Alert className='mt-5' color='success'>
              {publishSuccess}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}



