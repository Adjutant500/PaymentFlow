import { useRouter } from "next/router";
import Head from "next/head";
import PaymentForm from "../../components/PaymentForm";
import VerifyPayment from "../../components/VerifyPayment";
import SseDegradedBanner from "../../components/SseDegradedBanner";
import { SkeletonDetailCard, SkeletonBlock } from "../../components/Skeleton";
import { usePaymentEvents } from "../../hooks/usePaymentEvents";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { useAdminAuthContext } from "../../hooks/AdminAuthContext";
import { useTranslation } from "react-i18next";

// #1344 — shareable, bookmarkable payment status URL. Pre-fills the student
// lookup from the route param instead of requiring manual re-entry.
export default function PayFeesForStudent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { studentId } = router.query;
  const { degraded, connectionStatus } = usePaymentEvents();
  // Track network connectivity to disable mutation actions while offline (Issue #269).
  const { isOnline } = useOnlineStatus();

  // Show skeleton while the router is hydrating and studentId isn't available yet.
  if (!router.isReady) {
    return (
      <>
        <Head><title>{t("nav.payFees")} | {t("app.name")}</title></Head>
        <div
          className="payfees-page"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={t("actions.loading")}
        >
          <div className="payfees-header">
            <SkeletonBlock width={120} height={22} style={{ margin: "0 auto 0.75rem" }} />
            <SkeletonBlock width={280} height={36} style={{ margin: "0 auto 0.75rem" }} />
            <SkeletonBlock width={220} height={16} style={{ margin: "0 auto" }} />
          </div>
          <div className="payfees-grid">
            <SkeletonDetailCard rows={5} />
            <SkeletonDetailCard rows={3} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>{t("nav.payFees")} | {t("app.name")}</title></Head>
      <SseDegradedBanner degraded={degraded} connectionStatus={connectionStatus} />

      <div className="payfees-page">
        <div className="payfees-header">
          <span className="payfees-badge">
            <span className="payfees-badge-dot" />
            {t("payFees.liveOnStellar")}
          </span>
          <h1>{t("payFees.heroTitle")}</h1>
          <p>{t("payFees.studentHeroDesc")}</p>
        </div>

        <div className="payfees-grid">
          {typeof studentId === "string" && <PaymentForm initialStudentId={studentId} disabled={!isOnline} />}
          <VerifyPayment disabled={!isOnline} />
        </div>
      </div>
    </>
  );
}
