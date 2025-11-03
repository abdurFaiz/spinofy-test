import UserInfo from "./UserInfo";

export default function UserInfoCard() {
  return (
    <header className="relative bg-gradient-to-r from-dark-yellow to-primary-orange px-4 pt-11 pb-11 rounded-b-[24px] overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0             size-full opacity-55">
        <img src="/icons/beans-bg-2.svg" alt="" />
      </div>
      <div className="absolute left-[330px] bottom-0 size-full opacity-55">
        <img src="/icons/beans-bg-1.svg" alt="" />
      </div>

      {/* Header content */}
      <UserInfo />
    </header>
  );
}