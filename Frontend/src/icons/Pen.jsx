export default function Pen({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-pen" style={styles} onClick={onClick}></i>
    </div>
  );
}
