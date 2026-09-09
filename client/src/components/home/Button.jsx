const Button = ({
  className = "",
  text,
  onClick,
  children,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      {...props}
    >
      {text || children}
    </button>
  );
};

export default Button;
