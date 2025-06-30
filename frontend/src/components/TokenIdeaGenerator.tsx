// frontend/src/components/TokenIdeaGenerator.tsx
import { useState } from 'react';
import axios from 'axios';

interface TokenIdeaGeneratorProps {
    setTokenName: (name: string) => void;
    setTokenSymbol: (symbol: string) => void;
    setDescription: (description: string) => void;
}

interface Idea {
    name: string;
    symbol: string;
    description: string;
}

export const TokenIdeaGenerator: React.FC<TokenIdeaGeneratorProps> = ({ setTokenName, setTokenSymbol, setDescription }) => {
    const [prompt, setPrompt] = useState('');
    const [ideas, setIdeas] = useState<Idea | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please enter a concept for your token.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas(null);

        try {
            // Our Rust backend is running on port 8080
            const response = await axios.post('http://127.0.0.1:8080/api/generate-ideas', { prompt });
            setIdeas(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred while brainstorming.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-10 p-6 bg-gray-900 bg-opacity-40 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white flex items-center">Need an Idea? ✨</h3>
            <p className="text-gray-400 mt-1 mb-4">Describe your token concept and let AI brainstorm for you.</p>
            <textarea
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="e.g., A token for a decentralized network of solar-powered microgrids."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500 transition-all"
            >
                {isLoading ? 'Brainstorming...' : 'Generate Ideas'}
            </button>
            {error && <p className="mt-4 text-red-400">{error}</p>}
            {ideas && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                        <p><strong>Name:</strong> <span className="text-purple-300">{ideas.name}</span></p>
                        <button onClick={() => setTokenName(ideas.name)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded">Use</button>
                    </div>
                    <div className="flex justify-between items-center">
                        <p><strong>Symbol:</strong> <span className="text-purple-300">{ideas.symbol}</span></p>
                        <button onClick={() => setTokenSymbol(ideas.symbol)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded">Use</button>
                    </div>
                    <div className="flex justify-between items-start">
                        <p className="flex-1 mr-4"><strong>Description:</strong> <span className="text-gray-300">{ideas.description}</span></p>
                        <button onClick={() => setDescription(ideas.description)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded">Use</button>
                    </div>
                </div>
            )}
        </div>
    );
};