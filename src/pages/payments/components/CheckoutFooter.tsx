import Button from "@/components/ui/button";

interface CheckoutFooterProps {
    summary: {
        total: number;
        originalTotal: number;
        savings: number;
    };
    onSubmit: () => void;
}

export function CheckoutFooter({ summary, onSubmit }: CheckoutFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-[440px] z-50 mx-auto w-full flex flex-col rounded-t-3xl bg-white shadow-[0_-4px_8px_0_rgba(128,128,128,0.20)]">
            <div className="px-4 pt-6 pb-6 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 w-[181px]">
                        <h3 className="text-base font-rubik font-medium capitalize">Total</h3>
                        <p className="text-xs font-rubik text-light-green capitalize">Yeay!, kamu hemat Rp {summary.savings.toLocaleString('id-ID')} </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end w-[91px]">
                        <span className="text-base font-rubik font-medium capitalize">Rp {summary.total.toLocaleString('id-ID')}</span>
                        <span className="text-sm font-rubik text-body-grey line-through capitalize">Rp {summary.originalTotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Button variant={"primary"} size={"xl"} className="w-full" onClick={onSubmit}>
                    Pesan Sekarang
                </Button>
            </div>
        </div>
    );
}