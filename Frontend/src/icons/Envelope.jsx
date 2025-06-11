export default function Envelope({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-envelope" style={styles} onClick={onClick}></i>
    </div>
  );
}
