export default function ClockR({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-regular fa-clock" onClick={onClick} style={styles}></i>
    </div>
  );
}
