import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1320] text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Página não encontrada</h2>
        <p className="text-gray-400 mb-8">A página que você está procurando não existe.</p>
        <Link href="/" className="px-6 py-3 bg-[#0077FF] hover:bg-[#005ecb] rounded-lg font-bold transition-colors">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
