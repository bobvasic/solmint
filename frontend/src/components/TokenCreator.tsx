// frontend/src/components/TokenCreator.tsx
import { useState, useCallback, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Import the new components
import { RevokeOption } from './RevokeOption';
import { ToggleOption } from './ToggleOption';

// Placeholder for now
const TokenIdeaGenerator = () => <div className="p-4 mb-4 bg-gray-800 rounded-lg">Token Idea Generator placeholder...</div>;

export const TokenCreator = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    // Form state
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [decimals, setDecimals] = useState(9);
    const [supply, setSupply] = useState(1000000);
    const [description, setDescription] = useState('');
    const [tokenImage, setTokenImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Revoke authorities state
    const [revokeFreeze, setRevokeFreeze] = useState(false);
    const [revokeMint, setRevokeMint] = useState(false);
    const [revokeUpdate, setRevokeUpdate] = useState(true);

    // Custom creator info state
    const [customCreatorInfo, setCustomCreatorInfo] = useState(false);
    const [creatorName, setCreatorName] = useState('');
    const [creatorWebsite, setCreatorWebsite] = useState('');

    // UI state
    const [isCreating, setIsCreating] = useState(false);
    const [creationResult, setCreationResult] = useState<any | null>(null);

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setTokenImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    const cost = useMemo(() => {
        const serviceFee = 0.1;
        const baseNetworkFee = 0.002;
        let optionsCost = 0;
        if (revokeFreeze) optionsCost += 0.1;
        if (revokeMint) optionsCost += 0.1;
        if (revokeUpdate) optionsCost += 0.1;
        if (customCreatorInfo) optionsCost += 0.1;
        return serviceFee + baseNetworkFee + optionsCost;
    }, [revokeFreeze, revokeMint, revokeUpdate, customCreatorInfo]);

    const handleCreateToken = async () => {
        console.log("Creating token with the following data:", {
            tokenName, tokenSymbol, decimals, supply, description, tokenImage,
            revokeFreeze, revokeMint, revokeUpdate,
            customCreatorInfo, creatorName, creatorWebsite
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">Create your Solana Token</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">Launch your own cryptocurrency on the Solana blockchain in just a few clicks. No coding required.</p>
            </div>

            <div className="mt-12 bg-gray-900 bg-opacity-50 rounded-2xl shadow-2xl p-8 backdrop-filter backdrop-blur-md border border-gray-800">
                <TokenIdeaGenerator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input fields remain the same */}
                    <div>
                        <label htmlFor="tokenName" className="block text-sm font-medium text-gray-300">Token Name</label>
                        <input type="text" id="tokenName" value={tokenName} onChange={(e) => setTokenName(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., SolMint Coin" />
                    </div>
                    <div>
                        <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-300">Token Symbol</label>
                        <input type="text" id="tokenSymbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., SMC" />
                    </div>
                    <div>
                        <label htmlFor="decimals" className="block text-sm font-medium text-gray-300">Decimals</label>
                        <input type="number" id="decimals" value={decimals} onChange={(e) => setDecimals(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                    <div>
                        <label htmlFor="supply" className="block text-sm font-medium text-gray-300">Total Supply</label>
                        <input type="number" id="supply" value={supply} onChange={(e) => setSupply(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">Token Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md cursor-pointer" onDrop={onDrop} onDragOver={onDragOver} onClick={() => document.getElementById('file-upload')?.click()}>
                            <input id="file-upload" type="file" className="sr-only" onChange={onFileSelect} accept="image/*" />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Token preview" className="h-24 w-24 object-cover rounded-full" />
                            ) : (
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <p className="pl-1">Drag & drop, or click to upload</p>
                                    <p className="text-xs text-gray-600">PNG, JPG, GIF up to 1MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="A brief description of your token."></textarea>
                    </div>

                    {/* START: Updated Options Section */}
                    <div className="md:col-span-2 pt-8 mt-4 border-t border-gray-800">
                        <div className="p-6 bg-gray-900 bg-opacity-40 rounded-lg">
                            <ToggleOption checked={customCreatorInfo} onChange={setCustomCreatorInfo} />
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${customCreatorInfo ? 'max-h-96 mt-6' : 'max-h-0'}`}>
                                <div className="grid grid-cols-1 md:col-span-2 gap-8">
                                    <div>
                                        <label htmlFor="creatorName" className="block text-sm font-medium text-gray-300">Creator Name</label>
                                        <input type="text" id="creatorName" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., SolMint"/>
                                    </div>
                                    <div>
                                        <label htmlFor="creatorWebsite" className="block text-sm font-medium text-gray-300">Creator Website</label>
                                        <input type="url" id="creatorWebsite" value={creatorWebsite} onChange={(e) => setCreatorWebsite(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="https://solmint.io"/>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <h4 className="text-lg font-medium text-gray-200">Revoke Authorities</h4>
                                <p className="mt-1 text-sm text-gray-500">Permanently revoke authorities to attract more investors.</p>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <RevokeOption icon="freeze" title="Revoke Freeze" description="No one will be able to freeze token accounts." checked={revokeFreeze} onChange={setRevokeFreeze}/>
                                    <RevokeOption icon="mint" title="Revoke Mint" description="No one will be able to create more tokens." checked={revokeMint} onChange={setRevokeMint} />
                                    <RevokeOption icon="update" title="Revoke Metadata Update" description="No one can modify token metadata anymore." checked={revokeUpdate} onChange={setRevokeUpdate} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: Updated Options Section */}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                        <p className="text-lg text-white">Creation Cost: <span className="font-bold text-purple-400">{cost.toFixed(3)} SOL</span></p>
                        <button onClick={handleCreateToken} disabled={isCreating || !publicKey} className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300">
                            {isCreating ? 'Creating...' : (publicKey ? 'Create Token' : 'Connect Wallet to Create')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};