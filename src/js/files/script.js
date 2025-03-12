// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from './functions.js';
// Подключение списка активных модулей
import { flsModules } from './modules.js';

const mediaMaxWidth992 = window.matchMedia('(max-width: 991.98px)');
const mediaMaxWidth480 = window.matchMedia('(max-width: 478.98px)');

function setHeaderTop() {
  document.documentElement.style.setProperty(
    '--header-top',
    document.querySelector('header').getBoundingClientRect().top * -1 + 'px',
  );
}
window.addEventListener('load', setHeaderTop);

//========================================================================================================================================================
//====== Установить в переменную --vh высоту в пикселях 1% экрана ==================================================================================================================================================
//========================================================================================================================================================
function setVH() {
  let vh = (getWindowHeight() * 0.01).toFixed(2);
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

let windowResizeTimeoutId;
window.addEventListener('resize', () => {
  clearTimeout(windowResizeTimeoutId);
  windowResizeTimeoutId = setTimeout(setVH, 100);
});
setVH();

//========================================================================================================================================================
//====== Open menu on burger click (screen < 992 ) ==================================================================================================================================================
//========================================================================================================================================================
function burger() {
  const burger = document.querySelector('.burger');
  if (!burger) return;

  burger.addEventListener('click', () => {
    if (document.documentElement.classList.contains('_menu-open')) {
      closeMenu();
    } else {
      openMenu();
      setHeaderTop();
    }
  });

  function closeMenu() {
    document.documentElement.classList.remove('_menu-open');
    document.documentElement.classList.remove('_lock');
  }
  function openMenu() {
    document.documentElement.classList.add('_menu-open');
    document.documentElement.classList.add('_lock');
  }

  const onTabletChange = (e) => {
    if (!e.matches) closeMenu();
  };
  mediaMaxWidth992.addEventListener('change', onTabletChange);
  onTabletChange(mediaMaxWidth992);
}
burger();

//========================================================================================================================================================
//====== Move some items from the header to the burger menu ==================================================================================================================================================
//========================================================================================================================================================
const headerInfoMobile = document.querySelector('.header__info-mobile');
const headerInfo = document.querySelector('.header__info');
const headerItemTime = headerInfo.querySelector('.header__info-item._time');
const headerItemLocation = headerInfo.querySelector('.header__info-item._location');
const headerItemTel = headerInfo.querySelector('.header__info-item._tel');

function updateTabletScreen(e) {
  if (e.matches) {
    headerInfoMobile.insertAdjacentElement('beforeend', headerItemTime);
    headerInfoMobile.insertAdjacentElement('beforeend', headerItemLocation);
  } else {
    headerInfo.insertAdjacentElement('afterbegin', headerItemLocation);
    headerInfo.insertAdjacentElement('afterbegin', headerItemTime);
  }
}
mediaMaxWidth992.addEventListener('change', updateTabletScreen);
updateTabletScreen(mediaMaxWidth992);

function updateSmallMobileScreen(e) {
  if (e.matches) {
    headerInfoMobile.insertAdjacentElement('beforeend', headerItemTel);
  } else {
    headerInfo.insertAdjacentElement('beforeend', headerItemTel);
  }
}
mediaMaxWidth480.addEventListener('change', updateSmallMobileScreen);
updateSmallMobileScreen(mediaMaxWidth480);

//========================================================================================================================================================
//====== Позиционирование хедера ==================================================================================================================================================
//========================================================================================================================================================
const headerFixedPoint = document.querySelector('._header-fixed-point');
const header = document.querySelector('.header');
const headerTop = header.querySelector('.header__top');

// Фиксированое позиционирование хедера после прокрутки header__top
headerFixedPoint.style.top = headerTop.offsetHeight + 'px';
const fixedPointObserver = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) {
      header.classList.add('_fixed');
      document.documentElement.style.setProperty(
        '--header-top-height',
        headerTop.offsetHeight + 'px',
      );
    } else {
      header.classList.remove('_fixed');
      document.documentElement.style.removeProperty('--header-top-height');
    }
  },
  { threshold: 1 },
);
fixedPointObserver.observe(headerFixedPoint);

// Вносим некоторые правки относительно хедера при изменении его высоты
let prevHeaderHeight = new Map();
const resizeHeaderObserver = new ResizeObserver((entries) => {
  for (let i = 0; i < entries.length; i++) {
    const height = entries[i].borderBoxSize?.[0].blockSize;
    if (typeof height === 'number' && height !== prevHeaderHeight.get(entries[i].target)) {
      prevHeaderHeight.set(entries[i].target, height);

      headerFixedPoint.style.top = headerTop.offsetHeight + 'px';
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      setHeaderTop();

      if (header.classList.contains('_fixed')) {
        document.documentElement.style.setProperty(
          '--header-top-height',
          headerTop.offsetHeight + 'px',
        );
      }
      break;
    }
  }
});

resizeHeaderObserver.observe(header);
resizeHeaderObserver.observe(headerTop);

//========================================================================================================================================================
//====== Init spollers ==================================================================================================================================================
//========================================================================================================================================================
//
// data-spollers      - для блока родетеля группы споллеров
// data-spollers-one  - для блока родетеля, если нужно чтоб открытым был только один споллер
// data-spoller       - для споллера (заголовка) при клике на который показывается/скрывается body
// data-disabled      - атрибут, который задается для body нажатого споллера, пока оно открывается/закрывается
// _spoller-open      - класс для активного (открытого) споллера

const spollerBlocks = document.querySelectorAll('[data-spollers]');
spollerBlocks.forEach((spollerBlock) => {
  const spollerItems = spollerBlock.querySelectorAll('[data-spoller]');
  const onlyOneSpoller = spollerBlock.hasAttribute('data-spollers-one');

  spollerItems.forEach((spoller) => {
    const spollerBody = spoller.nextElementSibling;
    slideUp(spollerBody);

    spoller.addEventListener('click', () => {
      if (spollerBody.hasAttribute('data-disabled')) return;

      if (spoller.classList.contains('_spoller-open')) {
        spoller.classList.remove('_spoller-open');
        slideUp(spollerBody);
      } else {
        const activeSpoller = spollerBlock.querySelector('[data-spoller]._spoller-open');

        if (onlyOneSpoller && activeSpoller) {
          const activeSpollerBoby = activeSpoller.nextElementSibling;
          if (activeSpollerBoby.hasAttribute('data-disabled')) return;
          activeSpoller.classList.remove('_spoller-open');
          slideUp(activeSpoller.nextElementSibling);
        }

        spoller.classList.add('_spoller-open');
        slideDown(spollerBody);
      }
    });
  });
});

function slideDown(target, duration = 300) {
  if (target.hasAttribute('data-disabled')) return;
  target.setAttribute('data-disabled', '');
  target.hidden = null;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = '0px';
  target.offsetHeight;
  target.style.transitionProperty = 'height';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';

  setTimeout(() => {
    target.style.removeProperty('overflow');
    target.style.removeProperty('height');
    target.style.removeProperty('transition-property');
    target.style.removeProperty('transition-duration');
    target.removeAttribute('data-disabled');
  }, duration);
}
function slideUp(target, duration = 300) {
  if (target.hasAttribute('data-disabled')) return;
  target.setAttribute('data-disabled', '');
  target.style.overflow = 'hidden';
  let height = target.offsetHeight;
  target.style.height = height + 'px';
  target.offsetHeight;
  target.style.transitionProperty = 'height';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = 0;

  setTimeout(() => {
    target.style.removeProperty('overflow');
    target.style.removeProperty('height');
    target.style.removeProperty('transition-property');
    target.style.removeProperty('transition-duration');
    target.hidden = true;
    target.removeAttribute('data-disabled');
  }, duration);
}
function slideToggle(target, duration = 300) {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

//========================================================================================================================================================
//======= Init WHY (Почему ретон?) block's items =================================================================================================================================================
//========================================================================================================================================================
const whyInner = document.querySelector('.why__inner');
const whyItems = document.querySelectorAll('.why-item');

// Смена ширины item'ов при ресайзе окна
let whyInnerTimeoutId = null;
const whyInnerRO = new ResizeObserver((entries) => {
  clearTimeout(whyInnerTimeoutId);
  whyInnerTimeoutId = setTimeout(() => {
    whyItems.forEach((item) => setWhyItemWidth(item));
  }, 250);
});

// Инициализация айтемов
mediaMaxWidth992.addEventListener('change', initWhyItems);
initWhyItems(mediaMaxWidth992);

function initWhyItems(e) {
  if (e.matches) return;
  mediaMaxWidth992.removeEventListener('change', initWhyItems);

  whyItems.forEach((whyItem) => {
    const icon = whyItem.querySelector('.why-item__icon');
    setWhyItemWidth(whyItem, icon);
    icon.addEventListener('click', onClick);

    function onClick() {
      if (window.innerWidth < 998) return;
      const whyItemText = whyItem.querySelector('.why-item__text');
      if (whyItemText.hasAttribute('data-disabled')) return;

      if (whyItem.classList.contains('_active')) {
        slideUp(whyItemText);
        whyItem.classList.remove('_active');
      } else {
        const activeWhyItem = document.querySelector('.why-item._active');
        if (activeWhyItem) {
          slideUp(activeWhyItem.querySelector('.why-item__text'));
          activeWhyItem.classList.remove('_active');
        }

        slideDown(whyItemText);
        whyItem.classList.add('_active');
      }

      setWhyItemWidth(whyItem, icon);
    }
  });
}

// При ширине <992 отображать items как обычные блочные элементы
mediaMaxWidth992.addEventListener('change', updateMobileScreen);
updateMobileScreen(mediaMaxWidth992);

function updateMobileScreen(e) {
  if (e.matches) {
    whyItems.forEach((item) => {
      item.querySelector('.why-item__text').hidden = null;
      item.classList.remove('_active');
    });
    whyInnerRO.unobserve(whyInner);
  } else {
    whyItems.forEach((item) => {
      item.querySelector('.why-item__text').hidden = true;
    });
    whyInnerRO.observe(whyInner);
  }
}

// Задать ширину для айтемов
function setWhyItemWidth(whyItem, icon = null) {
  if (!icon) icon = whyItem.querySelector('.why-item__icon');
  const iconRect = icon.getBoundingClientRect();
  const whyInnerRect = whyInner.getBoundingClientRect();

  if (whyItem.classList.contains('why-item_right')) {
    whyItem.style.width = whyInnerRect.width + whyInnerRect.left - iconRect.left + 'px';
  } else {
    whyItem.style.width = iconRect.width + iconRect.left - whyInnerRect.left + 'px';
  }
}

//========================================================================================================================================================
//====== Реализация блока Награды/Аwards ==================================================================================================================================================
//========================================================================================================================================================
// data-tabs          - для блока с табами
// data-tabs-nav      - для родителя табов
// data-tabs-content  - для родителя контента табов
// _tab-active        - класс для активного таба

// Отображение контента только активного таба. Добавление атрибута с интдексом data-index для каждого таба и его контента
document.querySelectorAll('[data-tabs]').forEach((tabBlock) => {
  let tabTitles = tabBlock.querySelectorAll('[data-tabs-nav] > *');
  let tabBodies = tabBlock.querySelectorAll('[data-tabs-content] > *');
  let activeTab = tabBlock.querySelector('[data-tabs-nav] > ._tab-active');

  tabBodies.forEach((tabBody) => {
    tabBody.style.display = 'none';
  });

  if (activeTab) {
    activeTab.style.removeProperty('display');
  } else {
    tabBodies[0].style.removeProperty('display');
  }

  tabTitles.forEach((tabTitle, index) => {
    const tabBody = tabBodies[index];
    tabTitle.setAttribute('data-index', index);
    tabBody.setAttribute('data-index', index);
  });
});

// Реализация табов Аwards
const awardsTabBlocks = document.querySelectorAll("[data-tabs='awards']");
awardsTabBlocks.forEach((awardsTabs) => {
  const navigationWrapper = awardsTabs.querySelector('.awards-tabs__navigation-wrapper');
  const navigation = navigationWrapper.querySelector('.awards-tabs__navigation');
  const buttonPrev = awardsTabs.querySelector('.awards-tabs__navigation-btn._prev');
  const buttonNext = awardsTabs.querySelector('.awards-tabs__navigation-btn._next');
  const tabTitles = navigationWrapper.querySelectorAll('[data-tabs-nav] > *');
  const tabBodies = awardsTabs.querySelectorAll('[data-tabs-content] > *');
  let showTabsCount = 3;

  if (!tabTitles.length) return;

  let visibleTabIndex = {
    first: 0,
    last: tabTitles.length >= showTabsCount ? showTabsCount - 1 : tabTitles.length - 1,
  };
  tabTitles[visibleTabIndex.first].classList.add('_tab-active');

  changeVisibleTabs();
  changeNavHeight();

  buttonNext.addEventListener('click', () => onNext());
  buttonPrev.addEventListener('click', () => onPrev());

  //======= Возможность свайпом перелистывать табы ===============================================================================
  let sensitivity; // px
  let xStart = null;
  let yStart = null;
  let moved = false;

  const awardsContent = document.querySelector('.awards-tabs__content');
  awardsContent.addEventListener('touchstart', awardsContentTouchStart, { passive: true });
  awardsContent.addEventListener('touchend', awardsContentTouchEnd);
  awardsContent.addEventListener('mousedown', awardsContentTouchStart);
  awardsContent.addEventListener('mouseup', awardsContentTouchEnd);

  const awardsNavWrapper = document.querySelector('.awards-tabs__navigation-wrapper');
  awardsNavWrapper.addEventListener('touchstart', awardsNavTouchStart, { passive: true });
  awardsNavWrapper.addEventListener('touchend', awardsNavTouchEnd);
  awardsNavWrapper.addEventListener('mousedown', awardsNavTouchStart);
  awardsNavWrapper.addEventListener('mouseup', awardsNavTouchEnd);
  awardsNavWrapper.addEventListener('click', onTabClick);

  function setStartPoints(e) {
    if (e.type === 'touchstart') {
      xStart = e.touches[0].clientX;
      yStart = e.touches[0].clientY;
    } else {
      xStart = e.clientX;
      yStart = e.clientY;
    }
  }
  function resetVariables() {
    xStart = null;
    yStart = null;
    setTimeout(() => {
      moved = false;
    }, 0);
  }

  function awardsNavTouchStart(e) {
    setStartPoints(e);

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    if (getWindowWidth() >= 768) {
      awardsNavWrapper.addEventListener(moveEvent, awardsNavVerticalMove, { passive: false });
    } else {
      awardsNavWrapper.addEventListener(moveEvent, awardsNavHorisontalMove, { passive: true });
    }
    if (moveEvent === 'mousemove') {
      awardsNavWrapper.classList.add('unselectable');
    }
  }
  function awardsContentTouchStart(e) {
    setStartPoints(e);

    if (getWindowWidth() >= 768) return;

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    awardsContent.addEventListener(moveEvent, awardsContentHorisontalMove, { passive: true });
  }

  function awardsNavTouchEnd(e) {
    resetVariables();

    const moveEvent = e.type === 'touchend' ? 'touchmove' : 'mousemove';
    if (getWindowWidth() >= 768) {
      awardsNavWrapper.removeEventListener(moveEvent, awardsNavVerticalMove);
    } else {
      awardsNavWrapper.removeEventListener(moveEvent, awardsNavHorisontalMove);
    }

    if (moveEvent === 'mousemove') {
      awardsNavWrapper.classList.remove('unselectable');
    }
  }
  function awardsContentTouchEnd(e) {
    resetVariables();

    if (getWindowWidth() >= 768) return;

    const moveEvent = e.type === 'touchend' ? 'touchmove' : 'mousemove';
    awardsContent.removeEventListener(moveEvent, awardsContentHorisontalMove);
  }

  function handleMove(e, direction = null, setNextVisibleTabGroup = true) {
    if (moved) return;

    let xEnd = null;
    let yEnd = null;

    if (e.type === 'touchmove') {
      xEnd = e.touches[0].clientX;
      yEnd = e.touches[0].clientY;
      sensitivity = 80;
    } else {
      xEnd = e.clientX;
      yEnd = e.clientY;
      sensitivity = 50;
    }

    let xDiff = xStart - xEnd;
    let yDiff = yStart - yEnd;

    switch (direction) {
      case 'horizontal':
        horizontalSwipe();
        break;
      case 'vertical':
        verticalSwipe();
        break;
      default:
        bothSwipe();
        break;
    }

    function verticalSwipe() {
      if (yDiff > 0 && yDiff > sensitivity) {
        /* up swipe */
        onNext(setNextVisibleTabGroup);
        moved = true;
      } else if (yDiff < 0 && yDiff < -sensitivity) {
        /* down swipe */
        onPrev(setNextVisibleTabGroup);
        moved = true;
      }
    }

    function horizontalSwipe() {
      if (xDiff > 0 && xDiff > sensitivity) {
        /* left swipe */
        onNext(setNextVisibleTabGroup);
        moved = true;
      } else if (xDiff < 0 && xDiff < -sensitivity) {
        /* right swipe */
        onPrev(setNextVisibleTabGroup);
        moved = true;
      }
    }

    function bothSwipe() {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        horizontalSwipe();
      } else if (Math.abs(xDiff) < Math.abs(yDiff)) {
        verticalSwipe();
      }
    }
  }

  function awardsContentHorisontalMove(e) {
    handleMove(e, 'horizontal', false);
  }
  function awardsNavHorisontalMove(e) {
    handleMove(e, 'horizontal');
  }
  function awardsNavVerticalMove(e) {
    handleMove(e, 'vertical');
    e.preventDefault();
  }

  function onTabClick(e) {
    if (moved) return;

    let activeTab = awardsTabs.querySelector('._tab-active');
    if (e.target !== activeTab) {
      changeActiveTab(activeTab, e.target);
    }
  }

  // Смена количествам видимых табов при разных размерах экрана
  const breakpoints = {
    0: 1,
    480: 2,
    600: 3,
  };

  const breakpointsArray = Object.entries(breakpoints);
  for (let i = 0; i < breakpointsArray.length; i++) {
    const [currentMedia, currentVisibleTabsCount] = breakpointsArray[i];
    const nextMedia = breakpointsArray[i + 1] ? breakpointsArray[i + 1][0] : null;

    const matchMedia = window.matchMedia(
      `(min-width: ${currentMedia}px) ${nextMedia ? 'and (max-width: ' + (nextMedia - 0.02) + 'px)' : ''}`,
    );

    matchMedia.addEventListener('change', (e) => changeShowTabsCount(e, currentVisibleTabsCount));
    changeShowTabsCount(matchMedia, currentVisibleTabsCount);
  }

  function changeShowTabsCount(e, showVisibleTabCount) {
    if (!e.matches) return;

    let activeTab = awardsTabs.querySelector('._tab-active');
    let activeTabIndex = +activeTab.getAttribute('data-index');
    showTabsCount = showVisibleTabCount;

    if (activeTabIndex > tabTitles.length - showTabsCount) {
      visibleTabIndex = {
        first: tabTitles.length - showTabsCount,
        last: tabTitles.length - 1,
      };
    } else {
      visibleTabIndex = {
        first: activeTabIndex,
        last: activeTabIndex + (showTabsCount - 1),
      };
    }

    changeVisibleTabs();
    changeNavHeight();
  }

  // Смена высоты обертки блока с табами при смене размера экрана
  let navigationTimeoutId = null;
  const navigationRO = new ResizeObserver((entries) => {
    clearTimeout(navigationTimeoutId);
    navigationTimeoutId = setTimeout(() => {
      changeNavHeight();
    }, 100);
  });
  navigationRO.observe(navigation);

  // смена видимых табов
  function changeVisibleTabs() {
    awardsTabs.querySelectorAll('[data-tabs-nav] > ._tab-visible').forEach((tab) => {
      tab.classList.remove('_tab-visible');
    });
    for (let i = visibleTabIndex.first; i <= visibleTabIndex.last; i++) {
      tabTitles[i].classList.add('_tab-visible');
    }
  }

  // Смена высоты обертки блока с табами
  function changeNavHeight() {
    if (getWindowWidth() >= 768) {
      let wrapperHeight =
        tabTitles[visibleTabIndex.last].getBoundingClientRect().top +
        tabTitles[visibleTabIndex.last].getBoundingClientRect().height -
        tabTitles[visibleTabIndex.first].getBoundingClientRect().top;
      let transformY =
        tabTitles[visibleTabIndex.first].getBoundingClientRect().top -
        navigation.getBoundingClientRect().top;
      navigationWrapper.style.height = wrapperHeight + 'px';
      navigation.style.transform = `translate3d(0, ${-transformY}px, 0)`;
    } else {
      let wrapperHeight = navigation.offsetHeight;
      let transformX =
        ((tabTitles[visibleTabIndex.first].getBoundingClientRect().left -
          navigation.getBoundingClientRect().left) *
          100) /
        navigation.getBoundingClientRect().width;

      navigationWrapper.style.height = wrapperHeight + 'px';
      navigation.style.transform = `translate3d(${-transformX}%,0,0)`;
    }
  }

  // Следующий таб
  function onNext(setNextVisibleTabGroup = false) {
    if (setNextVisibleTabGroup && visibleTabIndex.last === tabTitles.length - 1) return;

    let activeTab = awardsTabs.querySelector('._tab-active');
    let activeTabIndex = +activeTab.getAttribute('data-index');
    if (activeTabIndex === tabTitles.length - 1) return;

    let nextTab, nextTabIndex;
    if (setNextVisibleTabGroup) {
      nextTabIndex =
        visibleTabIndex.last < tabTitles.length - showTabsCount
          ? visibleTabIndex.last + 1
          : tabTitles.length - showTabsCount;
    } else {
      nextTabIndex = activeTabIndex + 1;
    }
    nextTab = tabTitles[nextTabIndex];

    const activeTabBody = tabBodies[activeTabIndex];
    const nextTabBody = tabBodies[nextTabIndex];

    activeTabBody.style.display = 'none';
    activeTab.classList.remove('_tab-active');
    nextTab.classList.add('_tab-active');
    nextTabBody.style.removeProperty('display');

    if (!setNextVisibleTabGroup && nextTabIndex <= visibleTabIndex.last) return;

    if (tabTitles.length - nextTabIndex > showTabsCount) {
      visibleTabIndex.first = nextTabIndex;
      visibleTabIndex.last = nextTabIndex + (showTabsCount - 1);
    } else {
      visibleTabIndex.first = tabTitles.length - showTabsCount;
      visibleTabIndex.last = tabTitles.length - 1;
    }

    changeVisibleTabs();
    changeNavHeight();
  }

  // Предыдущий таб
  function onPrev(setNextVisibleTabGroup = false) {
    if (setNextVisibleTabGroup && visibleTabIndex.first === 0) return;

    let activeTab = awardsTabs.querySelector('._tab-active');
    let activeTabIndex = +activeTab.getAttribute('data-index');
    if (activeTabIndex === 0) return;

    let prevTab, prevTabIndex;
    if (setNextVisibleTabGroup) {
      prevTabIndex =
        visibleTabIndex.first - 1 < showTabsCount ? showTabsCount - 1 : visibleTabIndex.first - 1;
    } else {
      prevTabIndex = activeTabIndex - 1;
    }
    prevTab = tabTitles[prevTabIndex];

    const activeTabBody = tabBodies[activeTabIndex];
    const prevTabBody = tabBodies[prevTabIndex];

    activeTabBody.style.display = 'none';
    activeTab.classList.remove('_tab-active');
    prevTab.classList.add('_tab-active');
    prevTabBody.style.removeProperty('display');

    if (!setNextVisibleTabGroup && prevTabIndex >= visibleTabIndex.first) return;

    if (prevTabIndex < showTabsCount) {
      visibleTabIndex.first = 0;
      visibleTabIndex.last = showTabsCount - 1;
    } else {
      visibleTabIndex.last = prevTabIndex;
      visibleTabIndex.first = prevTabIndex - (showTabsCount - 1);
    }

    changeVisibleTabs();
    changeNavHeight();
  }

  // Удаление стилей у предыдущего таба и добавление их активному
  function changeActiveTab(currentTab, clickedTab) {
    let currentTabIndex = +currentTab.getAttribute('data-index');
    let clickedTabIndex = +clickedTab.getAttribute('data-index');
    tabBodies[currentTabIndex].style.display = 'none';
    currentTab.classList.remove('_tab-active');
    clickedTab.classList.add('_tab-active');
    tabBodies[clickedTabIndex].style.removeProperty('display');
  }
});

//========================================================================================================================================================
//====== Дополнительные функции получение ширины и высоты экрана ==================================================================================================================================================
//========================================================================================================================================================

function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
