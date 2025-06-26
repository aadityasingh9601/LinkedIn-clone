export default function Trash({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-trash"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
