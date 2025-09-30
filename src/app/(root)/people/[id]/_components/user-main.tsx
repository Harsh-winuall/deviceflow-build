"use client";
import ProfileSkeleton from "@/app/(root)/(userRoutes)/_components/profile-main-skeleton";
import { MemberIcon } from "@/app/(root)/teams/_components/member-icon";
import { UserData } from "@/app/store/authSlice";
import { GetAvatar } from "@/components/get-avatar";
import { StoreBannerCard } from "@/components/store-banner";
import { NewUserResponse } from "@/server/userActions";
import {
  Building2,
  Cake,
  ChevronRight,
  Link,
  Mail,
  MapPin,
  NotepadText,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AssetsSection from "./assets-section";

const UserGrid = ({ user }: { user: NewUserResponse }) => {
  const router = useRouter();
  const data: UserData = useSelector((state: any) => state.auth.userData);

  const renderMembers = () => {
    if (user?.team?.userCount === 0) {
      return Array(3)
        .fill(null)
        .map((_, index) => <MemberIcon key={index} isPlaceholder={true} />);
    }
    return (
      <>
        <MemberIcon src="https://picsum.photos/300/300" isPlaceholder={false} />
        <MemberIcon src="https://picsum.photos/301/300" isPlaceholder={false} />
        <MemberIcon src="https://picsum.photos/302/300" isPlaceholder={false} />
      </>
    );
  };
  return (
    <>
      {/* {JSON.stringify(user)} */}
      {user ? (
        <div className="flex flex-nowrap gap-4 mt-4 font-gilroyRegular w-full">
          <div className="flex flex-col gap-4">
            <div className="w-96 max-[1370px]:w-[350px] max-[1270px]:w-[340px] h-40 flex items-center bg-white bg-opacity-80 backdrop-blur-[22.8px] border border-[rgba(195,195,195,0.31)] rounded-lg px-6 py-4">
              <div className="flex justify-start gap-4 items-start w-full ">
                <div className="w-[90px] h-[90px] rounded-full t overflow-hidden flex-shrink-0">
                  <GetAvatar name={user?.first_name ?? ""} size={90} />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-[22px] font-gilroySemiBold text-gray-800 dark:text-gray-200">
                    {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
                  </h1>
                  <p className="text-[#7C7C7C] text-sm font-gilroyMedium whitespace-nowrap">
                    {user?.designation ?? ""} {user?.teamId?.title ?? ""}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {user?.deleted_at !== null ? (
                      <div className="flex justify-center items-center gap-[6.217px] px-[8.29px] py-[2.072px] rounded-[16.58px] bg-[#FFE0E0]">
                        <span className="text-center text-[#F00] text-[12.435px] font-gilroyMedium leading-[18.652px]">
                          Inactive
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center gap-[6.217px] px-[8.29px] py-[2.072px] rounded-[16.58px] bg-[#ECFDF3]">
                        <span className="text-center text-[#027A48] text-[12.435px] font-gilroyMedium leading-[18.652px]">
                          Active
                        </span>
                      </div>
                    )}

                    {user?.employment_type ? (
                      <div className="flex justify-center items-center gap-[6.217px] px-[8.29px] py-[2.072px] rounded-[16.58px] bg-[#FFE8D6]">
                        <span className="text-center text-[#E89F02] text-[12.435px] font-gilroyMedium leading-[18.652px]">
                          {user?.employment_type ?? ""}
                        </span>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-96 max-[1370px]:w-[350px] max-[1270px]:w-[340px] flex items-center bg-white bg-opacity-80 backdrop-blur-[22.8px] border border-[rgba(195,195,195,0.31)] rounded-lg px-6 py-4">
              <div className="flex flex-col justify-start gap-5 items-start w-full ">
                <div className="font-gilroySemiBold text-lg">
                  Personal Info.
                </div>

                <div className="flex gap-4 items-center w-full">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Mail className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Email
                    </div>
                    <div className="font-gilroySemiBold text-wrap w-full">
                      {user?.email ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Smartphone className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Phone
                    </div>
                    <div className="font-gilroySemiBold">
                      {user?.phone ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Cake className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Date of birth
                    </div>
                    <div className="font-gilroySemiBold">
                      {(() => {
                        const onboardingDate = user?.date_of_birth;

                        // Check if onboardingDate is null, undefined, or empty
                        if (!onboardingDate) {
                          return "-"; // Return "-" for null, undefined, or empty value
                        }

                        const date = new Date(onboardingDate);

                        // Check if the date is valid
                        if (isNaN(date.getTime())) {
                          return "-"; // Return "-" for invalid date
                        }

                        const formattedDate = date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return formattedDate;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center pb-2">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Link className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Joining Date
                    </div>
                    <div className="font-gilroySemiBold">
                      {(() => {
                        const onboardingDate = user?.onboarding_date;

                        // Check if onboardingDate is null, undefined, or empty
                        if (!onboardingDate) {
                          return "-"; // Return "-" for null, undefined, or empty value
                        }

                        const date = new Date(onboardingDate);

                        // Check if the date is valid
                        if (isNaN(date.getTime())) {
                          return "-"; // Return "-" for invalid date
                        }

                        const formattedDate = date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return formattedDate;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4">
            {/* First Row */}
            {user?.reporting_manager?.first_name ? (
              <div className="w-96 max-[1370px]:w-[350px] max-[1270px]:w-[340px] px-6 py-4 flex items-center bg-white bg-opacity-80 backdrop-blur-[22.8px] border border-[rgba(195,195,195,0.31)] rounded-lg">
                <div className="flex flex-col gap-2 items-start w-full ">
                  <div className="font-gilroySemiBold  text-lg">
                    Reporting Manager
                  </div>
                  <div className="flex justify-start gap-4 items-start w-full">
                    {/* <div className="w-[78px] h-[78px] rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={
                          user?.reporting_manager?.image &&
                          user?.reporting_manager?.image?.length > 0
                            ? user?.reporting_manager?.image
                            : user?.reporting_manager?.gender
                                ?.toLowerCase()
                                ?.includes("female")
                            ? "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012892650.png"
                            : "https://api-files-connect-saas.s3.ap-south-1.amazonaws.com/uploads/1737012636473.png"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div> */}
                    <GetAvatar
                      name={user?.reporting_manager?.first_name ?? ""}
                      size={90}
                    />

                    <div className="flex flex-col relative w-full">
                      <h1 className="text-lg font-gilroySemiBold dark:text-gray-200">
                        {`${user?.reporting_manager?.first_name ?? "-"} `}
                      </h1>
                      <div
                        className="absolute text-[#CDCDCD] text-xs top-4 -right-3 cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/people/${user?.reporting_manager?._id}`
                          );
                        }}
                      >
                        <ChevronRight />
                      </div>

                      <p className="text-gray-500 font-gilroyMedium text-sm">
                        {user?.reporting_manager?.email ?? "-"}
                      </p>
                      <div className="flex gap-2 mt-2 opacity-0 justify-start items-center">
                        <div className="flex justify-start items-center">
                          <div className="flex -space-x-5">
                            {renderMembers()}
                          </div>
                        </div>
                        <div>
                          {user?.teamId?.employees_count ? (
                            <div className="font-gilroyMedium text-gray-500 text-xs">
                              {user?.teamId?.employees_count} Team Members
                            </div>
                          ) : (
                            <div className="font-gilroyMedium text-gray-500 text-xs">
                              Team Members
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="w-96 max-[1370px]:w-[350px] max-[1270px]:w-[340px] flex items-center bg-white bg-opacity-80 backdrop-blur-[22.8px] border border-[rgba(195,195,195,0.31)] rounded-lg px-6 py-4">
              <div className="flex flex-col justify-start gap-5 items-start w-full ">
                <div className="font-gilroySemiBold  text-lg">
                  Organisation Info.
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Building2 className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Company
                    </div>
                    <div className="font-gilroySemiBold ">
                      {data?.orgId?.name ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <NotepadText className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Org Contact
                    </div>
                    <div className="font-gilroySemiBold">
                      {data?.addressDetails?.phone ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <Mail className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 font-gilroySemiBold">
                      Email
                    </div>
                    <div className="font-gilroySemiBold">
                      {data?.orgId?.email ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center pb-2">
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    <MapPin className="size-6 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-base text-gray-500 font-gilroySemiBold">
                      Address
                    </div>
                    <div className="font-gilroySemiBold">
                      {data?.addressDetails?.city ?? "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Column */}
          <div className="flex flex-col w-full gap-4">
            {/* First Row (Reversed Order) */}
            {user?.devices?.length ? (
              <div className="w-96 max-[1370px]:w-[350px] max-[1270px]:w-[340px] flex items-center bg-transparent bg-white bg-opacity-80 backdrop-blur-[22.8px] border border-[rgba(195,195,195,0.31)] rounded-lg p-6">
                <AssetsSection user={user} />
              </div>
            ) : (
              ""
            )}

            {/* Second Row */}
            <StoreBannerCard />

            {/* <pre>{JSON.stringify(user?.totalCostPerUser)}</pre> */}
          </div>
        </div>
      ) : (
        <ProfileSkeleton />
      )}
    </>
  );
};

export default UserGrid;
