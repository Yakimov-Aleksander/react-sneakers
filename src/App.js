import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import AppContext from './context';
import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] =
          await Promise.all([
            axios.get('https://6429cf0b00dfa3b5473aab07.mockapi.io/cart'),
            axios.get('https://64301233b289b1dec4c09fd9.mockapi.io/favorites'),
            axios.get('https://6429cf0b00dfa3b5473aab07.mockapi.io/items'),
          ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных');
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    const findItem = cartItems.find(
      (item) => Number(item.parentId) === Number(obj.id),
    );
    try {
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id)),
        );
        await axios.delete(
          `https://6429cf0b00dfa3b5473aab07.mockapi.io/cart/${findItem.id}`,
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          'https://6429cf0b00dfa3b5473aab07.mockapi.io/cart',
          obj,
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину');
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6429cf0b00dfa3b5473aab07.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id)),
      );
    } catch (error) {
      alert('Ошибка при удалении из корзины');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://64301233b289b1dec4c09fd9.mockapi.io/favorites/${obj.id}`,
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id)),
        );
      } else {
        const { data } = await axios.post(
          `https://64301233b289b1dec4c09fd9.mockapi.io/favorites`,
          obj,
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фаворит');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
        isLoading,
      }}
    >
      <div className='wrapper clear'>
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />
        <Header onClickCart={() => setCartOpened(true)} />

        <Route path='/' exact>
          <Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />
        </Route>

        <Route path='/favorites' exact>
          <Favorites />
        </Route>

        <Route path='/orders' exact>
          <Orders />
        </Route>
      </div>
    </AppContext.Provider>
  );
}

export default App;
