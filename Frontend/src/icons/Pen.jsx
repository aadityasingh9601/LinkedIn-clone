export default function Pen({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-pen"
        style={{ ...styles, display: "inline-block" }}
        onClick={onClick}
      ></i>
    </div>
  );
}
