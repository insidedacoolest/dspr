import CheckoutForm from "../../../components/CheckoutForm";
import PageHead from "../../../components/PageHead";
import { getSettings } from "../../../lib/settings";
import { shippingRules } from "../../../lib/shipping";
import { paypalClientId, paypalConfigured } from "../../../lib/paypal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHead crumb="Shop / Checkout" eyebrow="Secure checkout" title="Final" outline="lap" />
      <section className="sec">
        <div className="wrap">
          <CheckoutForm
            note={s.checkoutNote}
            shippingNote={s.shippingNote}
            rules={shippingRules(s)}
            paypalClientId={paypalConfigured() ? paypalClientId() : ""}
            devSimulate={process.env.NODE_ENV !== "production"}
          />
        </div>
      </section>
    </>
  );
}
