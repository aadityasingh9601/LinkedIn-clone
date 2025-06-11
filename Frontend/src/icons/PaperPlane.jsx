export default function PaperPlane(styles = {}, onClick = () => {}) {
  return (
    <div>
      <i
        className="fa-solid fa-paper-plane"
        style={styles}
        onClick={onClick}
      ></i>
    </div>
  );
}
