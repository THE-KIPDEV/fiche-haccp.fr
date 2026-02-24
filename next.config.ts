import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/fiches-haccp/controle-temperatures-reception", destination: "/fiches-haccp", permanent: true },
      { source: "/fiches-haccp/releve-temperatures-stockage", destination: "/fiches-haccp", permanent: true },
      { source: "/fiches-haccp/protocole-lavage-mains", destination: "/fiches-haccp", permanent: true },
      { source: "/fiches-haccp/gestion-allergenes", destination: "/fiches-haccp", permanent: true },
    ];
  },
};

export default nextConfig;
