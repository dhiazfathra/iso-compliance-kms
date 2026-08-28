import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
