const getTaskThumbnail = (type: TTaskType) => {
  switch (type) {
    case "video":
      return "/img/tasks/video.png";
    case "notification":
      return "/img/tasks/notification.png";
    case "handshake":
      return "/img/tasks/handshake.png";
  }
};

type TTaskType = "video" | "notification" | "handshake";

const Task = ({
  title,
  buttonText,
  value,
  type,
  imgSrc,
}: {
  title: string;
  buttonText: string;
  value: number;
  type: TTaskType;
  imgSrc?: string;
}) => {
  return (
    <div className="subscribe-task">
      <img
        src={imgSrc ? imgSrc : getTaskThumbnail(type)}
        className="subscribe-task__img"
      />
      <div className="subscribe-task__content">
        <div className="subscribe-task__title">{title}</div>
        <button className="subscribe-task__btn" onClick={() => {}}>
          {buttonText}
        </button>
        <div className="subscribe-task__info">
          <span className="subscribe-task__text">Ресурсов начислится</span>
          <span className="subscribe-task__plus">+{value}</span>
        </div>
      </div>
    </div>
  );
};
export default Task;
