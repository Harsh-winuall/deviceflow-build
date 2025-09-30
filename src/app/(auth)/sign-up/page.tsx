"use client";
import { useEffect, useState } from "react";
import PersonalDetails from "./_components/personal-details";
import OrganisationDetails from "./_components/organisation-details";
import EmailVerificaion from "./_components/email-verification";
import Welcome from "./_components/welcome-note";
import { notFound, useSearchParams } from "next/navigation";
import { validateToken } from "@/server/signupActions";
import DeviceFlowLoader from "@/components/deviceFlowLoader";
import { User } from "@/server/userActions";
import LinkExpired from "@/icons/LinkExpired";

function SignUp() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return notFound();
  }

  const [steps, setSteps] = useState(1);
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState("");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await validateToken(token);
        if (res.data?.teamId) {
          setValidToken(token);
        }
        setLoading(false);
      } catch (error) {
        setValidToken("");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <section className="flex flex-col gap-y-6 justify-center items-center h-screen bg-white">
        <DeviceFlowLoader />
        <span className="font-gilroyMedium text-base">
          Validating token ...
        </span>
      </section>
    );
  }

  if (!validToken || validToken.length === 0) {
    return (
      <section className="flex justify-center items-center h-screen bg-white">
        <LinkExpired/>
      </section>
    );
  }

  return (
    <>
      {steps === 1 && (
        <EmailVerificaion user={user} setUser={setUser} setSteps={setSteps} />
      )}
      {steps === 2 && (
        <PersonalDetails setSteps={setSteps} user={user} setUser={setUser} />
      )}
      {steps === 3 && (
        <OrganisationDetails
          setSteps={setSteps}
          token={validToken}
          user={user}
        />
      )}
      {steps === 4 && <Welcome />}
    </>
  );
}

export default SignUp;
