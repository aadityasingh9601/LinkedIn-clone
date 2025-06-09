export default function SmileS({ styles = {}, onClick }) {
  return (
    <div>
      <i
        className="fa-solid fa-face-smile"
        style={styles}
        onClick={onClick}
      ></i>
    </div>
  );
}
