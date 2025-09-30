"use client";

import { useState, useEffect } from "react";

export default function InternetCheck() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkInternetConnection = () => navigator.onLine;

    const updateConnectionStatus = () => {
      setIsOnline(checkInternetConnection());
    };

    // Initial check
    updateConnectionStatus();

    // Event listeners for online/offline
    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="w-full  fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/media/offline.svg"
          alt="Offline"
          className="w-[1024px] h-full object-contain"
        />

        <button
          onClick={() => window.location.reload()}
          className=" px-6 bottom-20 absolute py-2 font-gilroySemiBold bg-black text-white rounded-lg "
        >
          Retry
        </button>
      </div>
    </div>
  );
}
