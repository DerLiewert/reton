/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

window.addEventListener('load', function (e) {
  const newsSliders = document.querySelectorAll('[data-slider="news"]');
  newsSliders.forEach((slider) => {
    const swiper = slider.querySelector('.swiper');
    const nextBtn = slider.querySelector('.slider-btn-next');
    const prevBtn = slider.querySelector('.slider-btn-prev');
    const pagination = slider.querySelector('.news__slider-pagination');
    if (swiper) {
      new Swiper(swiper, {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        autoHeight: true,
        watchOverflow: true,
        speed: 300,

        pagination: {
          el: pagination,
          clickable: true,
        },

        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },

        breakpoints: {
          320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 25,
          },
          992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 25,
          },
        },
      });
    }
  });
});
