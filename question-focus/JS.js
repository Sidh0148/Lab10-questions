'use strict';

class MenuButtonActions {
  constructor(domNode, performMenuAction) {
    this.domNode = domNode;
    this.performMenuAction = performMenuAction;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = Array.from(domNode.querySelectorAll('[role="menuitem"]'));
    this.firstMenuitem = this.menuitemNodes[0];
    this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length - 1];

    this.buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
    this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));

    this.menuitemNodes.forEach((menuitem, index) => {
      menuitem.tabIndex = index === 0 ? 0 : -1;
      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
      menuitem.addEventListener('click', this.onMenuitemClick.bind(this));
    });

    domNode.addEventListener('focusin', this.onFocusin.bind(this));
    domNode.addEventListener('focusout', this.onFocusout.bind(this));

    window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
  }

  setFocusToMenuitem(newMenuitem) {
    this.menuitemNodes.forEach(menuitem => {
      menuitem.tabIndex = -1;
    });
    newMenuitem.tabIndex = 0;
    newMenuitem.focus();
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem(currentMenuitem) {
    const currentIndex = this.menuitemNodes.indexOf(currentMenuitem);
    const newIndex = currentIndex === 0 ? this.menuitemNodes.length - 1 : currentIndex - 1;
    this.setFocusToMenuitem(this.menuitemNodes[newIndex]);
  }

  setFocusToNextMenuitem(currentMenuitem) {
    const currentIndex = this.menuitemNodes.indexOf(currentMenuitem);
    const newIndex = currentIndex === this.menuitemNodes.length - 1 ? 0 : currentIndex + 1;
    this.setFocusToMenuitem(this.menuitemNodes[newIndex]);
  }

  openPopup() {
    this.menuNode.style.display = 'block';
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }

  closePopup() {
    this.buttonNode.removeAttribute('aria-expanded');
    this.menuNode.style.display = 'none';
  }

  onButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      this.openPopup();
      this.setFocusToFirstMenuitem();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  onButtonClick(event) {
    if (this.menuNode.style.display === 'block') {
      this.closePopup();
    } else {
      this.openPopup();
      this.setFocusToFirstMenuitem();
    }
    event.preventDefault();
  }

  onMenuitemKeydown(event) {
    if (event.key === 'ArrowDown') {
      this.setFocusToNextMenuitem(event.currentTarget);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.setFocusToPreviousMenuitem(event.currentTarget);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.performMenuAction(event.currentTarget);
      this.closePopup();
    } else if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  onMenuitemClick(event) {
    this.performMenuAction(event.currentTarget);
    this.closePopup();
  }

  onFocusin() {
    this.domNode.classList.add('focus');
  }

  onFocusout() {
    this.domNode.classList.remove('focus');
  }

  onBackgroundMousedown(event) {
    if (!this.domNode.contains(event.target)) {
      this.closePopup();
    }
  }
}

window.addEventListener('load', function () {
  const actionOutput = document.getElementById('action_output');
  function performMenuAction(menuItem) {
    actionOutput.value = menuItem.textContent.trim();
  }

  const menuButtons = document.querySelectorAll('.menu-button-actions');
  menuButtons.forEach(menuButton => {
    new MenuButtonActions(menuButton, performMenuAction);
  });
});


