export const TextField: React.FC<React.HTMLAttributes<HTMLInputElement>> = () => <input className="input w-full max-w-xs" />
export const SubmitButton: React.FC<React.HtmlHTMLAttributes<HTMLButtonElement>> = () => <button className="btn btn-primary">Submit</button>
export const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string | number; label: string }[] }> = ({ options, ...props }) => {
    return (
        <select {...props}>
            <option disabled value="">
                Выберите группу
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
