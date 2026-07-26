import type { Metadata } from "next";
import { LegalPageStub } from "@/components/LegalPageStub";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to our services and this website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPageStub
      title="Terms of Service"
      summary="This page will set out the terms under which we provide cleaning services and operate this website, including scheduling, payment, weather policy and the scope of our guarantee."
    />
  );
}
