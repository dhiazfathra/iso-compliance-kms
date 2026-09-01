import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  experimental: {
    // Turbopack panics emitting server source maps for this route tree
    // ("<Code as GenerateSourceMap>::generate_source_map was canceled"); the
    // same build passes under --webpack, and passes here with them off.
    serverSourceMaps: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
