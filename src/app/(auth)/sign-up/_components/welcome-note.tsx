import WelcomeGreenTick from "@/icons/WelcomeGreenTick";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function Welcome() {
  const router = useRouter();
  return (
    <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
      <div className="w-[46%]  h-[auto]">
        <img
          src="/media/Onboarding/employee.png"
          alt="edify-background"
          width={"100%"}
        />
      </div>
      <div className="w-[42%]  h-full justify-center items-center flex flex-col">
        <div className="w-full flex flex-col gap-0 justify-center items-center">
          <WelcomeGreenTick/>

          <h1 className="text-center text-3xl font-gilroyBold my-3 text-indigo-950">
            Welcome to DeviceFlow
          </h1>
          <p className="text-center text-base text-pretty my-1 font-gilroyMedium  text-[#52525B]">
            Successfully registered with DeviceFlow, your login details have
            been emailed.
          </p>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="flex items-center mt-5 justify-center h-[56px] w-[75%] rounded-[9.3px] bg-black px-44 py-[13px]"
        >
          <div className=" text-white justify-center font-gilroySemiBold items-center flex gap-3">
            Login <MoveRight className="size-5" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default Welcome;
