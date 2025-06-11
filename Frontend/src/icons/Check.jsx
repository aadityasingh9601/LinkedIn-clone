export default function Check({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-check" style={styles} onClick={onClick}></i>
    </div>
  );
}
