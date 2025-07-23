import React from 'react';
import Popup from './Popup';
import styles from "./Popup.module.scss";
import { useDrag, useDrop, DragPreviewImage, DndProvider } from 'react-dnd';
import { MultiBackend, TouchTransition, MouseTransition } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useRef, useEffect } from 'react';
import { useState } from 'react';

const ItemTypes = {
  PLANET: 'planet',
};

// Конфигурация MultiBackend с переходами для мыши и тача
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true, // Важно для DragPreviewImage на мобилках
      transition: TouchTransition,
    },
  ],
};

const DraggablePlanet = ({ planet }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.PLANET,
    item: { id: planet.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Подключаем превью перетаскивания к картинке планеты
  useEffect(() => {
    if (preview && ref.current) {
      preview(ref.current);
    }
  }, [preview]);

  return (
    <>
      <DragPreviewImage connect={preview} src={`/img/planet/${planet.img}`} />
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 8,
          color: 'white',
          touchAction: 'none', // Чтобы браузер не блокировал жесты
          userSelect: 'none',
        }}
      >
        <img
          ref={ref}
          src={`/img/planet/${planet.img}`}
          alt={planet.name || 'Planet'}
          style={{ width: 40, height: 40, objectFit: 'contain', pointerEvents: 'none' }}
        />
        <span>{planet.name || 'Unnamed Planet'}</span>
        <span>LV {planet.level || 'N level'}</span>
      </div>
    </>
  );
};

const CircleSlot = ({ index, planet, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PLANET,
    drop: (item) => {
      onDrop(item.id, index);
      return { moved: true };
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px dashed #ccc',
        backgroundColor: isOver && canDrop ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        userSelect: 'none',
        touchAction: 'manipulation', // попробуй так
      }}
    >
      {planet ? (
        <img
          src={`/img/planet/${planet.img}`}
          alt={planet.name}
          style={{ width: 40, height: 40, objectFit: 'contain', pointerEvents: 'none' }}
        />
      ) : (
        <span>+</span>
      )}
    </div>
  );
};


const Alliancemodal = ({
  isOpen,
  setIsOpen,
  assignedPlanets,
  handleDrop,
  handleCreateAlliance,
  hasEmptySlots,
  UserAlliancePlanets,
  isCreating,
}) => {
  const [isAskingName, setIsAskingName] = useState(false);
  const [allianceName, setAllianceName] = useState('');

  if (!isOpen) return null;

  const onCreateClick = () => {
    if (hasEmptySlots) return; // запрещаем, если есть пустые слоты
    setIsAskingName(true);
  };

  const onConfirmName = () => {
  if (allianceName.trim().length === 0) {
    alert('Введите имя альянса');
    return;
  }
  handleCreateAlliance(allianceName.trim());
  setIsAskingName(false);
  setAllianceName('');
};


  const onCancelName = () => {
    setIsAskingName(false);
    setAllianceName('');
  };

  return (
    <Popup title="Создание Альянса" setPopupStatus={setIsOpen}>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <p style={{ fontSize: '9px', marginTop: 4, marginBottom: 12 }}>
            После создания альянса здоровье всех планет будет суммировано
          </p>
        </div>
        <div className={styles.modalBody}>
  <div className={styles.leftPart}>
    {!isAskingName ? (
      <>
        <div className={styles.circleBorder} />
        {[0, 1, 2].map((idx, _, arr) => {
          const radius = 50;
          const center = 40;
          const angle = (idx / arr.length) * 2 * Math.PI - Math.PI / 2;
          const x = isCreating ? center : center + radius * Math.cos(angle);
          const y = isCreating ? center : center + radius * Math.sin(angle);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                transition: 'left 1.5s ease, top 1.5s ease',
              }}
            >
              <CircleSlot index={idx} planet={assignedPlanets[idx]} onDrop={handleDrop} />
            </div>
          );
        })}

        <div className={styles.createAllianceWrapper}>
          <button
            className={styles.createAllianceBtn}
            onClick={onCreateClick}
            disabled={hasEmptySlots}
            style={{ cursor: hasEmptySlots ? 'not-allowed' : 'pointer' }}
            onMouseEnter={(e) => {
              if (!hasEmptySlots) {
                e.currentTarget.style.background =
                  'linear-gradient(135deg,rgb(138, 139, 142) 0%,rgb(17, 203, 98) 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (!hasEmptySlots) {
                e.currentTarget.style.background =
                  'linear-gradient(135deg,rgb(132, 130, 134) 0%, #2575fc 100%)';
              }
            }}
          >
            Создать Альянс
          </button>
        </div>
      </>
    ) : (
     // Форма ввода имени
<div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
  <input
    type="text"
    placeholder="Введите имя альянса"
    value={allianceName}
    onChange={(e) => setAllianceName(e.target.value)}
    style={{ padding: '6px', fontSize: '14px', width: '100%' }}
    autoFocus
  />
  <div className={styles.modal__buttons_wrapper}>
  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start', width: '100%' }}>
    <button
      onClick={onConfirmName}
      style={{
  background: 'linear-gradient(135deg, #f8c335, #d09b0d)',
  cursor: 'pointer',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 4,
  height: 36,
  fontSize: 14,
  width: '50%',
  fontWeight: 'bold',
  userSelect: 'none',
}}

    >
      Подтвердить
    </button>
    <button
      onClick={onCancelName}
      style={{
        background: 'linear-gradient(135deg, #f8c335, #d09b0d)',
        cursor: 'pointer',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: 4,
        height: 36,
        fontSize: 14,
        width:'50%',
        fontWeight: 'bold',
        userSelect: 'none',
      }}
    >
      Отмена
    </button>
  </div>
  </div>
</div>

     
    )}
  </div>

  {!isAskingName && (
    <div className={styles.rightPart}>
      <h3>Доступные планеты</h3>
      {UserAlliancePlanets.length === 0 ? (
        <p>Нет доступных планет</p>
      ) : (
        UserAlliancePlanets.map((planet) => (
          <DraggablePlanet key={planet.id} planet={planet} />
        ))
      )}
    </div>
  )}
</div>

      </DndProvider>
    </Popup>
  );
};

export default Alliancemodal;