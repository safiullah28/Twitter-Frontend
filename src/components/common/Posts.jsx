import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { fetchPosts } from "./../../redux/postSlice";

const Posts = ({ feedType, username, userId }) => {
  const dispatch = useDispatch();

  const { posts, isLoadingPosts } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPosts({ feedType, username, userId }));
  }, [dispatch, feedType, username, userId]);

  return (
    <>
      {isLoadingPosts && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoadingPosts && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoadingPosts && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
