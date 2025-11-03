import Button from "@/components/ui/button";

interface BottomAction {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "outline";
    size?: "sm" | "md" | "lg" | "xl";
}

interface BottomActionSectionProps {
    actions: BottomAction[];
}

export const BottomActionSection: React.FC<BottomActionSectionProps> = ({ actions }) => {
    return (
        <div className="mt-auto">
            <div className="flex items-center gap-5 px-4 py-6 bg-white rounded-t-3xl shadow-[0_-4px_8px_0_rgba(128,128,128,0.16)]">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        className="flex-1"
                        variant={action.variant}
                        onClick={action.onClick}
                        size={action.size}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};