interface ButtonProps {
  onClick?: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  type?: "submit" | "reset" | "button";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  loading = false,
  disabled = false,
  variant = "primary",
  type,
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary hover:bg-primary-dark";
      case "secondary":
        return "bg-green-500 hover:bg-green-600";
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`text-white relative py-3 px-5 rounded-[10px] shadow-sm transition-all ${getButtonStyles()} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type={type}
    >
      {loading && (
        <div className="absolute w-full h-full flex justify-center items-center">
          <div className="container after:!bg-white before:!bg-white">
            <div className="dot !bg-white"></div>
          </div>
        </div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>{label}</span>
    </button>
  );
};

export default Button;
