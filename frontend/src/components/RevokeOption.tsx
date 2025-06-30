// frontend/src/components/RevokeOption.tsx
import React from 'react';

// Define the types for the component's props
interface RevokeOptionProps {
    icon: 'freeze' | 'mint' | 'update';
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const RevokeOption: React.FC<RevokeOptionProps> = ({ icon, title, description, checked, onChange }) => {
    // SVG icons are stored here for easy access
    const ICONS = {
        freeze: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 2.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 8.414l-2.293 2.293a1 1 0 01-1.414-1.414l4-4zM10 2a1 1 0 011 1v6a1 1 0 11-2 0V3a1 1 0 011-1zm0 14a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1zm-5.707-1.707a1 1 0 010-1.414l2-2a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0zm11.414 0a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414l2 2a1 1 0 010 1.414zM4 10a1 1 0 01-1-1H1a1 1 0 110-2h2a1 1 0 011 1zm14 0a1 1 0 01-1-1h-2a1 1 0 110-2h2a1 1 0 011 1zm-5.707 5.707a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414l2-2a1 1 0 011.414 0z" clipRule="evenodd" /></svg>),
        mint: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.133 0V7.15c.191.07.37.158.533.268zM10 12.5a2.5 2.5 0 01-2.5-2.5V7.15a3.5 3.5 0 005 0v2.85a2.5 2.5 0 01-2.5 2.5z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" /></svg>),
        update: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>),
    };

    return (
        <div onClick={() => onChange(!checked)} className={`p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-gray-700 hover:border-gray-600'}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <span className={`mr-2 ${checked ? 'text-purple-400' : 'text-gray-500'}`}>{ICONS[icon]}</span>
                    <h4 className={`font-semibold ${checked ? 'text-white' : 'text-gray-300'}`}>{title}</h4>
                </div>
                <button type="button" className={`${checked ? 'bg-purple-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`} role="switch" aria-checked={checked}>
                    <span aria-hidden="true" className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
                </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
            <p className="mt-2 text-xs font-semibold text-purple-400">+0.1 SOL</p>
        </div>
    );
};