"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var NodeUtils = require("../../utils/nodeutils");

var _require = require("./abstractnode"),
    AbstractNode = _require.AbstractNode;

var _require2 = require("../context"),
    ContextTarget = _require2.ContextTarget;

var _require3 = require("../../utils/debug"),
    trace = _require3.trace; // Abstract class representing the minimum interface required for an export node.


var AbstractWidget =
/*#__PURE__*/
function (_AbstractNode) {
  _inherits(AbstractWidget, _AbstractNode);

  function AbstractWidget(xdNode, ctx) {
    var _this;

    _classCallCheck(this, AbstractWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractWidget).call(this, xdNode, ctx));
    _this.children = [];
    _this._childParameters = {};
    _this._shapeData = {};
    _this._imports = {};
    return _this;
  }

  _createClass(AbstractWidget, [{
    key: "serialize",
    value: function serialize(ctx) {
      // serialize a widget instance. Bypass cache & _decorate.
      return this._serialize(ctx);
    }
  }, {
    key: "serializeWidget",
    value: function serializeWidget(ctx) {
      // serialize the widget class
      var params = this._childParameters,
          propStr = "",
          paramStr = "";

      for (var n in params) {
        var param = params[n],
            value = param.value;
        paramStr += "this.".concat(param.name).concat(value ? " = ".concat(value) : "", ", ");
        propStr += "final ".concat(param.type, " ").concat(param.name, ";\n");
      }

      var bodyStr = this._serializeWidgetBody(ctx); //Header 
      // let headerStr = this._serializeWidgetHeader(ctx);
      // trace(`HEADERSTR-------->>>>> ${headerStr}`);


      var importStr = this._getImportListString(ctx);

      var shapeDataStr = this._getShapeDataProps(ctx);

      return importStr + "\n" + "class ".concat(this.widgetName, " extends StatelessWidget {\n") + propStr + "".concat(this.widgetName, "({ Key key, ").concat(paramStr, "}) : super(key: key);\n") + "@override\nWidget build(BuildContext context) { \n\t\t\t\t\tvar screenSize = MediaQuery.of(context).size;\n\t\t\t\t\treturn ".concat(bodyStr, "; }") + "}\n" + shapeDataStr;
    }
  }, {
    key: "addShapeData",
    value: function addShapeData(shape) {
      // TODO: GS: Switching this to use a unique shape ID (NOT svgId) could simplify a few things
      this._shapeData[shape.xdNode.guid] = shape;
    }
  }, {
    key: "removeShapeData",
    value: function removeShapeData(shape) {
      delete this._shapeData[shape.xdNode.guid];
    }
  }, {
    key: "addImport",
    value: function addImport(name, isWidget, scope) {
      this._imports[name] = {
        name: name,
        isWidget: isWidget,
        scope: scope
      };
    }
  }, {
    key: "addChildParam",
    value: function addChildParam(param, ctx) {
      if (!param || !param.name) {
        return;
      }

      if (this._childParameters[param.name]) {
        ctx.log.warn("Duplicate parameter on '".concat(this.widgetName, "': ").concat(param.name, "."));
      }

      this._childParameters[param.name] = param;
    }
  }, {
    key: "_serializeWidgetBody",
    value: function _serializeWidgetBody(ctx) {
      throw "_serializeWidgetBody must be implemented.";
    }
  }, {
    key: "_serializeWidgetHeader",
    value: function _serializeWidgetHeader(ctx) {
      throw "_serializeWidgetHeader must be implemented.";
    }
  }, {
    key: "_getShapeDataProps",
    value: function _getShapeDataProps(ctx) {
      var str = "",
          names = {};

      for (var _i = 0, _Object$entries = Object.entries(this._shapeData); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            k = _Object$entries$_i[0],
            node = _Object$entries$_i[1];

        var name = NodeUtils.getShapeDataName(node, ctx);

        if (names[name]) {
          continue;
        }

        names[name] = true;
        str += "const String ".concat(name, " = '").concat(node.toSvgString(ctx), "';\n");
      }

      return str;
    }
  }, {
    key: "_getImportListString",
    value: function _getImportListString(ctx) {
      var str = "import 'package:flutter/material.dart';\n";
      var imports = this._imports;

      for (var n in imports) {
        var o = imports[n];

        if (ctx.target === ContextTarget.FILES || !o.isWidgetImport) {
          str += "import '".concat(o.name, "'").concat(o.scope ? "as ".concat(o.scope) : '', ";\n");
        }
      }

      return str;
    }
  }, {
    key: "_getParamList",
    value: function _getParamList(ctx) {
      var str = "",
          params = this._childParameters;

      for (var n in params) {
        var param = params[n],
            value = param.value;
        str += value ? "".concat(param.name, ": ").concat(value, ", ") : "";
      }

      return str;
    }
  }, {
    key: "symbolId",
    get: function get() {
      return this.xdNode.symbolId;
    }
  }, {
    key: "widgetName",
    get: function get() {
      return NodeUtils.getWidgetName(this.xdNode);
    }
  }]);

  return AbstractWidget;
}(AbstractNode);

exports.AbstractWidget = AbstractWidget;