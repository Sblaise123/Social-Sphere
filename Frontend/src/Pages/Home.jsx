import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.list(page);
      setPosts(response.data.results);
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await postsAPI.list(nextPage);
      setPosts([...posts, ...response.data.results]);
      setPage(nextPage);
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <CreatePost onPostCreated={handlePostCreated} />

      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handlePostDeleted}
            onUpdate={(post) => console.log('Update:', post)}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to post!</p>
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;