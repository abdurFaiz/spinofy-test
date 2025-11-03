export interface OrderItemDetail {
    label: string;
    price: number;
}

export interface OrderItemProps {
    id: string;
    name: string;
    quantity: number;
    price: string;
    details?: OrderItemDetail[];
    basePrice?: number;
    totalPrice?: number;
}

import { useState } from "react";

export const OrderItem: React.FC<OrderItemProps> = ({
    name,
    quantity,
    price,
    details = [],
    totalPrice
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasDetails = details.length > 1; // Show dropdown if there are variants (more than just base product)

    const toggleExpanded = () => {
        if (hasDetails) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            {/* Main Item Row */}
            <button
                className={`w-full flex justify-between items-center px-4 py-3 text-left ${hasDetails ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}
                onClick={toggleExpanded}
                disabled={!hasDetails}
                type="button"
            >
                <div className="flex items-center gap-3">
                    <span className="text-base font-rubik font-medium text-body-grey">{quantity}x</span>
                    <span className="text-base font-rubik font-medium text-body-grey capitalize">{name}</span>
                    {hasDetails && (
                        <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>
                <span className="text-base font-rubik font-medium text-body-grey">{price}</span>
            </button>

            {/* Expandable Details */}
            {hasDetails && isExpanded && (
                <div className="px-4 pb-3 bg-gray-50">
                    <div className="pl-8 pr-4">
                        <div className="text-sm font-medium text-gray-600 mb-2">Rincian Item:</div>
                        {details.map((detail) => (
                            <div key={`${detail.label}-${detail.price}`} className="flex justify-between items-center py-1">
                                <span className="text-sm text-gray-600">{detail.label}</span>
                                <span className="text-sm text-gray-600">
                                    {detail.price > 0 && '+'}Rp {detail.price.toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-800">Subtotal ({quantity}x)</span>
                            <span className="text-sm font-medium text-gray-800">
                                Rp {(totalPrice || 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};