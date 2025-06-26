export default function Pollicon({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-square-poll-vertical"
        onClick={onClick}
        style={{ display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
