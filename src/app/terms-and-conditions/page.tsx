import Link from "next/link";
import React from "react";

const TermsAndCondition = () => {
  return (
    <section className="flex justify-center items-center w-full">
      <div className="flex flex-col w-[87%] sm:w-4/5">
        <div className="flex flex-col text-center gap-8 py-4 sm:py-14 border-b">
          <h3 className="text-3xl sm:text-5xl font-gilroySemiBold">
            Terms and Conditions
          </h3>
          <p className="font-gilroySemiBold text-lg sm:text-xl">
            Welcome to Deviceflow. Please read these Terms and Conditions
            (“Terms”) carefully before using our platform, website, mobile
            application, or services (collectively referred to as “Services”).
            By accessing or using Deviceflow, you agree to be bound by these
            Terms and our Privacy Policy. If you do not agree with any part of
            these Terms, you must not use our Services.
          </p>
        </div>

        <div className="flex flex-col gap-8 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Definitions
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              “Deviceflow,” “we,” “our,” “us”: Refers to the company owning and
              operating the Deviceflow platform.
            </li>
            <li>
              “User,” “you,” “your”: Refers to any individual or entity
              accessing or using our Services.
            </li>
            <li>
              “Services”: Refers to all software, features, and tools provided
              by Deviceflow, including IT asset management, automation
              workflows, and reporting tools.
            </li>
            <li>
              “Content”: Includes all data, documentation, materials, and
              communications generated, uploaded, or submitted through the
              platform.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Eligibility
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              To use Deviceflow, you must:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Be at least 18 years of age.</li>
              <li>
                Have the authority to bind your organization (if using on behalf
                of a company).
              </li>
              <li>
                Provide accurate, current, and complete information when
                creating an account.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Account Registration and Security
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>Users must create an account to access certain features.</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              login credentials.
            </li>
            <li>
              Notify us immediately of any unauthorized use of your account.
            </li>
            <li>
              We are not liable for any loss or damage arising from your failure
              to comply with this section.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Use of Services
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              You agree to:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Use our Services only for lawful purposes.</li>
              <li>
                Not reverse engineer, decompile, or attempt to extract the
                source code.
              </li>
              <li>
                Not use our platform to transmit any viruses, malware, or
                harmful code.
              </li>
              <li>
                Not misuse our services to send spam, phishing, or unauthorized
                promotional materials.
              </li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We reserve the right to suspend or terminate accounts violating
              these Terms.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Subscription and Payment
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              Deviceflow may offer free and paid plans. Details of pricing,
              features, and billing cycles are available on our website or upon
              request.
            </li>
            <li>
              All payments are due in accordance with your chosen plan’s billing
              terms.
            </li>
            <li>
              Failure to pay may result in suspension or termination of access.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Intellectual Property
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              All content, features, and functionality of Deviceflow are owned
              by us or our licensors and are protected by copyright, trademark,
              and other laws.
            </li>
            <li>
              You may not use our branding or intellectual property without
              prior written consent.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            User Data and Privacy
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              You retain ownership of any data you upload or generate on
              Deviceflow.
            </li>
            <li>
              We may process your data only as necessary to provide Services, as
              outlined in our Privacy Policy.
            </li>
            <li>
              We implement reasonable security measures to protect your data,
              but we cannot guarantee absolute security.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Data Retention and Deletion
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              Upon termination, you may request a copy of your data within 30
              days.
            </li>
            <li>
              After that period, we reserve the right to delete all associated
              data from our servers.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Service Availability and Modifications
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
            <li>
              We aim to provide uninterrupted access to our Services but do not
              guarantee 100% uptime.
            </li>
            <li>
              We reserve the right to update, suspend, or discontinue any part
              of the Services without prior notice.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Limitation of Liability
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>
                Deviceflow shall not be liable for any indirect, incidental,
                special, or consequential damages.
              </li>
              <li>
                Our total liability for any claims arising under these Terms
                shall not exceed the amount you paid for the Services in the 12
                months preceding the claim.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Termination
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              We may terminate or suspend your account:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>For breach of these Terms.</li>
              <li>If required by law or regulation.</li>
              <li>If we cease offering the Services.</li>
            </ul>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              You may terminate your account at any time by notifying us via
              email or support.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Indemnification
          </h3>
          <div>
            <p className="font-gilroyRegular  text-base sm:text-lg">
              You agree to indemnify and hold harmless Deviceflow, its
              affiliates, officers, employees, and agents from any claims,
              damages, liabilities, or expenses arising out of:
            </p>
            <ul className="list-disc pl-6 text-base sm:text-lg font-gilroyRegular">
              <li>Your use of the Services,</li>
              <li>Your violation of these Terms,</li>
              <li>Your violation of any third-party rights.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Governing Law
          </h3>
          <p className="font-gilroyRegular  text-base sm:text-lg">
            These Terms shall be governed and construed in accordance with the
            laws of [Insert Jurisdiction, e.g., India], without regard to its
            conflict of law provisions.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Dispute Resolution
          </h3>

          <p className="font-gilroyRegular  text-base sm:text-lg">
            Any disputes arising out of or relating to these Terms or the
            Services shall be resolved through arbitration or the appropriate
            courts located in [Insert Jurisdiction].
          </p>
        </div>

        <div className="flex flex-col gap-6 py-6 sm:py-14">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">
            Changes to Terms
          </h3>

          <p className="font-gilroyRegular  text-base sm:text-lg">
            We reserve the right to modify these Terms at any time. We will provide notice of changes by updating the “Last Updated” date or through email. Continued use of the Services after such changes constitutes acceptance.
          </p>
        </div>

        <div className="flex flex-col gap-6 ">
          <h3 className="text-2xl sm:text-4xl font-gilroySemiBold">Contact Us</h3>
          <p className="font-gilroyRegular text-base sm:text-lg">
            For questions or concerns regarding these Terms, please contact us at:
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

export default TermsAndCondition;
