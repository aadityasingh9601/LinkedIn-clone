export default function Xmark({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i
        class="fa-solid fa-xmark cross"
        onClick={onClick}
        style={{ position: "absolute", ...styles }}
      ></i>
    </div>
  );
}
