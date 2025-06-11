export default function Paperclip({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i className="fa-solid fa-paperclip" style={styles} onClick={onClick}></i>
    </div>
  );
}
