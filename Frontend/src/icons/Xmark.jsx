export default function Xmark({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-xmark cross"
        onClick={onClick}
        style={{ position: "absolute", display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
