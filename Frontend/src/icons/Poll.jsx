export default function Poll({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i
        class="fa-solid fa-square-poll-vertical"
        onClick={onClick}
        style={styles}
      ></i>
    </div>
  );
}
