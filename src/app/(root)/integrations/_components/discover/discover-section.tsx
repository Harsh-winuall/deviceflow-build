import { AllIntegrationAvailable } from "@/server/integrationActions";
import { useEffect, useState } from "react";
import { CategoriesFilter } from "./categories-filter";
import { DiscoverSectionSkeleton } from "./discover-skelton";
import { IntegrationCompaniesSecx } from "./integration-companies-secx";
import { StoreBannerCardBig } from "./store-banner-card-big";
import { RequestIntegrationCard } from "./req-integration-card";
import RequestIntegration from "../request-integration";
import { Button } from "@/components/buttons/Button";
import CustomIntegration from "../custom-integration";

interface DiscoverSectionProps {
  data: AllIntegrationAvailable[] | undefined;
  status?: "error" | "success" | "pending";
}

export const DiscoverSection = ({ data, status }: DiscoverSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    companies: AllIntegrationAvailable[];
  }>({
    title: "All Integrations",
    companies: [],
  });

  // Update the selectedCategory when data becomes available.
  useEffect(() => {
    if (data && data?.length) {
      setSelectedCategory({
        title: "All Integrations",
        companies: data,
      });
    }
  }, [data]);

  // Show a loading indicator until data is available.
  if (status === "pending") {
    return (
      <div>
        <DiscoverSectionSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full h-[60vh]">
      <section className="flex gap-4 h-full">
        <CategoriesFilter data={data} onSelect={setSelectedCategory} />

        <div className="flex flex-col gap-6 py-4 pl-8 ml-5 h-full overflow-y-auto hide-scrollbar">
          <IntegrationCompaniesSecx
            categoryName={selectedCategory?.title}
            categoryCompanies={selectedCategory?.companies}
          />
          {selectedCategory?.title === "All Integrations" ? (
            <>
              <div className="flex justify-between gap-5 items-center w-full h-[30vh]">
                <div className="h-full w-full">
                  <StoreBannerCardBig />
                </div>
                <RequestIntegration>
                  {" "}
                  <RequestIntegrationCard />
                </RequestIntegration>
              </div>

              <IntegrationCompaniesSecx
                categoryName="Newly Added"
                categoryCompanies={data?.filter((item) =>
                  item.tags.includes("isNewlyAdded")
                )}
              />

              <IntegrationCompaniesSecx
                categoryName="Popular"
                categoryCompanies={data?.filter((item) =>
                  item.tags.includes("isPopular")
                )}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </section>
    </div>
  );
};
