"use client";
import { CombinedContainer } from "@/components/container/container";
import DeviceFlowLoader from "@/components/deviceFlowLoader";
import { QcReportResponse } from "@/server/checkMateActions";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons/core-free-icons";
import LoginKey from "./login-key";
import QcTable from "./qc-table";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

const EmployeeView = ({
  qcReports,
  downloadModal,
  setPagination,
  setDownloadModal,
  session,
  handleUniqueGeneration,
  handleViewReports,
  handleLoginKeyDone,
  loading,
  qualityData,
  downloadClicked,
  uniqueId,
  downloadRef,
  handleLinkClick,
}: {
  downloadModal: boolean;
  qcReports: QcReportResponse;
  setPagination: (pagination: any) => void;
  setDownloadModal: (isOpen: boolean) => void;
  session: number;
  handleUniqueGeneration: () => void;
  handleViewReports: () => void;
  handleLoginKeyDone: () => void;
  loading: boolean;
  qualityData: any;
  downloadClicked: boolean;
  uniqueId: string | null;
  downloadRef: React.RefObject<HTMLDivElement>;
  handleLinkClick: () => void;
}) => {
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center">
        {downloadClicked && (
          <div className="flex flex-col relative">
            <div
              className="flex  items-center py-1.5 gap-1.5  px-3 text-black font-gilroyMedium border rounded-md transition-all duration-300 cursor-pointer"
              onClick={() => setDownloadModal(!downloadModal)}
            >
              <HugeiconsIcon
                icon={Download04Icon}
                size={20}
                className="text-[#7F7F7F]"
              />{" "}
              <div>Download Software</div>
            </div>

            {downloadModal && (
              <div
                ref={downloadRef}
                className="border flex flex-col px-1 py-1 border-[#344054] bg-white rounded-2xl z-30 absolute gap-4 top-12"
              >
                <a
                  href="https://github.com/Harsh-winuall/QC-Release/releases/download/Windows/Check.Mate.Setup.5.0.0.exe"
                  className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-sm text-[#344054] font-gilroyMedium"
                  onClick={() => {
                    handleLinkClick();
                    setDownloadModal(false);
                  }}
                >
                  Windows
                </a>
                <a
                  href="https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.1-Apple-Silicone/CheckMate-5.0.1-arm64.dmg"
                  className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-nowrap text-sm text-[#344054] font-gilroyMedium"
                  onClick={() => {
                    handleLinkClick();
                    setDownloadModal(false);
                  }}
                >
                  Apple M Series
                </a>
                <a
                  href="https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.0-Apple/CheckMate-5.0.0.dmg"
                  className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-nowrap text-sm text-[#344054] font-gilroyMedium"
                  onClick={() => {
                    handleLinkClick();
                    setDownloadModal(false);
                  }}
                >
                  Apple Intel
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      {searchParams.get("showTable") ? (
        <QcTable
          data={qcReports}
          setPagination={setPagination}
          sessionRole={session}
        />
      ) : (
        <div
          className="rounded-lg  border border-[#F6F6F6] h-[66dvh] bg-[rgba(255,255,255,0.80)] backdrop-blur-[22.8px] pt-5 pb-2 flex flex-col gap-5 justify-center items-center"
          // onClick={() => setDownloadModal(false)}
        >
          {uniqueId ? (
            <LoginKey otpString={uniqueId} onDone={handleLoginKeyDone} />
          ) : (
            <>
              {loading ? (
                <CombinedContainer title="Diagnostics">
                  <div className="flex items-center justify-center h-full">
                    <DeviceFlowLoader />
                  </div>
                </CombinedContainer>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src="/media/analyze.webp"
                      width={200}
                      height={200}
                      alt="analyze-device"
                    />
                    <h1 className="text-3xl font-gilroySemiBold">
                      Analyze your device
                    </h1>
                    <p className="text-base text-[#4E4D4D] py-3 font-gilroyMedium">
                      Detailed insights & full specs of your laptop
                    </p>
                  </div>
                  {/* {JSON.stringify(downloadModal)} */}

                  {!downloadClicked && !loading && (
                    <>
                      <div className="relative w-full flex justify-center items-center">
                        <button
                          className="py-2 bg-black font-gilroySemiBold border hover:border hover:text-black duration-200 hover:border-black hover:bg-white text-white rounded-lg w-1/4 cursor-pointer"
                          onClick={() => {
                            setDownloadModal((prev: boolean) => !prev);
                            // handleUniqueGeneration();
                          }}
                        >
                          Download Software
                        </button>
                        {downloadModal && (
                          <div
                            ref={downloadRef}
                            className="border flex flex-col px-1 w-1/4 py-1 border-[#344054] bg-white rounded-2xl z-50 absolute gap-4 top-12"
                          >
                            <a
                              href="https://github.com/Harsh-winuall/QC-Release/releases/download/Windows/Check.Mate.Setup.5.0.0.exe"
                              className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-sm text-[#344054] font-gilroyMedium"
                              onClick={() => {
                                handleLinkClick();
                                setDownloadModal(false);
                              }}
                            >
                              Windows
                            </a>
                            <a
                              href="https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.1-Apple-Silicone/CheckMate-5.0.1-arm64.dmg"
                              className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-nowrap text-sm text-[#344054] font-gilroyMedium"
                              onClick={() => {
                                handleLinkClick();
                                setDownloadModal(false);
                              }}
                            >
                              Apple M Series
                            </a>
                            <a
                              href="https://github.com/Harsh-winuall/QC-Release/releases/download/5.0.0-Apple/CheckMate-5.0.0.dmg"
                              className="py-2 cursor-pointer px-11 w-full text-center hover:bg-gray-50 rounded-xl text-nowrap text-sm text-[#344054] font-gilroyMedium"
                              onClick={() => {
                                handleLinkClick();
                                setDownloadModal(false);
                              }}
                            >
                              Apple Intel
                            </a>
                          </div>
                        )}
                      </div>
                      {!loading && (
                    <>
                      {qualityData?.success ? (
                        <div className="flex w-1/4 gap-2">
                          <button
                            ref={buttonRef}
                            onClick={handleUniqueGeneration}
                            className="py-2 border hover:border hover:text-black duration-200 hover:border-black hover:bg-white text-white bg-black font-gilroySemiBold rounded-lg w-full cursor-pointer"
                          >
                            Generate UID
                          </button>
                        </div>
                      ) : (
                        <a
                          onClick={handleUniqueGeneration}
                          className="py-2 border hover:border hover:text-black duration-200 hover:border-black hover:bg-white text-white text-center bg-black font-gilroySemiBold rounded-lg w-1/4 cursor-pointer"
                        >
                          Generate UID
                        </a>
                      )}
                    </>
                  )}
                      <button
                        className="py-2 border duration-200 border-black bg-white  text-black font-gilroySemiBold rounded-lg w-1/4 cursor-pointer"
                        onClick={handleViewReports}
                      >
                        View Reports
                      </button>
                    </>
                  )}

                
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeView;
