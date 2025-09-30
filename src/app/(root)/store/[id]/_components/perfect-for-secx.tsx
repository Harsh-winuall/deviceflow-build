
import StoreProductIcons from "@/icons/StoreProductIcons";
import { StoreDevice } from "@/server/deviceActions";
import { BusFront, MonitorCheck } from "lucide-react";

export const PerfectForSecx = ({ data }: { data: StoreDevice }) => {
  const icons = [
    {
      key: "dev",
      icon: <StoreProductIcons.both_arrows />,
    },
    {
      key: "finance",
      icon: <MonitorCheck />,
    },
    {
      key: "operations",
      icon: <BusFront />,
    },
  ];

  const mockPerfectFor = [
    {
      title: "Graphic Designers",
    },
    {
      title: "Engineering Team",
    },
    {
      title: "IT Professionals",
    },
  ];

  const modifiedPerfectFor =
    data?.perfectFor && data.perfectFor.length > 0
      ? data.perfectFor
      : mockPerfectFor.map((item) => {
          // Find a matching icon based on the title
          const matchingIcon = icons.find((icon) =>
            item.title?.toLowerCase().includes(icon.key.toLowerCase())
          );

          // Return the object with icon and title
          return {
            icon: matchingIcon ? matchingIcon.icon : <StoreProductIcons.both_arrows />,
            title: item.title || "Default Title",
          };
        });

  return (
    <section className="px-32 pt-16 pb-6">
      <h2 className="text-2xl 2xl:text-3xl font-gilroySemiBold">Perfect for</h2>
      <div className="flex py-5 items-center gap-5">
        {modifiedPerfectFor.map((v) => (
          <div
            key={v.title}
            className="w-64 bg-[#F4F4F4] h-16 rounded-lg flex justify-center items-center gap-4"
          >
            <div>{v?.icon ?? ""}</div>{" "}
            <span className="font-gilroySemiBold text-black">
              {v?.title ?? ""}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
