import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		localPatterns: [
			{
				pathname: "/**",
				search: "",
			},
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "klrdsriygrrnmytfqylu.supabase.co",
			},
		],
	},
};

export default nextConfig;
