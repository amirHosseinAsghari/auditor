import copyIcon from "../../public/icons/copy.svg";
import { Field as FormikField } from "formik";
interface FieldProps {
  name: string;
  label: string;
  type?: string;
  as?: string;
  disabled: boolean;
  onCopy?: (text: string) => void;
  value: string;
}
const Field: React.FC<FieldProps> = ({
  disabled,
  label,
  name,
  as,
  type,
  onCopy,
  value,
}) => {
  return (
    <div className="flex justify-start items-start flex-col gap-3 md:w-[50%] max-md:w-full">
      <label htmlFor={name} className="block text-bse font-medium text-black">
        {label}
      </label>
      <div className="relative w-full">
        <FormikField
          id={name}
          name={name}
          as={as}
          type={type}
          disabled={disabled}
          className="block max-h-60 min-h-12 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
        />
        {onCopy && (
          <span
            className="absolute end-2 top-6 transform -translate-y-1/2 cursor-pointer"
            onClick={() => onCopy(value)}
          >
            <img src={copyIcon} alt="copy icon" className="w-5 h-5" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Field;
