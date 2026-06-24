export default function HomePage() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Payment link is ready</p>
        <h1>Open this app from a Zoho CRM payment schedule link.</h1>
        <p>
          Use a URL like <code>/p/CRM_RECORD_ID</code>. The app will check the
          payment schedule status and route the customer to the correct page.
        </p>
      </section>
    </main>
  );
}
