import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);

window.addEventListener('load', function (e) {
  const widthMatchMedia = window.matchMedia('(min-width: 992px)');
  const heightMatchMedia = window.matchMedia('(min-height: 500px)');
  const companyMapItems = document.querySelectorAll('.company-map__item');

  const onMatchMedia = (e) => {
    const matches = widthMatchMedia.matches && heightMatchMedia.matches;

    if (!matches) {
      uninitCompanyMap();
      return;
    }
    initCompanyMap();
  };

  widthMatchMedia.addEventListener('change', onMatchMedia);
  heightMatchMedia.addEventListener('change', onMatchMedia);
  onMatchMedia();

  window.matchMedia('(min-width: 1200px)').addEventListener('change', () => {
    uninitCompanyMap();
    initCompanyMap();
  });

  function initCompanyMap() {
    companyMapItems.forEach((companyMapItem, index) => {
      const mapItemDesc = companyMapItem.querySelector('.company-map__desc');
      let currentSolidLine, nextSolidLine, dot;

      if (index !== companyMapItems.length - 1) {
        currentSolidLine = companyMapItem.querySelector('.company-map__line-solid');
        currentSolidLine.setAttribute('stroke-dasharray', currentSolidLine.getTotalLength());
        drawLine(currentSolidLine, 0);

        nextSolidLine = companyMapItems[index + 1]?.querySelector('.company-map__line-solid');
        dot = companyMapItem.querySelector('.company-map__dot');
      }

      if (index !== companyMapItems.length - 1) {
        // const currentSolidLineBBox = currentSolidLine.getBBox();
        // console.log('currentSolidLineBBox', currentSolidLineBBox);
        // gsap.set(dot, {
        //   x: currentSolidLineBBox.x + currentSolidLineBBox.width / 2 - dot.clientWidth,
        //   y: currentSolidLineBBox.y + currentSolidLineBBox.height / 2 - dot.clientHeight,
        // });
        gsap.to(dot, {
          ease: 'none',
          scrollTrigger: {
            trigger: currentSolidLine,
            start: 'top 85%',
            end: `+=${nextSolidLine ? nextSolidLine.getBoundingClientRect().top - currentSolidLine.getBoundingClientRect().top : currentSolidLine.getBoundingClientRect().height}px`,
            scrub: true,
            onEnter: onEnterFunc,
            onEnterBack: onEnterFunc,
            onUpdate: (e) => {
              moveDescription(companyMapItem, mapItemDesc, dot);
              drawLine(currentSolidLine, e.progress);
            },
            onLeave: (e) => hideItem(companyMapItem),
            onLeaveBack: (e) => hideItem(companyMapItem),
          },
          motionPath: {
            path: currentSolidLine,
            align: currentSolidLine,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
        });

        function onEnterFunc(e) {
          showItem(companyMapItem);
          moveDescription(companyMapItem, mapItemDesc, dot);
          drawLine(currentSolidLine, e.progress);
        }
      } else {
        const prevItem = companyMapItems[index - 1];
        const prevSolidLine = prevItem?.querySelector('.company-map__line svg');

        let start = null;
        if (prevItem && prevSolidLine) {
          start =
            prevSolidLine.getBoundingClientRect().top +
            prevSolidLine.getBoundingClientRect().height -
            companyMapItem.getBoundingClientRect().top +
            'px';
        }

        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const descMaxHeight = (windowHeight * 85) / 100 - 20 - getVisibleHeaderHeight();
        setDescStyles(mapItemDesc, '100%', descMaxHeight);

        gsap.to(companyMapItem, {
          ease: 'none',
          scrollTrigger: {
            trigger: companyMapItem,
            start: `${start ? start : 'center'} 85%`,
            end: '+=' + ((windowHeight * 85) / 100 - companyMapItem.clientHeight) + 'px',
            onEnter: (e) => showItem(companyMapItem),
            onEnterBack: (e) => showItem(companyMapItem),
            onLeave: (e) => hideItem(companyMapItem),
            onLeaveBack: (e) => hideItem(companyMapItem),
          },
        });
      }
    });
  }

  function uninitCompanyMap() {
    companyMapItems.forEach((companyMapItem, index) => {
      const mapItemDesc = companyMapItem.querySelector('.company-map__desc');
      const dot = companyMapItem.querySelector('.company-map__dot');

      if (index !== companyMapItems.length - 1) {
        gsap.killTweensOf(dot);
      } else {
        gsap.killTweensOf(companyMapItem);
      }
      removeDescStyles(mapItemDesc);
      hideItem(companyMapItem);
    });
  }

  function showItem(item) {
    item.classList.add('_show');
  }
  function hideItem(item) {
    item.classList.remove('_show');
  }

  function removeDescStyles(mapItemDesc) {
    mapItemDesc.style.removeProperty('top');
    mapItemDesc.style.removeProperty('max-height');
  }
  function setDescStyles(mapItemDesc, descTop, descMaxHeight) {
    mapItemDesc.style.setProperty('top', descTop);
    mapItemDesc.style.setProperty('max-height', descMaxHeight + 'px');
  }

  function moveDescription(companyMapItem, mapItemDesc, dot) {
    const dotRect = dot.getBoundingClientRect();
    const descTop = dotRect.top - companyMapItem.getBoundingClientRect().top - dotRect.height / 2;
    const descMaxHeight = dotRect.top - dotRect.height / 2 - 20 - getVisibleHeaderHeight();
    setDescStyles(mapItemDesc, `${descTop}px`, descMaxHeight);
  }
  function drawLine(line, progress) {
    line.setAttribute(
      'stroke-dashoffset',
      line.getTotalLength() - line.getTotalLength() * progress,
    );
  }

  function getVisibleHeaderHeight() {
    const headerRect = document.querySelector('header').getBoundingClientRect();
    const height = headerRect.height;
    const top = headerRect.top;
    return height + top;
  }
});
