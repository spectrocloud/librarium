import React from "react";
import styles from "./AskAI.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

/**
 * Minimal typeable input component.
 * Just a controlled text input.
 * This input is read-only until Kapa can handle the privacy notice screen.
 */
type TypeableInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  onEnter?: (val: string) => void;
};

function TypeableInput({
  value,
  onChange,
  placeholder = "Ask AI to learn about Palette...",
  name,
  onEnter,
}: TypeableInputProps) {
  const handleClick = () => {
    onEnter?.(value); // call handler when user clicks
  };

  return (
    <div className={styles.inputContainer}>
      <FontAwesomeIcon icon={faWandMagicSparkles} className={styles.icon} />
      <input
        type="text"
        name={name}
        readOnly={true}
        disabled={false}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleClick}
      />
    </div>
  );
}

export function AskAI(): JSX.Element | null {
  const [text, setText] = React.useState("");
  return (
    <div className={styles.inputChangesContainer}>
      <TypeableInput
        value={text}
        onChange={setText}
        placeholder="Ask AI to learn about Palette..."
        onEnter={() => {
          // Open Kapa AI with the query
          window && window.Kapa && window.Kapa.open({
            mode: "ai",
            submit: true,
          });
        }}
      />
    </div>
  );
}

export default AskAI;
