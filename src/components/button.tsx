interface ButtonProps {
  onClick?: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  type?: "submit" | "reset" | "button";
  pagination?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  loading = false,
  disabled = false,
  variant = "primary",
  type,
  pagination = false,
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
      } ${pagination ? "bg-white hover:bg-gray-200 border-black text-black" : ""}`}
      type={type}
    >
      {loading && (
        <div className="absolute w-full h-full flex justify-center items-center">
          <div
            className={`${"container"} ${
              pagination
                ? "after:!bg-black before:!bg-black"
                : "after:!bg-white before:!bg-white"
            }`}
          >
            <div
              className={`${"dot"} ${pagination ? "!bg-black" : "!bg-white"}`}
            ></div>
          </div>
        </div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>{label}</span>
    </button>
  );
};

export default Button;
