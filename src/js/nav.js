module.exports = function (element) {
  var burgerButton = element.querySelector('.burger-button');
  var list = element.querySelector('ul');

  var open = false;
  element.classList.add('menu-closed');
  burgerButton.addEventListener('click', toggleMenu);

  function toggleMenu(event) {
    event.stopPropagation();
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    var items = list.children;
    var height = 0;
    var itemDelay = 0;
    var itemBetweenDelay = 50;

    for (var i = 0; i < items.length; i++) {
      var delay = itemDelay + (i * itemBetweenDelay);

      items[i].style['transition-delay'] = delay + 'ms';
      items[i].style['-webkit-transition-delay'] = delay + 'ms';
      items[i].style['-moz-transition-delay'] = delay + 'ms';
      items[i].style['-o-transition-delay'] = delay + 'ms';
      items[i].style['-ms-transition-delay'] = delay + 'ms';
      height += items[i].getBoundingClientRect().height;
    }

    list.style.height = height + 'px';
    element.classList.add('menu-open');
    element.classList.remove('menu-closed');
    open = true;
  }

  function closeMenu() {
    var items = list.children;
    var height = items.length * 50;

    for (var i = 0; i < items.length; i++) {
      items[i].style['transition-delay'] = '';
      items[i].style['-webkit-transition-delay'] = '';
      items[i].style['-moz-transition-delay'] = '';
      items[i].style['-o-transition-delay'] = '';
      items[i].style['-ms-transition-delay'] = '';
    }

    list.style.height = height + 'px';
    element.classList.add('menu-closed');
    element.classList.remove('menu-open');
    open = false;

    setTimeout(function() {
      list.style.height = '';
    }, 1);
  }
};
