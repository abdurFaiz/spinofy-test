interface SubHeaderProps {
    title: string;
    totalItems?: number;
    link?: string;
}
export const SubHeader: React.FC<SubHeaderProps> = ({ title, totalItems, link }) => {
    return (
        <div className="flex justify-between items-center px-4 pb-4 border-b border-body-grey/25">
            <h3 className="text-lg font-rubik font-medium capitalize">{title}</h3>
            {totalItems && <p className="text-sm font-rubik capitalize">{totalItems} Item</p>}
            {link && <button className="cursor-pointer text-xs text-primary-orange capitalize">{link}</button>}
        </div>
    );
};