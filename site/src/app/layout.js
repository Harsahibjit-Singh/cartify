// src/app/layout.jsx
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cartify',
  description: 'SDE Intern Fullstack Assignment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* bg-[#f1f3f6] is the exact light gray background Flipkart uses 
        for its main body, which makes the white product cards pop out!
      */}
      <body className="bg-[#f1f3f6] min-h-screen flex flex-col">
        <Providers>
        <Navbar />
        {/* Main content takes up remaining vertical space */}
        <main className="flex-grow max-w-[1248px] mx-auto w-full pt-4 px-2 sm:px-4">
          {children}
        </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}


