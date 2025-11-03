import React from "react";

interface TransactionHeaderProps {
    title: string; 
    dateTime: string; 
    transactionInfo: string;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
    title,
    dateTime,
    transactionInfo,
}) => {
    return (
        <div className="flex justify-between items-center px-4 py-4">
            <h2 className="text-lg font-rubik font-medium capitalize">{title}</h2>
            <div className="flex flex-col items-end gap-2">
                <p className="text-xs font-rubik text-body-grey text-right">
                    {dateTime}
                </p>
                <p className="text-xs font-rubik text-body-grey">
                    {transactionInfo}
                </p>
            </div>
        </div>
    );
};
