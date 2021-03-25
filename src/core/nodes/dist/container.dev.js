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

var ExportUtils = require("../../utils/exportutils");

var NodeUtils = require("../../utils/nodeutils");

var _require = require("./abstractnode"),
    AbstractNode = _require.AbstractNode;

var PropType = require("../proptype");

var _require2 = require("../parameter"),
    ParamType = _require2.ParamType;

var _require3 = require('../../utils/debug'),
    trace = _require3.trace; // Represents an Ellipse or Rectangle that can be exported as a decorated Container


var Container =
/*#__PURE__*/
function (_AbstractNode) {
  _inherits(Container, _AbstractNode);

  _createClass(Container, null, [{
    key: "create",
    value: function create(xdNode, ctx) {
      if (xdNode instanceof xd.Rectangle || xdNode instanceof xd.Ellipse) {
        if (xdNode.fillEnabled && xdNode.fill instanceof xd.RadialGradient) {
          ctx.addImport("package:adobe_xd/gradient_xd_transform.dart");
        }

        return new Container(xdNode, ctx);
      }
    }
  }]);

  function Container(xdNode, ctx) {
    var _this;

    _classCallCheck(this, Container);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Container).call(this, xdNode, ctx));

    if (xdNode.fill instanceof xd.ImageFill) {
      var value = ExportUtils.getAssetImage(xdNode, ctx);
      ctx.addParam(_this.addParam("fill", NodeUtils.getProp(xdNode, PropType.IMAGE_PARAM_NAME), ExportUtils.DartType.IMAGE, value));
    }

    return _this;
  }

  _createClass(Container, [{
    key: "_serialize",
    value: function _serialize(ctx) {
      // trace(`Container _serialize this.xdNode.name----> ${this.xdNode.name}`);
      // trace(`Container _serialize Container(\${this._getSizeParams(ctx)}\${this._getColorOrDecorationParam(ctx)----> Container(${this._getSizeParams(ctx)}${this._getColorOrDecorationParam(ctx)})`);
      return "Container(".concat(this._getSizeParams(ctx)).concat(this._getColorOrDecorationParam(ctx), ")");
    }
  }, {
    key: "_getSizeParams",
    value: function _getSizeParams(ctx) {
      if (this.responsive) {
        return "";
      }

      var artboard = this.xdNode.parent;

      while (!artboard.constructor.name.includes('Artboard')) {
        artboard = artboard.parent;
      }

      var o = this.xdNode,
          isRect = this.isRect;
      var w = $.fix(isRect ? o.width : o.radiusX * 2);
      var h = $.fix(isRect ? o.height : o.radiusY * 2);
      return "width: ".concat(w / artboard.width, " * screenSize.width, height: ").concat(h / artboard.height, "* screenSize.height, ");
    }
    /** BOXDECORATION */

  }, {
    key: "_getColorOrDecorationParam",
    value: function _getColorOrDecorationParam(ctx) {
      var xdNode = this.xdNode;

      if (this.isRect && !xdNode.stroke && !xdNode.hasRoundedCorners && !xdNode.shadow && xdNode.fill instanceof xd.Color) {
        return this._getFillParam(ctx);
      } else {
        return this._getDecorationParam(ctx);
      }
    }
  }, {
    key: "_getDecorationParam",
    value: function _getDecorationParam(ctx) {
      return "decoration: ".concat(this._getBoxDecoration(ctx), ", ");
    }
  }, {
    key: "_getBoxDecoration",
    value: function _getBoxDecoration(ctx) {
      var str = $.getParamList([this._getBorderRadiusParam(ctx), this._getFillParam(ctx), this._getBorderParam(ctx), this._getBoxShadowParam(ctx)]);
      return "BoxDecoration(" + str + ")";
    }
    /** FILL & STROKE */

  }, {
    key: "_getFillParam",
    value: function _getFillParam(ctx) {
      var xdNode = this.xdNode,
          fill = xdNode.fillEnabled && xdNode.fill;

      if (!fill) {
        return "";
      }

      var blur = xdNode.blur;
      var blurFillOpacity = blur && blur.visible && blur.isBackgroundEffect ? blur.fillOpacity : 1.0;
      var opacity = NodeUtils.getOpacity(xdNode) * blurFillOpacity;

      if (fill instanceof xd.Color) {
        return "color: ".concat(ExportUtils.getColor(xdNode.fill, opacity), ", ");
      }

      if (fill instanceof xd.ImageFill) {
        var image = this.getParamName("fill") || ExportUtils.getAssetImage(xdNode, ctx);
        return "image: DecorationImage(" + "  image: ".concat(image, ",") + "  fit: ".concat(this._getBoxFit(fill.scaleBehavior), ",") + this._getOpacityColorFilterParam(opacity) + "), ";
      }

      var gradient = ExportUtils.getGradientParam(fill, opacity);

      if (gradient) {
        return gradient;
      }

      ctx.log.warn("Unrecognized fill type ('".concat(fill.constructor.name, "')."), xdNode);
    }
  }, {
    key: "_getBoxFit",
    value: function _getBoxFit(scaleBehavior, ctx) {
      return "BoxFit.".concat(scaleBehavior === xd.ImageFill.SCALE_COVER ? 'cover' : 'fill');
    }
  }, {
    key: "_getOpacityColorFilterParam",
    value: function _getOpacityColorFilterParam(opacity) {
      if (opacity >= 1) {
        return '';
      }

      return "colorFilter: new ColorFilter.mode(Colors.black.withOpacity(".concat($.fix(opacity, 2), "), BlendMode.dstIn), ");
    }
  }, {
    key: "_getBorderParam",
    value: function _getBorderParam(ctx) {
      var xdNode = this.xdNode;

      if (!xdNode.strokeEnabled) {
        return "";
      }

      if (xdNode.strokePosition !== xd.GraphicNode.INNER_STROKE) {
        ctx.log.warn('Only inner strokes are supported on rectangles & ellipses.', xdNode);
      }

      if (xdNode.strokeJoins !== xd.GraphicNode.STROKE_JOIN_MITER) {
        ctx.log.warn('Only miter stroke joins are supported on rectangles & ellipses.', xdNode);
      }

      var dashes = xdNode.strokeDashArray;

      if (dashes && dashes.length && dashes.reduce(function (a, b) {
        return a + b;
      })) {
        ctx.log.warn('Dashed lines are not supported on rectangles & ellipses.', xdNode);
      }

      var color = xdNode.stroke && ExportUtils.getColor(xdNode.stroke, NodeUtils.getOpacity(xdNode));
      return color ? "border: Border.all(width: ".concat($.fix(xdNode.strokeWidth, 2), ", color: ").concat(color, "), ") : "";
    }
    /** BORDERRADIUS */

  }, {
    key: "_getBorderRadiusParam",
    value: function _getBorderRadiusParam(ctx) {
      var xdNode = this.xdNode,
          radiusStr;

      if (xdNode instanceof xd.Ellipse) {
        radiusStr = this._getBorderRadiusForEllipse(ctx);
      } else if (xdNode.hasRoundedCorners) {
        radiusStr = this._getBorderRadiusForRectangle(ctx);
      }

      return radiusStr ? "borderRadius: ".concat(radiusStr, ", ") : "";
    }
  }, {
    key: "_getBorderRadiusForEllipse",
    value: function _getBorderRadiusForEllipse(ctx) {
      // use a really high number so it works if it is resized.
      // using shape: BoxShape.circle doesn't work with ovals
      return "BorderRadius.all(Radius.elliptical(9999.0, 9999.0))";
    }
  }, {
    key: "_getBorderRadiusForRectangle",
    value: function _getBorderRadiusForRectangle(ctx) {
      var radii = this.xdNode.cornerRadii;
      var tl = radii.topLeft,
          tr = radii.topRight,
          br = radii.bottomRight,
          bl = radii.bottomLeft;

      if (tl === tr && tl === br && tl === bl) {
        return "BorderRadius.circular(".concat($.fix(tl, 2), ")");
      } else {
        return 'BorderRadius.only(' + this._getRadiusParam("topLeft", tl) + this._getRadiusParam("topRight", tr) + this._getRadiusParam("bottomRight", br) + this._getRadiusParam("bottomLeft", bl) + ')';
      }
    }
  }, {
    key: "_getRadiusParam",
    value: function _getRadiusParam(param, value) {
      if (value <= 1) {
        return '';
      }

      return "".concat(param, ": Radius.circular(").concat($.fix(value, 2), "), ");
    }
    /** SHADOWS */

  }, {
    key: "_getBoxShadowParam",
    value: function _getBoxShadowParam(ctx) {
      var xdNode = this.xdNode,
          s = xdNode.shadow;

      if (!s || !s.visible) {
        return "";
      }

      return "boxShadow: [BoxShadow(" + "color: ".concat(ExportUtils.getColor(s.color, NodeUtils.getOpacity(xdNode)), ", ") + "offset: Offset(".concat(s.x, ", ").concat(s.y, "), ") + "blurRadius: ".concat(s.blur, ", ") + "), ], ";
    }
  }, {
    key: "isRect",
    get: function get() {
      return this.xdNode instanceof xd.Rectangle;
    }
  }]);

  return Container;
}(AbstractNode);

exports.Container = Container;