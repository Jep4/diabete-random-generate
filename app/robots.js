export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://your-project-name.vercel.app/sitemap.xml', // 배포 주소 + /sitemap.xml
  }
}