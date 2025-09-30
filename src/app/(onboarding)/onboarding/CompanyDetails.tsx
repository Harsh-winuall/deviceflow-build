import { FormField } from "@/app/(root)/settings/_components/form-field";
import { LogoCompanyModal } from "@/app/(root)/settings/_components/logo-company";
import { Button, LoadingButton } from "@/components/buttons/Button";
import UploadIcon from "@/icons/UploadIcon";
import { Org, getCurrentOrg, updateOrg } from "@/server/orgActions";
import React, { useEffect, useRef, useState } from "react";

export function CompanyDetails({ setSteps }: any) {
  const [company, setCompany] = useState<Org | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = async () => {
    const data: Org = await getCurrentOrg();
    setCompany(data);
  };
  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof File) {
      const formData: any = new FormData();
      formData.append("file", file);
      try {
        const data = await updateOrg({
          id: company?._id,
          title: undefined,
          description: undefined,
          logo: formData,
        }); // Send the image in the form data
        getCompany();
      } catch (error) {}
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await updateOrg({ id: company?._id, title: company?.name });
      setSteps(2);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen justify-evenly items-center flex flex-col lg:flex-row p-8">
      <div className=" relative h-full justify-center items-center flex flex-col">
        <div
          className={`font-gilroySemiBold flex w-full gap-6 flex-col items-center  leading-[normal] tracking-[0px]`}
        >
          <div className="w-full">
            <div className="text-center text-[25px] font-gilroyBold leading-[normal] text-indigo-950">
              Customise your Organisation
            </div>
            <div className="text-center text-xl font-gilroyMedium leading-[normal] text-zinc-400">
              Setup your organization
            </div>
          </div>
          <div className="relative flex-1 flex-col rounded-[25px] px-5 py-5 bg-white gap-2 h-[136px]  items-center">
            <div className="w-full flex justify-center">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="size-28 rounded-full border object-cover"
                />
              ) : (
                <div className="size-28 rounded-full border bg-white" />
              )}
            </div>
            <LogoCompanyModal
              id={company?._id!}
              logo={company?.logo}
              uploadSuccess={() => {
                getCompany();
              }}
            >
              <div
                className="flex flex-col justify-end self-stretch pt-[17px]"
                style={{ cursor: "pointer" }}
              >
                <div className="flex flex-grow flex-wrap items-center justify-center gap-x-[22px] gap-y-[22px] text-[15px] font-medium leading-[normal] text-indigo-950 [max-height:59px] min-[423.75189208984375px]:flex-nowrap">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-x-[15px] rounded-[7.4px] border-x-[0.93px] border-t-[0.93px] border-solid border-x-[dimgray] border-y-[dimgray] bg-white px-8 py-2.5 [border-bottom-width:0.93px]"
                  >
                    <UploadIcon />
                    <div className="flex flex-col items-center">
                      {company?.logo ? (
                        <div>Edit Logo</div>
                      ) : (
                        <div>Upload Logo</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </LogoCompanyModal>
          </div>

          <div className="flex flex-col w-[75%] gap-6">
            <FormField
              label="Company Name"
              id="companyName"
              value={company?.name || ""}
              onChange={(e) => {
                const nextState = { ...company };
                nextState.name = e.target.value;
                setCompany(nextState);
              }}
              placeholder="Company Name"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-[75%]">
            <LoadingButton
              variant="primary"
              loading={loading}
              onClick={onSubmit}
            >
              Submit
            </LoadingButton>
            <Button
              onClick={() => setSteps(2)}
              className="w-full"
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
