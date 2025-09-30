import React from "react";

const QualityCheckModal = ({ qualityCheckDetails, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 w-full">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[80%] h-[75%]  overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-gilroyBold">Quality Check Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {qualityCheckDetails && qualityCheckDetails.length > 0 ? (
            qualityCheckDetails.map((detail, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-2 gap-4 h-[40%] overflow-auto">
                  {Object.entries(detail).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-gilroyMedium">{key}:</span>
                      <span className="font-gilroySemiBold">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No quality check details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityCheckModal;
