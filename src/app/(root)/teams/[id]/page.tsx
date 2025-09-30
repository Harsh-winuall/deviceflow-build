import { Metadata } from "next";
import TeamPage from "./main";

export const metadata: Metadata = {
  title: "Teams",
};

export default function Page({ params }: { params: { id: string } }) {
  return <TeamPage params={params} />;
}
