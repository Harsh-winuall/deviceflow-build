import React, { useRef, useState } from "react";
import { Button } from "../buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "../utils/upload";
import { getCurrentOrg, Org, updateOrg } from "@/server/orgActions";
import OrgLogo from "./org-logo";
import OrgDetailedInfo from "./org-detailed-info";
import OrgDetailsSkeleton from "./org-details-skeleton";

function OrgDetails({ OrgData }) {
  if (!OrgData) {
    return <OrgDetailsSkeleton />;
  }
  return (
    <div className="w-full flex flex-col gap-7">
      <OrgLogo OrgData={OrgData} />
      <OrgDetailedInfo data={OrgData} />
    </div>
  );
}

export default OrgDetails;
