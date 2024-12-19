import Popup from './Popup';
import PopupFuture from './PopupFuture';
import styles from "./Popup.module.scss";
import { useEffect, useState } from 'react';
import { getUserSpaceships, updateUser, updateUserSpaceship } from '../../utils/axios';
import { getInitValCorables } from '../main';
import { useUserStore } from '../../store/userStore';


export default function ShipMarket({
    setShowPopup,
    userId,
    onClick,
    isOpen,
    onSuccess,
}: {
    setShowPopup: (status: boolean) => void;
    userId: number | undefined;
    onSuccess: () => void;
    isOpen: boolean;
    onClick: (is: boolean, id: number) => void;
}) {
    const [val, setVal] = useState({
        cost: 0,
        amount: 0,
        damage: 0
    })

    const user = useUserStore.getState().user;
        const setUser = useUserStore().setUser;
    
    const [cosmoports, setCosmoports] = useState();
    const getUserCosmoport = async () => {
        if(userId) {
            const data = await getUserSpaceships(userId);
            let cosmoport;
            if(data?.length) {
                cosmoport = data.find(item => item.type === 'corable');
                setCosmoports(cosmoport);
            }
            const init = getInitValCorables(cosmoport);
            console.log(init)
            setVal({
                cost: init?.cost,
                amount: init?.amount,
                damage: init?.damage
            })
            
        }
    }

    const upgradeUserCosmoport = async () => {
        
        if(!user) return
        if(user?.coins > val.cost) {
            const newUser = await updateUser({ coins: user.coins - val.cost })
            setUser(newUser);

            if(cosmoports?.id) {
                await updateUserSpaceship({level: cosmoports.level + 1, type: 'corable', id: cosmoports.id}, 'update');
            } else {
                await updateUserSpaceship({level: 1, type: 'corable', userId}, 'create')
            }
        }
        setShowPopup(false);
    };

    useEffect(() => {
        if(isOpen)
            getUserCosmoport();
    }, [isOpen])
    return (
        <PopupFuture
            img="/modals/mobile/corable/Spaceship.png"
            cost={val.cost}
            type="upgrade"
            isOpen={isOpen}
            onSuccess={() => {
                
                upgradeUserCosmoport();
            }}
            setShowPopup={setShowPopup}
            title="Рынок кораблей">
            <div className={styles.upgrade__planet__wrapper}>
                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>Уровень</span>
                        <div>
                            <span>{cosmoports?.level ?? 0}</span>
                            <span className="global-green">
                                {` -> `}
                                {cosmoports?.level ? cosmoports?.level + 1 : 1}
                            </span>
                        </div>
                    </div>
                    {!cosmoports?.id && <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>Урон</span>
                        <div>
                            <span>{val?.damage}</span>
                            <span className="global-green">
                                {` -> `}
                                {val?.damage + 1}
                            </span>
                        </div>
                    </div>}
                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>Количество ударов</span>
                        <div>
                            <span>{val.amount}</span>
                            <span className="global-green">
                                {` -> `}
                                {val.amount + 1}
                            </span>
                        </div>
                    </div>
                </div>
        </PopupFuture>
    );
}
