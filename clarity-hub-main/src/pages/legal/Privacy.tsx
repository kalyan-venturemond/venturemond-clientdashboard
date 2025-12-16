import { LandingHeader } from "@/components/landing/LandingHeader";
import { FooterLinks } from "@/components/landing/FooterLinks";

export default function Privacy() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased text-foreground">
            <LandingHeader />
            <main className="flex-1 container mx-auto py-12 md:py-24 px-6 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">1. Overview</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to Venturemond. Venturemond (“we”, “our”, or “us”) operates a technology company that includes two divisions:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Venturemond Studio</strong> — A full-stack venture building and product execution division.</li>
                            <li><strong>Venturemond SaaS</strong> — A product division developing intelligent software products, including Venturemond Workspace.</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed">
                            This Privacy Policy explains how we collect, use, store, and protect your information when you interact with our website, products, or services. By visiting our website or submitting information through any of our forms, you agree to this Privacy Policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                        <p className="text-muted-foreground">We collect information in the following ways:</p>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">a. Information You Provide</h3>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Company or organization name</li>
                                <li>Project or product details</li>
                                <li>Optional info like budget, timelines, or preferences</li>
                            </ul>

                            <h3 className="text-xl font-semibold">b. Automatically Collected Data</h3>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Browser type and version</li>
                                <li>Device and operating system</li>
                                <li>IP address</li>
                                <li>Usage data and page visits</li>
                            </ul>

                            <h3 className="text-xl font-semibold">c. Cookies</h3>
                            <p className="text-muted-foreground">We use minimal cookies to improve functionality and understand usage. You can disable cookies via your browser.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Responding to your inquiries or submissions</li>
                            <li>Providing access to our products (like Venturemond Workspace)</li>
                            <li>Scheduling meetings or calls</li>
                            <li>Sending updates about our services, if you opt in</li>
                            <li>Improving our website and user experience</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">4. Data Storage and Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use appropriate security measures to protect your data from unauthorized access, alteration, or disclosure. Your data may be securely stored on servers managed by reputable providers (like Google Cloud, AWS, or Zoho) in compliance with applicable laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">5. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We retain your personal data only as long as necessary or as required by law. You may contact us at <a href="mailto:hello@venturemond.com" className="text-primary hover:underline">hello@venturemond.com</a> to request removal.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">6. Sharing of Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>With trusted partners working with Venturemond to execute your project</li>
                            <li>When required by law or regulation</li>
                            <li>To protect the safety, rights, or integrity of our users or services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">7. Your Rights</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Access, correct, or delete your personal data</li>
                            <li>Withdraw consent for data processing</li>
                            <li>Request a copy of your stored information</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">8. Third-Party Links</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our website or emails may contain links to third-party sites. We are not responsible for their privacy practices or content.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">9. Children’s Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Venturemond does not knowingly collect personal information from anyone under the age of 16. If you believe your child has provided information, contact us to remove it.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">10. Updates to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy periodically. Revisions will be posted with an updated “Last Updated” date.
                        </p>
                    </section>

                    <section className="rounded-xl border bg-card p-6 md:p-8 space-y-4">
                        <h2 className="text-2xl font-bold">11. Contact Us</h2>
                        <p className="text-muted-foreground">For any questions regarding this Privacy Policy, you can reach us at:</p>

                        <div className="space-y-2 text-muted-foreground">
                            <p className="font-semibold text-foreground">Venturemond</p>
                            <p>4th Floor, Bizness Square, Hitec City, Hyderabad – 500084</p>
                            <p>Email: <a href="mailto:hello@venturemond.com" className="text-primary hover:underline">hello@venturemond.com</a></p>
                            <p>LinkedIn: <a href="https://linkedin.com/company/venturemond" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Venturemond LinkedIn</a></p>
                        </div>
                    </section>

                </div>
            </main>
            <FooterLinks />
        </div>
    );
}
