"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  NodeList.prototype.map = function (callback) {
    var result = [];
    this.forEach(function (el, i, array) {
      var returned = callback(el, i, array);
      returned ? result.push(returned) : result.push('');
    });
    return result;
  };

  var Gallery = /*#__PURE__*/function () {
    function Gallery(options) {
      _classCallCheck(this, Gallery);

      this.groups = {};
      this.activeImage = {};
      this.components = options.components || {};
    }

    _createClass(Gallery, [{
      key: "getRoot",
      value: function getRoot() {
        //init container__galleryApp
        var container = document.createElement('div');
        container.className = 'container__galleryApp';
        var containerComponent = new ContainerApp(container);
        containerComponent.$el.innerHTML = containerComponent.addImageContainer();
        this.Elements[ContainerApp.shortName()] = containerComponent;
        this.initComponents();
        return containerComponent.$el;
      }
    }, {
      key: "initComponents",
      value: function initComponents() {
        var _this = this;

        this.components.forEach(function (Component) {
          var div = document.createElement('div');
          div.className = Component.className();
          var component = new Component(div);
          component.$el.innerHTML = component.toHTML();
          _this.Elements[Component.shortName()] = component;

          _this.Elements[ContainerApp.shortName()].$el.appendChild(component.$el);
        });
      }
    }, {
      key: "build",
      value: function build() {
        this.Elements = {};
        var wrapperApp = document.createElement('div');
        wrapperApp.className = BgClosing.className();
        this.$root = wrapperApp;
        var rootElement = new BgClosing(this.$root);
        this.Elements[BgClosing.shortName()] = rootElement;
        var a = this.Elements[BgClosing.shortName()];
        this.$root.appendChild(this.getRoot());
        var body = document.querySelector('body');
        body.appendChild(this.$root);
        delete this.components;
      }
    }, {
      key: "showApp",
      value: function showApp(imgObject) {
        var quantityImages = this.groups[imgObject.selector].length;

        if (quantityImages <= 1) {
          this.setSinglePreset();
        } else {
          this.setFullPreset();
        } //initial image in gallery


        this.changeImage(imgObject);
        this.$root.classList.remove('hidden');
      }
    }, {
      key: "hiddeApp",
      value: function hiddeApp() {
        this.$root.classList.add('hidden');
      }
    }, {
      key: "changeImage",
      value: function changeImage(imgObject) {
        var img = $('[data-imageOfApp=""]');
        this.activeImage = imgObject;
        img.src = imgObject.path;
      }
    }, {
      key: "setSinglePreset",
      value: function setSinglePreset() {
        var elems = this.Elements;

        for (var element in elems) {
          if (elems.hasOwnProperty(element)) {
            if (elems[element].singlePreset) {
              var nodeElement = elems[element].$el;
              nodeElement.classList.add('hidden');
            }
          }
        }
      }
    }, {
      key: "setFullPreset",
      value: function setFullPreset() {
        var elems = this.Elements;

        for (var element in elems) {
          if (elems.hasOwnProperty(element)) {
            var nodeElement = elems[element].$el;
            nodeElement.classList.remove('hidden');
          }
        }
      }
    }, {
      key: "previousImage",
      value: function previousImage() {
        var indexImage = this.activeImage.index;
        var newIndex;
        indexImage === 0 ? newIndex = this.groups[this.activeImage.selector].length - 1 : newIndex = indexImage - 1;
        var newImage = this.groups[this.activeImage.selector][newIndex];
        this.changeImage(newImage);
      }
    }, {
      key: "nextImage",
      value: function nextImage() {
        var indexImage = this.activeImage.index;
        var newIndex;
        var maxIndex = this.groups[this.activeImage.selector].length - 1;
        indexImage === maxIndex ? newIndex = 0 : newIndex = indexImage + 1;
        var newImage = this.groups[this.activeImage.selector][newIndex];
        this.changeImage(newImage);
      }
    }]);

    return Gallery;
  }();

  var DOMListener = /*#__PURE__*/function () {
    function DOMListener(options) {
      _classCallCheck(this, DOMListener);

      this.listeners = options.listeners;
    }

    _createClass(DOMListener, [{
      key: "initDomListeners",
      value: function initDomListeners() {
        var _this2 = this;

        this.listeners.forEach(function (listener) {
          var eventName = _this2.getEventName(listener);

          _this2.$el.addEventListener(listener, _this2[eventName].bind(_this2));
        });
      }
    }, {
      key: "getEventName",
      value: function getEventName(shortName) {
        return 'on' + shortName[0].toUpperCase() + shortName.slice(1);
      }
    }]);

    return DOMListener;
  }();

  var CloseApp = /*#__PURE__*/function (_DOMListener) {
    _inherits(CloseApp, _DOMListener);

    var _super = _createSuper(CloseApp);

    function CloseApp(options) {
      var _this3;

      _classCallCheck(this, CloseApp);

      _this3 = _super.call(this, options);
      _this3.$el = options.el;

      _this3.initDomListeners(_this3.$el);

      return _this3;
    }

    _createClass(CloseApp, [{
      key: "onClick",
      value: function onClick() {
        event.stopPropagation();

        if (event.target === this.$el) {
          gallery.hiddeApp();
          toggleBodyScroll('unlock');
        }
      }
    }]);

    return CloseApp;
  }(DOMListener);

  var ContainerApp = /*#__PURE__*/function () {
    _createClass(ContainerApp, null, [{
      key: "shortName",
      value: function shortName() {
        return 'containerApp';
      }
    }]);

    function ContainerApp(el) {
      _classCallCheck(this, ContainerApp);

      this.$el = el;
    }

    _createClass(ContainerApp, [{
      key: "addImageContainer",
      value: function addImageContainer() {
        return "<div class=\"img-container__galleryApp\">\n            <img src=\"\" alt=\"#\" data-imageOfApp=\"\">\n            <div class=\"cover-image__galleryApp\"></div>\n        </div>";
      }
    }]);

    return ContainerApp;
  }();

  var SlideBtn = /*#__PURE__*/function (_DOMListener2) {
    _inherits(SlideBtn, _DOMListener2);

    var _super2 = _createSuper(SlideBtn);

    function SlideBtn(options) {
      var _this4;

      _classCallCheck(this, SlideBtn);

      _this4 = _super2.call(this, options);
      _this4.$el = options.el;

      _this4.initDomListeners(_this4.$el);

      _this4.singlePreset = true;
      return _this4;
    }

    _createClass(SlideBtn, [{
      key: "onClick",
      value: function onClick() {
        event.stopPropagation();
        this.direction === 'previous' ? gallery.previousImage() : gallery.nextImage();
      }
    }]);

    return SlideBtn;
  }(DOMListener);

  var Image = /*#__PURE__*/function (_DOMListener3) {
    _inherits(Image, _DOMListener3);

    var _super3 = _createSuper(Image);

    function Image(img, index, parameters) {
      var _this5;

      _classCallCheck(this, Image);

      _this5 = _super3.call(this, {
        listeners: ['click']
      });
      _this5.$el = img;
      _this5.path = img.src;
      _this5.index = index;
      _this5.selector = parameters.selector;
      return _this5;
    }

    _createClass(Image, [{
      key: "onClick",
      value: function onClick() {
        gallery.showApp(this);
        toggleBodyScroll();
      }
    }]);

    return Image;
  }(DOMListener);

  var BgClosing = /*#__PURE__*/function (_CloseApp) {
    _inherits(BgClosing, _CloseApp);

    var _super4 = _createSuper(BgClosing);

    _createClass(BgClosing, null, [{
      key: "shortName",
      value: function shortName() {
        return 'bgClosing';
      }
    }, {
      key: "className",
      value: function className() {
        return 'galleryApp hidden';
      }
    }]);

    function BgClosing(el) {
      _classCallCheck(this, BgClosing);

      return _super4.call(this, {
        el: el,
        listeners: ['click']
      });
    }

    _createClass(BgClosing, [{
      key: "toHTML",
      value: function toHTML() {
        return '';
      }
    }]);

    return BgClosing;
  }(CloseApp);

  var CrossClosing = /*#__PURE__*/function (_CloseApp2) {
    _inherits(CrossClosing, _CloseApp2);

    var _super5 = _createSuper(CrossClosing);

    _createClass(CrossClosing, null, [{
      key: "shortName",
      value: function shortName() {
        return 'crossClosing';
      }
    }, {
      key: "className",
      value: function className() {
        return 'close__galleryApp';
      }
    }]);

    function CrossClosing(el) {
      _classCallCheck(this, CrossClosing);

      return _super5.call(this, {
        el: el,
        listeners: ['click']
      });
    }

    _createClass(CrossClosing, [{
      key: "toHTML",
      value: function toHTML() {
        return '';
      }
    }]);

    return CrossClosing;
  }(CloseApp);

  var SlideNext = /*#__PURE__*/function (_SlideBtn) {
    _inherits(SlideNext, _SlideBtn);

    var _super6 = _createSuper(SlideNext);

    _createClass(SlideNext, null, [{
      key: "shortName",
      value: function shortName() {
        return 'slideNext';
      }
    }, {
      key: "className",
      value: function className() {
        return 'btn-wrapper next';
      }
    }]);

    function SlideNext(el) {
      _classCallCheck(this, SlideNext);

      return _super6.call(this, {
        el: el,
        listeners: ['click']
      });
    }

    _createClass(SlideNext, [{
      key: "toHTML",
      value: function toHTML() {
        return '<div class="btn-next__btn-wrapper"></div>';
      }
    }, {
      key: "onClick",
      value: function onClick() {
        event.stopPropagation();
        gallery.nextImage();
      }
    }]);

    return SlideNext;
  }(SlideBtn);

  var SlidePrev = /*#__PURE__*/function (_SlideBtn2) {
    _inherits(SlidePrev, _SlideBtn2);

    var _super7 = _createSuper(SlidePrev);

    _createClass(SlidePrev, null, [{
      key: "shortName",
      value: function shortName() {
        return 'slidePrev';
      }
    }, {
      key: "className",
      value: function className() {
        return 'btn-wrapper previous';
      }
    }]);

    function SlidePrev(el) {
      _classCallCheck(this, SlidePrev);

      return _super7.call(this, {
        el: el,
        listeners: ['click']
      });
    }

    _createClass(SlidePrev, [{
      key: "toHTML",
      value: function toHTML() {
        return '<div class="btn-prev__btn-wrapper"></div>';
      }
    }, {
      key: "onClick",
      value: function onClick() {
        event.stopPropagation();
        gallery.previousImage();
      }
    }]);

    return SlidePrev;
  }(SlideBtn);

  function initGallery(imgObject) {
    gallery.build(imgObject);
  }

  function addGroup(parameters) {
    var imagesNode = $all(parameters.selector);
    images = getInstanceImage(imagesNode, parameters);
    images.forEach(function (img) {
      return img.initDomListeners(img.img);
    });
    gallery.groups[parameters.selector] = images;
  }

  function getInstanceImage(images, parameters) {
    return images.map(function (elem, index) {
      return new Image(elem, index, parameters);
    });
  }

  function toggleBodyScroll(type) {
    var body = $('body');
    type === 'unlock' ? body.classList.remove('lock') : body.classList.add('lock');
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return document.querySelectorAll(selector);
  }

  var gallery = new Gallery({
    components: [CrossClosing, SlideNext, SlidePrev]
  });
  window.addEventListener('load', initGallery);
  console.log(gallery);
  addGroup({
    selector: '[data-gallery]'
  });
  addGroup({
    selector: '[data-gallery-two]'
  });
})();