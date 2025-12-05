import React from "react";
import styles from "./AskAI.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";


/**
 * Minimal typeable input component.
 * Just a controlled text input.
 */
type TypeableInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  onEnter?: (val: string) => void;
};

function TypeableInput({
  value,
  onChange,
  placeholder = "Ask AI to learn about Palette...",
  disabled = false,
  name,
  onEnter,
}: TypeableInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.(value); // call handler if provided
    }
  };

  return (
    <div className={styles.inputContainer}>
      <FontAwesomeIcon icon={faWandMagicSparkles} className={styles.icon} />
      <input
        type="text"
        name={name}
        disabled={disabled}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export function AskAI(): JSX.Element | null {
  const [text, setText] = React.useState("");
  return (
    <div className={styles.inputChangesContainer}>
      <TypeableInput value={text} onChange={setText} placeholder="Ask AI to learn about Palette..." 
      onEnter={(val) => {
        // Open Kapa AI with the query
        window.Kapa.open({
          mode: "ai",
          query: val,
          submit: true,
        });
      }} />
    </div>
  );
}

export default AskAI;
