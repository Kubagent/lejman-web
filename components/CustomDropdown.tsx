'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  activeBackgroundShift?: boolean; // When true, button turns black with white text when open
}

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'All',
  activeBackgroundShift = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Get display label
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ') {
          setIsOpen(true);
          event.preventDefault();
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          event.preventDefault();
          break;
        case 'ArrowDown':
          setHighlightedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : prev
          );
          event.preventDefault();
          break;
        case 'ArrowUp':
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
          event.preventDefault();
          break;
        case 'Enter':
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          event.preventDefault();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={dropdownRef} className="custom-dropdown-container" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="custom-dropdown-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          minWidth: activeBackgroundShift ? 'auto' : '200px',
          padding: activeBackgroundShift ? '16px 24px' : '14px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: activeBackgroundShift && isOpen ? '#000000' : activeBackgroundShift ? '#FAFAFA' : '#FFFFFF',
          border: activeBackgroundShift ? 'none' : '1px solid #E0E0E0',
          borderRadius: activeBackgroundShift ? '0px' : '3px',
          fontSize: activeBackgroundShift ? '15px' : '12.5px',
          fontFamily: 'Inter, sans-serif',
          color: activeBackgroundShift && isOpen ? '#FFFFFF' : '#000000',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          outline: 'none',
          position: 'relative',
          textAlign: 'center'
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          if (!activeBackgroundShift) {
            e.currentTarget.style.borderColor = '#CCCCCC';
          } else if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          if (!activeBackgroundShift) {
            e.currentTarget.style.borderColor = '#E0E0E0';
          } else if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#FAFAFA';
            e.currentTarget.style.color = '#000000';
          }
        }}
      >
        <span style={{ fontWeight: value ? 500 : 400 }}>{displayLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease, stroke 0.3s ease',
            marginLeft: '8px',
            position: 'absolute',
            right: activeBackgroundShift ? '24px' : '16px'
          }}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke={activeBackgroundShift && (isOpen || isHovered) ? '#FFFFFF' : '#000000'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="custom-dropdown-list"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0E0E0',
            borderRadius: '3px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 1000,
            margin: 0,
            padding: '6px 0',
            listStyle: 'none',
            animation: 'dropdown-appear 0.3s ease'
          }}
        >
          <style jsx>{`
            @keyframes dropdown-appear {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: '12px 16px',
                fontSize: '12.5px',
                fontFamily: 'Inter, sans-serif',
                color: '#000000',
                cursor: 'pointer',
                backgroundColor:
                  highlightedIndex === index
                    ? '#F5F5F5'
                    : option.value === value
                    ? '#FAFAFA'
                    : 'transparent',
                fontWeight: option.value === value ? 500 : 400,
                transition: 'background-color 0.15s ease'
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
