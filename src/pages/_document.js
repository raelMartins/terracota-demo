import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA-5_wkcvc0s0bX1iyez3mBC0g7X0Gzef8&libraries=places`}
          async
          defer
        ></script>
        <link href="https://fonts.cdnfonts.com/css/euclid-circular-b" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
