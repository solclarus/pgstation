import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200], // モバイル・タブレット中心に削減
		imageSizes: [32, 64, 96, 128, 256], // 小さいサイズを削減してポケモン画像に最適化
		minimumCacheTTL: 31536000, // 1年間 (より長いキャッシュでtransformation回数削減)
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
