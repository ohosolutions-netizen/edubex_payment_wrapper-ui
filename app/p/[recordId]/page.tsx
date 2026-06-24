import { redirect } from "next/navigation";
import { getPaymentSchedule } from "../../services/zoho";

type PageProps = {
  params: {
    recordId: string;
  };
};

export const dynamic = "force-dynamic";

export default async function PaymentGatePage({ params }: PageProps) {
  // const payment = await getPaymentSchedule(params.recordId);
  const resolvedParams = await params;

  console.log("Resolved params:", resolvedParams);
  console.log("recordId:", resolvedParams.recordId);

  const payment = await getPaymentSchedule(resolvedParams.recordId);

  if (payment.isPending) {
    if (!payment.formUrl) {
      throw new Error("Payment is pending, but the Zoho Form URL field is empty.");
    }

    redirect(payment.formUrl);
  }

  // return (
  //   <main className="shell">
  //     <section className="panel success">
  //       <h1>Your payment is already completed.</h1>
  //       <p>
  //         Thank you. No further payment action is required for this schedule.
  //       </p>
  //     </section>
  //   </main>
  // );
  return (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f6faf7",
      padding: "20px",
    }}
  >
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        background: "#ffffff",
        borderRadius: "32px",
        padding: "80px 60px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "32px",
          borderRadius: "50%",
          background: "#e8f8ed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "54px",
        }}
      >
        ✅
      </div>

      <div
        style={{
          display: "inline-block",
          background: "#e8f8ed",
          color: "#16a34a",
          padding: "12px 28px",
          borderRadius: "999px",
          fontSize: "16px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          marginBottom: "40px",
        }}
      >
        PAYMENT COMPLETED
      </div>

      <h1
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 24px",
          textAlign: "center",
        }}
      >
        Thank You!
      </h1>

      <p
        style={{
          fontSize: "22px",
          lineHeight: 1.8,
          color: "#6b7280",
          margin: 0,
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        Your payment has already been
        <br />
        completed successfully.
      </p>
    </div>
  </main>
);
}
