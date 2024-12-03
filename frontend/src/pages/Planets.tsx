import { useTonAddress } from "@tonconnect/ui-react";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColorRing } from "react-loader-spinner";
import Layout from "../components/Layout";
import PlanetMain from "../components/main/PlanetMain";
import { useUserStore } from "../store/userStore";
import { IPlanet } from "../types/planets.type";
import { getPlanets } from "../utils/axios";

export default function Planets() {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState([0, 9]);
  const { t } = useTranslation();
  const { user } = useUserStore();
  const adress = useTonAddress();

  async function fetch(endRange?: number) {
    if (endRange) {
      range[1] = endRange;
    }

    const data = await getPlanets(range, false, user?.id ?? 0);

    setPlanets(data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetch();
  }, [user, adress]);

  return (
    <Layout>
      <Suspense>
        <div className="main__inner" style={{ position: "relative" }}>
          <h1 className="main__title">{t("buyPlanet")}</h1>
          <h6 className="main__text">{t("upgradePlanet")}</h6>
          <div className="planets">
            {/* {!user && (
              <div className="color-ring-wrapper planets-ring">
                <ColorRing
                  visible={true}
                  height={1000}
                  width={500}
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            )} */}

            {planets?.length ? (
              <>
                {planets?.map((item, idx) => (
                  <PlanetMain
                    planet={item}
                    key={item.id}
                    wallet={user?.wallet}
                    onUpdate={() => fetch()}
                  />
                  // <Planet
                  //   idx={item.element.index}
                  //   update={fetch}
                  //   planet={item}
                  //   key={item.id}
                  // />
                ))}
              </>
            ) : (
              <div className="color-ring-wrapper planets-ring">
                <ColorRing
                  visible={true}
                  height={1000}
                  width={500}
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            )}
          </div>

          <button
            className={`btn btn-show ${range[1] >= 119 ? "hidden" : ""}`}
            onClick={() => fetch(range[1] + 10)}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {t("showMore")}
          </button>
        </div>
      </Suspense>
    </Layout>
  );
}
