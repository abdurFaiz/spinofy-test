import React from "react";

interface ScreenWrapperProps {
    children: React.ReactNode;
    className?: string;
    minHeight?: string;
    maxWidth?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    className = "",
    minHeight = "768px",
    maxWidth = "440px",
}) => {
    return (
        <div
            className={`bg-white  flex flex-col ${className}`}
            style={{ minHeight }}
        >
            <div
                className="flex-1 border-r-2 border-l-2 shadow-2xs border-body-grey/10 flex flex-col mx-auto w-full"
                style={{ maxWidth }}
            >
                {children}
            </div>
        </div>
    );
};