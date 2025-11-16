import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rapha Lumina. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a 
              href="https://rapha-lumina1.odoo.com/contactus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
            <Link href="/privacy">
              <a className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/refund-policy">
              <a className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
