import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
export const metadata = {
  title: 'Adoptly',
  description: 'Осинови, не купувай.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
      </body>
    </html>
  );
}
