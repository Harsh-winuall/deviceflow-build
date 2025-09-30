"use client";
import CreateDevice from "@/app/(root)/assets/_components/addDevices/_components/create-device";
import ReAssign from "@/app/(root)/assets/_components/re-assign";
import { Props } from "@/app/(root)/layout";
import CreateUserDialog from "@/app/(root)/people/_components/add-user-form/create-user.dialog";
import { login } from "@/app/store/authSlice";

import {
  LinkSquare01Icon,
  Logout02Icon,
  PlusSignIcon,
  RefreshIcon,
  Settings02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
import { globalSearch } from "@/server/globalSearch";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import GlobalSearch from "./global-search";
import SettingsDialog from "../settings/settings.dialog";
import CreateDeviceDialog from "@/app/(root)/assets/_components/addDevices/_components/add-device-form";

export default function Header({ session }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedInput = useDebounce(inputValue, 300);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // console.log(session);
    if (parseInt(localStorage?.getItem("employee-count")) >= 2) {
      return;
    } else if (session?.user?.user?.employeeCount === 0) {
      localStorage.setItem("employee-count", "0");
      router.push("/onboarding");
    }
  }, [session?.user?.user?.employeeCount]);

  const handleMouseEnter = (href: string) => {
    setIsHovered(true);
    router.prefetch(href); // Prefetch the route on hover
  };
  const dispatch = useDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Tracks user input

  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  const pageName =
    pathname === "/"
      ? "Dashboard"
      : pathname.includes("issues")
      ? "Tickets"
      : pathname.includes("invoices")
      ? "Invoices"
      : pathParts[0].replace(/-/g, " ");

  // Closing dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      // @ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        handleModalClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    if (session?.user?.user) {
      dispatch(
        login({
          userData: {
            token: session.user.user.token,
            userId: session.user.user.userId,
            email: session.user.user.email,
            firstName: session.user.user.firstName!,
            lastName: session.user.user.lastName!,
            employeeCount: session.user.user.employeeCount ?? 0,
            designation: session.user.user.designation,
            role: session.user.user.role ?? 1,
            orgId: session.user.user.orgId!,
            teamId: session.user.user.teamId!,
            addressDetails: session.user.user.addressDetails!,
          },
        })
      );
    }
  }, [session, dispatch]);

  const { data: searchData, isLoading } = useQuery({
    queryKey: ["global-search", debouncedInput],
    queryFn: () => globalSearch(debouncedInput),
    enabled: debouncedInput.trim().length > 0, // ✅ only run when debounced value has length
  });

  const closeDropdown = () => {
    setInputValue("");
  };
  const handleModalClose = () => {
    closeDropdown();
    setDropdownVisible(false);
  };
  const handleLogout = () => {
    signOut();
    queryClient.clear();
    sessionStorage.clear();
  };

  return (
    <>
      {session ? (
        <header className="bg-white border border-b border-t-0 border-l-0 border-r-0  top-0 font-gilroyRegular py-12 w-full h-14 bg-transparent backdrop-blur-3xl z-20 flex justify-between items-center px-12 pl-4">
          <h1 className="font-gilroyMedium w-40 capitalize text-base text-[#c8c8c8]">
            {pageName}
          </h1>

          <div className="flex justify-center items-center ">
            <div className="flex items-center gap-x-2 bg-transparent  bg-opacity-90  px-1 py-1">
              {session?.user?.user?.role !== 1 ? (
                <div className="bg-transparent overflow-hidden border flex justify-between items-center  border-[rgba(0,0,0,0.2)] rounded-md px-2 py-1.5">
                  <div className="flex gap-2 items-center">
                    <Search className=" size-[1.16rem]" />
                    <input
                      type="text"
                      placeholder={`Search anything...`}
                      onChange={(e) => setInputValue(e.target.value)} // Update input value
                      className={`flex-grow bg-transparent outline-none text-black 
                        placeholder-black placeholder:font-gilroyMedium placeholder:text-[15px] 
                        transition-all duration-1000
                      `}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}

              {inputValue.trim() !== "" && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-[18.4%] bg-white shadow-md rounded-lg border border-gray-200 -mt-4 z-10 w-[30vw] max-h-96 overflow-y-auto hide-scrollbar"
                >
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : (
                    <GlobalSearch
                      data={searchData}
                      onClose={handleModalClose}
                    />
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {session?.user?.user?.role !== 1 ? (
                <>
                  <CreateDeviceDialog>
                    <div className="flex gap-x-1.5 cursor-pointer items-center rounded-md border border-[rgba(0,0,0,0.2)]  p-2 px-3  hover:bg-black hover:text-white hover:border-white group">
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        className="size-4 lg:size-3.5 2xl:size-4  group-hover:text-white"
                        strokeWidth={2.5}
                      />
                      <div className=" group-hover:text-white text-nowrap text-sm font-gilroyMedium">
                        Add Device
                      </div>
                    </div>
                  </CreateDeviceDialog>
                  <ReAssign>
                    <div className="flex gap-x-1.5 cursor-pointer items-center rounded-md border border-[rgba(0,0,0,0.2)]  p-2 px-3  hover:bg-black hover:text-white hover:border-white group">
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        className="size-4 lg:size-3.5 2xl:size-4  group-hover:text-white"
                        strokeWidth={2.5}
                      />

                      <div className=" group-hover:text-white text-nowrap text-sm font-gilroyMedium">
                        Reassign
                      </div>
                    </div>
                  </ReAssign>
                  <CreateUserDialog>
                    <div className="flex gap-x-1.5 cursor-pointer items-center rounded-md border border-[rgba(0,0,0,0.2)] p-2 px-3 gap-1 hover:bg-black hover:text-white hover:border-white group">
                      <HugeiconsIcon
                        icon={UserIcon}
                        className="size-4 lg:size-3.5 2xl:size-4  group-hover:text-white"
                        strokeWidth={2.25}
                      />
                      <div className=" group-hover:text-white text-nowrap text-sm font-gilroyMedium">
                        Add Employee
                      </div>
                    </div>
                  </CreateUserDialog>{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user?.user?.role !== 1 && (
              <SettingsDialog>
                <button
                  className=" bg-white hover:bg-black rounded-full hover:text-white flex items-center justify-center p-2"
                  onMouseEnter={() => {
                    handleMouseEnter("/settings");
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <HugeiconsIcon icon={Settings02Icon} className="size-6" />
                </button>
              </SettingsDialog>
            )}
            {/* <button className=" bg-white hover:bg-black hover:text-white flex items-center justify-center rounded-full p-2">
              <CircleHelp className="size-5" />
            </button> */}

            {session?.user?.user?.role !== 1 ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="p-2 bg-white hover:bg-black hover:text-white flex items-center justify-center rounded-full"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-6" />
                </button>
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg pt-0.5 pb-0.5 font-gilroyMedium"
                  >
                    <div className="block mx-1 text-black my-1 rounded-[5px] hover:bg-[#EEEEEE] w-[95%] cursor-pointer">
                      <button
                        onClick={() => {
                          router.push(`/people/${session.user.user.userId}`);
                          setDropdownVisible(false);
                        }}
                        className="w-full py-2 text-sm 2xl:text-base flex justify-center items-center gap-1.5"
                      >
                        <HugeiconsIcon
                          icon={LinkSquare01Icon}
                          className="size-4"
                        />
                        View Profile{" "}
                      </button>
                    </div>

                    <div className="h-[1px] bg-[#F3F3F3]"></div>

                    <div className="block mx-1 text-black my-1 rounded-[5px] hover:bg-[#EEEEEE] w-[95%] cursor-pointer">
                      <button
                        onClick={() => handleLogout()}
                        className="w-full py-2 pr-6 text-sm 2xl:text-base flex justify-center items-center gap-1.5"
                      >
                        <HugeiconsIcon icon={Logout02Icon} className="size-4" />
                        <div>Logout</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="p-2 bg-white hover:bg-black hover:text-white flex items-center justify-center rounded-full cursor-pointer mx-auto"
                onClick={handleLogout}
              >
                <HugeiconsIcon icon={Logout02Icon} className="size-5" />
              </div>
            )}
          </div>
        </header>
      ) : null}
    </>
  );
}
