import { Metadata } from "next";
import { AiAgentsMain } from "./_components/main";

export const metadata: Metadata = {
  title: "AI Agents",
};

export default function Page() {
  return <AiAgentsMain />;
}
