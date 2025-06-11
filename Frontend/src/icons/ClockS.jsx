export default function ClockS({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-clock" onClick={onClick} style={styles}></i>
    </div>
  );
}
