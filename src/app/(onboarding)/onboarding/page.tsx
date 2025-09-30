"use client";
import { useRouter } from "next/navigation";
import { parseAsFloat, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Address } from "./Address";
import { CompanyDetails } from "./CompanyDetails";
import { DeviceComponent } from "./Device";
import { Employee } from "./Employee";
import { Teams } from "./Teams";

export default function Page() {
  const router = useRouter();
  const [welcomeScreen, setWelcomeScreenState] = useState(false);
  const [steps, setSteps] = useQueryState("step", parseAsFloat);
  const orgCard: any = useRef(null);
  const addressCard: any = useRef(null);
  const teams: any = useRef(null);
  const employee: any = useRef(null);
  const devices: any = useRef(null);
  const welcome: any = useRef(null);

  useEffect(() => {
    if (!steps) {
      setSteps(1);
    }
  }, [steps]);

  useEffect(() => {
    if (localStorage.getItem("employee-count")) {
      const count = parseInt(localStorage.getItem("employee-count")!);
      if (count >= 2) {
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    if (welcomeScreen) {
      devices.current.style.borderRadius = "17.014px";
      devices.current.style.transform = "";
      devices.current.style.border = welcomeScreen
        ? "0px"
        : "1px solid #465ff1";
      devices.current.style.background = "#f8fbff";
      devices.current.innerHTML =
        '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Devices</div>';
    }
    setTimeout(() => {
      if (orgCard.current && steps === 1) {
        orgCard.current.style.transform = "translate(110px, -200px)";
        orgCard.current.style.borderRadius = "17.014px";
        orgCard.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        orgCard.current.style.background = "#f8fbff";
        orgCard.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Organisation</div>';
      }
      if (steps > 1) {
        orgCard.current.style.borderRadius = "17.014px";
        orgCard.current.style.transform = "";
        orgCard.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        orgCard.current.style.background = "#f8fbff";
        orgCard.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Organisation</div>';
      }
      if (addressCard.current && steps === 2) {
        addressCard.current.style.transform = "translate(-100px, -200px)";
        addressCard.current.style.borderRadius = "17.014px";
        addressCard.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        addressCard.current.style.background = "#f8fbff";
        addressCard.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Address</div>';
      }
      if (steps > 2) {
        addressCard.current.style.borderRadius = "17.014px";
        addressCard.current.style.transform = "";
        addressCard.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        addressCard.current.style.background = "#f8fbff";
        addressCard.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Address</div>';
      }
      if (teams.current && steps === 3) {
        teams.current.style.transform = "translate(80px, -290px)";
        teams.current.style.borderRadius = "17.014px";
        teams.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        teams.current.style.background = "#f8fbff";
        teams.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Teams</div>';
      }
      if (steps > 3) {
        teams.current.style.borderRadius = "17.014px";
        teams.current.style.transform = "";
        teams.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        teams.current.style.background = "#f8fbff";
        teams.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Teams</div>';
      }
      if (employee.current && steps === 4) {
        employee.current.style.transform = "translate(-180px, -290px)";
        employee.current.style.borderRadius = "17.014px";
        employee.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        employee.current.style.background = "#f8fbff";
        employee.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Employee</div>';
      }
      if (steps > 4) {
        employee.current.style.borderRadius = "17.014px";
        employee.current.style.transform = "";
        employee.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        employee.current.style.background = "#f8fbff";
        employee.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Employee</div>';
      }
      if (devices.current && steps === 5 && !welcomeScreen) {
        devices.current.style.transform = "translate(100px, -370px)";
        devices.current.style.borderRadius = "17.014px";
        devices.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        devices.current.style.background = "#f8fbff";
        devices.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Devices</div>';
      }

      if (welcome.current && welcomeScreen) {
        welcome.current.style.borderRadius = "17.014px";
        welcome.current.style.border = welcomeScreen
          ? "0px"
          : "1px solid #465ff1";
        welcome.current.style.background = "#f8fbff";
        welcome.current.innerHTML =
          '<div class="font-gilroySemiBold" style="color:#465FF1;font-size:12px;font-style:normal;font-weight:600;line-height:32.246px;margin-left: 18px">Welcome</div>';
      }
    }, 800);
  }, [steps, welcomeScreen]);

  return (
    <div
      className={
        welcomeScreen
          ? "flex flex-col items-center justify-center h-[100vh] mt-[50px] "
          : `flex flex-row w-[100%] items-center `
      }
    >
      <div className={welcomeScreen ? "w-[50%] mb-[50px]" : "w-full"}>
        {steps === 1 && (
          <CompanyDetails
            setSteps={(steps: number) => {
              setSteps(steps);
            }}
          />
        )}
        {steps === 2 && (
          <Address
            steps={(steps: number) => {
              setSteps(steps);
            }}
          />
        )}
        {steps === 3 && (
          <Teams
            setSteps={() => {
              setSteps(4);
            }}
          />
        )}
        {steps === 4 && (
          <Employee
            setSteps={() => {
              setSteps(5);
            }}
          />
        )}
        {steps === 5 && (
          <DeviceComponent
            setWelcomeScreen={(value: boolean) => {
              setWelcomeScreenState(true);
            }}
          />
        )}
      </div>
      <div
        className={`flex w-full ${
          welcomeScreen ? "flex-col" : "flex-row"
        } items-center justify-center gap-[49px] bg-white leading-[normal] `}
      >
        <div
          className={`flex ${
            welcomeScreen ? "w-[60%] scale-[1.2] mt-[50px]" : "w-[577px]"
          } flex-col justify-center gap-[1.7px] rounded-[11px] border-x-[0.37px] border-t-[0.37px] border-solid border-neutral-400 bg-white px-[18px] pb-6 pt-4 [border-bottom-width:0.37px]`}
        >
          <div className="flex flex-wrap items-center justify-between gap-[3.1px] min-[725.0165405273438px]:flex-nowrap">
            <div className="h-[19px] w-16 rounded-[3.7px] bg-zinc-100" />
            <div className="h-[19px] w-48 rounded-[3.7px] bg-zinc-100" />
            <div className="flex items-center justify-center gap-[3.1px]">
              <div className="h-[19px] w-[19px] rounded-[3.7px] bg-zinc-100" />
              <div className="h-[19px] w-[19px] rounded-[3.7px] bg-zinc-100" />
              <div className="h-[19px] w-[19px] rounded-[3.7px] bg-zinc-100" />
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6 pr-1 pt-6 min-[725.0165405273438px]:flex-nowrap">
            <div className="flex flex-col gap-[8.1px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
            </div>
            <div className="flex flex-grow flex-wrap items-center justify-center gap-[6.9px] min-[725.0165405273438px]:flex-nowrap">
              <div
                ref={(el: any) => (orgCard.current = el)}
                className="h-[74px] w-[44%] rounded-[10px] bg-neutral-50 onboarding-org-card"
              />
              <div
                ref={(el: any) => (addressCard.current = el)}
                className="h-[74px] w-[72%] rounded-[10px] bg-neutral-50 onboarding-org-card"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-8 pr-1 pt-[5.7px] min-[725.0165405273438px]:flex-nowrap">
            <div className="flex flex-col gap-[8.1px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <circle
                  cx="10.3093"
                  cy="10.6296"
                  r="9.73629"
                  fill="#F0F0F0"
                  stroke="white"
                  strokeWidth="0.196693"
                />
              </svg>
            </div>
            <div className="flex flex-grow flex-wrap items-center justify-center gap-[7.1px] min-[725.0165405273438px]:flex-nowrap">
              <div
                ref={(el: any) => (teams.current = el)}
                className="h-28 w-[72%] rounded-[10px] bg-neutral-50 onboarding-org-card"
              />
              <div
                ref={(el: any) => (employee.current = el)}
                className="h-28 w-[44%] rounded-[10px] bg-neutral-50 onboarding-org-card"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-2.5 pr-1 min-[725.0165405273438px]:flex-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <circle
                cx="10.3093"
                cy="10.6296"
                r="9.73629"
                fill="#F0F0F0"
                stroke="white"
                strokeWidth="0.196693"
              />
            </svg>
            <div className="flex flex-grow flex-wrap items-end justify-center gap-[8.1px] min-[725.0165405273438px]:flex-nowrap">
              <div className="flex flex-col items-center w-full justify-end pt-[7.4px]">
                <div
                  ref={(el: any) => (devices.current = el)}
                  className="h-[74px] w-full rounded-[10px] bg-neutral-50 onboarding-org-card"
                />
              </div>
              <div className="flex flex-col w-full items-center justify-end pt-[7.4px]">
                <div
                  ref={(el: any) => (welcome.current = el)}
                  className="h-[74px] w-full rounded-[10px] bg-neutral-50 onboarding-org-card"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
