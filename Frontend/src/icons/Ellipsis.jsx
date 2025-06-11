export default function Ellipsis({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-ellipsis" onClick={onClick} style={styles}></i>
    </div>
  );
}
