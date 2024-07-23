import React from "react";
import styles from "./Article.module.css";

function Article({ title, description, link, Image }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={`text-2xl font-bold ${styles.inter}`} >{title}</div>
        <div className={ `${styles.desc}`}>{description}</div>
        <a href={link} target="_blank" className={styles.button}>
          <div>Learn more</div>
        </a>
      </div>
      <div className={styles.right}>
        <img
          src={Image}
          alt=""
          className="sm:absolute sm:max-w-max sm:h-full"
        />
      </div>
    </div>
  );
}

export default Article;