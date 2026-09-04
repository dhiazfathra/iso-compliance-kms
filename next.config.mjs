import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Applied to every response. The download routes set their own tighter
 * Content-Security-Policy (they render untrusted stored bytes); this is the
 * baseline for the rest of the app, which Next/Payload don't set on their own.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  experimental: {
    // Turbopack panics emitting server source maps for this route tree
    // ("<Code as GenerateSourceMap>::generate_source_map was canceled"); the
    // same build passes under --webpack, and passes here with them off.
    serverSourceMaps: false,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
