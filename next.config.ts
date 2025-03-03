import type { NextConfig } from "next";
// @ts-expect-error
import withSvgr from "next-plugin-svgr";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSvgr(nextConfig);
