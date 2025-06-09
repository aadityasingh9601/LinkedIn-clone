export default function Trash({ styles = {}, onClick }) {
  return (
    <div>
      <i class="fa-solid fa-trash" style={styles} onClick={onClick}></i>
    </div>
  );
}
