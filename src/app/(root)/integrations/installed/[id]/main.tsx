"use client";

import { ActionBar } from "@/components/action-bar/action-bar";
import { Button, buttonVariants } from "@/components/buttons/Button";
import {
  getCustomCategories,
  getUsersOfIntegration,
  IntegrationUsers,
} from "@/server/integrationActions";
import { useQuery } from "@tanstack/react-query";
import { RemoveIntegration } from "../../_components/installed/remove-integration.dialog";
import UserByIntegrations from "../../_components/installed/user-by-integrations";
import AddingNewMembersIntegration from "../../_components/installed/adding-new-members-integration";
import EditingCustomIntegration from "../../_components/installed/edit-custom-integration";
import { RemoveCustomIntegration } from "../../_components/installed/deleting-custom-integration";
import { ActionSearchBar } from "@/components/action-bar/action-search-bar";
import { useEffect, useMemo, useState } from "react";

export const SingleInstalledIntegration = ({
  params,
}: {
  params: { id: string };
}) => {
  const platform = decodeURI(params?.id);
  const [searchValue, setSearchValue] = useState("");
  const [platformData, setPlatformData] = useState();
  const { data: integration, status } = useQuery({
    queryKey: ["user-by-integrations", platform],
    queryFn: () => getUsersOfIntegration({ platform: platform }),
  });

  const { data: customCategories, status: categoryStatus } = useQuery({
    queryKey: ["custom-categories"],
    queryFn: () => getCustomCategories(),
  });

  // console.log(integration);

  // const platformData = integration?.platformData || {};

  let integrationData: IntegrationUsers["allUsers"][0]["integrations"][0];

  for (const user of integration?.allUsers || []) {
    const match = user.integrations?.find((i) => i?.platform === platform);
    if (match) {
      integrationData = match;
      break;
    }
  }
  const filteredUsers = useMemo(() => {
    if (!integration?.allUsers) return [];

    return integration.allUsers.filter((user) => {
      const searchLower = searchValue.toLowerCase();
      return user.first_name?.toLowerCase().includes(searchLower);
    });
  }, [integration, searchValue]);
  useEffect(() => {
    if (integration) {
      setPlatformData(integration?.platformData);
    }
  }, [integration]);

  // console.log(platformData);

  return (
    <>
      <div className="flex flex-col gap-4 hide-scrollbar overflow-hidden">
        <ActionBar showBackBtn>
          {/* {JSON.stringify(integrationData.id)} */}
          <div className="w-full flex gap-3 justify-end">
            {!integrationData?.url ? (
              <>
                {platformData?.orgBased === true ||
                (platformData?.orgBased === false &&
                  platformData?.perSeat === false) ? null : (
                  <AddingNewMembersIntegration
                    filterUserData={integration?.allUsers}
                    integrationId={integrationData?.id}
                  >
                    <Button variant="outlineTwo" className="h-9  rounded-md">
                      {" "}
                      Add Members
                    </Button>
                  </AddingNewMembersIntegration>
                )}
                <EditingCustomIntegration
                  data={{
                    ...integrationData,
                    category: platformData?.customCategoryTitle,
                    platform: platformData?.platform,
                    logo: platformData?.companyLogo,
                    price: platformData?.price?.price.toString(),
                  }}
                  platformData={platformData}
                  category={platformData?.customCategoryTitle}
                  platform={platformData?.platform}
                  customCategoryId={platformData?.customCategoryId}
                  customCategories={customCategories}
                >
                  <Button variant="outlineTwo" className="h-9 rounded-md">
                    {" "}
                    Edit
                  </Button>
                </EditingCustomIntegration>
                <RemoveCustomIntegration id={platformData?._id}>
                  <Button variant="primary" className="h-9 rounded-md w-fit">
                    {" "}
                    Remove
                  </Button>
                </RemoveCustomIntegration>
              </>
            ) : (
              <>
                <RemoveIntegration
                  id={platformData?._id}
                  platform={platformData?.platform}
                >
                  <span
                    className={`${buttonVariants({
                      variant: "outlineTwo",
                    })} w-fit`}
                  >
                    Remove
                  </span>
                </RemoveIntegration>
              </>
            )}
          </div>
        </ActionBar>

        <UserByIntegrations
          platformData={platformData}
          status={status}
          data={integration}
          selectedPlatform={platform}
          integrationData={integrationData}
        />
      </div>
    </>
  );
};
