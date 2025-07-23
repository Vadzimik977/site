window.addEventListener('load', (event) => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Подготовка WebApp
    tg.expand(); // Разворачиваем WebApp
    // tg.disableVerticalSwipes();
    const userName = tg.initDataUnsafe.user.username || "vadi977";

    // Сохраняем userId в localStorage
    const ty = window.Telegram.WebApp.initData;
    console.log(ty)
    const userId = tg.initDataUnsafe.user?.id || 1;
    if (userId) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        console.log("User ID сохранен:", userId);
    } else {
        console.error("User ID не найден в initDataUnsafe.");
    }
});