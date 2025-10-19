import React from 'react';
import styles from './Loader.module.css'; // We'll create this CSS file

const Loader: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;