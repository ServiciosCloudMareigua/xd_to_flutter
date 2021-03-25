"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
var xd = require("scenegraph");

var _require = require("../../utils/debug"),
    trace = _require.trace;

var _require2 = require("./abstractwidget"),
    AbstractWidget = _require2.AbstractWidget;

var _require3 = require("../../utils/exportutils"),
    getColor = _require3.getColor;

var Artboard =
/*#__PURE__*/
function (_AbstractWidget) {
  _inherits(Artboard, _AbstractWidget);

  function Artboard() {
    _classCallCheck(this, Artboard);

    return _possibleConstructorReturn(this, _getPrototypeOf(Artboard).apply(this, arguments));
  }

  _createClass(Artboard, [{
    key: "_serialize",
    value: function _serialize(ctx) {
      return "".concat(this.widgetName, "(").concat(this._getParamList(ctx), ")");
    }
  }, {
    key: "_serializeWidgetBody",
    value: function _serializeWidgetBody(ctx) {
      return "Scaffold(".concat(this._getBackgroundColorParam(ctx), "body: ").concat(this._getChildStack(ctx), ", )");
    }
  }, {
    key: "_serializeWidgetHeader",
    value: function _serializeWidgetHeader(ctx) {
      return "Artboard VARS (".concat(this._getChildStackV(ctx), ")");
    }
  }, {
    key: "_getBackgroundColorParam",
    value: function _getBackgroundColorParam(ctx) {
      var xdNode = this.xdNode,
          fill = xdNode.fillEnabled && xdNode.fill,
          color;

      if (fill instanceof xd.Color) {
        color = fill;
      } else if (fill) {
        ctx.log.warn("Only solid color backgrounds are supported for artboards.", xdNode);
        var stops = fill.colorStops;

        if (stops && stops.length > 0) {
          color = stops[0].color;
        }
      }

      return color ? "backgroundColor: ".concat(getColor(color), ", ") : "";
    }
  }, {
    key: "symbolId",
    get: function get() {
      return this.xdNode.guid;
    }
  }, {
    key: "adjustedBounds",
    get: function get() {
      // we don't want the artboard's position in the document.
      var xdNode = this.xdNode;
      return {
        x: 0,
        y: 0,
        width: xdNode.width,
        height: xdNode.height
      };
    }
  }], [{
    key: "create",
    value: function create(xdNode, ctx) {
      throw "Artboard.create() called.";
    }
  }]);

  return Artboard;
}(AbstractWidget);

exports.Artboard = Artboard;