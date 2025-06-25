export default function ImageIcon({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-regular fa-image"
        style={{ ...styles, display: "inline-block" }}
        onClick={onClick}
      ></i>
    </div>
  );
}
