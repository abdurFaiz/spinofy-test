import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import OutletAPI from "@/api/outlet.api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface OutletSelectionProps {
    onOutletSelect?: (outletSlug: string) => void;
}

export const OutletSelection: React.FC<OutletSelectionProps> = ({ onOutletSelect }) => {
    const navigate = useNavigate();

    const {
        data: outletsResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ['outlets-selection'],
        queryFn: () => OutletAPI.getListOutlets(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    const handleOutletSelect = (outletSlug: string) => {
        if (onOutletSelect) {
            onOutletSelect(outletSlug);
        } else {
            navigate(`/${outletSlug}/home`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner />
                <p className="mt-4 text-body-grey">Loading outlets...</p>
            </div>
        );
    }

    if (error || !outletsResponse?.data?.outlets?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-red-500 text-center">
                    {error ? "Failed to load outlets" : "No outlets available"}
                </p>
                <button
                    onClick={() => globalThis.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary-orange text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-title-black mb-2">
                    Choose Outlet
                </h2>
                <p className="text-body-grey text-sm">
                    Select an outlet to start ordering
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {outletsResponse.data.outlets.map((outlet) => (
                    <button
                        key={outlet.id}
                        onClick={() => handleOutletSelect(outlet.slug)}
                        className="w-full p-4 bg-white border-2 border-gray-200 rounded-[16px] hover:border-primary-orange transition-colors text-left"
                    >
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-title-black">
                                {outlet.name}
                            </h3>
                            {outlet.address && (
                                <p className="text-sm text-body-grey">
                                    {outlet.address}
                                </p>
                            )}
                            {outlet.phone && (
                                <p className="text-xs text-body-grey">
                                    📞 {outlet.phone}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};