import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, postsAPI } from '../services/api';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileResponse = await authAPI.getProfile();
      setProfile(profileResponse.data);
      setBio(profileResponse.data.bio || '');

      const postsResponse = await postsAPI.getPosts();
      const myPosts = postsResponse.data.results.filter(
        post => post.author.id === profileResponse.data.id
      );
      setUserPosts(myPosts);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const response = await authAPI.updateProfile({ bio });
      updateUser(response.data);
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(postId);
        setUserPosts(userPosts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.username[0].toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
            <p className="text-gray-600">{profile.email}</p>
            
            <div className="mt-4">
              {editing ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateBio}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setBio(profile.bio || '');
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700">{profile.bio || 'No bio yet'}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Edit Bio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {userPosts.reduce((sum, post) => sum + post.likes_count, 0)}
            </p>
            <p className="text-gray-600">Likes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {userPosts.reduce((sum, post) => sum + post.comments_count, 0)}
            </p>
            <p className="text-gray-600">Comments</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Posts</h2>
        {userPosts.length === 0 ? (
          <div className="text-center text-gray-600 py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl">You haven't posted anything yet</p>
          </div>
        ) : (
          userPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;