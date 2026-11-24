const FormError = ({ error, id }) => {
  return error ? (
    <p id={id} role="alert" aria-live="polite" className="mt-1.5 text-xs font-medium text-error">
      {error}
    </p>
  ) : null;
};

export default FormError;
