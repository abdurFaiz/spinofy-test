import { ScreenWrapper } from "./layout/ScreenWrapper";
import MenuItem from "./MenuItem";
import type { Category } from "@/types/Product";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    activeCategory: string;
    onCategorySelect: (category: string) => void;
}


export default function BottomSheet({
    isOpen,
    onClose,
    categories,
    activeCategory,
    onCategorySelect }: BottomSheetProps) {
    if (!isOpen) return null;

    // Convert Category[] to string[] for MenuItem
    const categoryNames = categories.map(cat => cat.name);

    return (
        <ScreenWrapper>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <div
                        className="max-w-[440px] mx-auto fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-[fadeIn_0.3s_ease-out]"
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <div className="fixed inset-x-0 bottom-0 z-50 animate-[slideUp_0.3s_ease-out]">
                        <MenuItem
                            items={categoryNames}
                            onClose={onClose}
                            activeItem={activeCategory}
                            onItemSelect={onCategorySelect}
                        />
                    </div>
                </>
            )}
        </ScreenWrapper>
    );
}