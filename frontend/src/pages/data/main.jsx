import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export const slides = () => {
    const {t} = useTranslation();
    return [
        {
            id: 0,
            title: t("s1Title"),
            text: t("s1Text"),
            image: "/images/1.png",
        },
        {
            id: 1,
            title: t("s2Title"),
            text: t("s2Text"),
            image: "/images/2.png",
        },
        {
            id: 2,
            title: t("s3Title"),
            text: t("s3Text"),
            image: "/images/3.png",
        },
        {
            id: 3,
            title: t("s4Title"),
            text: t("s4Text"),
            image: "/images/4.png",
        },
        {
            id: 4,
            title: t("s5Title"),
            text: t("s5Text"),
            image: "/images/5.png",
        },
    ];
};
