import React from "react";
import { QuizOption, SubmitAnswer } from "../../pages/assesment/types";

interface OptionProps {
  questionId: string;
  name: string;
  option: QuizOption;
  badge?: string;
  checked?: boolean;
  onChange?: (answer: SubmitAnswer) => void;
}

const Option: React.FC<OptionProps> = ({
  option,
  questionId,
  name,
  badge,
  checked,
  onChange,
}) => {
  return (
    <label
      htmlFor={option.id}
      className="block cursor-pointer"
      onClick={() => onChange?.({ questionId: questionId, optionId: option.id })}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange?.({ questionId: questionId, optionId: option.id });
        }
      }}
    >
      <div
        className={`relative rounded-xl p-4 grid grid-cols-[auto_1fr] gap-4 items-center border border-gray-200 hover:shadow-md transition-shadow ${checked ? "ring-2 ring-green-100" : ""}`}
        style={{ transition: "box-shadow 0.2s, border-color 0.2s" }}
      >
        <div className="w-6 h-6 border rounded-full flex items-center justify-center">
          <input
            id={option.id}
            type="radio"
            name={name}
            value={option.id}
            checked={checked}
            onChange={() => onChange?.({ questionId: questionId, optionId: option.id })}
            className="w-4 h-4 rounded-full checked:bg-green-600 transition cursor-pointer accent-green-600"
            style={{ accentColor: "#16a34a" }}
            tabIndex={-1}
          />
        </div>

        <div className="text-md relative text-gray-600 flex-1">
          <div className="toast-align-container flex items-center justify-between gap-2">
            <div className="custom-style">
              <div className="toastui-editor-contents break-words">
                <p>{option.text}</p>
                {option.image && <div className="max-w-[120px]">
                  <img src={option.image} alt={option.text} className="w-full h-auto" />
                </div>}
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
