import { Navigation } from "@/components/Navigation";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Refund and Cancellation Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-muted-foreground mb-8">
            <strong>Rapha Lumina (Pty) Ltd</strong><br />
            Last Updated: November 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Digital Products</h2>
            <p>
              All digital products (e-books, courses, guided meditations, workbooks) are <strong>non-refundable</strong> once accessed or downloaded, as per standard digital goods policy.
            </p>
            <p>
              <strong>Exception:</strong> If you experience technical issues preventing access to your purchase, contact us within 7 days at{" "}
              <a href="mailto:support@raphalumina.com" className="text-primary hover:underline">
                support@raphalumina.com
              </a>{" "}
              and we'll resolve it or issue a refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription Services</h2>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">Free Tier</h3>
            <ul>
              <li>No charges apply</li>
              <li>Cancel anytime through your account settings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6">Premium & Transformation Tiers</h3>
            
            <h4 className="text-lg font-semibold mb-2 mt-4">Cancellation:</h4>
            <ul>
              <li>Cancel anytime through your account settings or by emailing support@raphalumina.com</li>
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You retain access until the paid period ends</li>
              <li>No partial refunds for unused time in the current billing period</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2 mt-4">Refund Eligibility:</h4>
            <ul>
              <li>First-time subscribers: Full refund if requested within 7 days of initial charge</li>
              <li>Subsequent renewals: No refunds (cancel before renewal date to avoid charges)</li>
              <li>Technical issues preventing service access: Full refund if unresolved within 48 hours</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2 mt-4">How to Cancel:</h4>
            <ol>
              <li>Log into your account at raphalumina.com</li>
              <li>Go to Settings → Subscription</li>
              <li>Click "Cancel Subscription"</li>
              <li>OR email support@raphalumina.com with "Cancel Subscription" in the subject line</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Coaching Sessions</h2>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">1-on-1 Coaching</h3>
            <ul>
              <li><strong>Cancellation:</strong> Free cancellation up to 24 hours before scheduled session</li>
              <li><strong>Late cancellation</strong> (less than 24 hours): Session fee forfeited</li>
              <li><strong>No-show:</strong> Full session fee charged</li>
              <li><strong>Refunds:</strong> Available if you're unsatisfied after your first session only</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6">Coaching Packages (Multi-session)</h3>
            <ul>
              <li>Unused sessions refundable within 30 days of purchase</li>
              <li>After 30 days: No refunds, but sessions can be rescheduled within 6 months</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
            <ul>
              <li>Refunds processed within 5-7 business days</li>
              <li>Funds appear in your account within 10-14 business days depending on your bank</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>Questions about refunds or cancellations:</p>
            <p>
              📧 <a href="mailto:support@raphalumina.com" className="text-primary hover:underline">support@raphalumina.com</a><br />
              ⏰ Response within 24-48 hours
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fair Use</h2>
            <p>
              We reserve the right to refuse refunds for suspected abuse or violation of our Terms of Service.
            </p>
          </section>

          <hr className="my-8" />

          <p className="text-sm text-muted-foreground italic">
            This policy complies with South African Consumer Protection Act and international digital commerce standards.
          </p>
        </div>
      </main>
    </div>
  );
}
