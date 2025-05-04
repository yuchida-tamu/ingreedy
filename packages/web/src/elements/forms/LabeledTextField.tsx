type Props = {
  label: string;
  value: string;
  type?: HTMLInputElement['type'];
  onChange: (value: string) => void;
};

export function LabeledTextField({ label, value, type = 'text', onChange }: Props) {
  return (
    <label className="label flex flex-col items-start">
      <span>{label}</span>
      <input
        className="input"
        placeholder={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
