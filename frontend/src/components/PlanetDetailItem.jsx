export default function PlanetDetailItem({onClick, id, title, img, getPlanetLevel, userHasPlanet}) {
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
		<div
			className={`content-build  build-${id}-w`}
			onClick={() => onClick()}>
			<img
				className={`build build-${id} ${
					getPlanetLevel(title) ? "active" : ""
				}`}
				src={`/builds/${img}`}
				alt=""
			/>
			<Up visible={!getPlanetLevel(title)} />
		</div>
	);
}
