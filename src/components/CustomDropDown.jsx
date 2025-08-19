import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const SelectDropdown = ({ name, options, placeholder = 'Select', value, onChange, className = '', errors, disabled, extraName, hideArrow = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = 240;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                // setOpenUpward(true);
            } else {
                // setOpenUpward(false);
            }
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    // Fix: allow 0 as a valid value
    const optionLabel = (value !== undefined && value !== null) ? options.find((e) => e.key === value) : null;

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center w-full border ${(errors?.[name] || errors?.calendar_choosed) ? 'border-red-500' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 bg-white text-left hover:cursor-pointer focus:outline-none focus:border-[#7edf99]`}
            >
                <span className={`block truncate ${!optionLabel ? 'text-[#5A687C]' : `${name == "lead_status" ? 'text-[#7be174]' : 'text-[#1E1E1E]'}`}`}>
                    {extraName ? `${extraName}: ${optionLabel?.label}` : (optionLabel?.label || placeholder)}
                </span>
                {!hideArrow && (
                  <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                )}
            </button>
            {isOpen && (
                <div
                    className={`absolute z-10 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}
                >
                    <ul className="py-1 px-2 flex flex-col gap-1 my-1">
                        {options?.length > 0 && options.map((option) => (
                            <li
                                key={option.key}
                                className={`cursor-pointer font-[400] select-none relative px-4 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#7edca0] ${value === option.key ? 'text-[#3ce76f] bg-[#F4F5F6] rounded-lg' : 'text-[#5A687C]'}`}
                                onClick={() => handleSelect(option.key)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
