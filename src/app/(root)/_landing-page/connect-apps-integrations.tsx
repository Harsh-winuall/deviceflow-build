import { Button } from "@/components/buttons/Button";

export const ConnectAppsIntegrations = () => {
  const imageGridOne = [
    {
      alt: "dropbox",
      src: "/media/integrations-companies/dropbox.webp",
      wrap: true,
    },
    { alt: "duo", src: "/media/integrations-companies/duo.webp" },
    { alt: "gmail", src: "/media/landingPage/gmail.webp" },
    { alt: "slack", src: "/media/landingPage/Slack.webp", small: true },
    { alt: "clickup", src: "/media/integrations-companies/clickup.webp" },
    { alt: "razorpay", src: "/media/integrations-companies/razorpay.webp" },
    { alt: "jira", src: "/media/integrations-companies/jira.webp" },
    { alt: "azure", src: "/media/integrations-companies/azure.webp" },
  ];

  const imageGridTwo = [
    { alt: "github", src: "/media/integrations-companies/github.webp" },
    { alt: "keka", src: "/media/landingPage/keka.webp" },
    { alt: "hubspot", src: "/media/integrations-companies/hubspot.webp" },
    { alt: "notion", src: "/media/integrations-companies/notion.webp" },
    { alt: "asana-alt", src: "/media/landingPage/asana.webp", small: true },
    {
      alt: "google",
      src: "/media/integrations-companies/google.webp",
      small: true,
    },
    { alt: "figma", src: "/media/integrations-companies/figma.webp" },
    { alt: "teams", src: "/media/integrations-companies/teams.webp" },
  ];

  return (
    <section className="h-[65vh] w-full relative flex flex-col items-center justify-evenly bg-[#101010]">
      <div className="flex flex-col w-full gap-y-8 items-center ">
        <h1 className="text-2xl sm:text-3xl lg:text-6xl font-gilroySemiBold text-white text-center">
          Connect apps in
          <br /> just a click
        </h1>
        <Button className=" bg-white text-black font-gilroySemiBold">
          Coming Soon
        </Button>
      </div>

      <div className="absolute -top-1/3 left-[10%] w-full h-full z-0 flex items-end justify-start">
        <div className="grid grid-cols-4 grid-rows-2 gap-x-0 gap-y-12 rotate-45 translate-x-[-30%] translate-y-[20%] w-[35vw]">
          {imageGridOne.map((img, i) => (
            <div
              key={i}
              className="flex justify-center items-center w-fit h-fit p-1 bg-white rounded-lg -rotate-45"
            >
              <img
                alt={img.alt}
                src={img.src}
                className="size-8 lg:size-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-1/3 right-[10%] w-full h-full z-0 flex items-end justify-end">
        <div className="grid grid-cols-4 grid-rows-2 gap-x-0 gap-y-12 -rotate-45 translate-x-[30%] translate-y-[20%] w-[35vw]">
          {imageGridTwo.map((img, i) => (
            <div
              key={i}
              className="flex justify-center items-center w-fit h-fit p-1 bg-white rounded-lg rotate-45"
            >
              <img
                alt={img.alt}
                src={img.src}
                className="size-8 lg:size-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none h-36" />
    </section>
  );
};
