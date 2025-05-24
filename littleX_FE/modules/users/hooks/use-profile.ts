import { useState } from "react";
import { useAuth } from "@/modules/users/hooks/use-auth";
import { useAppDispatch } from "@/store/useStore";
import { changePassword } from "../userActions";
import { updateUserProfileAction, useTweets } from "@/modules/tweet";

export function useProfile() {
  const dispatch = useAppDispatch();
  const { change_password, data: user } = useAuth();
  const { profile } = useTweets();
  const username = profile.user.username;

  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(username || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(updateUserProfileAction(name));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await change_password(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  return {
    email,
    setEmail,
    name,
    setName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,

    handleProfileSubmit,
    handlePasswordSubmit,
  };
}
