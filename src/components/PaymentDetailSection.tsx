export interface PaymentDetailItem {
    id: string;
    label: string;
    value: string;
    highlight?: boolean;
    isDiscount?: boolean;
    dashed?: boolean;
}


interface PaymentDetailSectionProps {
    title: string;
    items: PaymentDetailItem[];
}


export const PaymentDetailSection: React.FC<PaymentDetailSectionProps> = ({ title, items }) => {
    return (
        <div className="flex flex-col gap-4 py-4">
            {/* Header */}
            <div className="flex justify-between items-center px-4 pb-4 border-b border-body-grey/25">
                <h3 className="text-lg font-rubik font-medium capitalize">{title}</h3>
            </div>


            {/* Items */}
            <div className="flex flex-col">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`flex justify-between items-center px-4 py-3 ${item.dashed ? 'border-b border-dashed border-[#80808052]' : ''
                            }`}
                    >
                        <span
                            className={`text-base font-rubik font-medium capitalize ${item.highlight ? 'text-light-green' : 'text-body-grey'
                                }`}
                        >
                            {item.label}
                        </span>
                        <span
                            className={`text-base font-rubik font-medium ${item.highlight ? 'text-light-green' : item.label.toLowerCase().includes('total') ? 'text-title-black' : 'text-body-grey'
                                }`}
                        >
                            {item.isDiscount ? `- ${item.value}` : item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};