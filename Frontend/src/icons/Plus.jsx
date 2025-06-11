export default function Plus({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-plus" style={styles} onClick={onClick}></i>
    </div>
  );
}
