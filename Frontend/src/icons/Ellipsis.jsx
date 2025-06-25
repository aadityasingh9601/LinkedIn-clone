export default function Ellipsis({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-ellipsis"
        onClick={onClick}
        style={{ ...styles, display: "inline-block" }}
      ></i>
    </div>
  );
}
