import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDefaultUser } from "../assets/js/getUser";
import { getUserWallet, updateUser, updateWalletElement } from "../utils/axios";
import showPopup from "../assets/js/showPopup";
import { useTranslation } from "react-i18next";
import DepositPopup from '../components/Popup/DepositPopap';



function removeDuplicatesByElementAndName(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const element = item.element ?? item.symbol; // подстраховка
    const name = item.name?.trim().toLowerCase() ?? "";
    const key = `${element}_${name}`;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}





async function getWalletFromBackend(userId) {
        try {
          const response = await fetch('https://playmost.ru/api2/get-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),  // Передаем в теле user_id
          });
      
          if (!response.ok) {
            throw new Error('Не удалось получить данные о кошельке');
          }
      
          const data = await response.json();
          return data;  // Или data.wallet если так оформлено
        } catch (error) {
          console.error('Ошибка при получении кошелька:', error);
          return null;
        }
      }

export default function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [ton, setTon] = useState(window?.user?.ton ?? 0);
    const [coins, setCoins] = useState(window?.user?.coins ?? 0);
    const { t } = useTranslation();
    const [showDepositPopup, setShowDepositPopup] = useState(false);
    const [processingMonetId, setProcessingMonetId] = useState(null);

   async function initWallet() {
  const user = window.user;
  const walletData = await getWalletFromBackend(user.id);

  console.log('walletData',walletData);

  if (walletData && walletData.value) {
    const cleanedWallet = {
      ...walletData,
      value: removeDuplicatesByElementAndName(walletData.value),
    };

    // !!! тут можно полностью перезаписать value без дубликатов
    const uniqueIds = new Set();
    const finalValue = [];

    for (const item of cleanedWallet.value) {
      const key = `${item.element}_${item.name}`;
      if (!uniqueIds.has(key)) {
        uniqueIds.add(key);
        finalValue.push(item);
      }
    }

    setWallet({ ...cleanedWallet, value: finalValue });

    setCoins(user.coins ?? 0);
    setTon(user.ton ?? 0);
  }
}



   useEffect(() => {
  
  initWallet();
}, []);


    const showModal = (event, status) => {
        const walletElement = event.target.closest('.wallet__table');
        let content, additionalClasses = ['wallet__popup'];
        console.log((status) === 'wall');
        if (status === 'complete') {
            content = `<div class="wallet__popup-title">${t('exchangeSuccess')}</div><div class="wallet__popup-text">${t('balanceUpd')}</div>`;
        } else if (status === 'error') {
            content = `<div class="wallet__popup-title">${t('modalError')}</div><div class="wallet__popup-text">${t('notEnought')}</div>`;
        } else if (status === 'wall') {
            content = `<div class="wallet__popup-title">${t('modalError')}</div><div class="wallet__popup-text">${t('withdrawMsg')}</div>`;
        } else {
            content = `<div class="wallet__popup-title">${t('tryAgain')}</div>`;
        }

        content = '<div class="popup__inner">' + content + '</div>';

        showPopup(walletElement, content, additionalClasses);
    };

     async function updateElement(id, newValue, element) {
        console.log("mined",newValue);
        console.log("element",element);

            
        const response = await fetch(`https://playmost.ru/api2/ffeddscds/${id}/`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mined: newValue,   
                element: element,
                user_id: window.user?.id,
                }),

        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update element: ${error}`);
        }

        return await response.json();
        }

    const changeMonet = async (monet, event) => {
    if (monet.value === 0 || processingMonetId === monet.element) return;

    setProcessingMonetId(monet.element);

    try {
        const sameMonets = wallet.value.filter(
            item => item.element === monet.element && item.name === monet.name
        );

        let totalGive = 0;

        for (const item of sameMonets) {
            let coeff = 1;
            switch (item.rare) {
                case 'Редкая': coeff = 2; break;
                case 'Эпическая': coeff = 3; break;
            }

            totalGive += parseFloat((item.value * coeff).toFixed(6));
            await updateElement(item.element, 0, item); // Обнуляем каждый
        }

        const newWalletList = wallet.value.filter(
            item => !(item.element === monet.element && item.name === monet.name)
        );

        await updateWalletElement(wallet, newWalletList);
        await updateUser({ coins: totalGive + window.user.coins });

        window.user.coins += totalGive;
        const updatedWallet = {
  ...wallet,
  value: newWalletList,
};
initWallet();


const ids = newWalletList.map(i => i.element);
const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
if (duplicates.length) {
  console.warn("⚠️ Обнаружены дубли element в кошельке:", duplicates);
}


        setCoins(window.user.coins);
        showModal(event, 'complete');
    } catch (err) {
        console.error(err);
        showModal(event, 'error');
    } finally {
        setProcessingMonetId(null);
    }
};







    return (
        <div className="main__inner">
            <div className="wallet">
                <div className="wallet__row">
                    <div className="wallet__title">{t('wallet')}</div>
                    <div className="wallet__balance">
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <button 
      className="btn btn-deposit"
      onClick={() => setShowDepositPopup(true)}
    >
      {t("deposit")}
    </button>
    <span>{t('balance')}</span>
    <span className="wallet-total_tap">
      {(coins ?? 0).toFixed(3)} GC
    </span>
  </div>
</div>



                </div>
                <div className="wallet__table">
                    <div className="wallet__table-inner">
                        <div className="wallet__table-header">
                            <div>{t('monet')}</div>
                            <div>{t('balance')}</div>
                        </div>
                        <div className="wallet__table-row">
                            <div className="wallet__table-coin">
                                Tonium{" "}
                            </div>
                            <div>{(ton).toFixed(6)} TON</div>
                            <button className="btn btn-to" onClick={(e) => showModal(e, 'wall')}>
                                {t('withdraw')}
                            </button>
                        </div>
                        <hr className="wallet__table-hr" />
                        <div className="wallet__table-wrapper">
                           {wallet?.value?.length
  ? wallet.value
      .sort((a, b) => b.value - a.value)
      .map(item => (
        <div key={item.name} className="wallet__table-row">
          <div className="wallet__table-coin">
            {item.name}
            <span className="usd">USD 0,01322 $</span>
          </div>
          <div>{Number(item.value).toFixed(5)}</div>
          <button
            onClick={(e) => changeMonet(item, e)}
            className="btn"
            disabled={processingMonetId === item.element || item.value === 0}
          >
            {processingMonetId === item.element ? t('wait') : t('martketBtn')}
          </button>
        </div>
      ))
  : null}

                        </div>
                    </div>
                </div>
            </div>
            {showDepositPopup && (
  <DepositPopup
  isOpen={showDepositPopup}
  setPopupOpen={setShowDepositPopup}
  userId={window.user?.id}
  onSuccess={(sum) => {
    // 1. Обновим глобального юзера
    window.user.coins += sum;

    // 2. Обновим состояние
    setCoins(window.user.coins);

    // 3. Обновим сумму в верхнем меню
    const walletAmountElement = document.querySelector('.tap__wallet-amout');
    if (walletAmountElement) {
      walletAmountElement.innerText = window.user.coins.toFixed(4);
    }
  }}
/>

)}


        </div>

        
    );
}


