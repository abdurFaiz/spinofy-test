import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { BottomNav } from "@/components/MenuBar";
import { Separator } from "@/components/Separator";
import { LogOut, ShoppingCart } from "lucide-react";
import ListItemLink from "./Components/ItemLink";
import { SubHeader } from "@/components/SubHeader";
import UserStatsCard from "./Components/UserStatsCard";
import UserInfoCard from "./Components/UserInfoCard";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/services/auth/auth.queries";

export default function Index() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Navigation will happen after successful logout
      navigate("/onboard");
    } catch (error) {
      // Even if logout fails, redirect to onboard
      // The mutation already handles clearing local state
      console.error("Logout error:", error);
      navigate("/onboard");
    }
  };

  return (
    <ScreenWrapper>
      {/* Header with gradient background */}
      <UserInfoCard />
      {/* Stats Cards */}
      <UserStatsCard
        stats={[
          {
            title: "Vouchers",
            value: 2,
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3.33366 3.33334C2.89163 3.33334 2.46771 3.50894 2.15515 3.8215C1.84259 4.13406 1.66699 4.55798 1.66699 5.00001V8.33334C2.10902 8.33334 2.53294 8.50894 2.8455 8.8215C3.15806 9.13406 3.33366 9.55798 3.33366 10C3.33366 10.442 3.15806 10.866 2.8455 11.1785C2.53294 11.4911 2.10902 11.6667 1.66699 11.6667V15C1.66699 15.442 1.84259 15.866 2.15515 16.1785C2.46771 16.4911 2.89163 16.6667 3.33366 16.6667H16.667C17.109 16.6667 17.5329 16.4911 17.8455 16.1785C18.1581 15.866 18.3337 15.442 18.3337 15V11.6667C17.8916 11.6667 17.4677 11.4911 17.1551 11.1785C16.8426 10.866 16.667 10.442 16.667 10C16.667 9.55798 16.8426 9.13406 17.1551 8.8215C17.4677 8.50894 17.8916 8.33334 18.3337 8.33334V5.00001C18.3337 4.55798 18.1581 4.13406 17.8455 3.8215C17.5329 3.50894 17.109 3.33334 16.667 3.33334H3.33366Z"
                  fill="#F35F0F"
                />
              </svg>
            ),
          },
          {
            title: "Point",
            value: "126 Poin",
            withBorder: true,
            icon: <img src="/icons/icon-poin.svg" alt="" className="size-5" />,
          },
          {
            title: "Transaksi",
            value: 2,
            icon: (
              <ShoppingCart
                className="w-6 h-6 text-brand-orange"
                strokeWidth={1.5}
              />
            ),
          },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Account Settings Section */}
        <div className="px-4 pb-6 flex-col flex gap-1">
          <SubHeader title="Pengaturan Akun" />
          <div className="flex flex-col gap-1">
            <ListItemLink label="Lihat Profil" href="/FormProfile" />
            <ListItemLink label="Ubah Nomor WhatsApp" href="/formwhatsapp" />
            <ListItemLink label="Email" href="/formemail" />
          </div>
        </div>

        <Separator />

        {/* Other Section */}
        <div className="px-4 py-6 flex-col flex gap-1">
          <SubHeader title="Lainnya" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between py-3 px-3">
              <span className="text-brand-gray text-base">Temukan Kami</span>
              <div className="flex items-center gap-2">
                {/* WhatsApp */}
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.001 2C17.524 2 22.001 6.477 22.001 12C22.001 17.523 17.524 22 12.001 22C10.2337 22.003 8.49757 21.5353 6.97099 20.645L2.00499 22L3.35699 17.032C2.46595 15.5049 1.99789 13.768 2.00099 12C2.00099 6.477 6.47799 2 12.001 2ZM8.59299 7.3L8.39299 7.308C8.26368 7.31691 8.13734 7.35087 8.02099 7.408C7.91257 7.46951 7.81355 7.5463 7.72699 7.636C7.60699 7.749 7.53899 7.847 7.46599 7.942C7.09611 8.4229 6.89696 9.01331 6.89999 9.62C6.90199 10.11 7.02999 10.587 7.22999 11.033C7.63899 11.935 8.31199 12.89 9.19999 13.775C9.41399 13.988 9.62399 14.202 9.84999 14.401C10.9534 15.3724 12.2683 16.073 13.69 16.447L14.258 16.534C14.443 16.544 14.628 16.53 14.814 16.521C15.1052 16.5056 15.3895 16.4268 15.647 16.29C15.7778 16.2223 15.9056 16.1489 16.03 16.07C16.03 16.07 16.0723 16.0413 16.155 15.98C16.29 15.88 16.373 15.809 16.485 15.692C16.569 15.6053 16.639 15.5047 16.695 15.39C16.773 15.227 16.851 14.916 16.883 14.657C16.907 14.459 16.9 14.351 16.897 14.284C16.893 14.177 16.804 14.066 16.707 14.019L16.125 13.758C16.125 13.758 15.255 13.379 14.723 13.137C14.6673 13.1128 14.6077 13.0989 14.547 13.096C14.4786 13.0888 14.4094 13.0965 14.3442 13.1184C14.279 13.1403 14.2192 13.176 14.169 13.223C14.164 13.221 14.097 13.278 13.374 14.154C13.3325 14.2098 13.2753 14.2519 13.2098 14.2751C13.1443 14.2982 13.0733 14.3013 13.006 14.284C12.9408 14.2666 12.877 14.2446 12.815 14.218C12.691 14.166 12.648 14.146 12.563 14.11C11.9889 13.8599 11.4574 13.5215 10.988 13.107C10.862 12.997 10.745 12.877 10.625 12.761C10.2316 12.3842 9.88874 11.958 9.60499 11.493L9.54599 11.398C9.50425 11.3338 9.47003 11.265 9.44399 11.193C9.40599 11.046 9.50499 10.928 9.50499 10.928C9.50499 10.928 9.74799 10.662 9.86099 10.518C9.97099 10.378 10.064 10.242 10.124 10.145C10.242 9.955 10.279 9.76 10.217 9.609C9.93699 8.925 9.64766 8.24467 9.34899 7.568C9.28999 7.434 9.11499 7.338 8.95599 7.319C8.90199 7.31233 8.84799 7.307 8.79399 7.303C8.65972 7.2953 8.52508 7.29664 8.39099 7.307L8.59299 7.3Z"
                      fill="#F35F0F"
                    />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.4444 2C17.9179 2 19.3309 2.58532 20.3728 3.62718C21.4147 4.66905 22 6.08213 22 7.55556V16.4444C22 17.9179 21.4147 19.3309 20.3728 20.3728C19.3309 21.4147 17.9179 22 16.4444 22H7.55556C6.08213 22 4.66905 21.4147 3.62718 20.3728C2.58532 19.3309 2 17.9179 2 16.4444V7.55556C2 6.08213 2.58532 4.66905 3.62718 3.62718C4.66905 2.58532 6.08213 2 7.55556 2H16.4444ZM12 7.55556C10.8213 7.55556 9.6908 8.02381 8.8573 8.8573C8.02381 9.6908 7.55556 10.8213 7.55556 12C7.55556 13.1787 8.02381 14.3092 8.8573 15.1427C9.6908 15.9762 10.8213 16.4444 12 16.4444C13.1787 16.4444 14.3092 15.9762 15.1427 15.1427C15.9762 14.3092 16.4444 13.1787 16.4444 12C16.4444 10.8213 15.9762 9.6908 15.1427 8.8573C14.3092 8.02381 13.1787 7.55556 12 7.55556ZM12 9.77778C12.5894 9.77778 13.1546 10.0119 13.5713 10.4287C13.9881 10.8454 14.2222 11.4106 14.2222 12C14.2222 12.5894 13.9881 13.1546 13.5713 13.5713C13.1546 13.9881 12.5894 14.2222 12 14.2222C11.4106 14.2222 10.8454 13.9881 10.4287 13.5713C10.0119 13.1546 9.77778 12.5894 9.77778 12C9.77778 11.4106 10.0119 10.8454 10.4287 10.4287C10.8454 10.0119 11.4106 9.77778 12 9.77778ZM17 5.88889C16.7053 5.88889 16.4227 6.00595 16.2143 6.21433C16.006 6.4227 15.8889 6.70532 15.8889 7C15.8889 7.29469 16.006 7.5773 16.2143 7.78567C16.4227 7.99405 16.7053 8.11111 17 8.11111C17.2947 8.11111 17.5773 7.99405 17.7857 7.78567C17.9941 7.5773 18.1111 7.29469 18.1111 7C18.1111 6.70532 17.9941 6.4227 17.7857 6.21433C17.5773 6.00595 17.2947 5.88889 17 5.88889Z"
                      fill="#F35F0F"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.63636 2C4.67194 2 3.74702 2.38312 3.06507 3.06507C2.38312 3.74702 2 4.67194 2 5.63636V18.3636C2 19.3281 2.38312 20.253 3.06507 20.9349C3.74702 21.6169 4.67194 22 5.63636 22H18.3636C19.3281 22 20.253 21.6169 20.9349 20.9349C21.6169 20.253 22 19.3281 22 18.3636V5.63636C22 4.67194 21.6169 3.74702 20.9349 3.06507C20.253 2.38312 19.3281 2 18.3636 2H5.63636ZM12.3091 5.18182H14.4791C14.4791 6.63636 15.7082 8.28182 17.5791 8.28182V10.4509C16.2909 10.3618 15.19 10.1509 14.4791 9.52091V15.0991C14.4791 16.6491 13.2536 18.8182 10.4509 18.8182C7.02727 18.8182 6.42182 15.7182 6.42182 14.7891C6.42182 13.86 6.96727 10.76 10.76 10.76V12.93C9.76818 12.72 8.59091 13.5491 8.59091 14.7891C8.59091 16.3391 9.52091 16.6491 10.4509 16.6491C11.3809 16.6491 12.31 15.7191 12.31 14.7891L12.3091 5.18182Z"
                      fill="#F35F0F"
                    />
                  </svg>
                </a>

                {/* X/Twitter */}
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.63636 2C4.67194 2 3.74702 2.38312 3.06507 3.06507C2.38312 3.74702 2 4.67194 2 5.63636V18.3636C2 19.3281 2.38312 20.253 3.06507 20.9349C3.74702 21.6169 4.67194 22 5.63636 22H18.3636C19.3281 22 20.253 21.6169 20.9349 20.9349C21.6169 20.253 22 19.3281 22 18.3636V5.63636C22 4.67194 21.6169 3.74702 20.9349 3.06507C20.253 2.38312 19.3281 2 18.3636 2H5.63636ZM5.33273 5.18182C5.23321 5.2188 5.14371 5.27851 5.07134 5.3562C4.99898 5.43388 4.94575 5.52739 4.91591 5.62928C4.88607 5.73117 4.88043 5.83861 4.89945 5.94306C4.91847 6.04751 4.96162 6.14608 5.02545 6.23091L10.1291 13.0036L4.75182 18.7718L4.71182 18.8182H6.57273L10.9636 14.11L14.3382 18.59C14.4165 18.6937 14.5228 18.7729 14.6445 18.8182H18.6645C18.7639 18.781 18.8532 18.7211 18.9254 18.6434C18.9976 18.5656 19.0506 18.4721 19.0802 18.3702C19.1099 18.2683 19.1154 18.161 19.0962 18.0566C19.0771 17.9522 19.0339 17.8538 18.97 17.7691L13.8664 10.9964L19.2882 5.18182H17.4245L13.0336 9.89091L9.65727 5.41091C9.57911 5.30687 9.4728 5.22738 9.35091 5.18182H5.33273ZM15.2236 17.4982L6.93727 6.50182H8.77273L17.0582 17.4973L15.2236 17.4982Z"
                      fill="#F35F0F"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <ListItemLink label="Syarat & Ketentuan" href="/about" />
            <ListItemLink label="Kebijakan Privasi" href="/about" />
          </div>
        </div>

        <Separator />

        {/* Logout */}
        <div className="px-4 pb-6 mb-20">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex cursor-pointer items-center justify-between w-full py-3 px-3 hover:bg-ligh-red rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-dark-red text-base font-medium">
              {logoutMutation.isPending ? "Keluar..." : "Keluar"}
            </span>
            {logoutMutation.isPending ? (
              <div className="w-6 h-6 border-2 border-dark-red border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut className="w-6 h-6 text-dark-red" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
