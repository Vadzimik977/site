import PlanetDetailItem from "./PlanetDetailItem";
import { SwiperSlide } from "swiper/react";

export default function PlanetsDetail({
	getPlanetLevel,
	onClick,
	userHasPlanet,
    withSwiper = false
}) {
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
	return (
		<div className="wrapper container without max-hidden">
			{items.map((item) =>
				withSwiper ? (
					<SwiperSlide className="swiper-container-slide">
						<PlanetDetailItem
							key={item.id}
							title={item.title}
							img={item.img}
							userHasPlanet={userHasPlanet}
							getPlanetLevel={getPlanetLevel}
							id={item.id}
							onClick={() =>
								onClick({ title: item.title, img: item.img })
							}
						/>
					</SwiperSlide>
				) : (
					<PlanetDetailItem
						key={item.id}
						title={item.title}
						img={item.img}
						userHasPlanet={userHasPlanet}
						getPlanetLevel={getPlanetLevel}
						id={item.id}
						onClick={() =>
							onClick({ title: item.title, img: item.img })
						}
					/>
				)
			)}
		</div>
	);
}
