import React from "react";
import type { TransactionStatus } from "@/types/Transaction";

interface TransactionProgressIndicatorProps {
  status: TransactionStatus;
}

export default function TransactionProgressIndicator({
  status,
}: TransactionProgressIndicatorProps) {
  const getStepStatus = (step: number) => {
    switch (status) {
      case "menunggu-konfirmasi":
        return step === 0 ? "active" : "inactive";
      case "dalam-proses":
        return step <= 1 ? "active" : step === 2 ? "current" : "inactive";
      case "selesai":
        return "active";
      case "dibatalkan":
      case "ditolak":
        return step === 0 ? "active" : "inactive";
      default:
        return "inactive";
    }
  };

  const getStepStyles = (stepStatus: string) => {
    switch (stepStatus) {
      case "active":
        return {
          circle: "bg-primary-orange",
          icon: "white",
          text: "text-title-black",
        };
      case "current":
        return {
          circle: "bg-yellow-500",
          icon: "white",
          text: "text-title-black",
        };
      case "inactive":
      default:
        return {
          circle: "bg-[#D0D0D0]",
          icon: "#999999",
          text: "text-gray-400",
        };
    }
  };

  const getConnectorStyles = (fromStep: number) => {
    const fromStatus = getStepStatus(fromStep);
    const toStatus = getStepStatus(fromStep + 1);

    if (
      fromStatus === "active" &&
      (toStatus === "active" || toStatus === "current")
    ) {
      return "bg-primary-orange";
    }
    return "bg-[#D0D0D0]";
  };

  const steps = [
    // {
    //   label:
    //     status === "menunggu-konfirmasi"
    //       ? "Menunggu Konfirmasi"
    //       : "Pesanan Diterima",
    //   icon:
    //     status === "menunggu-konfirmasi" ? (
    //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    //         <path
    //           d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //         />
    //       </svg>
    //     ) : (
    //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    //         <path
    //           d="M9 12l2 2 4-4"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //         />
    //       </svg>
    //     ),
    // },
    {
      label: "Pesanan Disiapkan",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Selesai",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const styles = getStepStyles(stepStatus);

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full ${styles.circle} flex items-center justify-center mb-2`}
                >
                  <div style={{ color: styles.icon }}>{step.icon}</div>
                </div>
                <p
                  className={`text-xs font-rubik font-medium text-center ${styles.text}`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${getConnectorStyles(index)} mx-2 mt-6`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
