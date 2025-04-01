import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ThemeRegistry from '@/components/themeRegistry/ThemeRegistry';
export const metadata = {
  title: 'Adoptly',
  description: 'Осинови, не купувай.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body>
        <ThemeRegistry>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
