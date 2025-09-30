import "./globals.min.css";
import type { Metadata } from "next";
import Providers from "@/providers";
import { getSession } from "@/server/helper";
import localFont from "next/font/local";
import InternetCheck from "./InternetCheck";
import CoachMarks from "@/components/coach-marks";
import { ScreenSize } from "@/components/utils/screen-size";
import PaymentReminderDialog from "@/components/settings/payment-reminder";

export const metadata: Metadata = {
  metadataBase: new URL("https://deviceflow.ai"),
  title: {
    default: "DeviceFlow - Track and Optimize IT Asset Management | By Edify",
    template: "%s | DeviceFlow",
  },
  description:
    "DeviceFlow by Edify is your comprehensive solution for tracking, managing, and optimizing IT assets. Gain actionable insights, improve efficiency, and reduce costs with our intuitive SaaS platform.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://deviceflow.ai",
    title: "DeviceFlow - Track and Optimize IT Asset Management | By Edify",
    description:
      "DeviceFlow by Edify is your comprehensive solution for tracking, managing, and optimizing IT assets. Gain actionable insights, improve efficiency, and reduce costs with our intuitive SaaS platform.",
    siteName: "DeviceFlow - Track and Optimize IT Asset Management | By Edify",
    images: `https://deviceflow.ai/og_main.webp`,
  },
  twitter: {
    card: "summary_large_image",
    title: "DeviceFlow - Track and Optimize IT Asset Management | By Edify",
    description:
      "DeviceFlow by Edify is your comprehensive solution for tracking, managing, and optimizing IT assets. Gain actionable insights, improve efficiency, and reduce costs with our intuitive SaaS platform.",
    images: `https://deviceflow.ai/og_main.webp`,
  },
  icons: {
    icon: "/logo.png",
  },
};

const gilroyRegular = localFont({
  src: "../../public/fonts/gilroy2/Gilroy-Regular.ttf",
  // weight: "400",
  display: "block",

  variable: "--font-gilroy-regular",
});

const gilroyMedium = localFont({
  src: "../../public/fonts/gilroy2/Gilroy-Medium.ttf",
  // weight: "500",
  display: "block",

  variable: "--font-gilroy-medium",
});

const gilroySemiBold = localFont({
  src: "../../public/fonts/gilroy2/Gilroy-Semibold.ttf",
  // weight: "100 1000",
  display: "block",
  variable: "--font-gilroy-semibold",
});

const gilroyBold = localFont({
  src: "../../public/fonts/gilroy2/Gilroy-Bold.ttf",
  // weight: "700",
  display: "block",

  variable: "--font-gilroy-bold",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const userRole: number | undefined = session?.user?.user?.role;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        ></script>
      </head>
      <body
        className={`
          ${gilroyRegular.variable} 
          ${gilroyMedium.variable} 
          ${gilroySemiBold.variable} 
          ${gilroyBold.variable}
        `}
      >
        {/* {session?.user && <KbarWrapper userRole={userRole} />}{" "} */}
        <Providers>
          {children}
          {/* {session?.user?.user?.subscriptionStatus &&
            userRole !== 1 &&
            session?.user?.user?.subscriptionStatus === "Expired" && (
              <PaymentReminderDialog
                role={userRole}
                amount={session?.user?.user?.amount}
              />
            )} */}
        </Providers>
        <InternetCheck />
        <ScreenSize />
        {/* <CoachMarks /> */}
        {/* {userRole && <CoachMarks />} */}
      </body>
    </html>
  );
}
