import { useEffect, useState, useContext } from "react";
import { DataContext } from "../components/Layout";
import { useTranslation } from "react-i18next";
import PlanetMain from "../components/main/PlanetMain";
import { ColorRing } from "react-loader-spinner";
import { getPlanets } from "../utils/axios";
import Layout from "../components/Layout";
import AllianceModal from "../components/Popup/Alliancemodal";
import styles from "../components/main/PlanetMain.module.scss";


const url = "https://playmost.ru";

export default function Planets() {
  const [modalOpenForPlanetId, setModalOpenForPlanetId] = useState(null);
  const { user, isLoading } = useContext(DataContext);
  const { t } = useTranslation();

  const [planets, setPlanets] = useState([]);
  const [range, setRange] = useState([0, 9]);
  const [loading, setLoading] = useState(false);

  const [assignedPlanets, setAssignedPlanets] = useState([null, null, null]);
  const [UserAlliancePlanets, setUserAlliancePlanets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [hasEmptySlots, setHasEmptySlots] = useState(false);
  const [planetsWithAllianceMined, setPlanetsWithAllianceMined] = useState([]);

  const [showSuccess, setShowSuccess] = useState(false);

  async function openModalForPlanet(planetId) {
    if (!user?.id) return;

    try {
      const response = await fetch(`${url}/api2/get_planets_alliance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await response.json();

      if (data && typeof data === "object" && !Array.isArray(data)) {
        setUserAlliancePlanets([data]);
      } else if (Array.isArray(data)) {
        setUserAlliancePlanets(data);
      } else {
        setUserAlliancePlanets([]);
      }

      setModalOpenForPlanetId(planetId);
      setAssignedPlanets([null, null, null]); // Обнулим слоты при открытии
      setHasEmptySlots(false);
    } catch (error) {
      console.error("Ошибка при получении планет:", error);
      setUserAlliancePlanets([]);
      setModalOpenForPlanetId(planetId);
      setAssignedPlanets([null, null, null]);
      setHasEmptySlots(false);
    }
  }

  function closeModal() {
    setModalOpenForPlanetId(null);
    setAssignedPlanets([null, null, null]);
    setUserAlliancePlanets([]);
    setIsCreating(false);
    setHasEmptySlots(false);
    setShowSuccess(false);
  }

  function handleDrop(draggedPlanetId, slotIndex) {
    const draggedPlanet = UserAlliancePlanets.find((p) => p.id === draggedPlanetId);
    if (!draggedPlanet) return;

    const planetInSlot = assignedPlanets[slotIndex];

    if (planetInSlot) {
      setUserAlliancePlanets((prev) =>
        prev
          .filter((p) => p.id !== draggedPlanetId)
          .concat(planetInSlot)
      );

      setAssignedPlanets((prev) => {
        const newAssigned = [...prev];
        newAssigned[slotIndex] = draggedPlanet;
        return newAssigned;
      });
    } else {
      setAssignedPlanets((prev) => {
        const newAssigned = [...prev];
        newAssigned[slotIndex] = draggedPlanet;
        return newAssigned;
      });

      setUserAlliancePlanets((prev) => prev.filter((p) => p.id !== draggedPlanetId));
    }
  }

 async function handleCreateAlliance(allianceName) {
  if (!user?.id) return;
  setIsCreating(true);

  const planetsToSend = assignedPlanets
    .filter(Boolean)
    .map((p) => ({ planet_id: p.planet_id, user_id: p.user_id }));

  const planetsToSend22 = assignedPlanets.filter(Boolean).map((p) => p.id);

  if (planetsToSend.length === 0) {
    alert("Добавьте хотя бы одну планету в альянс");
    setIsCreating(false);
    return;
  }

  try {
    const response = await fetch(`${url}/api2/create_alliance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: user.id, 
        planets: planetsToSend22,
        alliancename: allianceName  // вот тут добавляем имя альянса
      }),
    });

    if (!response.ok) throw new Error("Ошибка создания альянса");

    setPlanets((prevPlanets) => {
      const updatedPlanets = prevPlanets.map((planetItem) => {
        const match = planetsToSend.find(
          (p) =>
            p.planet_id === planetItem.planet.id &&
            p.user_id === planetItem.user_planet.userId
        );

        if (match) {
          console.log(`✅ Планета ${planetItem.planet.id} — alliance установлен`);
          return {
            ...planetItem,
            user_planet: {
              ...planetItem.user_planet,
              alliance: true,
            },
          };
        } else {
          console.log(`⏭️ Планета ${planetItem.planet.id} — без изменений`);
        }

        return planetItem;
      });

      console.log("Обновлённый список планет с alliance:");
      updatedPlanets.forEach(p => {
        console.log(`Планета ${p.planet.id}: alliance = ${p.user_planet.alliance}`);
      });

      return updatedPlanets;
    });

    closeModal();
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setIsCreating(false);
    }, 3000);
    setTimeout(() => {
  window.location.reload();
}, 1000);
  } catch (error) {
    alert("Ошибка при создании альянса");
    setIsCreating(false);
  }
}


  const fetchPlanets = async (step = 10) => {
    if (!user?.id) return;

    const userId = user.id;
    const start = planets.length === 0 ? 0 : range[1] + 1;
    const end = start + (step - 1);
    const newRange = [start, end];

    setLoading(true);
    try {
      const data = await getPlanets(newRange, false, userId);
      if (Array.isArray(data)) {
        setPlanets((prev) => [...prev, ...data]);
        setRange(newRange);
      } else {
        console.warn("Планеты пришли не массивом:", data);
      }
    } catch (err) {
      console.error("Ошибка при получении планет:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!planets.length) return;

  const interval = setInterval(() => {
    const now = Date.now();

    const updatedPlanets = planets.map((planetItem) => {
      const { user_planet, planet } = planetItem;
      if (!user_planet?.alliance) {
        return { ...planetItem, allianceMined: 0 };
      }

      const mainMined = user_planet.mined + ((now - user_planet.lastTimestamp) / 1000) * user_planet.speed / 3600;

      const relatedIds = user_planet.related_planets || [];

      const relatedSum = planets
        .filter((p) => relatedIds.includes(p.planet.id))
        .reduce((acc, p) => {
          const rp = p.user_planet;
          if (!rp) return acc;
          return acc + (rp.mined + ((now - rp.lastTimestamp) / 1000) * rp.speed / 3600);
        }, 0);

      return {
        ...planetItem,
        allianceMined: mainMined + relatedSum,
      };
    });

    setPlanetsWithAllianceMined(updatedPlanets);
  }, 1000);

  return () => clearInterval(interval);
}, [planets]);

  useEffect(() => {
    if (!user || isLoading) return;
    fetchPlanets();
  }, [user, isLoading]);

  return (
    <>
      <div className="main__inner" style={{ position: "relative" }}>
        <h1 className="main__title">{t("buyPlanet")}</h1>

        <div className="planets">
          {planets.length > 0 ? (
            planets.map((item) => (
              <PlanetMain
                key={item.planet.id}
                planetData={item}
                userId={user.id}
                allianceMined={item.allianceMined || 0}
                openModal={() => openModalForPlanet(item.planet.id)}
              />
            ))
          ) : (
            !loading && <p>{t("noPlanets")}</p>
          )}
        </div>

        {showSuccess && (
  <div className={styles.successOverlay}>
    Альянс успешно создан
  </div>
)}

        {loading && (
          <div
            className="color-ring-wrapper planets-ring"
            style={{ marginTop: 24 }}
          >
            <ColorRing
              visible={true}
              height={100}
              width={100}
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        )}

        {!loading && range[1] < 119 && (
          <button className="btn btn-show" onClick={() => fetchPlanets(10)}>
            {t("showMore")}
          </button>
        )}
      </div>

      {modalOpenForPlanetId && (
        <AllianceModal
          isOpen={true}
          setIsOpen={closeModal}
          planetId={modalOpenForPlanetId}
          assignedPlanets={assignedPlanets}
          handleDrop={handleDrop}
          handleCreateAlliance={handleCreateAlliance}
          hasEmptySlots={hasEmptySlots}
          UserAlliancePlanets={UserAlliancePlanets}
          isCreating={isCreating}
          showSuccess={showSuccess}
        />
      )}
    </>
  );
}
