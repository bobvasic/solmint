// frontend/src/App.tsx
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TokenCreator } from './components/TokenCreator'; // <-- IMPORT

function App() {
  // We will add state here later for switching between Creator and FAQ
  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-gray-900">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob [animation-delay:2s]"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-900 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob [animation-delay:4s]"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex-shrink-0">
                <span className="text-white text-2xl font-bold tracking-wider flex items-center cursor-pointer">
                  <svg className="inline-block w-8 h-8 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  SolMint
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">FAQ</button>
                <WalletMultiButton />
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-20">
          <TokenCreator /> {/* <-- RENDER COMPONENT */}
        </main>

        {/* Footer */}
        <footer className="bg-black bg-opacity-20 mt-20">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SolMint. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;