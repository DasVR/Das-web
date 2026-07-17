"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { terminalCommands } from "@/config/terminal";
import { cn } from "@/lib/cn";
import { hasCoarsePointer } from "@/lib/capability";
import { useHaptics } from "@/lib/haptics";

const DEFAULT_LINES = [
  "Das terminal online.",
  "Type `help` to inspect the command table.",
];

export function TerminalPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(DEFAULT_LINES);
  const [inputValue, setInputValue] = useState("");
  const [coarsePointer] = useState(() => hasCoarsePointer());
  const { pulse } = useHaptics();

  const submit = () => {
    const normalizedValue = inputValue.trim().toLowerCase();

    if (!normalizedValue) {
      return;
    }

    if (normalizedValue === "clear") {
      setLines([]);
      setInputValue("");
      pulse("light");
      return;
    }

    const match = terminalCommands.find(
      (terminalCommand) => terminalCommand.command === normalizedValue,
    );

    setLines((currentLines) => [
      ...currentLines,
      `> ${normalizedValue}`,
      ...(match ? match.output : ["command not found"]),
    ]);
    setInputValue("");
    pulse(match ? "selection" : "warning");
  };

  return (
    <>
      <button
        type="button"
        className="liquid-panel fixed right-4 bottom-4 z-40 rounded-full border border-[#84ffc9]/20 px-4 py-3 font-mono text-xs uppercase tracking-[0.24em] text-[#dcffec] shadow-[0_0_28px_rgba(109,255,176,0.12)] transition hover:border-[#84ffc9]/30 hover:text-white"
        onClick={() => {
          setIsOpen((currentOpen) => !currentOpen);
          pulse("medium");
        }}
      >
        terminal
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            key="terminal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className={cn(
              "terminal-card liquid-panel fixed z-40 overflow-hidden border border-[#84ffc9]/14 shadow-[0_0_46px_rgba(109,255,176,0.16)]",
              coarsePointer
                ? "inset-x-3 bottom-20 max-h-[58vh]"
                : "right-4 bottom-20 h-[32rem] w-[25rem]",
            )}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#79d9aa]">
                  command overlay
                </p>
                <p className="text-xs text-[#8ebba2]">dark liminal control surface</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#c9eed8] hover:border-[#84ffc9]/20"
                onClick={() => {
                  setIsOpen(false);
                  pulse("light");
                }}
              >
                close
              </button>
            </div>

            <div className="max-h-[calc(100%-7rem)] overflow-auto px-4 py-4 font-mono text-sm text-[#cdeedb]">
              <div className="space-y-2">
                {lines.map((line, lineIndex) => (
                  <p key={`${line}-${lineIndex}`}>{line}</p>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                <span className="font-mono text-[#6dffb0]">&gt;</span>
                <input
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      submit();
                    }
                  }}
                  placeholder="help"
                  className="w-full bg-transparent font-mono text-sm text-[#e5fff0] outline-none placeholder:text-[#6f947f]"
                />
              </label>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
