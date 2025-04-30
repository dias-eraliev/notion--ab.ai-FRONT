interface SubmitButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    content: string;
}

export const TextField: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props) => <input {...props} />
export const SubmitButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({ children, ...props }) => (
    <button className="btn btn-primary" {...props}>
        {children}
    </button>
);
