import type {Metadata} from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { CustomCursor } from '@/components/CustomCursor'; // <-- Importação do cursor adicionada

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Nexora Studios | Sites inteligentes. Resultados reais.',
  description: 'Criamos sites modernos, rápidos e focados em gerar clientes para pequenas empresas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-dark text-light`} suppressHydrationWarning>
        <CustomCursor /> {/* <-- Cursor ativado em todo o site! */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}