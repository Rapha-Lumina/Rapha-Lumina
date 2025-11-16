import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-display text-foreground">Privacy Policy</h1>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                When you create an account and use Rapha Lumina, we collect and store the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Email address</strong> (provided by your login method)</li>
                <li><strong>Name</strong> (first and last name, if available from your OAuth provider)</li>
                <li><strong>Profile picture</strong> (URL from your OAuth provider)</li>
                <li><strong>Unique user identifier</strong> (stable ID from Replit authentication)</li>
                <li><strong>Conversation history</strong> (all messages exchanged with Rapha Lumina)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Authenticate you and maintain your session</li>
                <li>Provide personalized spiritual guidance through conversation memory</li>
                <li>Display your profile information in the app interface</li>
                <li>Improve our AI's responses based on conversation context</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Storage & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your data is stored securely in a PostgreSQL database hosted on Neon (serverless database provider).
                We use industry-standard security practices including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted database connections (SSL/TLS)</li>
                <li>Secure session management with httpOnly cookies</li>
                <li>OAuth authentication through Replit (no passwords stored)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>We use the following third-party services to provide our application:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Anthropic (Claude AI)</strong> - Processes your messages to generate responses</li>
                <li><strong>Neon (Database)</strong> - Hosts your user data and conversation history</li>
                <li><strong>Replit (Authentication)</strong> - Manages secure login via OAuth</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies and we recommend reviewing them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Request deletion of your account and data</li>
                <li>Export your conversation history</li>
                <li>Opt out of data collection by not creating an account</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact the application administrator.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                We retain your account information and conversation history for as long as your account is active.
                If you request account deletion, we will remove your data from our systems within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                We may update this privacy policy from time to time. We will notify users of significant changes
                through the application interface.
              </p>
              <p className="mt-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
