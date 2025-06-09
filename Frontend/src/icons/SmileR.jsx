export default function SmileR({ styles = {}, onClick }) {
  return (
    <div>
      <i
        className="fa-regular fa-face-smile"
        onClick={onClick}
        style={styles}
      ></i>
    </div>
  );
}
