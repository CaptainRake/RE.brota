import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useProgressStore,
} from '../stores/progressStore';


const shopCategories = [
  {
    id: 'characters',

    title:
      'Personagens',

    items: [
      {
        id:
          'character-01',

        name:
          'Explorador 01',

        image:
          'ui/shop/characters/Character_01.png',

        price:
          120,
      },

      {
        id:
          'character-02',

        name:
          'Explorador 02',

        image:
          'ui/shop/characters/Character_02.png',

        price:
          160,
      },

      {
        id:
          'character-03',

        name:
          'Explorador 03',

        image:
          'ui/shop/characters/Character_03.png',

        price:
          200,
      },
    ],
  },


  /*
    No futuro:

    {
      id: 'guides',
      title: 'Guias',
      items: [...]
    }
  */
];


export default function Shop() {
  const navigate =
    useNavigate();


  const leaves =
    useProgressStore(
      (state) =>
        state.leaves
    );


  return (
    <main className="shop-page">

      <header className="shop-header">

        <button
          type="button"

          className="shop-back"

          onClick={() =>
            navigate('/home')
          }

          aria-label="Voltar"
        >
          <img
            src={
              `${import.meta.env.BASE_URL}ui/common/back.svg`
            }

            alt=""
          />
        </button>


        <div className="shop-header-copy">

          <span>
            SUPRIMENTOS
          </span>


          <h1>
            Barraca de Expedição
          </h1>

        </div>


        <div className="shop-balance">

          <span className="shop-leaf-icon">
            🍃
          </span>


          <strong>
            {leaves ?? 0}
          </strong>

        </div>

      </header>


      <section className="shop-content">

        {shopCategories.map(
          (category) => (

            <ShopCarousel
              key={
                category.id
              }

              category={
                category
              }
            />

          )
        )}

      </section>

    </main>
  );
}


function ShopCarousel({
  category,
}) {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);


  const items =
    category.items;


  function previousItem() {
    setActiveIndex(
      (
        current
      ) =>
        (
          current -
          1 +
          items.length
        ) %
        items.length
    );
  }


  function nextItem() {
    setActiveIndex(
      (
        current
      ) =>
        (
          current +
          1
        ) %
        items.length
    );
  }


  const activeItem =
    items[
      activeIndex
    ];


  return (
    <section className="shop-category">

      <div className="shop-category-header">

        <span>
          COLEÇÃO
        </span>


        <h2>
          {
            category.title
          }
        </h2>

      </div>


      <div className="shop-carousel">

        {items.map(
          (
            item,
            index
          ) => {

            const offset =
              getCarouselOffset(
                index,
                activeIndex,
                items.length
              );


            return (
              <button
                key={
                  item.id
                }

                type="button"

                className={
                  `shop-character ${
                    offset ===
                    0
                      ? 'active'
                      : ''
                  }`
                }

                data-offset={
                  offset
                }

                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }

                aria-label={
                  item.name
                }
              >

                <img
                  src={
                    `${import.meta.env.BASE_URL}${item.image}`
                  }

                  alt={
                    item.name
                  }
                />

              </button>
            );
          }
        )}

      </div>


      <div className="shop-item-info">

        <strong>
          {
            activeItem.name
          }
        </strong>


        <span>
          🍃 {
            activeItem.price
          }
        </span>

      </div>


      <div className="shop-carousel-controls">

        <button
          type="button"

          onClick={
            previousItem
          }

          aria-label="Anterior"
        >
          ‹
        </button>


        <div className="shop-carousel-dots">

          {items.map(
            (
              item,
              index
            ) => (

              <button
                key={
                  item.id
                }

                type="button"

                className={
                  index ===
                  activeIndex
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }

                aria-label={
                  `Mostrar ${item.name}`
                }
              />

            )
          )}

        </div>


        <button
          type="button"

          onClick={
            nextItem
          }

          aria-label="Próximo"
        >
          ›
        </button>

      </div>

    </section>
  );
}


function getCarouselOffset(
  index,
  activeIndex,
  length
) {
  if (
    index ===
    activeIndex
  ) {
    return 0;
  }


  const previous =
    (
      activeIndex -
      1 +
      length
    ) %
    length;


  const next =
    (
      activeIndex +
      1
    ) %
    length;


  if (
    index ===
    previous
  ) {
    return -1;
  }


  if (
    index ===
    next
  ) {
    return 1;
  }


  return 2;
}