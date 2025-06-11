export default function ImageIcon({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-regular fa-image" style={styles} onClick={onClick}></i>
    </div>
  );
}
