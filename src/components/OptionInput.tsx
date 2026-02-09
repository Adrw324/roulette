import { useState } from 'react';
import type { RacerOption } from '../types';
import { RACER_COLORS } from '../types';

interface OptionInputProps {
  options: RacerOption[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export default function OptionInput({ options, onAdd, onRemove }: OptionInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  return (
    <div className="input-section">
      <form className="option-form" onSubmit={handleSubmit}>
        <input
          className="option-input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter an option..."
          maxLength={30}
        />
        <button
          className="add-btn"
          type="submit"
          disabled={!value.trim() || options.length >= 12}
        >
          Add
        </button>
      </form>
      <div className="options-list">
        {options.map((opt, i) => (
          <div className="option-chip" key={opt.id}>
            <span
              className="color-dot"
              style={{ background: RACER_COLORS[i % RACER_COLORS.length] }}
            />
            <span>{opt.name}</span>
            <button className="remove-btn" onClick={() => onRemove(opt.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
