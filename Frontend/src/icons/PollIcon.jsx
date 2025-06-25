export default function Pollicon({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-square-poll-vertical"
        onClick={onClick}
        style={{ ...styles, display: "inline-block" }}
      ></i>
    </div>
  );
}
