import { useCallback, useEffect, useState } from "react";
import {
	getPlanet,
	updateBuilds,
	updateUser,
	updateUserPlanet,
	updateWalletElement,
} from "../utils/axios";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "../scss/detail.scss";
import PlanetsDetail from "../components/PlanetsDetail";
import Modal from "../components/Modal";
import PlanetDetailItem from "../components/PlanetDetailItem";

export default function Detail() {
	const { planetId } = useParams();
	const [planet, setPlanet] = useState();
	const [loading, setIsLoading] = useState(false);
	const [value, setValue] = useState(0);
	const [resource, setResource] = useState(false);
	const [click, setClick] = useState(0);
	const [show, setShow] = useState(false);
	const [item, setItem] = useState("");

	const { t } = useTranslation();
	const items = [
		{
			id: 1,
			title: "first",
			img: "1.png",
		},
		{
			id: 2,
			title: "second",
			img: "2.png",
		},
		{
			id: 3,
			title: "third",
			img: "3.png",
		},
		{
			id: 4,
			title: "fourth",
			img: "4.png",
		},
		{
			id: 5,
			title: "fiveth",
			img: "5.png",
		},
		{
			id: 6,
			title: "sixth",
			img: "6.png",
		},
		{
			id: 7,
			title: "seventh",
			img: "7.png",
		},
	];
	const builds = {
		first: t("firstBuild"),
		second: t("secondBuild"),
		third: t("thirdBuild"),
		fourth: t("fourthBuild"),
		fiveth: t("fivethBuild"),
		sixth: t("sixthBuild"),
		seventh: t("seventhBuild"),
	};
	const buildsCosts = {
		first: 3,
		second: 3,
		third: 6,
		fourth: 12,
		fiveth: 24,
		sixth: 48,
		seventh: 96,
	};
	const fetchPlanet = async () => {
		const a = await getPlanet(planetId, window?.user?.id);
		setPlanet(a);

		setIsLoading(false);
		getInitState(a);

		if (a.user_planets?.length) {
			const userPlanet = a.user_planets.find(
				(item) => item.userId === window?.user?.id
			);
			if (userPlanet?.level) {
				const allBuildsLength = Number(
					window.user.wallet?.builds?.length ?? 0
				);

				if (allBuildsLength < userPlanet.level) {
					const diff = +userPlanet.level - allBuildsLength;
					const buildsValue = Object.keys(builds);

					if (allBuildsLength > 0) {
						const planetToAdd = [];
						const filtered = buildsValue.filter((item) =>
							window.user.wallet.builds.some((a) => a !== item)
						);

						for (let i = 0; i < diff; i++) {
							planetToAdd.push(filtered[i]);
						}

						await updateBuilds(window.user.wallet, [
							...window.user.wallet.builds,
							...planetToAdd,
						]);
					} else {
						const planetToAdd = [];

						for (let i = 0; i < diff; i++) {
							planetToAdd.push(buildsValue[i]);
						}

						await updateBuilds(window.user.wallet, planetToAdd);
					}
				}
			}
		}
	};

	const getInitState = (a) => {
		setValue(
			window?.user?.wallet?.value?.find(
				(bal) => bal.element === a?.element?.id
			)?.value
		);
	};

	const updatePlanetLevel = async (e) => {
		setShow(true);
		setItem(e);
	};

	const successPlanetUpd = async () => {
		let data;
		const builds = window.user.wallet.builds;
		const cost = buildsCosts[item.title];
		if (+window.user.coins < cost) {
			return;
		}
		if (builds?.length) {
			data = [...builds, item.title];
		} else {
			data = [item.title];
		}

		const userPlanet = planet.user_planets.find(
			(item) => item.userId === window.user.id
		);
		await updateBuilds(window.user.wallet, data);
		setShow(false);
		await updateUserPlanet(userPlanet.id, +userPlanet.level + 1);
		await updateUser({ coins: window.user.coins - cost });
		setItem({});
		window.user.coins = window.user.coins - cost;
		window.user.wallet.builds = data;
	};

	useEffect(() => {
		document.addEventListener("getUser", () => {
			setIsLoading(true);
			fetchPlanet();
		});
	}, [window, localStorage.getItem("user")]);

	const getPlanetLevel = (buildName) => {
		if (window.user.wallet?.builds?.length) {
			if (window.user.wallet.builds.includes(buildName)) {
				return true;
			}
		}

		return false;
	};

	const userHasPlanet = () => {
		if (planet?.user_planets) {
			console.log(planet);
			const plData = planet.user_planets;
			const idx = plData?.find(
				(item) =>
					item?.planetId === planet?.id &&
					item?.userId === window?.user?.id
			);
			if (idx?.id) {
				return true;
			}
		}
		if (window?.user?.userPlanets?.length) {
			const planets = window.user.userPlanets;
			if (planets.some((item) => item.planetId === planet?.id)) {
				const planeta = planets.find(
					(item) => item.planetId === planet?.id
				);
				//setUserPlanet(planet);
				return true;
			}
		}
		if (window?.user?.nft) {
			const arr = window.user.nft;
			const fullName = `${planet?.name}(${planet?.element?.symbol}) - Planet #${planet?.element?.index}`;
			const item = arr?.find((item) => item.metadata.name === fullName);
			if (item?.length && window.user.userPlanets?.length) {
				const planets = window.user.userPlanets;
				const planeta = planets.find(
					(item) => item.planetId === planet?.id
				);
				if (!planeta?.id) {
					//addPlanetToUser(id);
				}
			}
			return item?.length;
		}
		return false;
	};

	const putWallet = async (walletId, value) => {
		await updateWalletElement(walletId, value);
	};

	const updateFn = debounce(async (val, planet) => {
		if (loading) {
			setTimeout(() => {
				updateFn(val);
			}, 200);
			return;
		}

		if (window.user?.wallet) {
			const balance = window.user?.wallet?.value;

			const currentElem = balance?.find(
				(item) => item.element === planet?.element?.id
			);

			if (currentElem?.element) {
				setIsLoading(true);
				currentElem.value = parseFloat(
					(parseFloat(currentElem.value) + val).toFixed(10)
				);
				const data = [
					...balance.filter(
						(bal) => bal.element !== planet?.element?.id
					),
					{ ...currentElem },
				];
				setValue(currentElem.value);
				await putWallet(window.user.wallet, data);

				setIsLoading(false);
			} else {
				let data;
				console.log(planet, planetId);
				if (window.user.wallet.value?.length) {
					data = [
						...window.user.wallet.value,
						{
							element: planet?.element.id,
							value: val,
							name: planet?.element.name,
							img: planet?.element.img,
							symbol: planet?.element.symbol,
							rare: planet?.element.rare,
						},
					];
				} else {
					data = [
						{
							element: planet?.element.id,
							value: val,
							name: planet?.element.name,
							img: planet?.element.img,
							symbol: planet?.element.symbol,
							rare: planet?.element.rare,
						},
					];
				}
				setValue(val);
				await putWallet(window.user.wallet, data);
				window.user.wallet.value = data;
			}
			//await fetchDefaultUser();
		}
	}, 50);
	const debounceFn = useCallback(
		(click, planet) => updateFn(click, planet),
		[]
	);

	const walletUpdate = async (e) => {
		if (e.target.tagName.toLowerCase() === "button") return;

		const plusIcon = document.createElement("div");
		plusIcon.textContent = "+";
		plusIcon.classList.add("plus-icon");
		plusIcon.style.left = `${e.pageX}px`;
		plusIcon.style.top = `${e.pageY}px`;

		document.body.appendChild(plusIcon);
		plusIcon.addEventListener("animationend", () => plusIcon.remove());

		setClick(click + 1);
		if (!window?.user?.id && click >= 2) {
			showModal(e, "wallet");
		}

		if (userHasPlanet()) {
			debounceFn(0.00005, planet);
		} else {
			debounceFn(0.00005, planet);
		}
	};

	const Up = ({ visible }) =>
		userHasPlanet() && visible ? (
			<div className="up">
				<div className="symbols">
					<span className="symbol">❰</span>
					<span className="symbol">❰</span>
				</div>
				<span>BUY</span>
			</div>
		) : null;

	return (
		<Layout without>
			<div className="main__inner">
				{!planet?.id ? (
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
				) : (
					<div className="planet__detail">
						<Link
							style={{ textDecoration: "none" }}
							to="/planets"
							className="header-back container without">
							<div className="back-title">
								<span>
									{t("return")} <br /> {t("back")}
								</span>{" "}
								<br />
							</div>
							<img src="/builds/back.png" alt="Вернуться назад" />
							<div className="planet__detail-header container without max-visible m-hidden">
								<div className="header-planet">
									<span>
										{planet?.name}({planet?.element?.symbol}
										) - Planet #{planet?.element?.index}
									</span>
								</div>
								<div></div>
							</div>
						</Link>
						<div className="planet__detail-header container without max-hidden">
							<div className="header-planet">
								<span>
									{planet?.name}({planet?.element?.symbol}) -
									Planet #{planet?.element?.index}
								</span>
							</div>
							<div></div>
						</div>
						<div className="planet__detail-wrapper container without">
							<div className="planet-img">
								<img
									src={`/img/planet/${planet?.img}`}
									alt=""
									onClick={(e) => walletUpdate(e)}
								/>
								<div className="planet-farm m-hidden max-visible">
									<div className="planet-farm-content">
										<div className="planet-farm-content__first">
											<img
												onClick={() => setResource(!resource)}
												className={resource ? "open" : ""}
												src="/builds/arrow-right.png"
												alt=""
											/>
											<span>
												{t("free")}{" "}
												<span style={{ fontSize: "29px" }}>
													{t("resource")}
												</span>
											</span>
										</div>
										<div
											className={`planet-farm-tasks ${
												resource ? "flex" : "hidden"
											}`}>
											<div className="farm-task">
												<div>
													Чтобы получить 10{" "}
													{planet?.element?.symbol} <br />
													Подпишись на канал
												</div>
												<img src="/builds/tg.png" alt="" />
											</div>
											<div className="farm-task">
												<div>
													Чтобы получить 10{" "}
													{planet?.element?.symbol} <br />
													Подпишись на канал
												</div>
												<img src="/builds/tg.png" alt="" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="planet-information">
								<span className="info-header">
									{t("information")}
								</span>
								<div className="info-content">
									
									<div className="info-content-wrapper">
										<div>
											<span className="bold-title">
												{t("speed")} - {}
											</span>
											<span className="info-text">
												{userHasPlanet()
													? planet?.user_planets?.find(
															(item) =>
																item?.planetId ===
																planet?.id
													  ).level == 2
														? 0.1
														: 0.05
													: 0.00005}{" "}
												({planet?.element?.symbol})/
												{userHasPlanet()
													? t("hour")
													: t("tap")}
											</span>
										</div>
										<div className="">
											<span className="bold-title">
												{t("level")} - {}
											</span>
											<span className="info-text">
												{userHasPlanet()
													? planet.user_planets.find(
															(item) =>
																item?.planetId ===
																planet?.id
													  )?.level
													: 1}
											</span>
										</div>
									</div>
								</div>
								<p className="planet__gc">
									{value ?? "0.000"} {planet?.element?.symbol}
								</p>
							</div>
							<div className="planet-farm max-hidden">
								<div className="planet-farm-content">
									<img
										onClick={() => setResource(!resource)}
										className={resource ? "open" : ""}
										src="/builds/arrow-right.png"
										alt=""
									/>
									<span>
										{t("free")}{" "}
										<span style={{ fontSize: "29px" }}>
											{t("resource")}
										</span>
									</span>
									<div
										className={`planet-farm-tasks ${
											resource ? "flex" : "hidden"
										}`}>
										<div className="farm-task">
											<div>
												Чтобы получить 10{" "}
												{planet?.element?.symbol} <br />
												Подпишись на канал
											</div>
											<img src="/builds/tg.png" alt="" />
										</div>
										<div className="farm-task">
											<div>
												Чтобы получить 10{" "}
												{planet?.element?.symbol} <br />
												Подпишись на канал
											</div>
											<img src="/builds/tg.png" alt="" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="planet__detail-builds">
							<PlanetsDetail
								onClick={(e) => updatePlanetLevel(e)}
								userHasPlanet={userHasPlanet}
								getPlanetLevel={getPlanetLevel}
							/>
							<div className="wrapper container without slider m-hidden max-visible">
								<Swiper
									loop
									modules={[Navigation]}
									slidesPerView={1}
									spaceBetween={50}
									navigation>
										{items.map(item => (

									<SwiperSlide key={item.id} className="swiper-container-slide">
										<PlanetDetailItem 
											key={item.id}
											title={item.title}
											img={item.img}
											userHasPlanet={userHasPlanet}
											getPlanetLevel={getPlanetLevel}
											id={item.id}
											onClick={() =>
												updatePlanetLevel({ title: item.title, img: item.img })
											} />
									</SwiperSlide>
										))}
								</Swiper>
							</div>
							<img
								className="ten max-hidden"
								src="/builds/ten.png"
								alt=""
							/>
						</div>
					</div>
				)}
				{/* <div className="main__bg" style={{backgroundImage: 'url(/builds/bg.png)', width: '100%', height: '100%', position: 'absolute'}}>

                </div> */}
			</div>
			<Modal
				onClose={() => setShow(false)}
				cost={buildsCosts?.[item?.title]}
				open={show}
				title={builds?.[item?.title]}
				img={item?.img}
				updatePlanet={successPlanetUpd}
			/>
		</Layout>
	);
}
