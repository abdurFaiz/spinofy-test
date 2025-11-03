import { useNavigate } from "react-router-dom";
import { useOutletSlug } from "@/hooks/useOutletSlug";

/**
 * Navigation utility hook that provides outlet-aware navigation functions
 */
export const useOutletNavigation = () => {
    const navigate = useNavigate();
    const outletSlug = useOutletSlug();

    const navigateToHome = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/home`);
        } else {
            navigate('/onboard'); // Redirect to onboard if no outlet slug
        }
    };

    const navigateToCheckout = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/checkout`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToVouchers = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/vouchers`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToRewardPoin = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/RewardPoin`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToHistoryPoin = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/HistoryPoin`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToHistoryVouchers = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/HistoryVouchers`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToDetailItem = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/DetailItem`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToPayment = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/payment`);
        } else {
            navigate('/onboard');
        }
    };
    const navigateToAccount = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/account`);
        } else {
            navigate('/onboard');
        }
    };

    const navigateToVoucherCheckout = () => {
        if (outletSlug) {
            navigate(`/${outletSlug}/vouchercheckout`);
        } else {
            navigate('/onboard');
        }
    };

    // Generic navigation with outlet slug
    const navigateWithOutlet = (path: string) => {
        if (outletSlug) {
            navigate(`/${outletSlug}${path}`);
        } else {
            navigate('/onboard');
        }
    };

    return {
        navigateToHome,
        navigateToCheckout,
        navigateToVouchers,
        navigateToRewardPoin,
        navigateToHistoryPoin,
        navigateToHistoryVouchers,
        navigateToDetailItem,
        navigateToPayment,
        navigateToVoucherCheckout,
        navigateWithOutlet,
        navigateToAccount,
        outletSlug, // Expose outlet slug for custom usage
    };
};