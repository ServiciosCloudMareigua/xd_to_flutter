"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var $ = require("../../utils/utils");

var _require = require("./abstractdecorator"),
    AbstractDecorator = _require.AbstractDecorator;

var _require2 = require("../../utils/debug"),
    trace = _require2.trace;

var Layout =
/*#__PURE__*/
function (_AbstractDecorator) {
  _inherits(Layout, _AbstractDecorator);

  _createClass(Layout, null, [{
    key: "create",
    value: function create(node, ctx) {
      throw "Layout.create() called.";
    }
  }]);

  function Layout(node, ctx) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, node, ctx));

    if (node.responsive) {
      ctx.usesPinned();
    }

    return _this;
  }

  _createClass(Layout, [{
    key: "_serialize",
    value: function _serialize(nodeStr, ctx) {
      var node = this.node;

      if (!node.layout) {
        return nodeStr;
      }

      nodeStr = this._transform(nodeStr, ctx);
      return node.responsive ? this._pin(nodeStr, ctx) : this._translate(nodeStr, ctx);
    }
  }, {
    key: "_pin",
    value: function _pin(nodeStr, ctx) {
      var xdNode = this.node.xdNode,
          C = xd.SceneNode;
      var size = xdNode.parent.localBounds;
      var bounds = this.node.adjustedBounds;
      var hConstraints = xdNode.horizontalConstraints,
          vConstraints = xdNode.verticalConstraints;
      var hPos = hConstraints.position,
          hSize = hConstraints.size;
      var vPos = vConstraints.position,
          vSize = vConstraints.size;
      var artboard = xdNode.parent;

      while (!artboard.constructor.name.includes('Artboard')) {
        artboard = artboard.parent;
      } // trace(`ERROR EN PINNED ================== AROBOARD WIDTH ${artboard.width}     HEIGHT ${artboard.height}`)


      return "Pinned.fromSize(" + "bounds: Rect.fromLTWH(".concat($.fix(bounds.x) / artboard.width, "* screenSize.width, ").concat($.fix(bounds.y) / artboard.height, "* screenSize.height, ").concat($.fix(bounds.width) / artboard.width, "* screenSize.width, ").concat($.fix(bounds.height) / artboard.height, "* screenSize.height), ") + "size: Size(".concat($.fix(size.width) / artboard.width, "* screenSize.width, ").concat($.fix(size.height) / artboard.height, "* screenSize.height), ") + (hPos === C.FIXED_LEFT || hPos === C.FIXED_BOTH ? "pinLeft: true, " : "") + (hPos === C.FIXED_RIGHT || hPos === C.FIXED_BOTH ? "pinRight: true, " : "") + (vPos === C.FIXED_TOP || vPos === C.FIXED_BOTH ? "pinTop: true, " : "") + (vPos === C.FIXED_BOTTOM || vPos === C.FIXED_BOTH ? "pinBottom: true, " : "") + (hSize === C.SIZE_FIXED ? "fixedWidth: true, " : "") + (vSize === C.SIZE_FIXED ? "fixedHeight: true, " : "") + "child: ".concat(nodeStr, ", ") + ")";
    }
  }, {
    key: "_translate",
    value: function _translate(nodeStr, ctx) {
      var node = this.node,
          xdNode = node.xdNode;
      var bounds = node.adjustedBounds;
      var xStr = $.fix(bounds.x),
          yStr = $.fix(bounds.y);
      var artboard = xdNode.parent;

      while (!artboard.constructor.name.includes('Artboard')) {
        artboard = artboard.parent;
      } // if (xStr === "0.0" && yStr === "0.0") { return nodeStr; }
      // if(this.node.xdNode.name.startsWith('input:')|| this.node.xdNode.name.startsWith('checkbox:')){


      return "Positioned(" + "left:".concat(xStr / artboard.width, "* screenSize.width, ") + "top:  ".concat(yStr / artboard.height, "* screenSize.height,") + "child: ".concat(nodeStr, ",") + ")"; // }else{
      // }
      // return "Transform.translate(" +
      // 	`offset: Offset(${$.fix(bounds.x)}, ${$.fix(bounds.y)}), ` +
      // 	`child: ${nodeStr},` +
      // ")";
    }
  }, {
    key: "_transform",
    value: function _transform(nodeStr, ctx) {
      var transform = this.node.transform,
          str = nodeStr;

      if (transform.flipY) {
        nodeStr = 'Transform(' + 'alignment: Alignment.center, ' + "transform: Matrix4.identity()..rotateZ(".concat(this._getAngle(transform), ")..scale(1.0, -1.0), ") + "child: ".concat(nodeStr, ", ") + ')';
      } else if (transform.rotation % 360 !== 0) {
        nodeStr = 'Transform.rotate(' + "angle: ".concat(this._getAngle(transform), ", ") + "child: ".concat(nodeStr, ", ") + ')';
      }

      if (str !== nodeStr) {
        ctx.log.warn("Rotation and flip are not fully supported in responsive layouts.", this.node.xdNode);
      }

      return nodeStr;
    }
  }, {
    key: "_getAngle",
    value: function _getAngle(transform) {
      return $.fix(transform.rotation / 180 * Math.PI, 4);
    }
  }]);

  return Layout;
}(AbstractDecorator);

exports.Layout = Layout;