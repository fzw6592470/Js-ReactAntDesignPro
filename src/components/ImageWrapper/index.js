import React from 'react';
import styles from './index.less';

const ImageWrapper = ({ src, desc, style }) => (
    <div style={style} className={styles.imageWrapper}>
      <img src={src} alt={desc} className={styles.img} />
      {desc && <div className={styles.desc}>{desc}</div>}
    </div>
);

export default ImageWrapper;
