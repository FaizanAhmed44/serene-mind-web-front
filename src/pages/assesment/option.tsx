import React from "react";

interface OptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  badge?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

const Option: React.FC<OptionProps> = ({
  id,
  name,
  value,
  label,
  badge,
  checked,
  onChange
}) => {

  // Make the whole box clickable by wrapping everything in a label
  return (
    <label
      htmlFor={id}
      className={`get-option block cursor-pointer`}
      onClick={() => onChange?.(value)}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange?.(value);
        }
      }}
    >
      <div
        className={`relative rounded-xl p-4 grid grid-cols-[auto_1fr] gap-4 items-center border border-gray-200 hover:shadow-md transition-shadow ${checked ? "ring-2 ring-green-100" : ""}`}
        style={{ transition: "box-shadow 0.2s, border-color 0.2s" }}
      >
        <div className="w-6 h-6 border rounded-full flex items-center justify-center">
          <input
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange?.(value)}
            className="w-4 h-4 rounded-full checked:bg-green-600 transition cursor-pointer accent-green-600"
            style={{ accentColor: "#16a34a" }}
            tabIndex={-1}
          />
        </div>

        <div className="text-md relative text-gray-600 flex-1">
          <div className="toast-align-container flex items-center justify-between gap-2">
            <div className="custom-style">
              <div className="toastui-editor-contents break-words">
                <p>{label}</p>
              </div>
            </div>
            {badge && (
              <div className="grey-badge bg-gray-100 rounded-md text-gray-700 text-xs font-medium px-3 py-1">
                {badge}
              </div>
            )}
          </div>
        </div>
      </div>
    </label>
  );
};

export default Option;
