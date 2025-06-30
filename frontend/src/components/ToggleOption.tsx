// frontend/src/components/ToggleOption.tsx
import React from 'react';

interface ToggleOptionProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const ToggleOption: React.FC<ToggleOptionProps> = ({ checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center">
            <button type="button" onClick={() => onChange(!checked)} className={`${checked ? 'bg-purple-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`} role="switch" aria-checked={checked}>
                <span aria-hidden="true" className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
            </button>
            <div className="ml-4">
                <h4 className="font-semibold text-white flex items-center">Custom Creator Info<span className="ml-2 text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center"><span className="mr-1">🔥</span>New</span></h4>
                <p className="text-sm text-gray-500">Change information about token creator in token metadata</p>
            </div>
        </div>
        <p className="text-sm font-semibold text-purple-400">Fee: 0.1 SOL</p>
    </div>
);