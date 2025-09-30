"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { Input } from "@/components/inputs/Input";
import CompanyOnbardingIcon from "@/icons/CompanyOnbardingIcon";
import { cn } from "@/lib/utils";
import { createTeam } from "@/server/teamActions";
import { useState } from "react";

export const Teams = ({ setSteps }: any) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local state for form data
  const [formData, setFormData] = useState({
    title: "",
  });

  const [errors, setErrors] = useState({
    title: "",
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    // Manual validation
    const newErrors = {
      title: formData.title ? "" : "Team name is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;
    try {
      setLoading(true);
      await createTeam({ title: formData.title });
      setSuccess(true);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
      {!success ? (
        <div className="w-full relative h-full justify-center items-center flex flex-col gap-6">
          <div
            className={`font-gilroySemiBold flex w-full gap-6 flex-col items-center  leading-[normal] tracking-[0px]`}
          >
            <div className="w-full">
              <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
                Create teams
              </div>
              <div className="text-center text-xl font-gilroyMedium leading-[normal] text-zinc-400">
                Add all the teams in organizations
              </div>
            </div>
            <CompanyOnbardingIcon />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-8 w-[75%]"
          >
            <div className="group relative">
              <label
                htmlFor="team-name"
                className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-base font-gilroyMedium text-foreground"
              >
                Team Name
              </label>
              <Input
                maxLength={20}
                id="team-name"
                className={cn(
                  errors.title
                    ? "border-destructive/80  focus-visible:border-destructive/80 focus-visible:ring-destructive/0 h-12"
                    : "h-12"
                )}
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="eg: Alpha, Gamma"
                type="text"
              />
              {errors.title && (
                <p className="mt-0.5 text-xs font-gilroyMedium text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <LoadingButton
                variant="primary"
                className="w-full"
                loading={loading}
                type="submit"
              >
                Create Team
              </LoadingButton>
              <Button
                onClick={() => setSteps(3)}
                className="w-full"
                variant="outline"
              >
                Skip
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full relative h-full justify-center items-center flex flex-col gap-6">
          <div className="w-full">
            <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
              Team Created!!
            </div>
            <div className="text-center text-md mt-2 font-gilroyMedium leading-[normal] text-zinc-400">
              Team has been created and is ready to assign employees
            </div>
          </div>

          <Button
            className="w-[75%]"
            variant="primary"
            onClick={() => {
              setSteps(4);
            }}
          >
            Add Employee
          </Button>
          <LoadingButton
            onClick={() => {
              setSuccess(false);
            }}
            variant="primary"
            className="w-[75%]"
            type="submit"
          >
            Create New Team
          </LoadingButton>
        </div>
      )}
    </div>
  );
};
