"use client";

import { ActionBar } from "@/components/action-bar/action-bar";
import { buttonVariants } from "@/components/buttons/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/providers/session-provider";
import { getUserById } from "@/server/userActions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ProfileSkeleton from "../../(userRoutes)/_components/profile-main-skeleton";
import { RestoreUser } from "../_components/restore-user";
import AssignDevice from "./_components/assign-device";
import { DeleteUser } from "./_components/delete-user";
import UserMain from "./new-main";

interface UserPageProps {
  params: { id: string };
}

export default function UserPage({ params }: UserPageProps) {
  const session = useSession();
  const userId = useMemo(() => params?.id, [params?.id]);

  const { data: user, status } = useQuery({
    queryKey: ["fetch-user-by-id", params?.id],
    queryFn: async () => await getUserById(params?.id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (status === "pending") {
    return (
      <>
        <UserProfileSkeleton />
      </>
    );
  }

  return (
    <div className="px-3 overflow-y-scroll h-full mt-4">
      <ActionBar showBackBtn>
        <div className="flex gap-2 justify-end w-full">
          {!user?.deleted_at && (
            <AssignDevice userData={user}>
              <div
                className={buttonVariants({
                  variant: "outlineTwo",
                })}
              >
                Assign asset
              </div>
            </AssignDevice>
          )}
          {/* {JSON.stringify(user.devices, null, 2)} */}
          {/* <UnassignAsset id={id ?? ""}>
            <div className={buttonVariants({ variant: "outlineTwo" })}>
              Unassign
            </div>
          </UnassignAsset> */}
          {/* <EditUser userData={userData}> */}
          {/* <div
            className={buttonVariants({
              variant: "outlineTwo",
            })}
            onClick={() => handleEditSaveClick()}
          >
            {isEditing ? "Save User" : "Edit User"}
          </div> */}
          {/* </EditUser> */}
          {session?.session?.user?.user?.userId !== userId &&
            user?.deleted_at === null && (
              <DeleteUser id={userId}>
                <div
                  className={buttonVariants({
                    variant: "primary",
                  })}
                >
                  Delete User
                </div>
              </DeleteUser>
            )}

          {user?.deleted_at !== null && (
            <>
              {/* <PermanentUserDelete id={user?._id!}>
                <div className="flex  cursor-pointer items-center rounded-md border border-[rgba(0,0,0,0.2)] hover:border-black  p-[7px]   group">
                  <div className="px-4  text-nowrap text-sm font-gilroyMedium">
                    Delete
                  </div>
                </div>
              </PermanentUserDelete> */}

              <RestoreUser id={user?._id!}>
                <div
                  className={`${buttonVariants({
                    variant: "outlineTwo",
                  })} border-[rgba(0,0,0,0.2)]`}
                >
                  Restore
                </div>
              </RestoreUser>
            </>
          )}
        </div>
      </ActionBar>

      <UserMain user={user} />
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="px-4 flex flex-col gap-4 mt-8 overflow-y-scroll h-full">
      <div className="flex justify-between w-full items-center">
        <Skeleton className="h-6 w-24" />

        <div className="flex gap-2.5 px-4">
          {/* Assign Button Skeleton */}
          <Skeleton className="h-9 w-20 rounded-full" />
          {/* Edit Button Skeleton */}
          <Skeleton className="h-9 w-20 rounded-full" />
          {/* Delete Button Skeleton */}
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      <ProfileSkeleton />
    </div>
  );
}
