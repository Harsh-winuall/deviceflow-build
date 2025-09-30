import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="flex justify-center items-center w-full">
      <div className="flex flex-col w-[87%] sm:w-4/5  ">
        <div className="flex flex-col text-center gap-8 py-4 sm:py-14 border-b">
          <h3 className="text-3xl sm:text-5xltext-2xl sm:text-5xl font-gilroySemiBold">
            Privacy Policy
          </h3>
          <p className="font-gilroySemiBold text-lg sm:text-xl">
            Welcome to Deviceflow. We respect your privacy and are committed to
            protecting the personal and organizational data you provide us. This
            Privacy Policy outlines how we collect, use, disclose, and safeguard
            your information when you use our platform and services.
          </p>
        </div>

        <div className="flex flex-col gap-8 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Who We Are
          </h3>

          <p className="font-gilroyRegular  text-base sm:text-lg">
            Deviceflow is a platform designed to help organizations manage IT
            assets, workflows, subscriptions, and user permissions. This policy
            applies to all users of our web application and services.
          </p>
        </div>

        <div className="flex flex-col gap-8 ">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            What Information We Collect
          </h3>

          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We collect the following types of data:
            </p>
            <div>
              <p className="font-gilroySemiBold  text-base sm:text-lg">
                Personal Information
              </p>
              <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number (optional)</li>
                <li>User Profile Data</li>
              </ul>
            </div>

            <div>
              <p className="font-gilroySemiBold  text-base sm:text-lg">
                Organization & Billing Info
              </p>
              <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
                <li>Company Name</li>
                <li>GST or Tax ID (if applicable)</li>
                <li>Billing Address</li>
                <li>
                  Payment method (processed via third-party providers; we don’t
                  store full card details)
                </li>
              </ul>
            </div>

            <div>
              <p className="font-gilroySemiBold  text-base sm:text-lg">
                Usage & System Data
              </p>
              <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
                <li>Device and browser info</li>
                <li>IP address</li>
                <li>Login timestamps</li>
                <li>
                  Actions performed on the platform (e.g., plan upgrades, asset
                  updates)
                </li>
              </ul>
            </div>

            <div>
              <p className="font-gilroySemiBold  text-base sm:text-lg">
                Communication
              </p>
              <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
                <li>Support conversations</li>
                <li>Feedback or survey responses</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Limited Use of Google User Data
          </h3>
          <p className="font-gilroyRegular  text-base sm:text-lg">
            Deviceflow's use of information received from Google APIs will
            adhere to the
            &nbsp;
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {" "}
              Google API Services User Data Policy{" "}
            </a>
            , including the &nbsp;
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Limited Use requirements
            </a>
            .
          </p>
          <p className="font-gilroyRegular  text-base sm:text-lg">
            We affirm that our use of Google user data complies with the Limited
            Use requirements.
          </p>
          <p className="font-gilroyRegular  text-base sm:text-lg">
            Specifically:
            <ul style={{ marginLeft: "1.5em", listStyleType: "disc" }}>
              <li>
                We only use Google Workspace data to provide or improve
                user-facing features that are clearly displayed and necessary
                for our app's core functionality.
              </li>
              <li>
                We do <strong>not</strong> use this data for advertising
                purposes.
              </li>
              <li>
                We do <strong>not</strong> transfer or sell Google user data to
                third parties.
              </li>
              <li>
                We do <strong>not</strong> allow human access to Google user
                data unless explicitly permitted by the user, required for
                security, legal reasons, or as part of our operational support.
              </li>
            </ul>
          </p>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            How We Use Your Information
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We use your data to:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Provide and improve our services</li>
              <li>Manage billing and subscriptions</li>
              <li>Communicate updates and alerts</li>
              <li>Ensure platform security</li>
              <li>Generate usage analytics (anonymized)</li>
              <li>Comply with legal and financial obligations</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            How We Share Your Information
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We do not sell your personal information.
            </p>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We may share data with:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Payment processors (e.g., Stripe)</li>
              <li>Cloud infrastructure partners (e.g., AWS)</li>
              <li>Analytics and crash reporting tools</li>
              <li>Legal authorities if required by law</li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              All third-party services are contractually obligated to protect
              your data.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Data Security
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Role-based access controls</li>
              <li>2FA for admin-level users</li>
              <li>Regular audits and vulnerability checks</li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              However, no online system is 100% secure — we encourage users to
              maintain strong passwords and follow security best practices.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Data Retention
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              User account data is retained as long as the account is active.
            </li>
            <li>
              Invoices and billing records are retained for legal compliance.
            </li>
            <li>
              Users may request deletion of their data after account
              cancellation.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Your Rights
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Access the personal data we hold about you</li>
              <li>Correct or update your information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              To exercise any of these rights, contact us at:{" "}
              <Link
                prefetch={false}
                className="hover:underline font-gilroySemiBold"
                href="mailto:contact@edify.club"
              >
                contact@edify.club
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Cookies and Tracking
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We use essential cookies for:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Session management</li>
              <li>Security</li>
              <li>Remembering preferences</li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We also use optional analytics cookies (e.g., Google Analytics).
              You may opt out of non-essential tracking via your browser
              settings.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Children’s Privacy
          </h3>

          <p className="font-gilroyRegular  text-base sm:text-lg">
            Deviceflow is not intended for use by individuals under 16. We do
            not knowingly collect personal data from children.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Changes to This Policy
          </h3>

          <p className="font-gilroyRegular  text-base sm:text-lg">
            We may update this Privacy Policy from time to time. We’ll notify
            users of significant changes by email or in-app notices. Continued
            use of the platform implies acceptance of the revised policy.
          </p>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Contact Us
          </h3>
          <p className="font-gilroyRegular text-base sm:text-lg">
            For any privacy-related concerns, please contact us:
          </p>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              Email:{" "}
              <Link
                prefetch={false}
                className="hover:underline font-gilroySemiBold"
                href="mailto:contact@edify.club"
              >
                contact@edify.club
              </Link>
            </li>
            <li>
              Phone:{" "}
              <Link
                prefetch={false}
                className="hover:underline font-gilroySemiBold"
                href="tel:+919513245671"
              >
                +91 9513245671
              </Link>{" "}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
