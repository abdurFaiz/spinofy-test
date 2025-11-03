import { useAuth } from "@/hooks/Auth/auth.hooks";

// Props are now optional since we get data from API
interface UserInfoProps {
  name?: string;
  phoneNumber?: string | number;
}

export default function UserInfo({ name, phoneNumber }: UserInfoProps = {}) {
  const { user, isLoadingProfile } = useAuth();

  // Use props if provided, otherwise use data from API
  const displayName = name || user?.name || "Unknown Name";
  const displayPhone = phoneNumber || user?.phone || "Unknown Phone Number";

  if (isLoadingProfile) {
    return (
      <div className="relative z-10">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-2 w-48"></div>
          <div className="h-6 bg-white/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <h1 className="text-white text-2xl font-medium mb-2">
        Hi, {displayName} 👋
      </h1>
      <p className="text-white text-base">
        {displayPhone}
      </p>
    </div>
  );
}
