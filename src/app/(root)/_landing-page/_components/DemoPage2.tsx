interface DemoPage2Props {
    setStep: (step:number)=> void;
    setIsOpen: (state: boolean) => void;
}

export const DemoPage2 = ({ setStep, setIsOpen }: DemoPage2Props) => (
    <div className="py-10">
      <div className="flex flex-col gap-4 mb-8">
        <div className="text-[#090914] text-3xl font-gilroyBold">All Done!</div>
        <div className="text-[#52525B] text-base font-gilroyMedium">
          Sit Back! Our support will contact you soon
        </div>
      </div>
  
      <div
        className="rounded-[9px] bg-black text-white text-base font-gilroySemiBold py-3 cursor-pointer"
        onClick={
            ()=>{
                setIsOpen(false);
            }
        } // Reset to step 1
      >
        Done
      </div>
    </div>
  );