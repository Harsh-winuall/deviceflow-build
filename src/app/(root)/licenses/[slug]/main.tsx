"use client";
import { ActionBar } from "@/components/action-bar/action-bar";
import { CombinedContainer } from "@/components/container/container";
import SingleSoftwareScreen from "./_components/single-software";
import { useQuery } from "@tanstack/react-query";
import { getLicenseById } from "@/server/licenseActions";

export default function Main({ slug }: { slug: string }) {
  const { data, status } = useQuery({
    queryKey: ["get-license-by-id", slug],
    queryFn: () => getLicenseById(slug),
  });
  return (
    <CombinedContainer>
      <ActionBar showBackBtn>
        <div className="flex gap-2"></div>
      </ActionBar>

      {/* {JSON.stringify(data)} */}
      <SingleSoftwareScreen data={data} status={status} />
    </CombinedContainer>
  );
}
