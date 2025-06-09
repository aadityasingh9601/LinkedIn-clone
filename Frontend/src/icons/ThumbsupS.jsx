export default function ThumbsupS({ styles = {}, onClick }) {
  return (
    <div>
      <i class="fa-solid fa-thumbs-up" style={styles} onClick={onClick}></i>
    </div>
  );
}
