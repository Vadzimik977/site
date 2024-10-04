import { useTranslation } from "react-i18next";

export default function Modal({ open, title, onClose, img, updatePlanet, cost }) {
	const { t } = useTranslation();
	return open ? (
		<div tabIndex={1} className={`modal-select`}>
			<div className="modal-content">
				<div className="modal-header" style={{textAlign: 'center'}}>
					<h2>{t("buyPlanetModal")}</h2>
					<p>{title}</p>
					<button className="close-button" onClick={() => onClose()}>
						&times;
					</button>
				</div>
				<div style={{display: 'flex', justifyContent: 'center'}} className="options-list map__options">
					<img src={`/builds/${img}`} alt="" />
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
                        flexDirection: 'column',
						justifyContent: "center",
						marginTop: "20px",
					}}>
                    {cost > window.user.coins ? <div>
                        Недостаточно средств
                    </div>: null}
					<button style={{opacity: cost > window.user.coins ? 0.5 : 1}} className="buy btn" disabled={cost > window.user.coins} onClick={updatePlanet}>{cost} GC</button>
				</div>
			</div>
		</div>
	) : null;
}
