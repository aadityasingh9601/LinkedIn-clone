export default function ClockR({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-regular fa-clock"
        onClick={onClick}
        style={{ display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
