import { updateUserProfile } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
const useUpdateUserProfile = () => {
  const dispatch = useDispatch();
  const { isUpdatingProfile } = useSelector((state) => state.auth);
  const updateProfile = async (formData) => {
    await dispatch(updateUserProfile(formData));
  };

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
