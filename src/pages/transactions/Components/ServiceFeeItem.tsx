import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ServiceFeeItemProps {
    id: string;
    name: string;
    price: string;
    details?: Array<{
        label: string;
        price: number;
    }>;
}

export const ServiceFeeItem: React.FC<ServiceFeeItemProps> = ({
    name,
    price,
    details = []
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasDetails = details.length > 0;

    return (
        <div className="flex flex-col">
            {/* Main Item */}
            <button
                className="flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                onClick={() => hasDetails && setIsExpanded(!isExpanded)}
                disabled={!hasDetails}
            >
                <div className="flex items-center gap-3">
                    <span className="text-base font-rubik font-medium text-title-black">
                        {name}
                    </span>
                    {hasDetails && (
                        <div className="ml-2">
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-body-grey" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-body-grey" />
                            )}
                        </div>
                    )}
                </div>
                <span className="text-base font-rubik font-medium text-title-black">
                    {price}
                </span>
            </button>

            {/* Expandable Details */}
            {hasDetails && isExpanded && (
                <div className="mx-4 mb-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-rubik font-medium text-body-grey mb-3">
                        Rincian Biaya:
                    </div>
                    <div className="space-y-2">
                        {details.map((detail) => (
                            <div
                                key={`${detail.label}-${detail.price}`}
                                className="flex justify-between items-center"
                            >
                                <span className="text-sm font-rubik text-body-grey">
                                    {detail.label}
                                </span>
                                <span className="text-sm font-rubik text-body-grey">
                                    {detail.price > 0 ? `+Rp ${detail.price.toLocaleString('id-ID')}` : 'Gratis'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};