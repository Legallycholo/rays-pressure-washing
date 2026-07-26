import type { Metadata } from "next";
import { LegalPageStub } from "@/components/LegalPageStub";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPageStub
      title="Privacy Policy"
      summary="This page will explain what information we collect through our quote and contact forms, how we use it, who we share it with, and the choices you have."
    />
  );
}
