"use client";
import { UserData } from "@/app/store/authSlice";
import { useSelector } from "react-redux";
import UserGrid from "../../(userRoutes)/_components/profile-main";

export default function UserDashboard() {
  const user: UserData = useSelector((state: any) => state.auth.userData);

  return (
    <div className="flex w-full h-full">
      <UserGrid user={user} />
    </div>
  );
}
