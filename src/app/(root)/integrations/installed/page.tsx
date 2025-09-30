import { Metadata } from "next";
import InstalledPage from "./main";

export const metadata: Metadata = {
  title: "Installed Integrations",
};

export default function Page() {
  return <InstalledPage />;
}
