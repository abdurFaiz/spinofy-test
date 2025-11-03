import { X } from "lucide-react";

export default function MenuItem({ items, onClose, activeItem, onItemSelect }: {
    items: string[],
    onClose: () => void,
    activeItem: string,
    onItemSelect: (item: string) => void
}) {
    const handleSelect = (item: string) => {
        onItemSelect(item);
        onClose();
    }; return (
        <div className="max-w-[440px] mx-auto z-[9999] bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-title-black">Pilih Menu</h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-primary-orange/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-body-grey" />
                </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all"
                    >
                        <span className="text-gray-700">{item}</span>
                        <div className={`w-5 h-5 rounded-full border-2 ${activeItem === item
                                ? 'border-primary-orange bg-primary-orange'
                                : 'border-gray-300'
                            }`}>
                            {activeItem === item && (
                                <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}