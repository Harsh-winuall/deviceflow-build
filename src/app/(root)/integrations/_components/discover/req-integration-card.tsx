import { MemberIcon } from "@/app/(root)/teams/_components/member-icon";
import { Button } from "@/components/buttons/Button";

export const RequestIntegrationCard = () => {
  const renderIcons = () => {
    return (
      <>
        <MemberIcon
          isPlaceholder={false}
          className="bg-black border-none"
          src="/media/integrations-companies/drive.png"
        />
        <MemberIcon
          isPlaceholder={false}
          className="bg-black border-none"
          src="/media/integrations-companies/keka.png"
        />
        <MemberIcon
          isPlaceholder={false}
          src="/media/integrations-companies/github.png"
          className="bg-black border-none"
        />
      </>
    );
  };
  return (
    <div className="rounded-2xl bg-black p-6 flex flex-col w-[19rem] gap-5">
      <h1 className="text-[#BFBFBF] text-2xl text-start 2xl:text-3xl w-[70%]  font-gilroySemiBold">
        Can&apos;t <span className="text-white">find</span> your integration?
      </h1>
      <div className="flex -space-x-3">{renderIcons()}</div>
      <Button className="w-full bg-white text-black font-gilroySemiBold">
        Request
      </Button>
    </div>
  );
};
