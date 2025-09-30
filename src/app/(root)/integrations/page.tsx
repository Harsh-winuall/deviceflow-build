import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Integrations",
};

export default function Page() {
  return redirect("integrations/discover");
}
