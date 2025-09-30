import { Props } from "@/app/(root)/layout";
import SidebarNavigation from "./main";

export default async function Sidebar({ session }: Props) {
  return <>{session && <SidebarNavigation session={session} />}</>;
}
