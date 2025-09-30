import { IntegrationCompanyCard } from "./integration-company-card";
import { AllIntegrationAvailable, getCustomCategories } from "@/server/integrationActions";
import { Button } from "@/components/buttons/Button";
import CustomIntegration from "../custom-integration";
import { useQuery } from "@tanstack/react-query";

export const IntegrationCompaniesSecx = (props: {
  categoryName: string;
  categoryCompanies: AllIntegrationAvailable[];
}) => {
  const { data: customCategories, status: categoryStatus } = useQuery({
    queryKey: ["custom-categories"],
    queryFn: () => getCustomCategories(),
  });
  return (
    <section className="w-full flex flex-col items-start gap-3 ">
      <div className="flex justify-between items-center w-full">
        <h1 className="relative font-gilroySemiBold p-1.5">
          {props?.categoryName}
        </h1>

        {props.categoryName === "All Integrations" && (
          <CustomIntegration customCategories={customCategories}>
            <Button
              className="rounded-md border border-[#DEDEDE]"
              variant="outlineTwo"
            >
              Add Custom Integration
            </Button>
          </CustomIntegration>
        )}
      </div>

      <div className=" flex flex-wrap gap-3 xl:grid xl:justify-items-center xl:gap-5 xl:grid-cols-3">
        {props?.categoryCompanies?.map((company) => (
          <IntegrationCompanyCard key={company?._id} company={company} />
        ))}
      </div>
    </section>
  );
};
