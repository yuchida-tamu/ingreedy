type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function LabeledSelectField({ label, options, value, onChange }: Props) {
  return (
    <label className="label flex flex-col items-start">
      <span className="label-text text-left">{label}</span>
      <select className="select select-bordered" value={value} onChange={onChange} required>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
