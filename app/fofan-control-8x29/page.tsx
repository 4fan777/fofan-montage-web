import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { adminRoutePath } from "@/config/admin";

export const metadata: Metadata = {
  title: "Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HiddenAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const expectedKey = process.env.ADMIN_ACCESS_KEY;

  if (!expectedKey || params.key !== expectedKey) {
    notFound();
  }

  return <AdminPanel accessKey={params.key} adminPath={adminRoutePath} />;
}
