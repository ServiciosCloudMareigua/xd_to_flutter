"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
var _require = require("../../utils/debug"),
    trace = _require.trace;

var $ = require("../../utils/utils");

var _require2 = require("../parameter"),
    Parameter = _require2.Parameter;

var _require3 = require("../decorators/layout"),
    Layout = _require3.Layout;

var _require4 = require("../decorators/prototypeinteraction"),
    PrototypeInteraction = _require4.PrototypeInteraction; // Abstract class representing the minimum interface required for an export node.


var AbstractNode =
/*#__PURE__*/
function () {
  // Nodes should also have a static `create(xdNode, ctx)` method
  // that returns an instance if appropriate for the xdNode.
  function AbstractNode(xdNode, ctx) {
    _classCallCheck(this, AbstractNode);

    this.xdNode = xdNode;
    this.parameters = null;
    this.children = null;
    this.decorators = null;
    this.hasDecorators = false; // indicates this node has non-cosmetic decorators.

    this.layout = new Layout(this, ctx);
    this._cache = null;
    this.vars = null;
  }

  _createClass(AbstractNode, [{
    key: "addDecorator",
    value: function addDecorator(decorator) {
      // if (this.xdNode.name.startsWith('op')) {
      // 	trace(`AbstractNode addingDecorator to ${this.xdNode.name} decorator: ${decorator}`)
      // 	trace(`AbstractNode addingDecorator to child of ${this.xdNode.parent.name}`)
      // 	trace(`decorator instanceof PrototypeInteraction ${decorator instanceof PrototypeInteraction}`)
      // 	trace(`decorator .constructor.name: ${decorator.constructor.name}`)
      // 	trace(`!decorator.cosmetic ${!decorator.cosmetic}`)
      // }
      // trace(`this.decorators 1: ${this.decorators}`)
      this.decorators = this.decorators || []; // trace(`this.decorators 2: ${this.decorators}`)

      this.decorators.push(decorator); // if (this.xdNode.name.startsWith('op')) {
      // 	trace(`1AbstractNode addingDecorator to ${this} decorator: ${decorator}`)
      // 	trace(`1AbstractNode addingDecorator to ${this.xdNode.name} decorator: ${decorator}`)
      // 	trace(`AbstractNode addingDecorator to child of ${this.xdNode.parent.name}`)
      // 	trace(`1AbstractNode addingDecorator to ${this.xdNode.name} decorators: ${this.decorators}`)
      // 	trace(`decorator instanceof PrototypeInteraction ${this.decorators[0] instanceof PrototypeInteraction}`)
      // 	trace(`decorator .constructor.name: ${decorator.constructor.name}`)
      // 	trace(`decorator DECORATE ${this.decorators[0] instanceof PrototypeInteraction}`)
      // 	trace(`1!decorator.cosmetic ${!decorator.cosmetic}`)
      // }

      if (!decorator.cosmetic) {
        this.hasDecorators = true;
      }
    }
  }, {
    key: "addParam",
    value: function addParam(key, name, type, value) {
      if (!name || !key) {
        return null;
      }

      var param = new Parameter(name, type, value);

      if (!this.parameters) {
        this.parameters = {};
      }

      return this.parameters[key] = param;
    }
  }, {
    key: "getParam",
    value: function getParam(key) {
      return this.parameters && this.parameters[key];
    }
  }, {
    key: "getParamName",
    value: function getParamName(key) {
      var param = this.getParam(key);
      return param && param.name || null;
    }
  }, {
    key: "toString",
    value: function toString(ctx) {
      return "[".concat(this.constructor.name, "]");
    }
  }, {
    key: "serialize",
    value: function serialize(ctx) {
      // if(this.xdNode.name.startsWith('select:') || this.xdNode.name.startsWith('op:')){
      // 	trace(`cachesillo.... ${this.xdNode.name} ${this._cache.xdNode.name}`);
      // }
      if (this._cache === null) {
        var nodeStr = this._serialize(ctx);

        this._cache = this._decorate(nodeStr, ctx); // if(this.xdNode.name.startsWith('select:') || this.xdNode.name.startsWith('op:')){
        // 	trace(`serializing.... ${this.xdNode.name}`)
        // }
        // if(this.xdNode.name.startsWith('select:') || this.xdNode.name.startsWith('op:')){
        // 	trace(`decorating.... ${this.xdNode.name}`)
        // }
      } // if(this.xdNode.name.startsWith('select:') || this.xdNode.name.startsWith('op:')){
      // 	// trace(`returning cache....${this.xdNode.name} chache ${this._cache}`)
      // }


      return this._cache;
    }
  }, {
    key: "_serialize",
    value: function _serialize(ctx) {
      return "";
    }
  }, {
    key: "getNeededVars",
    value: function getNeededVars(ctx) {
      if (this.vars === null) {
        this.vars = this._getNeededVars(ctx);
      }

      return this.vars;
    }
  }, {
    key: "_getNeededVars",
    value: function _getNeededVars(ctx) {
      return "";
    }
  }, {
    key: "_decorate",
    value: function _decorate(nodeStr, ctx) {
      if (!nodeStr) {
        return nodeStr;
      }

      var decorators = this.decorators,
          l = nodeStr && decorators ? decorators.length : 0;

      for (var i = 0; i < l; i++) {
        nodeStr = decorators[i].serialize(nodeStr, ctx);
      }

      if (this.layout) {
        nodeStr = this.layout.serialize(nodeStr, ctx);
      }

      return nodeStr;
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
      });
      return str;
    }
  }, {
    key: "_getChildVars",
    value: function _getChildVars(ctx) {
      var _this = this;

      var str = ""; // trace(`AbstractNode _getChildVars this.children ----> ${this.children}`)
      // trace(`AbstractNode _getChildVars this.xdNode.name ----> ${this.xdNode.name}`)

      this.children.forEach(function (node) {
        // trace(`AbstractNode _getChildVars this.xdNode.name.startsWith('input:') ----> ${this.xdNode.name.startsWith('input:')}`);
        if (_this.xdNode.name.startsWith('input:')) {// trace(`AbstractNode _getChildVars node.runtimeType == Container ----> ${node.runtimeType}`);
          // trace(typeof node);
        } else {} // trace(`AbstractNode_getChildVars this.children.forEach(node => ${node}`);


        var childStr = node && node.getNeededVars(ctx);

        if (childStr) {
          str += childStr + ", ";
        }
      });
      return str;
    }
  }, {
    key: "_addSizedBox",
    value: function _addSizedBox(nodeStr, size, ctx) {
      return "SizedBox(width: ".concat($.fix(size.width, 0), ", height: ").concat($.fix(size.height, 0), ", child: ").concat(nodeStr, ",)");
    }
  }, {
    key: "_getChildStack",
    value: function _getChildStack(ctx) {
      return "Stack(children: <Widget>[".concat(this._getChildList(ctx), "], )");
    }
  }, {
    key: "_getChildStackV",
    value: function _getChildStackV(ctx) {
      return "AbstractNode _getChildStackV [".concat(this._getChildVars(ctx), "], )");
    }
  }, {
    key: "hasChildren",
    get: function get() {
      return !!(this.children && this.children.length);
    }
  }, {
    key: "responsive",
    get: function get() {
      return !!this.xdNode.horizontalConstraints;
    }
  }, {
    key: "xdId",
    get: function get() {
      return this.xdNode ? this.xdNode.guid : null;
    }
  }, {
    key: "xdName",
    get: function get() {
      return this.xdNode ? this.xdNode.name : null;
    }
  }, {
    key: "adjustedBounds",
    get: function get() {
      // Note: Artboards always return x/y=0 & w/h = specified size for localBounds, even if children exceed edges.
      var xdNode = this.xdNode;
      var bip = xdNode.boundsInParent,
          lb = xdNode.localBounds,
          pb = xdNode.parent.localBounds; // calculate the untransformed top left corner, by finding the center and subtracting half w & h:

      var tl = {
        x: bip.x + bip.width / 2 - lb.width / 2,
        y: bip.y + bip.height / 2 - lb.height / 2
      };
      return {
        x: tl.x - pb.x,
        y: tl.y - pb.y,
        width: lb.width,
        height: lb.height
      };
    }
  }, {
    key: "transform",
    get: function get() {
      // currently supports rotation & flipY.
      return {
        rotation: this.xdNode.rotation,
        flipY: false
      };
    }
  }]);

  return AbstractNode;
}();

exports.AbstractNode = AbstractNode;