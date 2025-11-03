import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const Home = lazy(() => import("@/pages/home/Home"));
const OnboardApp = lazy(() => import("@/pages/onboards/Welocome"));
const Transactions = lazy(() => import("@/pages/transactions/Transactions"));
const Checkout = lazy(() => import("@/pages/payments/Checkout"));
const Payment = lazy(() => import("@/pages/payments/Payment"));
const Vouchers = lazy(() => import("@/pages/vouchers/Vouchers"));
const Account = lazy(() => import("@/pages/accounts/Account"));
const FormProfile = lazy(() => import("@/pages/accounts/Form/FormProfile"));
const DetailItem = lazy(() => import("@/pages/item/DetailItem"));
const DetailTransaction = lazy(
  () => import("@/pages/transactions/DetailTransaction"),
);
const SearchTransaction = lazy(
  () => import("@/pages/transactions/SearchTransaction"),
);
const RewardPoin = lazy(() => import("@/pages/poin/RewardPoin"));
const HistoryPoin = lazy(() => import("@/pages/poin/HistoryPoin"));
const HistoryVouchers = lazy(() => import("@/pages/vouchers/HistoryVouchers"));
const NotFound = lazy(() => import("@/NotFound"));
const FormWhatsapp = lazy(
  () => import("@/pages/accounts/Form/FormWhatsAppNumber"),
);
const VoucherCheckout = lazy(() => import("@/pages/payments/VoucherCheckout"));
const GoogleCallback = lazy(() => import("@/pages/auth/GoogleCallback"));
const FormEmail = lazy(() => import("@/pages/accounts/Form/FormEmail"));
const PaymentSuccess = lazy(() => import("@/pages/payments/PaymentSuccess"));

// Root component to handle authentication-based routing
const RootRedirect = () => {
  return React.createElement(Navigate, {
    to: "/onboard",
    replace: true
  });
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(RootRedirect, null),
  },
  {
    path: "/:outletSlug/home",
    element: React.createElement(Home, null),
  },
  {
    path: "/home",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/onboard",
    element: React.createElement(OnboardApp, null),
  },
  {
    path: "/:outletSlug/transactions",
    element: React.createElement(Transactions, null),
  },
  {
    path: "/transactions",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/:outletSlug/checkout",
    element: React.createElement(Checkout, null),
  },
  {
    path: "/:outletSlug/payment",
    element: React.createElement(Payment, null),
  },
  {
    path: "/:outletSlug/vouchers",
    element: React.createElement(Vouchers, null),
  },
  {
    path: "/:outletSlug/account",
    element: React.createElement(Account, null),
  },
  {
    path: "/checkout",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/payment",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/vouchers",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/account",
    element: React.createElement(Account, null),
  },
  {
    path: "/FormProfile",
    element: React.createElement(FormProfile, null),
  },
  {
    path: "/:outletSlug/DetailItem",
    element: React.createElement(DetailItem, null),
  },
  {
    path: "/DetailItem",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/:outletSlug/DetailTransaction",
    element: React.createElement(DetailTransaction, null),
  },
  {
    path: "/DetailTransaction",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/SearchTransaction",
    element: React.createElement(SearchTransaction, null),
  },
  {
    path: "/:outletSlug/RewardPoin",
    element: React.createElement(RewardPoin, null),
  },
  {
    path: "/:outletSlug/HistoryPoin",
    element: React.createElement(HistoryPoin, null),
  },
  {
    path: "/:outletSlug/HistoryVouchers",
    element: React.createElement(HistoryVouchers, null),
  },
  {
    path: "/RewardPoin",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/HistoryPoin",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/HistoryVouchers",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/FormWhatsapp",
    element: React.createElement(FormWhatsapp, null),
  },
  {
    path: "/FormEmail",
    element: React.createElement(FormEmail, null),
  },
  {
    path: "/:outletSlug/vouchercheckout",
    element: React.createElement(VoucherCheckout, null),
  },
  {
    path: "/vouchercheckout",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/auth/google/callback",
    element: React.createElement(GoogleCallback, null),
  },
  {
    path: "/webhook/google/callback",
    element: React.createElement(GoogleCallback, null),
  },
  {
    path: "/:outletSlug/payment-success",
    element: React.createElement(PaymentSuccess, null),
  },
  {
    path: "/payment-success",
    element: React.createElement(Navigate, { to: "/onboard", replace: true }),
  },
  {
    path: "/*",
    element: React.createElement(NotFound, null),
  },
  {
    path: "*",
    element: React.createElement(Navigate, { to: "/notfound", replace: true }),
  },
]);

export default router;
