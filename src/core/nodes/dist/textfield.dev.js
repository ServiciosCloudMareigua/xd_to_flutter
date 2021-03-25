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

var NodeUtils = require("../../utils/nodeutils");

var _require = require("../../utils/exportutils"),
    DartType = _require.DartType;

var _require2 = require("./abstractnode"),
    AbstractNode = _require2.AbstractNode;

var PropType = require("../proptype");

var _require3 = require('../../utils/debug'),
    trace = _require3.trace; // Represents an Ellipse or Rectangle that can be exported as a decorated TextField


var TextField =
/*#__PURE__*/
function (_AbstractNode) {
  _inherits(TextField, _AbstractNode);

  _createClass(TextField, null, [{
    key: "create",
    value: function create(xdNode, ctx) {
      // trace(`TextField create xdNode.name ${xdNode.name}`);
      if (xdNode instanceof xd.Group) {
        // trace(`TextField create entra xdNode instanceof xd.Group`);
        return new TextField(xdNode, ctx);
      }
    }
  }]);

  function TextField(xdNode, ctx) {
    var _this;

    _classCallCheck(this, TextField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextField).call(this, xdNode, ctx));
    _this.children = [];
    ctx.addParam(_this.addParam("onTap", NodeUtils.getProp(_this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.IMAGE));
    return _this;
  }

  _createClass(TextField, [{
    key: "_serialize",
    value: function _serialize(ctx) {
      // trace(`TextField _serialize this.xdNode.name----> ${this.xdNode.name}`);
      if (!this.hasChildren) {
        return "";
      }

      var xdNode = this.xdNode;

      if (xdNode.mask) {
        ctx.log.warn("Group masks aren't supported.", xdNode);
      }

      var arreglo = this._getChildTextInput(ctx);

      arreglo.forEach(function (e) {
        return trace("AAAArreglo------".concat(e));
      });
      var str = 'Container()';

      if (arreglo != null && arreglo != undefined && arreglo.length > 3) {
        // str=`TextField(
        // 	obscureText: true,
        // 	decoration: InputDecoration(
        // 	  border: OutlineInputBorder(),
        // 	  labelText: 'Password',
        // 	), , color: const Color()
        //   )`;
        // let colorTemp=arreglo[1].substring(arreglo[1].indexOf('color:'));
        // colorTemp=colorTemp.substring(0, colorTemp.indexOf(','));
        str = "TextField(\n\t\t\t\tdecoration: InputDecoration(\n\t\t\t\thintText: '".concat(arreglo.length != 5 ? 'No le llegó nada de texto al TextField' : arreglo[3], "',\n\t\t\t\t// helperText: 'Helper Text',\n\t\t\t\t// counterText: '0 characters',\n\t\t\t\tprefixIcon: ").concat(arreglo[1], ",\n\t\t\t\tborder: OutlineInputBorder(\n\t\t\t\t\tborderSide: BorderSide(").concat(arreglo[0].includes(' - ') ? arreglo[0].split(' - ')[1] : '', "),\n\t\t\t\t\tborderRadius: ").concat(arreglo[0].includes(' - ') ? arreglo[0].split(' - ')[0] : 'BorderRadius.circular(1.0)', ",\n\t\t\t\t),\n\t\t\t\t),\n\t\t\t\t").concat(arreglo.length != 5 ? 'style: TextStyle(),' : arreglo[2], "\n\t\t\t\tonChanged: (String value) async {\n\t\t\t\t\t//Ponga aqu\xED lo que quiere que pase cada vez que haya un cambio en el TextField\n\t\t\t\t},\n\t\t\t\tonSubmitted: (String value) async {\n\t\t\t\t\t//Ponga aqu\xED lo que quiere que pase cada vez que se entrege el resultado del TextField\n\t\t\t\t},\n\t\t\t\t)");
      } // trace(`TextField _serialize str1----> ${str}`);


      if (!this.responsive) {
        str = this._addSizedBox(str, xdNode.localBounds, ctx);
      } // trace(`TextField _serialize str2----> ${str}`);
      // trace(`TextField _serialize str --> ${str}`);


      return str;
    } //Returns [decoration: (container), style: (TextoIcono), style: (TextoPlaceholder), TextoIcono, TextoPlaceHolder]
    //Returns [decoration: (container), Icon() , style: (TextoPlaceholder),  TextoPlaceHolder]

  }, {
    key: "_getChildTextInput",
    value: function _getChildTextInput(ctx) {
      var res = [];

      var len = this._getChildList(ctx).split('Pinned.fromSize'); // trace(`TextField this.xdNode.children ================ ${this.xdNode.children}`);
      // let iconName='';
      // this.xdNode.children.forEach(element => {
      // 	if(element.name.startsWith('icon:')){
      // 		iconName=element.name.substring('icon:'.length);
      // 	}
      // trace(`Element.name -----> ${element.name}`);
      // });
      // trace(`---------------------------------len ${len}`)
      // trace(`len.length ${len.length}`)


      var containerDecoration = ''; //styles[0]=iconStyle, styles[1]=placeholderStyle 

      var style = ''; //texts[0]=iconText, texts[1]=placeholderText 

      var text = '';
      var icono = ''; // let longestText = -1;

      if (len.length == 4) {
        for (var i = 0; i < len.length; i++) {
          var element = len[i];

          if (element.includes('Container(')) {
            var modification1 = element.substring(element.indexOf('decoration'));
            modification1 = modification1.substring(0, modification1.length - 6);

            if (modification1.includes('borderRadius:') && modification1.includes('border: ')) {
              var modification2 = modification1.substring(modification1.indexOf('borderRadius:') + 'borderRadius:'.length); // trace(`mModificacion2 ${modification2}`)

              modification2 = modification2.substring(0, modification2.indexOf(',')); // trace(`modificacion2 ${modification2}`)

              var modificacion3 = modification1.substring(modification1.indexOf('Border.all(') + 'Border.all('.length); // trace(`mModificacion3 ${modificacion3}`)

              modificacion3 = modificacion3.substring(0, modificacion3.lastIndexOf(',') - 4); // trace(`modificacion3 ${modificacion3}`)

              containerDecoration = modification2 + ' - ' + modificacion3;
            } else {
              containerDecoration = modification1;
            } // trace(`containerDecoration ==== ${containerDecoration}`)

          }

          if (element.includes('Text(')) {
            text = element.substring(element.indexOf('Text(\'') + 'Text(\''.length);
            text = text.substring(0, text.indexOf('\'')); // longestText = texto.length > longestText ? texto.length : longestText;

            style = element.substring(element.indexOf('style'), element.length - 6);
          }

          if (element.includes('Icon(')) {
            // trace(`ICONOpre ${element}`);
            icono = element.substring(element.indexOf('Icon(Icons.')); //sacar iconos

            icono = icono.substring(0, icono.lastIndexOf(', ),')); // trace(`ICONO ${icono}`);
          }
        }

        res.push(containerDecoration); // res = res.concat(styles).concat(texts);

        res.push(icono);
        res.push(style);
        res.push(text); // res.push(iconName);
      } else {
        trace("Solo pueden haber 3 partes en el inputText: Container, Text(Icon), Text(placeholder)");
      }

      return res;
    }
  }, {
    key: "_getChildList",
    value: function _getChildList(ctx) {
      var str = "";
      this.children.forEach(function (node) {
        var childStr = node && node.serialize(ctx);

        if (childStr) {
          str += childStr + ", ";
        }
      }); // trace(`TextField _getChildList str---> ${str}`)

      return str;
    }
  }]);

  return TextField;
}(AbstractNode);

exports.TextField = TextField;