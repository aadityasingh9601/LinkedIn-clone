export default function Pen({ onClick, styles = {} }) {
  return (
    <div>
      <i class="fa-solid fa-pen" style={styles} onClick={onClick}></i>
    </div>
  );
}
