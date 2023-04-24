import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <body>
        <Main />
        <NextScript />
        <Script src="./assets/vendor/preline/dist/preline.js" />
      </body>
    </Html>
  )
}
