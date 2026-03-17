"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SearchSelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
};

export function SearchSelect({ options, value, onChange, placeholder, name }: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(term));
  }, [options, query]);


  const displayValue = open ? query : value;

  return (
    <div className="relative" ref={containerRef}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <input
        value={displayValue}
        placeholder={placeholder}
        className="w-full text-sm rounded-lg border border-[#e7e1d8] bg-white px-4 py-2 placeholder:text-[#8a7d70] focus:border-[#6b8fa3] focus:outline-none"
        onFocus={() => {
          setOpen(true);
          setQuery(value);
          setHighlightedIndex(0);
        }}
        onChange={(event) => {
          setOpen(true);
          setQuery(event.target.value);
          setHighlightedIndex(0);
        }}
        onKeyDown={(event) => {
          if (!open) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          }

          if (event.key === "Enter") {
            event.preventDefault();
            const selected = filteredOptions[highlightedIndex];
            if (selected) {
              onChange(selected);
              setQuery(selected);
              setOpen(false);
            }
          }

          if (event.key === "Escape") {
            setOpen(false);
            setQuery(value);
          }
        }}
      />

      {open ? (
        <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-[#e7e1d8] bg-white p-1 shadow-sm">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#73685d]">Sin resultados</div>
          ) : (
            filteredOptions.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                  index === highlightedIndex ? "bg-[#ece5dd] text-[#2c241d]" : "text-[#73685d] hover:bg-[#f4eee7]"
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setQuery(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
