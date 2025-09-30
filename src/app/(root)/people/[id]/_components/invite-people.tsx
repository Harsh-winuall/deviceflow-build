"use client";
import { Button, LoadingButton } from "@/components/buttons/Button";
import { GetAvatar } from "@/components/get-avatar";
import { Input } from "@/components/inputs/Input";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/side-sheet";
import { createSignupLink } from "@/server/signupActions";
import { fetchTeams, Team } from "@/server/teamActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InvitePeople({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [link, setLink] = useState("");

  const [team, setTeam] = useState<Team>();
  const [error, setError] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!team?._id) {
      setError("Team required");
      return;
    }

    setLoading(true);
    try {
      const res = await createSignupLink(team._id);
      setLink(res.link);
      setOpen(false);
      toast.success("Invite people link created !");
      setDialogOpen(true);
      setLoading(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to create link !");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
          <DialogTitle className="text-lg font-gilroySemiBold text-gray-900">
            Invite people
          </DialogTitle>
          <p className="text-[#B1B1B1] text-sm font-gilroyMedium -mt-2">
            Share this link to onboard your employees easily.
          </p>

          <div className="w-full mt-2 flex items-center  justify-between gap-x-2">
            <Input
              id="copy-link"
              type="text"
              className={
                "text-[#025CE5] select-none w-[17rem]  rounded-lg border-[#BEBEBE] focus-visible:border-[#BEBEBE] focus:border-[#BEBEBE] font-gilroyMedium text-sm h-10"
              }
              defaultValue={link}
              value={link}
              readOnly
              placeholder=""
            />
            <Button
              variant="outlineTwo"
              onClick={handleCopy}
              className="w-fit border-[#BEBEBE]"
            >
              Copy
            </Button>
          </div>

          <DialogFooter className="flex w-full items-center justify-center mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false);
                setTeam({});
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center items-center gap-8">
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="rounded-[10px] p-4">
              <div className="flex justify-center w-full h-full items-start">
                <div className="flex flex-col w-[97%]  justify-start items-center">
                  <h1 className="font-gilroySemiBold w-full text-start text-lg mb-3">
                    Invite people
                  </h1>

                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col justify-start  "
                  >
                    <div className="flex flex-col gap-2 ">
                      <h1 className="font-gilroyMedium text-[13px] ">
                        Select Team
                      </h1>
                      <AsyncSelect<Team>
                        fetcher={fetchTeams}
                        queryKey="fetch-teams"
                        preload
                        // fixInputClear={false}
                        renderOption={(team) => (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="font-gilroyMedium">
                                {team?.title}
                              </div>
                              <div className="text-xs font-gilroyRegular text-muted-foreground">
                                {team?.description}
                              </div>
                            </div>
                          </div>
                        )}
                        filterFn={(team, query) =>
                          team?.title
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase()) ||
                          team?.description
                            ?.toLowerCase()
                            ?.includes(query?.toLowerCase())
                        }
                        getOptionValue={(team) => team?._id}
                        getDisplayValue={() => (
                          <div className="flex items-center gap-2 text-left w-full">
                            <div className="flex flex-col leading-tight">
                              <div className="font-gilroyMedium">
                                {team?.title ?? ""}
                              </div>
                            </div>
                          </div>
                        )}
                        notFound={
                          <div className="py-6 text-center font-gilroyMedium text-sm">
                            No teams found
                          </div>
                        }
                        label="Team"
                        placeholder="Search Teams"
                        value={team?.title || "null"}
                        onChange={(selected) =>
                          setTeam({
                            _id: selected?._id,
                            title: selected?.title,
                            description: selected?.description,
                            image: selected?.image,
                          })
                        }
                        width="100%"
                      />
                      {error.length > 0 && (
                        <p className="text-destructive/80 text-xs ml-1 font-gilroyMedium">
                          {error}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2  w-full mt-6">
                      <Button
                        type="button"
                        className=" w-full"
                        variant="outlineTwo"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </Button>
                      <LoadingButton
                        loading={loading}
                        variant="primary"
                        className="w-full"
                        type="submit"
                      >
                        Create Link
                      </LoadingButton>
                    </div>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
