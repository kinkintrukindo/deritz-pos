export function AdminField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  defaultValue?: string | number;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={3}
          className="mt-1.5 w-full border border-mist px-3 py-2 text-sm bg-paper focus:outline-none focus:border-ink"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          step={step}
          className="mt-1.5 w-full border border-mist px-3 py-2 text-sm bg-paper focus:outline-none focus:border-ink"
        />
      )}
    </label>
  );
}
