export default function CommentR(styles = {}, onClick = () => {}) {
  return (
    <div>
      <i className="fa-regular fa-comment" style={styles} onClick={onClick}></i>
    </div>
  );
}
