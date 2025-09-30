"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import CoachmarksOne from "@/app/(root)/workflows/_components/coachmarks/coachmarks-one";
import CoachmarksTwo from "@/app/(root)/workflows/_components/coachmarks/coachmarks-two";
import CoachmarksThree from "@/app/(root)/workflows/_components/coachmarks/coachmarks-three";
import CoachmarksFour from "@/app/(root)/workflows/_components/coachmarks/coachmarks-four";
import CoachmarksFive from "@/app/(root)/workflows/_components/coachmarks/coachmarks-five";
import { usePathname, useRouter } from "next/navigation";

function CoachMarks() {
  const [step, setStep] = useState<number | null>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const done = localStorage.getItem("doneCoachMarks");
    const skipped = localStorage.getItem("skippedCoachmarksOne");

    if (done) return;

    const savedStep = localStorage.getItem("coachMarkStep");

    if (savedStep !== null) {
      setStep(parseInt(savedStep));
      setShouldShow(true);
    } else if (!skipped) {
      // show step 0 if not skipped before
      setStep(0);
      setShouldShow(true);
    }
  }, []);

  const handleNext = () => {
    if (step === 0) {
      localStorage.setItem("coachMarkStep", "1");
      router.push("/workflows");
    } else if (step === 1) {
      setStep(2);
      localStorage.setItem("coachMarkStep", "2");
    } else if (step === 2) {
      setStep(3);
      localStorage.setItem("coachMarkStep", "3");
    } else if (step === 3) {
      setStep(4);
      localStorage.setItem("coachMarkStep", "4");
    } else if (step === 4) {
      localStorage.setItem("doneCoachMarks", "true");
      localStorage.removeItem("coachMarkStep");
      localStorage.removeItem("skippedCoachmarksOne");
      setShouldShow(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("skippedCoachmarksOne", "true");
    localStorage.setItem("coachMarkStep", "1"); // Start at step 1 next
    setStep(null); // hide dialog for now
    setShouldShow(false);
  };

  // Handle /workflows visit
  useEffect(() => {
    const done = localStorage.getItem("doneCoachMarks");
    const savedStep = localStorage.getItem("coachMarkStep");

    if (
      pathname === "/workflows" &&
      !done &&
      savedStep &&
      parseInt(savedStep) > 0 &&
      parseInt(savedStep) < 5
    ) {
      setStep(parseInt(savedStep));
      setShouldShow(true);
    }
  }, [pathname]);

  if (!shouldShow || step === null) return null;

  return (
    <Dialog open={shouldShow} onOpenChange={setShouldShow}>
      <DialogContent className="p-4 h-[26rem] rounded-2xl max-w-xs w-fit focus:outline-none focus-visible:outline-none">
        {step === 0 && (
          <CoachmarksOne onNext={handleNext} onSkip={handleSkip} />
        )}
        {step === 1 && <CoachmarksTwo onNext={handleNext} />}
        {step === 2 && <CoachmarksThree onNext={handleNext} />}
        {step === 3 && <CoachmarksFour onNext={handleNext} />}
        {step === 4 && <CoachmarksFive onNext={handleNext} />}
      </DialogContent>
    </Dialog>
  );
}

export default CoachMarks;
