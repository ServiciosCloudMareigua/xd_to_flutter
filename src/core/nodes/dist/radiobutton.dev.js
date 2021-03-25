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
    trace = _require3.trace; // Represents an Ellipse or Rectangle that can be exported as a decorated RadioButton


var RadioButton =
/*#__PURE__*/
function (_AbstractNode) {
  _inherits(RadioButton, _AbstractNode);

  _createClass(RadioButton, null, [{
    key: "create",
    value: function create(xdNode, ctx) {
      // trace(`RadioButton create xdNode.name ${xdNode.name}`);
      if (xdNode instanceof xd.Group) {
        // trace(`RadioButton create entra xdNode instanceof xd.Group`);
        return new RadioButton(xdNode, ctx);
      }
    }
  }]);

  function RadioButton(xdNode, ctx) {
    var _this;

    _classCallCheck(this, RadioButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RadioButton).call(this, xdNode, ctx));
    _this.children = [];
    ctx.addParam(_this.addParam("onTap", NodeUtils.getProp(_this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.IMAGE));
    return _this;
  }

  _createClass(RadioButton, [{
    key: "_serialize",
    value: function _serialize(ctx) {
      if (!this.hasChildren) {
        return "";
      }

      var xdNode = this.xdNode;

      if (xdNode.mask) {
        ctx.log.warn("Group masks aren't supported.", xdNode);
      } // trace(`RadioButton _serialize this.xdNode.name4----> ${xdNode.name}`);
      // let str = `RadioButtonListTile(
      //                 title: Text(${this._getChildCheckBox(ctx)=='' ? '\'No le llegó nada de texto al TextField\''  : this._getChildCheckBox(ctx)}),
      //                 value: true,
      //                 onChanged: (newValue) { 
      //                 //  setState(() {
      //                 //    checkedValue = newValue; 
      //                 //  }); 
      //                },
      //                 controlAffinity: ListTileControlAffinity.leading,  //  <-- leading RadioButton
      //   )`;


      var lista = this._getChildCheckBox(ctx); // trace(`RadioButton res---->${lista[0].substring(lista[0].indexOf('Color('))}`);


      var str = "Row(\n\t\t\tmainAxisAlignment: MainAxisAlignment.start,\n\t\t\tchildren: [\n\t\t\t  SizedBox(\n\t\t\t\theight: 24.0,\n\t\t\t\twidth: 24.0,\n\t\t\t\tchild: Radio(\n                    value: 'grup.Value(valorDelTexto generalmente)',\n                    groupValue: 'group.Value2',\n                    onChanged: (String value) {\n                    //   setState(() {\n                    //      _character = value;\n                    //   });\n                    },\n                  ),\n\t\t\t  ),\n\t\t\t  ".concat(lista[1], "\n\t\t\t],\n\t\t  )"); // trace(`RadioButton _serialize str1----> ${str}`);

      if (!this.responsive) {
        str = this._addSizedBox(str, xdNode.localBounds, ctx);
      } // trace(`RadioButton _serialize str --> ${str}`);


      return str;
    } //retorna el color y del borde del radiobutton y el parametro Text() del label 

  }, {
    key: "_getChildCheckBox",
    value: function _getChildCheckBox(ctx) {
      var res = [];
      var texto = '';
      var containerDecoration = '';

      var len = this._getChildList(ctx).split('Pinned.fromSize');

      if (len.length == 3) {
        for (var i = 0; i < len.length; i++) {
          var element = len[i];

          if (element.includes('Container(')) {
            var modification1 = element.substring(element.indexOf('decoration'));
            modification1 = modification1.substring(0, modification1.length - 6);

            if (modification1.includes('border: ')) {
              var modificacion3 = modification1.substring(modification1.indexOf('Border.all(') + 'Border.all('.length); // trace(`mModificacion3 ${modificacion3}`)

              modificacion3 = modificacion3.substring(0, modificacion3.lastIndexOf(',') - 4); // trace(`modificacion3 ${modificacion3}`)

              containerDecoration = modificacion3;
            } else {
              trace("esto no es un RadioButton, no tiene todos los bordes.");
            } // trace(`containerDecoration ==== ${containerDecoration}`)

          }

          if (element.includes('Text(')) {
            texto = element.substring(element.indexOf('Text(\''));
            texto = texto.substring(0, texto.lastIndexOf(')'));
          }
        }

        res.push(containerDecoration);
        res.push(texto);
      } else {
        trace("Solo pueden haber 2 partes en el inputText: Container, Text(Icon), Text(placeholder)");
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
      }); // trace(`RadioButton _getChildList str---> ${str}`)

      return str;
    }
  }]);

  return RadioButton;
}(AbstractNode);

exports.RadioButton = RadioButton;