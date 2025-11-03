import React from "react";

interface CardProps {
    children: React.ReactNode;
    /**
     * Optional additional class names to merge with base styles.
     */
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    const baseStyles =
        "p-3 rounded-3xl border border-body-grey/25 bg-white shadow-[0_4px_8px_0_rgba(128,128,128,0.16)]";

    return <div className={`${baseStyles} ${className}`}>{children}</div>;
}