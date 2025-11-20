// app/layout.js
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://diabete-random-generate.vercel.app/'), 
  title: {
    default: "당뇨 식단 생성기 | 식품교환표 기반 1초 완성",
    template: "%s | 당뇨 식단 생성기",
  },
  description: "당뇨병 관리를 위한 맞춤 식단을 1초 만에 생성하세요. 나이, 체중별 필요 칼로리 계산과 식품교환표 기준 밸런스 잡힌 식단을 무료로 제공합니다.",
  keywords: ["당뇨 식단", "당뇨병 음식", "식품교환표", "혈당 관리", "당뇨 식단표 짜기", "당뇨 도시락", "칼로리 계산기"],
  authors: [{ name: "내 이름(또는 닉네임)" }],
  openGraph: {
    title: "당뇨 식단 고민 끝! 1초 만에 짜주는 식단표",
    description: "식품교환표 기준으로 영양 밸런스를 맞춘 식단을 지금 바로 확인해보세요.",
    url: 'ttps://diabete-random-generate.vercel.app',
    siteName: '당뇨 식단 생성기',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1833210144684624"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}