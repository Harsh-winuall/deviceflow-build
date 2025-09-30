import { Metadata } from "next";
import UserPage from "./main";

export const metadata: Metadata = {
  title: "People",
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <UserPage params={params} />
    </>
  );
}
