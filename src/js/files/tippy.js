// Подключение функционала "Чертогов Фрилансера"
import { isMobile, FLS } from './functions.js';
// Подключение списка активных модулей
import { flsModules } from './modules.js';

// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение cтилей из src/scss/libs
// import '../../scss/libs/tippy.scss';
// Подключение cтилей из node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей

const tippyMap = new Map();

document.querySelectorAll('.talk-about-us [data-tippy]').forEach((item) => {
  const bullet = item.querySelector('[data-tippy-bullet]');
  const content = item.querySelector('[data-tippy-content]');
  if (bullet && content) {
    const placement = content.getAttribute('data-tippy-content');
    tippy(bullet, {
      content: content,
      arrow: true,
      maxWidth: 372,
      offset: [0, 15],
      placement: placement ? placement : 'top',
      trigger: 'focus click',
    });
  }
});
flsModules.tippy = tippyMap;
