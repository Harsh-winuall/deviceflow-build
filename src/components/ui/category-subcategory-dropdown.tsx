import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Category {
  label: string;
  value: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  label: string;
  value: string;
}

export const categories: Category[] = [
  {
    label: "Hardware Issues",
    value: "Hardware Issues",
    subcategories: [
      { label: "Laptop/Desktop not powering on", value: "Laptop/Desktop not powering on" },
      { label: "Keyboard/Mouse not working", value: "Keyboard/Mouse not working" },
      { label: "Printer/Scanner issues", value: "Printer/Scanner issues" },
      { label: "Monitor/display problems", value: "Monitor/display problems" },
      { label: "Battery/swelling issues", value: "Battery/swelling issues" },
      { label: "Hardware overheating", value: "Hardware overheating" },
      { label: "Device not booting or stuck on BIOS", value: "Device not booting or stuck on BIOS" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Software/Application Issues",
    value: "Software/Application Issues",
    subcategories: [
      { label: "Application not loading or crashing", value: "Application not loading or crashing" },
      { label: "Login/authentication errors", value: "Login/authentication errors" },
      { label: "Slow system or software performance", value: "Slow system or software performance" },
      { label: "Software update failures", value: "Software update failures" },
      { label: "Microsoft 365 issues", value: "Microsoft 365 issues" },
      { label: "VPN or remote desktop issues", value: "VPN or remote desktop issues" },
      { label: "Antivirus conflicts", value: "Antivirus conflicts" },
      { label: "License activation problems", value: "License activation problems" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Network & Connectivity Issues",
    value: "Network & Connectivity Issues",
    subcategories: [
      { label: "No internet access", value: "No internet access" },
      { label: "Wi-Fi not connecting", value: "Wi-Fi not connecting" },
      { label: "Network slowness", value: "Network slowness" },
      { label: "Shared drive or network folder not accessible", value: "Shared drive or network folder not accessible" },
      { label: "VPN not connecting", value: "VPN not connecting" },
      { label: "IP conflict or DNS issues", value: "IP conflict or DNS issues" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Access & Account Issues",
    value: "Access & Account Issues",
    subcategories: [
      { label: "MFA issues/Reset", value: "MFA issues/Reset" },
      { label: "Password reset", value: "Password reset" },
      { label: "Account locked/disabled", value: "Account locked/disabled" },
      { label: "Email access problems", value: "Email access problems" },
      { label: "Shared mailbox or group access request", value: "Shared mailbox or group access request" },
      { label: "OneDrive access request", value: "OneDrive access request" },
      { label: "Access to tools (Jira, Confluence, Freshdesk, Zoho.)", value: "Access to tools (Jira, Confluence, Freshdesk, Zoho.)" },
      { label: "Role-based permission issues", value: "Role-based permission issues" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Request for Hardware/Software",
    value: "Request for Hardware/Software",
    subcategories: [
      { label: "New laptop/desktop request", value: "New laptop/desktop request" },
      { label: "Monitor/accessory request", value: "Monitor/accessory request" },
      { label: "Software installation or upgrade", value: "Software installation or upgrade" },
      { label: "License request (e.g., Adobe, MS Office)", value: "License request (e.g., Adobe, MS Office)" },
      { label: "Procurement of specialized tools", value: "Procurement of specialized tools" },
      { label: "Mobile device request", value: "Mobile device request" },
      { label: "SIM card request", value: "SIM card request" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "IT Asset Management",
    value: "IT Asset Management",
    subcategories: [
      { label: "Asset not tagged or missing", value: "Asset not tagged or missing" },
      { label: "Asset return or replacement", value: "Asset return or replacement" },
      { label: "Warranty claim follow-up", value: "Warranty claim follow-up" },
      { label: "Disposal of old hardware", value: "Disposal of old hardware" },
      { label: "Asset ownership change", value: "Asset ownership change" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Email & Communication",
    value: "Email & Communication",
    subcategories: [
      { label: "Email delivery failures", value: "Email delivery failures" },
      { label: "Mailbox quota issues", value: "Mailbox quota issues" },
      { label: "Shared mailbox creation", value: "Shared mailbox creation" },
      { label: "Distribution list issues", value: "Distribution list issues" },
      { label: "Outlook configuration problems", value: "Outlook configuration problems" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Security & Compliance",
    value: "Security & Compliance",
    subcategories: [
      { label: "Suspicious emails or phishing", value: "Suspicious emails or phishing" },
      { label: "Antivirus alerts", value: "Antivirus alerts" },
      { label: "Device encryption issues", value: "Device encryption issues" },
      { label: "ISO/IT policy non-compliance", value: "ISO/IT policy non-compliance" },
      { label: "DLP (Data Loss Prevention) alerts", value: "DLP (Data Loss Prevention) alerts" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Others / General Support",
    value: "Others / General Support",
    subcategories: [
      { label: "Printer setup", value: "Printer setup" },
      { label: "Zoom/Teams setup", value: "Zoom/Teams setup" },
      { label: "Request for training or documentation", value: "Request for training or documentation" },
      { label: "Office 365 user onboarding", value: "Office 365 user onboarding" },
      { label: "Backup or restore requests", value: "Backup or restore requests" },
      { label: "Others", value: "Others" },
    ],
  },
];

export const CategoryDropdown = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  error,
}: {
  categories: Category[];
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectCategory: (value: string) => void;
  onSelectSubcategory: (value: string) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-left border rounded-md text-sm font-gilroyMedium",
              error ? "border-destructive/80" : "border-[#E5E5E5]",
              !selectedCategory && "text-[#818EA1]"
            )}
          >
            {selectedCategory || "Select category"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="min-w-full max-h-64 overflow-auto border p-0" align="start">
          <div className="flex flex-col w-full">
            {categories.map((category) => (
              <div
                key={category.value}
                className="relative flex flex-col p-1"
                onMouseEnter={() => setHoveredCategory(category.value)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={cn(
                    "px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer flex justify-between items-center font-gilroyMedium w-full",
                    selectedCategory === category.value && "bg-gray-50 font-gilroyMedium",
                    hoveredCategory === category.value && "bg-gray-50 rounded-md"
                  )}
                  onClick={() => {
                    if (!category.subcategories || category.subcategories.length === 0) {
                      onSelectCategory(category.value);
                      setOpen(false);
                    }
                  }}
                >
                  {category.label}
                  {/* {category.subcategories && category.subcategories.length > 0 && (
                    <span className="text-xs text-gray-500">▼</span>
                  )} */}
                </div>
                
                {/* Subcategories dropdown - now appears below the category */}
                {hoveredCategory === category.value && category.subcategories && category.subcategories.length > 0 && (
                  <div className="flex flex-col pl-6 bg-white py-1">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.value}
                        className={cn(
                          "px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-sm font-gilroyMedium",
                          selectedSubcategory === subcategory.value && "bg-gray-100 font-gilroyMedium"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(category.value);
                          onSelectSubcategory(subcategory.value);
                          setOpen(false);
                        }}
                      >
                        {subcategory.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
};