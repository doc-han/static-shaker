import React from "react";
import styles from "./googleGPT.modules.css";

const MATCHES = ["*://*.google.com"];

export function getConfig() {
  return {
    matches: MATCHES,
  };
}

console.log("I'm on the google page!");

const BoxModal: React.FC = () => {
  return (
    <div className={styles.boxModal}>
      <button>Search with GPT</button>
    </div>
  );
};
export default BoxModal;
