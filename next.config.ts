import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 不要な大サイズを削除
		imageSizes: [16, 32, 48, 64, 96, 128, 256], // ポケモン画像に適したサイズに最適化
		minimumCacheTTL: 2678400, // 31日間 (Next.js公式推奨値)
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
		dangerouslyAllowSVG: false,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

export default nextConfig;
