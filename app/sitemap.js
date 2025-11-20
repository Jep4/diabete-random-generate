export default function sitemap() {
  return [
    {
      url: 'https://your-project-name.vercel.app', // 배포 주소
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}