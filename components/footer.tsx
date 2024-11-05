"use client";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full pb-4">
      <p className="text-sm text-center leading-normal">
        &copy; {t("footer.rights")}{" "}
        <a href="https://github.com/Leytox" target="_blank" title=":)">
          Leytox
        </a>{" "}
        2024.
        <br />
        <a href="https://standwithukraine.com.ua" target="_blank">
          {t("footer.standWith")}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
