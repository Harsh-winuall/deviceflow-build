import { Metadata } from "next";
import SingleDevice from "./main";

interface DevicePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Assets",
};

export default async function Page({ params }: DevicePageProps) {
  const id = (await params).id;

  return <SingleDevice params={id} />;
}
