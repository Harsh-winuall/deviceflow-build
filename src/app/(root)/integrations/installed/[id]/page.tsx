import { Metadata } from "next";
import { SingleInstalledIntegration } from "./main";

export const metadata: Metadata = {
  title: "Installed Integrations",
};

export default function Page({ params }: { params: { id: string } }) {
  return <SingleInstalledIntegration params={params} />;
}
