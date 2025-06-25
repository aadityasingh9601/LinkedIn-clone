export default function ClockS({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-clock"
        onClick={onClick}
        style={{ ...styles, display: "inline-block" }}
      ></i>
    </div>
  );
}
