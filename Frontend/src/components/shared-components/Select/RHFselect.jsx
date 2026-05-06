export default function RHFselect({
  register,
  name,
  options,
  errors = {},
  styles = {},
  rules = {},
}) {
  return (
    <div className="select">
      <select style={styles} {...register(name, { ...rules })}>
        {options?.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </select>
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  );
}
