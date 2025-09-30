import { DeviceGrid } from "@/app/(root)/assets/[id]/_components/device-grid";
import { CombinedContainer } from "@/components/container/container";
import { Device, getDeviceById } from "@/server/deviceActions";

interface DeviceParam {
  params: { id: string };
}

const Page = async ({ params }: DeviceParam) => {
  try {
    const { id } = params;
    const data: Device = await getDeviceById(id);

    return (
      <CombinedContainer title="Device Details">
        <DeviceGrid data={data} />
      </CombinedContainer>
    );
  } catch (error) {
    console.error("Error fetching Device:", error);
    return (
      <CombinedContainer>
        <div className="text-red-500">Error fetching Device</div>
      </CombinedContainer>
    );
  }
};

export default Page;
