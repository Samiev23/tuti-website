import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin тянет нативные модули Node — бандлить его не нужно,
  // он подключается на сервере как есть (роуты /api/admin/*).
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
