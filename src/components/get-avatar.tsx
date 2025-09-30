import React from "react";
import { generateAvatarFromName } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  size?: number; // e.g., 40 = 40px
  isDeviceAvatar?: boolean;
}

export const GetAvatar: React.FC<AvatarProps> = ({
  name,
  className = "",
  size = 40,
  isDeviceAvatar,
  ...props
}) => {
  const { initials, backgroundColor, textColor } = generateAvatarFromName(name);

  // Scale font size relative to avatar size but keep it reasonable
  const fontSize = Math.min(Math.max(size * 0.4, 12), 28);
  // 👆 at least 12px, at most 28px, scales in between

  return (
    <div
      className={`flex items-center justify-center rounded-full font-gilroyMedium flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: isDeviceAvatar ? "#9ca3af" : backgroundColor,
        color: isDeviceAvatar ? "#fff" : textColor,
        fontSize,
      }}
      {...props}
    >
      <span className="mt-0.5">{initials}</span>
    </div>
  );
};
