import { ShoppingBag, Coffee, Package } from 'lucide-react';

interface EmptyProductSectionProps {
    title: string;
    type?: string;
    message?: string;
}

const getIconAndMessage = (type: EmptyProductSectionProps['type']) => {
    switch (type) {
        case 'recommendations':
            return {
                icon: <ShoppingBag className="w-8 h-8 text-gray-400" />,
                message: 'No recommendations available at the moment'
            };
        case 'coffee':
            return {
                icon: <Coffee className="w-8 h-8 text-gray-400" />,
                message: 'No coffee products available'
            };
        case 'pastry':
            return {
                icon: <Package className="w-8 h-8 text-gray-400" />,
                message: 'No pastries available'
            };
        default:
            return {
                icon: <Package className="w-8 h-8 text-gray-400" />,
                message: 'No products available'
            };
    }
};

export default function EmptyProductSection({
    title,
    type = 'general',
    message
}: EmptyProductSectionProps) {
    const { icon, message: defaultMessage } = getIconAndMessage(type);
    const displayMessage = message || defaultMessage;

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {icon}
            <h3 className="text-lg font-medium text-gray-900 mt-3 mb-1">
                No {title}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
                {displayMessage}
            </p>
        </div>
    );
}