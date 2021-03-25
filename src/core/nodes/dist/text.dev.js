"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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

var NodeUtils = require("../../utils/nodeutils");

var _require = require("../../utils/exportutils"),
    getColor = _require.getColor,
    getString = _require.getString,
    DartType = _require.DartType;

var _require2 = require("./abstractnode"),
    AbstractNode = _require2.AbstractNode;

var PropType = require("../proptype");

var _require3 = require('../../utils/debug'),
    trace = _require3.trace;
/*
Notes:
- Line height in XD is a fixed pixel value. In Flutter it is a multiplier of the largest text in a line. This causes differences in rich text with different sizes.
- SingleChildScrollView does not work correctly when in a Transform.
*/


var Text =
/*#__PURE__*/
function (_AbstractNode) {
  _inherits(Text, _AbstractNode);

  _createClass(Text, null, [{
    key: "create",
    value: function create(xdNode, ctx) {
      // trace(`Text create xdNode.name ${xdNode.name}`);
      if (xdNode instanceof xd.Text) {
        return new Text(xdNode, ctx);
      }
    }
  }]);

  function Text(xdNode, ctx) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, xdNode, ctx));
    ctx.addParam(_this.addParam("text", NodeUtils.getProp(xdNode, PropType.TEXT_PARAM_NAME), DartType.STRING, getString(xdNode.text)));
    ctx.addParam(_this.addParam("fill", NodeUtils.getProp(xdNode, PropType.COLOR_PARAM_NAME), DartType.COLOR, getColor(xdNode.fill)));
    return _this;
  }

  _createClass(Text, [{
    key: "_serialize",
    value: function _serialize(ctx) {
      // trace(`Text _serialize this.xdNode.name----> ${this.xdNode.name}`);
      var str,
          o = this.xdNode;

      if (o.styleRanges.length <= 1 || this.getParam("text") || this.getParam("fill")) {
        str = this._getText(ctx);
      } else {
        str = this._getTextRich(ctx);
      }

      if (o.clippedByArea) {
        str = "SingleChildScrollView(child: ".concat(str, ")");
      }

      if (this.responsive) {// doesn't need any modifications. Sizing is all handled by the layout.
      } else if (o.areaBox) {
        // Area text.
        // don't add padding since the user set an explicit width
        str = this._addSizedBox(str, o.areaBox, ctx);
      } else if (o.textAlign !== xd.Text.ALIGN_LEFT) {
        // To keep it aligned we need a width, with a touch of padding to minimize differences in rendering.
        var w = $.fix(this.adjustedBounds.width, 0);
        str = "SizedBox(width: ".concat(w, ", child: ").concat(str, ",)");
      } // trace(`Text _serialize str----> ${str}`);


      return str;
    }
  }, {
    key: "_padWidth",
    value: function _padWidth(w) {
      var o = this.xdNode,
          pad = Math.max(o.fontSize * 0.25, w * 0.1) | 0;

      if (o.textAlign === xd.Text.ALIGN_RIGHT) {
        this._offsetX = -pad * 2;
      } else if (o.textAlign === xd.Text.ALIGN_CENTER) {
        this._offsetX = -pad;
      }

      return w + pad * 2;
    }
  }, {
    key: "_getText",
    value: function _getText(ctx) {
      var text = this.getParamName("text") || getString(this.xdNode.text); // if(this.xdNode.name.startsWith('icon:')){
      // 	trace(`this._getTextStyleParamList(this.xdNode, false, ctx)[1] ${this._getTextStyleParamList(this.xdNode, false, ctx)[1]}`);
      // 	trace(`this._getTextStyleParamList(this.xdNode, false, ctx)[2] ${this._getTextStyleParamList(this.xdNode, false, ctx)[2]}`);
      // }	

      return this.xdNode.name.startsWith('icon:') ? "Icon(Icons.".concat(this.xdNode.name.substring('icon:'.length).trim(), ", \n\t\ts").concat(this._getTextStyleParamList(this.xdNode, false, ctx)[1].substring(5), "\n\t\t").concat(this._getTextStyleParamList(this.xdNode, false, ctx)[2], "\n\t\t)") : "Text(" + "".concat(text, ", ") + getStyleParam(this._getTextStyleParamList(this.xdNode, false, ctx)) + this._getTextAlignParam() + ")";
    }
  }, {
    key: "_getTextRich",
    value: function _getTextRich(ctx) {
      var xdNode = this.xdNode,
          text = xdNode.text;
      var styles = xdNode.styleRanges;
      var str = "",
          j = 0;

      var defaultStyleParams = this._getTextStyleParamList(styles[0], true, ctx);

      for (var i = 0; i < styles.length; i++) {
        var style = styles[i],
            l = style.length;

        if (l === 0) {
          continue;
        }

        var styleParams = this._getTextStyleParamList(styles[i], false, ctx);

        var delta = $.getParamDelta(defaultStyleParams, styleParams);

        if (i === styles.length - 1) {
          l = text.length - j;
        } // for some reason, XD doesn't always return the correct length for the last entry.


        str += this._getTextSpan(delta, text.substr(j, l)) + ", ";
        j += l;
      } // Export a rich text object with an empty root span setting a default style.
      // Child spans set their style as a delta of the default.


      return "Text.rich(TextSpan(" + getStyleParam(defaultStyleParams) + "  children: [".concat(str, "],") + "), ".concat(this._getTextAlignParam(), ")");
    }
  }, {
    key: "_getTextSpan",
    value: function _getTextSpan(styleParams, text) {
      return "TextSpan(" + " text: ".concat(getString(text), ", ") + getStyleParam(styleParams) + ")";
    }
  }, {
    key: "_getTextAlignParam",
    value: function _getTextAlignParam() {
      return "textAlign: ".concat(this._getTextAlign(this.xdNode.textAlign), ", ");
    }
  }, {
    key: "_getTextAlign",
    value: function _getTextAlign(align) {
      return "TextAlign." + (align === "right" ? "right" : align === "center" ? "center" : "left");
    }
  }, {
    key: "_getTextStyleParamList",
    value: function _getTextStyleParamList(o, isDefault, ctx) {
      return getTextStyleParamList(o, isDefault, ctx, this.xdNode, this.getParamName("fill"));
    }
  }, {
    key: "adjustedBounds",
    get: function get() {
      var bounds = _get(_getPrototypeOf(Text.prototype), "adjustedBounds", this),
          o = this.xdNode;

      if (!o.areaBox && !this.responsive) {
        var pad = Math.max(o.fontSize * 0.25, bounds.width * 0.1);
        bounds.width += 2 * pad;

        if (o.textAlign === xd.Text.ALIGN_RIGHT) {
          bounds.x -= pad * 2;
        } else if (o.textAlign === xd.Text.ALIGN_CENTER) {
          bounds.x -= pad;
        }
      }

      return bounds;
    }
  }, {
    key: "transform",
    get: function get() {
      var o = this.xdNode;
      return {
        rotation: o.rotation,
        flipY: o.flipY
      };
    }
  }]);

  return Text;
}(AbstractNode);

exports.Text = Text;

function getTextStyleParamList(o, isDefault, ctx) {
  var xdNode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var isStyleRange = o.length != null; // kind of an unusual place for this, but we want to run it on every style object:

  _checkForUnsupportedFeatures(o, xdNode, ctx);

  ctx.addFont(_getFontFamily(o), xdNode); // Builds an array of style parameters.

  return [_getFontFamilyParam(o), _getFontSizeParam(o), _getColorParam(o, fill), _getLetterSpacingParam(o), // The default style doesn't include weight, decoration, or style (italic):
  isDefault ? null : _getFontStyleParam(o), isDefault ? null : _getFontWeightParam(o), isDefault ? null : _getTextDecorationParam(o), // Line height & shadows are set at the node level in XD, so not included for ranges:
  !isStyleRange || isDefault ? _getHeightParam(xdNode || o) : null, !isStyleRange || isDefault ? _getShadowsParam(xdNode || o) : null];
}

exports.getTextStyleParamList = getTextStyleParamList;

function getStyleParam(styleParams) {
  if (!styleParams) {
    return "";
  }

  var str = getTextStyle(styleParams);
  return !str ? "" : "style: ".concat(str, ", ");
}

exports.getStyleParam = getStyleParam;

function getTextStyle(styleParams) {
  var str = $.getParamList(styleParams);
  return !str ? "" : "TextStyle(".concat(str, ")");
}

exports.getTextStyle = getTextStyle;

function _checkForUnsupportedFeatures(o, xdNode, ctx) {
  if (o.textScript !== "none") {
    // super / subscript
    ctx.log.warn("Superscript & subscript are not currently supported.", xdNode);
  }

  if (o.textTransform !== "none") {
    // uppercase / lowercase / titlecase
    ctx.log.warn("Text transformations (all caps, title case, lowercase) are not currently supported.", xdNode);
  }

  if (o.paragraphSpacing) {
    ctx.log.warn("Paragraph spacing is not currently supported.", xdNode);
  }

  if (o.strokeEnabled && o.stroke) {
    // outline text
    ctx.log.warn("Text border is not currently supported.", xdNode);
  }
}

function _getFontFamilyParam(o) {
  return "fontFamily: '".concat(_getFontFamily(o), "', ");
}

function _getFontFamily(o) {
  return NodeUtils.getFlutterFont(o.fontFamily) || o.fontFamily;
}

function _getFontSizeParam(o) {
  return "fontSize: ".concat(o.fontSize, ", ");
}

function _getColorParam(o, fill) {
  return "color: ".concat(fill || getColor(o.fill, NodeUtils.getOpacity(o)), ", ");
}

function _getLetterSpacingParam(o) {
  // Flutter uses pixel values for letterSpacing.
  // XD uses increments of 1/1000 of the font size.
  return o.charSpacing === 0 ? "" : "letterSpacing: ".concat(o.charSpacing / 1000 * o.fontSize, ", ");
}

function _getFontStyleParam(o) {
  var style = _getFontStyle(o.fontStyle);

  return style ? "fontStyle: ".concat(style, ", ") : "";
}

function _getFontStyle(style) {
  style = style.toLowerCase();
  var match = style.match(FONT_STYLES_RE);
  var val = match && FONT_STYLES[match];
  return val ? "FontStyle." + val : null;
}

function _getFontWeightParam(o) {
  var weight = _getFontWeight(o.fontStyle);

  return weight ? "fontWeight: ".concat(weight, ", ") : "";
}

function _getFontWeight(style) {
  style = style.toLowerCase();
  var match = style.match(FONT_WEIGHTS_RE);
  var val = match && FONT_WEIGHTS[match];
  return val ? "FontWeight." + val : null;
}

function _getTextDecorationParam(o) {
  var u = o.underline,
      s = o.strikethrough,
      str = "";

  if (!u && !s) {
    return str;
  }

  if (u && s) {
    str = "TextDecoration.combine([TextDecoration.underline, TextDecoration.lineThrough])";
  } else {
    str = "TextDecoration.".concat(u ? "underline" : "lineThrough");
  }

  return "decoration: ".concat(str, ", ");
}

function _getHeightParam(o) {
  // XD reports a lineSpacing of 0 to indicate default spacing.
  // Flutter uses a multiplier against the font size for its "height" value.
  // XD uses a pixel value.
  return o.lineSpacing === 0 ? "" : "height: ".concat(o.lineSpacing / o.fontSize, ", ");
}

function _getShadowsParam(xdNode) {
  return xdNode.shadow == null || !xdNode.shadow.visible ? "" : "shadows: [".concat(_getShadow(xdNode.shadow), "], ");
}

function _getShadow(shadow) {
  var o = shadow;
  return "Shadow(color: ".concat(getColor(o.color), ", ") + (o.x || o.y ? "offset: Offset(".concat(o.x, ", ").concat(o.y, "), ") : "") + (o.blur ? "blurRadius: ".concat(o.blur, ", ") : "") + ")";
}

function _buildStyleRegExp(map) {
  var list = [];

  for (var n in map) {
    list.push(n);
  }

  return new RegExp(list.join("|"), "ig");
} // Used to translate font weight names from XD to Flutter constants:
// https://www.webtype.com/info/articles/fonts-weights/


var FONT_WEIGHTS = {
  "thin": "w100",
  "hairline": "w100",
  "extralight": "w200",
  "ultralight": "w200",
  "light": "w300",
  "book": "w300",
  "demi": "w300",
  "normal": null,
  // w400
  "regular": null,
  "plain": null,
  "medium": "w500",
  "semibold": "w600",
  "demibold": "w600",
  "bold": "w700",
  // or "bold"
  "extrabold": "w800",
  "heavy": "w800",
  "black": "w900",
  "poster": "w900"
};

var FONT_WEIGHTS_RE = _buildStyleRegExp(FONT_WEIGHTS);

var FONT_STYLES = {
  "italic": "italic",
  "oblique": "italic"
};

var FONT_STYLES_RE = _buildStyleRegExp(FONT_STYLES);