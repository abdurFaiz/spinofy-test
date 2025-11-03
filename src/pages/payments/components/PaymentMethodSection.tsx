import { Check } from "lucide-react";

const QrisIcon = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path d="M0 0V11.7692H11.7692V0H0ZM14.3846 0V2.61538H17V0H14.3846ZM17 2.61538V5.23077H14.3846V10.4615H17V7.84615H19.6154V2.61538H17ZM17 10.4615V14.3846H5.23077V17H2.61538V19.6154H7.84615V17H10.4615V19.6154H17V17H19.6154V19.6154H23.5385V17H26.1538V14.3846H19.6154V10.4615H17ZM26.1538 17V19.6154H34V17H31.3846V14.3846H28.7692V17H26.1538ZM2.61538 17V14.3846H0V17H2.61538ZM22.2308 0V11.7692H34V0H22.2308ZM2.61538 2.61538H9.15385V9.15385H2.61538V2.61538ZM24.8462 2.61538H31.3846V9.15385H24.8462V2.61538ZM3.92308 3.92308V7.84615H7.84615V3.92308H3.92308ZM26.1538 3.92308V7.84615H30.0769V3.92308H26.1538ZM14.3846 20.9231V23.5385H17V20.9231H14.3846ZM17 23.5385V26.1538H14.3846V31.3846H17V28.7692H22.2308V26.1538H24.8462V23.5385H27.4615V26.1538H24.8462V28.7692H22.2308V34H24.8462V31.3846H27.4615V28.7692H28.7692V31.3846H27.4615V34H30.0769V31.3846H31.3846V28.7692H34V23.5385H31.3846V20.9231H22.2308V23.5385H17ZM31.3846 31.3846V34H34V31.3846H31.3846ZM17 31.3846V34H19.6154V31.3846H17ZM0 22.2308V34H11.7692V22.2308H0ZM2.61538 24.8462H9.15385V31.3846H2.61538V24.8462ZM3.92308 26.1538V30.0769H7.84615V26.1538H3.92308Z" fill="black" />
    </svg>
);

interface PaymentMethodSectionProps {
    selectedMethod: string;
    onSelectMethod: (methodId: string) => void;
}

export function PaymentMethodSection({ selectedMethod, onSelectMethod }: PaymentMethodSectionProps) {
    const methods = [
        { id: "qris", name: "QRIS", icon: <QrisIcon /> },
        // { id: "gopay", name: "GoPay", icon: <GoPayIcon /> },
    ];

    return (
        <div className="px-4 pb-4 flex flex-col gap-4">
            <h2 className="text-lg font-rubik font-medium capitalize">Metode Pembayaran</h2>
            {methods.map((method) => (
                <div
                    key={method.id}
                    onClick={() => onSelectMethod(method.id)}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        {method.icon}
                        <span className="text-base font-rubik font-medium capitalize">{method.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full  border-[1.5px] ${selectedMethod === method.id ? 'border-primary-orange bg-primary-orange' : 'border-black'}`}>
                        <Check className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                </div>
            ))}
        </div>
    );
}