import { ActionBar } from "@/components/action-bar/action-bar";
import { Main } from "../../../_components/main";

export default function Page() {
  return (
    <div className="w-full space-y-3 h-fit">
      <ActionBar showBackBtn key={`diagnostics-action-bar-emp`}>
        <></>
      </ActionBar>
      <Main isAdmin={false} key={"reports of admin himself"} />
    </div>
  );
}
