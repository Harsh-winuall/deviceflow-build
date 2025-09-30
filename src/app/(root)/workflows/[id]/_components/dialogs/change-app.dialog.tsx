"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { AppTaskType } from "../types/task";

export const ChangeAppDialog = ({
  onChangeApp,
  children,
}: {
  children: React.ReactNode;
  onChangeApp: (app: AppTaskType) => void;
}) => {
  const appData = [
    {
      icon: "/media/integrations-companies/google.webp",
      name: "Gmail",
      type: AppTaskType.GOOGLE,
    },
    {
      icon: "/media/integrations-companies/gmail-icon.webp",
      name: "Zoom",
      type: AppTaskType.ZOOM,
    },
    {
      icon: "/media/integrations-companies/hubspot.webp",
      name: "HubSpot",
      type: AppTaskType.HUBSPOT,
    },
    {
      icon: "/media/integrations-companies/github.webp",
      name: "Github",
      type: AppTaskType.GITHUB,
    },
    {
      icon: "/media/integrations-companies/notion.webp",
      name: "Notion",
      type: AppTaskType.NOTION,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        closeButton
        className="rounded-lg font-gilroyMedium max-w-sm min-h-0 max-h-60 h-full"
      >
        <DialogHeader>
          <DialogTitle className="font-normal tracking-wide font-gilroyMedium">
            Change app to:{" "}
          </DialogTitle>
        </DialogHeader>
        <div className="h-full space-y-2 overflow-y-auto hide-scrollbar">
          {appData.map((app) => (
            <DialogClose className="w-full" key={app.name}>
              <div
                onClick={() => onChangeApp(app.type)}
                className="w-full p-1 rounded-md border flex items-center gap-2"
                key={app.name}
              >
                <div className="rounded-lg p-1.5 border border-gray-100 flex-shrink-0">
                  <img src={app.icon} alt={app.name} className="size-10" />
                </div>
                {app.name}
              </div>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
