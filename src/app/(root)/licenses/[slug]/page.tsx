import { CombinedContainer } from "@/components/container/container";
import { Metadata } from "next";
import Main from "./main";
interface SoftwarePageProps {
  params: Promise<{ slug: string }>;
}
export const metadata: Metadata = {
  title: "Software",
};

export default async function Software({ params }: SoftwarePageProps) {
  const slug = (await params).slug;

  return <Main slug={slug} />;
}
