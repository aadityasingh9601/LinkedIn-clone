export default function Pen({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i class="fa-solid fa-pen" style={styles} onClick={onClick}></i>
    </div>
  );
}
