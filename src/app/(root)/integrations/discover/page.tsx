import { Metadata } from "next";
import DiscoverPage from "./main";

export const metadata: Metadata = {
  title: "Discover Integrations",
};

export default function Page() {
  return <DiscoverPage />;
}
