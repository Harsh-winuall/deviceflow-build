import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../buttons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddNewLocation from "./add-new-location";
import SettingsSidebar, { sideBarItems } from "./settings-sidebar";

type SettingsDialogProps = {
  children: React.ReactNode;
};

function SettingsDialog({ children }: SettingsDialogProps) {
  const [selectItem, setSelectItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const isAdminAccess = sideBarItems().at(selectItem).label === "Admin Access";
  const isAssetLocationAccess =
    sideBarItems().at(selectItem).label === "Asset Locations";
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        closeButton={!isAdminAccess && !isAssetLocationAccess}
        className="rounded-lg max-w-[600px] h-[77vh] max-h-[80vh] p-0 flex flex-col gap-0"
      >
        <DialogHeader className="px-4 pt-3 pb-2 ">
          <div className="flex justify-between items-center w-full h-8">
            <h1 className="text-lg font-gilroySemiBold">Settings</h1>

            {isAdminAccess && (
              <div className="flex gap-36 justify-start items-start">
                <div className="flex mr-1 border border-[#E5E5E5] rounded-md items-center">
                  <input
                    placeholder="Search user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    className="flex-grow text-xs p-2 h-full bg-transparent outline-none text-black placeholder-[#B2B2B2] font-gilroyMedium placeholder:text-xs"
                  />
                  <Search className="size-3 text-[#B2B2B2] mr-2" />
                </div>
              </div>
            )}

            {isAssetLocationAccess && (
              <AddNewLocation isEdit={false}>
                <Button variant="outlineTwo" className="text-xs h-8">
                  Add New Locations
                </Button>
              </AddNewLocation>
            )}
          </div>
        </DialogHeader>

        <div className="h-[1px] bg-gray-200" />

        {/* Scrollable Body */}
        <div className="flex-grow overflow-hidden ">
          <SettingsSidebar
            onSelect={setSelectItem}
            selectItem={selectItem}
            searchTerm={searchTerm}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
