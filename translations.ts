import type { MetadataRoute } from "next";
import { adminRoutePath } from "@/config/admin";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [adminRoutePath, "/api/admin/"],
    },
  };
}
