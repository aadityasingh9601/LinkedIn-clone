import MyErrorBoundary from "./MyErrorBoundary";

export default function RHFtextarea({
  placeholder,
  register,
  name,
  rules = {},
  errors = {},
}) {
  return (
    <MyErrorBoundary>
      <div>
        <textarea
          {...register(name, rules)}
          placeholder={placeholder}
        ></textarea>

        {errors[name] && <p>{errors[name].message}</p>}
      </div>
    </MyErrorBoundary>
  );
}
