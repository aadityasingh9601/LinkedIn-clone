export default function Plus({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-plus"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
