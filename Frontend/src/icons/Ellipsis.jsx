export default function Ellipsis({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-ellipsis"
        onClick={onClick}
        style={{ display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
