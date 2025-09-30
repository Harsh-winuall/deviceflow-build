import { buttonVariants } from "@/components/buttons/Button";
import { Table } from "@/components/wind/Table";
import { LicenseData } from "@/server/licenseActions";
import Link from "next/link";

const LicenseTable = ({ data: ogData }: { data: LicenseData["licenses"] }) => {
  if (!ogData || ogData.length === 0) {
    return (
      <div className="flex justify-center items-center text-gray-500 p-4">
        <img
          src="/media/no_data/no_license.svg"
          alt=""
          className="size-[450px]"
        />
      </div>
    );
  }
  const data = ogData?.map((item, i) => ({
    ...item,
    id: i + 1,
  }));

  return (
    <div className="mx-5 h-[60dvh] hide-scrollbar overflow-auto ">
      <Table
        data={data}
        selectedIds={[]}
        setSelectedIds={() => {}}
        columns={[
          {
            title: "Serial No",
            render: (record: LicenseData["licenses"][0]) => (
              <div className="font-gilroySemiBold text-sm text-black truncate">
                {record?.id}
              </div>
            ),
          },
          {
            title: "Key",
            render: (record: LicenseData["licenses"][0]) => {
              if (record?.licenseKey) {
                return (
                  <h3 className="text-[13px] font-gilroyMedium text-[#808080]">
                    <span className="ml-0.5 px-1 rounded-sm font-gilroyMedium text-[#808080]">
                      {record?.licenseKey
                        ? `${record?.licenseKey.substring(0, 4)}-XXXX-XXXX`
                        : ""}
                    </span>
                  </h3>
                );
              } else {
                return <h1>-</h1>;
              }
            },
          },
          {
            title: "Assigned To",
            render: (record: LicenseData["licenses"][0]) => (
              <div>{record?.deviceName}</div>
            ),
          },

          {
            title: "",
            render: (record: LicenseData["licenses"][0]) => (
              <Link
                href={`/assets/${record?.deviceId}/${record._id}`}
                className={buttonVariants({ variant: "outlineTwo" })}
                style={{ cursor: "pointer" }}
              >
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default LicenseTable;
