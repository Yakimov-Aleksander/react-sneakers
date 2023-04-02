import React from 'react';
import styles from './Card.module.scss';

function Card({ title, imageUrl, price, onClickFavorite, onClickPlus }) {
  const [isAdded, setIsAdded] = React.useState(false);

  const onPlus = () => {
    onClickPlus({ title, imageUrl, price });
    setIsAdded(!isAdded);
  };

  return (
    <div className={styles.card}>
      <div className={styles.favorite} onClick={onClickFavorite}>
        <img src='/img/heart-unliked.svg' alt='Unliked' />
      </div>
      <img width={133} height={112} src={imageUrl} alt='Sneakers' />
      <h5>{title}</h5>
      <div className='d-flex justify-between align-center'>
        <div className='d-flex flex-column'>
          <span>Цена:</span>
          <b>{price}</b>
        </div>
        <img
          className={styles.plus}
          onClick={onPlus}
          src={isAdded ? '/img/btn-checked.svg' : '/img/btn-plus.svg'}
          alt='Plus'
        />
      </div>
    </div>
  );
}

export default Card;
