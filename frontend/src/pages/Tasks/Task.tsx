import { useTranslation } from "react-i18next";

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
  src
}: {
  title: string;
  buttonText: string;
  value: number;
  type: TTaskType;
  src: string;
  imgSrc?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="subscribe-task">
      <img
        src={imgSrc ? imgSrc : getTaskThumbnail(type)}
        className="subscribe-task__img"
      />
      <div className="subscribe-task__content">
        <div className="subscribe-task__title">{title}</div>
        <button className="subscribe-task__btn" onClick={() => {}}>
          <a target="_blank" href={src} style={{textDecoration: 'none', color: 'inherit'}}>{buttonText}</a>
        </button>
        <div className="subscribe-task__info">
          <span className="subscribe-task__text">{t('creditedResource')}</span>
          <span className="subscribe-task__plus">+{value}</span>
        </div>
      </div>
    </div>
  );
};
export default Task;
