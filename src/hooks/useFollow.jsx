import { useDispatch, useSelector } from "react-redux";
import { getAuthUser } from "../redux/authSlice";
import { followUser, getSuggestedUsers } from "../redux/userSlice";

const useFollow = () => {
  const dispatch = useDispatch();
  const { isFollowing: isPending, followingUserId } = useSelector(
    (state) => state.user
  );
  const follow = async (userId) => {
    await dispatch(followUser(userId));

    dispatch(getAuthUser());
    dispatch(getSuggestedUsers());
  };
  return { follow, followingUserId, isPending };
};

export default useFollow;
