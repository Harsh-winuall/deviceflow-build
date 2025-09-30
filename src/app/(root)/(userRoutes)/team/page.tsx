"use client";
import { CombinedContainer } from "@/components/container/container";

import { UserData } from "@/app/store/authSlice";
import DeviceFlowLoader from "@/components/deviceFlowLoader";
import { getUsersByTeamId, UsersTeamResponse } from "@/server/userActions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TeamHeader from "./_components/team-header";
import TeamMembers from "./_components/team-members";

export default function TeamPage() {
  const user: UserData = useSelector((state: any) => state.auth.userData);
  const [users, setUsers] = useState<UsersTeamResponse | null>(null);
  const teamState = user?.teamId;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamState?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedUsers: UsersTeamResponse = await getUsersByTeamId(
          teamState._id,
          1
        );
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamState]);

  // if (!users) {
  //   return (
  //     <>
  //       <CombinedContainer>
  //         <div className="justify-center flex items-center h-[60vh] w-full">
  //           <span className="text-2xl font-gilroyMedium">
  //             You haven't been added to a team yet :(
  //           </span>
  //         </div>
  //       </CombinedContainer>
  //     </>
  //   );
  // }

  return (
    <CombinedContainer title="Teams">
      <div className=" p-3 bg-white rounded-[10px] ">
        <div className="flex items-center mb-6 pt-2 pl-3">
          <TeamHeader teamData={teamState} />
        </div>
        {users === null || loading ? (
          <div className="flex justify-center items-center my-10">
            <DeviceFlowLoader />
          </div>
        ) : (
          <>
            <TeamMembers users={users} setUsers={setUsers} id={teamState._id} />
          </>
        )}
      </div>
    </CombinedContainer>
  );
}
