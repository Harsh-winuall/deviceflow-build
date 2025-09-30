"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/buttons/Button";
import { Icons } from "../components/icons";
import WarningDelete from "@/icons/WarningDelete";
import AlertSuccess from "@/icons/AlertSuccess";

interface AlertContextValue {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

interface AlertOptions {
  title: string;
  description: string;
  isFailure: boolean;
  key?: string;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const generateRandomKey = () =>
  `alert-${Math.random().toString(36).substr(2, 9)}`;

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAlert, setCurrentAlert] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    if (currentAlert) return;
    const alertKey = options.key || generateRandomKey();
    setCurrentAlert({ ...options, key: alertKey });
  };

  const hideAlert = () => {
    setCurrentAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {currentAlert && (
        <Dialog open={true} onOpenChange={hideAlert}>
          <DialogContent className="rounded-2xl bg-white p-4 shadow-lg w-96 text-center">
            <div className="flex justify-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  currentAlert.isFailure
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {currentAlert.isFailure ? (
                  <WarningDelete />
                ) : (
                  <AlertSuccess />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-b-0.5 my-1">
              <DialogTitle className="text-base font-gilroySemiBold text-gray-900">
                {currentAlert.title}
              </DialogTitle>

              <DialogDescription className="p-1 text-sm px-2 font-gilroyMedium text-pretty text-gray-600">
                {currentAlert.description}
              </DialogDescription>
            </div>

            <DialogFooter className="flex w-full items-center  justify-center">
              <Button
                className={`w-full rounded-md border shadow-sm ${
                  currentAlert.isFailure
                    ? "border-[#D0D5DD] bg-[#FFF] text-[#344054]"
                    : "border-[#039855] bg-[#039855] text-white"
                }`}
                onClick={hideAlert}
              >
                {currentAlert.isFailure ? "Close" : "Done"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextValue => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
