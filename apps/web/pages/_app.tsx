import type { AppProps } from 'next/app';
import ChatbotWidget from '../components/ChatbotWidget';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ChatbotWidget />
    </>
  );
}
