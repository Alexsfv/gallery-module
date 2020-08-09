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

!function () {
  NodeList.prototype.map = function (e) {
    var t = [];
    return this.forEach(function (s, n, i) {
      var o = e(s, n, i);
      o ? t.push(o) : t.push("");
    }), t;
  };

  var e = /*#__PURE__*/function () {
    function e(_e) {
      _classCallCheck(this, e);

      this.listeners = _e.listeners;
    }

    _createClass(e, [{
      key: "initDomListeners",
      value: function initDomListeners() {
        var _this = this;

        this.listeners.forEach(function (e) {
          var t = _this.getEventName(e);

          _this.$el.addEventListener(e, _this[t].bind(_this));
        });
      }
    }, {
      key: "getEventName",
      value: function getEventName(e) {
        return "on" + e[0].toUpperCase() + e.slice(1);
      }
    }]);

    return e;
  }();

  var t = /*#__PURE__*/function (_e2) {
    _inherits(t, _e2);

    var _super = _createSuper(t);

    function t(e) {
      var _this2;

      _classCallCheck(this, t);

      _this2 = _super.call(this, e), _this2.$el = e.el, _this2.initDomListeners(_this2.$el);
      return _this2;
    }

    _createClass(t, [{
      key: "onClick",
      value: function onClick() {
        event.stopPropagation(), event.target === this.$el && (l.hiddeApp(), c("unlock"));
      }
    }]);

    return t;
  }(e);

  var s = /*#__PURE__*/function () {
    _createClass(s, null, [{
      key: "shortName",
      value: function shortName() {
        return "containerApp";
      }
    }]);

    function s(e) {
      _classCallCheck(this, s);

      this.$el = e;
    }

    _createClass(s, [{
      key: "addImageContainer",
      value: function addImageContainer() {
        return '<div class="img-container__galleryApp">\n            <img src="" alt="#" data-imageOfApp="">\n            <div class="cover-image__galleryApp"></div>\n        </div>';
      }
    }]);

    return s;
  }();

  var n = /*#__PURE__*/function (_e3) {
    _inherits(n, _e3);

    var _super2 = _createSuper(n);

    function n(e) {
      var _this3;

      _classCallCheck(this, n);

      _this3 = _super2.call(this, e), _this3.$el = e.el, _this3.initDomListeners(_this3.$el), _this3.singlePreset = !0;
      return _this3;
    }

    _createClass(n, [{
      key: "onClick",
      value: function onClick() {
        event.stopPropagation(), "previous" === this.direction ? l.previousImage() : l.nextImage();
      }
    }]);

    return n;
  }(e);

  var i = /*#__PURE__*/function (_e4) {
    _inherits(i, _e4);

    var _super3 = _createSuper(i);

    function i(e, t, s) {
      var _this4;

      _classCallCheck(this, i);

      _this4 = _super3.call(this, {
        listeners: ["click"]
      }), _this4.$el = e, _this4.path = e.src, _this4.index = t, _this4.selector = s.selector;
      return _this4;
    }

    _createClass(i, [{
      key: "onClick",
      value: function onClick() {
        l.showApp(this), c();
      }
    }]);

    return i;
  }(e);

  var o = /*#__PURE__*/function (_t) {
    _inherits(o, _t);

    var _super4 = _createSuper(o);

    _createClass(o, null, [{
      key: "shortName",
      value: function shortName() {
        return "bgClosing";
      }
    }, {
      key: "className",
      value: function className() {
        return "galleryApp hidden";
      }
    }]);

    function o(e) {
      _classCallCheck(this, o);

      return _super4.call(this, {
        el: e,
        listeners: ["click"]
      });
    }

    _createClass(o, [{
      key: "toHTML",
      value: function toHTML() {
        return "";
      }
    }]);

    return o;
  }(t);

  function r(e) {
    var t = (s = e.selector, document.querySelectorAll(s));
    var s;
    images = function (e, t) {
      return e.map(function (e, s) {
        return new i(e, s, t);
      });
    }(t, e), images.forEach(function (e) {
      return e.initDomListeners(e.img);
    }), l.groups[e.selector] = images;
  }

  function c(e) {
    var t = a("body");
    "unlock" === e ? t.classList.remove("lock") : t.classList.add("lock");
  }

  function a(e) {
    return document.querySelector(e);
  }

  var l = new ( /*#__PURE__*/function () {
    function _class(e) {
      _classCallCheck(this, _class);

      this.groups = {}, this.activeImage = {}, this.components = e.components || {};
    }

    _createClass(_class, [{
      key: "getRoot",
      value: function getRoot() {
        var e = document.createElement("div");
        e.className = "container__galleryApp";
        var t = new s(e);
        return t.$el.innerHTML = t.addImageContainer(), this.Elements[s.shortName()] = t, this.initComponents(), t.$el;
      }
    }, {
      key: "initComponents",
      value: function initComponents() {
        var _this5 = this;

        this.components.forEach(function (e) {
          var t = document.createElement("div");
          t.className = e.className();
          var n = new e(t);
          n.$el.innerHTML = n.toHTML(), _this5.Elements[e.shortName()] = n, _this5.Elements[s.shortName()].$el.appendChild(n.$el);
        });
      }
    }, {
      key: "build",
      value: function build() {
        this.Elements = {};
        var e = document.createElement("div");
        e.className = o.className(), this.$root = e;
        var t = new o(this.$root);
        this.Elements[o.shortName()] = t, this.Elements[o.shortName()], this.$root.appendChild(this.getRoot()), document.querySelector("body").appendChild(this.$root), delete this.components;
      }
    }, {
      key: "showApp",
      value: function showApp(e) {
        this.groups[e.selector].length <= 1 ? this.setSinglePreset() : this.setFullPreset(), this.changeImage(e), this.$root.classList.remove("hidden");
      }
    }, {
      key: "hiddeApp",
      value: function hiddeApp() {
        this.$root.classList.add("hidden");
      }
    }, {
      key: "changeImage",
      value: function changeImage(e) {
        var t = a('[data-imageOfApp=""]');
        this.activeImage = e, t.src = e.path;
      }
    }, {
      key: "setSinglePreset",
      value: function setSinglePreset() {
        var e = this.Elements;

        for (var _t2 in e) {
          e.hasOwnProperty(_t2) && e[_t2].singlePreset && e[_t2].$el.classList.add("hidden");
        }
      }
    }, {
      key: "setFullPreset",
      value: function setFullPreset() {
        var e = this.Elements;

        for (var _t3 in e) {
          e.hasOwnProperty(_t3) && e[_t3].$el.classList.remove("hidden");
        }
      }
    }, {
      key: "previousImage",
      value: function previousImage() {
        var e = this.activeImage.index;
        var t;
        t = 0 === e ? this.groups[this.activeImage.selector].length - 1 : e - 1;
        var s = this.groups[this.activeImage.selector][t];
        this.changeImage(s);
      }
    }, {
      key: "nextImage",
      value: function nextImage() {
        var e = this.activeImage.index;
        var t;
        t = e === this.groups[this.activeImage.selector].length - 1 ? 0 : e + 1;
        var s = this.groups[this.activeImage.selector][t];
        this.changeImage(s);
      }
    }]);

    return _class;
  }())({
    components: [/*#__PURE__*/function (_t4) {
      _inherits(_class2, _t4);

      var _super5 = _createSuper(_class2);

      _createClass(_class2, null, [{
        key: "shortName",
        value: function shortName() {
          return "crossClosing";
        }
      }, {
        key: "className",
        value: function className() {
          return "close__galleryApp";
        }
      }]);

      function _class2(e) {
        _classCallCheck(this, _class2);

        return _super5.call(this, {
          el: e,
          listeners: ["click"]
        });
      }

      _createClass(_class2, [{
        key: "toHTML",
        value: function toHTML() {
          return "";
        }
      }]);

      return _class2;
    }(t), /*#__PURE__*/function (_n) {
      _inherits(_class3, _n);

      var _super6 = _createSuper(_class3);

      _createClass(_class3, null, [{
        key: "shortName",
        value: function shortName() {
          return "slideNext";
        }
      }, {
        key: "className",
        value: function className() {
          return "btn-wrapper next";
        }
      }]);

      function _class3(e) {
        _classCallCheck(this, _class3);

        return _super6.call(this, {
          el: e,
          listeners: ["click"]
        });
      }

      _createClass(_class3, [{
        key: "toHTML",
        value: function toHTML() {
          return '<div class="btn-next__btn-wrapper"></div>';
        }
      }, {
        key: "onClick",
        value: function onClick() {
          event.stopPropagation(), l.nextImage();
        }
      }]);

      return _class3;
    }(n), /*#__PURE__*/function (_n2) {
      _inherits(_class4, _n2);

      var _super7 = _createSuper(_class4);

      _createClass(_class4, null, [{
        key: "shortName",
        value: function shortName() {
          return "slidePrev";
        }
      }, {
        key: "className",
        value: function className() {
          return "btn-wrapper previous";
        }
      }]);

      function _class4(e) {
        _classCallCheck(this, _class4);

        return _super7.call(this, {
          el: e,
          listeners: ["click"]
        });
      }

      _createClass(_class4, [{
        key: "toHTML",
        value: function toHTML() {
          return '<div class="btn-prev__btn-wrapper"></div>';
        }
      }, {
        key: "onClick",
        value: function onClick() {
          event.stopPropagation(), l.previousImage();
        }
      }]);

      return _class4;
    }(n)]
  });
  window.addEventListener("load", function (e) {
    l.build(e);
  }), console.log(l), r({
    selector: "[data-gallery]"
  }), r({
    selector: "[data-gallery-two]"
  });
}();