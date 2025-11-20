export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://diabete-random-generate.vercel.app/sitemap.xml', // 배포 주소 + /sitemap.xml
  }
}