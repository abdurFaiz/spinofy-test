interface RecommendationProductContainerProps {
    children: React.ReactNode;
}

export const RecommendationProductContainer = ({ children }: RecommendationProductContainerProps) => {
    return (
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {children}
        </div>

    )
}