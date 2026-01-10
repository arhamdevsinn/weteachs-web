"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Effective Date: <span className="font-semibold">May 8, 2024</span>
        </p>
      </motion.div>

      {/* Card Content */}
      <Card className="max-w-5xl mx-auto shadow-lg border border-gray-100">
        <CardContent className="p-8 md:p-12 space-y-10 text-gray-700">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Introduction
            </h2>
            <p>
              This privacy policy applies to the <strong>WeTeach</strong> app
              (hereby referred to as &quot;Application&quot;) created by{" "}
              <strong>Isaiah Joseph</strong> (&quot;Service Provider&quot;) as a Free
              service. This service is intended for use <strong>“AS IS”</strong>.
            </p>
          </motion.div>

          <Separator />

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Information Collection and Use
            </h2>
            <p>
              The Application collects information when you download and use it.
              This may include your device’s IP address, pages visited, time and
              date of use, time spent on the Application, and operating system.
            </p>
            <p className="mt-3">
              The Service Provider may use your information to contact you with
              important notices or promotions. The Application may also require
              basic personal details like <strong>email, birthday, age,
              gender,</strong> and <strong>name</strong> to improve your
              experience.
            </p>
          </motion.div>

          <Separator />

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Third Party Access
            </h2>
            <p>
              Only anonymized data may be shared with trusted third-party
              services, including <strong>Google Play Services</strong>, to help
              improve the Application.
            </p>
            <p className="mt-3">
              The Service Provider may disclose your information if required by
              law, to protect safety, prevent fraud, or fulfill legal
              obligations.
            </p>
          </motion.div>

          <Separator />

          {/* Section 4 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Opt-Out Rights
            </h2>
            <p>
              You can stop all data collection by uninstalling the Application
              at any time through standard uninstall procedures available on
              your device.
            </p>
          </motion.div>

          <Separator />

          {/* Section 5 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Data Retention Policy
            </h2>
            <p>
              User data will be retained as long as the Application is used and
              for a reasonable period afterward. To request data deletion,
              contact <strong>weteachat@gmail.com</strong>.
            </p>
          </motion.div>

          <Separator />

          {/* Section 6 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Children’s Privacy
            </h2>
            <p>
              The Application does not knowingly collect data from children
              under 13. If you believe a child has provided personal
              information, contact{" "}
              <strong>weteachat@gmail.com</strong> for immediate removal.
            </p>
          </motion.div>

          <Separator />

          {/* Section 7 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Security
            </h2>
            <p>
              The Service Provider uses physical, electronic, and procedural
              safeguards to protect all data processed and maintained through
              the Application.
            </p>
          </motion.div>

          <Separator />

          {/* Section 8 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Changes to This Policy
            </h2>
            <p>
              This Privacy Policy may be updated from time to time. Continued
              use of the Application after any modifications constitutes
              acceptance of the new terms.
            </p>
          </motion.div>

          <Separator />

          {/* Section 9 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or data
              practices, please contact us at:{" "}
              <a
                href="mailto:weteachat@gmail.com"
                className="text-primary hover:underline font-medium"
              >
                weteachat@gmail.com
              </a>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
