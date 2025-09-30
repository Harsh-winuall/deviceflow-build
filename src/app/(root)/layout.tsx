import Header from "@/components/header/header";
import Sidebar from "@/components/sidebar";
import { getSession } from "@/server/helper";
import type { Session } from "next-auth";
import { LandingPage } from "./_landing-page";
import SessionProvider from "@/lib/providers/session-provider";
import ClientDialogWrapper from "@/components/client-dialog-wrapper";

export type Props = {
  session: Session | null;
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="w-full min-h-screen">
        <LandingPage />
      </div>
    );
  }

  return (
    <SessionProvider value={{ session: session }}>
      <div className="relative">
        <div
          className="flex flex-row h-full min-h-screen hide-scrollbar fixed z-20"
          style={{ width: "100%" }}
        >
          <div className="flex flex-grow w-full">
            <div className="fixed top-0 z-30 left-0 w-56 h-full bg-transparent border bg-white">
              <Sidebar session={session} />
            </div>
            <div className="flex flex-col w-full h-full ml-56">
              <Header session={session} />

              <ClientDialogWrapper>
                <div className="w-full z-10 bg-[#FAFBFC] h-full">
                  {children}
                </div>
              </ClientDialogWrapper>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
