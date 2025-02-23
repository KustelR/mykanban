import type { NextConfig } from "next";
// @ts-expect-error
import withSvgr from "next-plugin-svgr";

const nextConfig: NextConfig = {};

export default withSvgr(nextConfig);
