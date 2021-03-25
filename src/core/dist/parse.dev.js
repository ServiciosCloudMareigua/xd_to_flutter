"use strict";

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

var interactions = require('interactions');

var allInteractions = interactions.allInteractions;

var NodeUtils = require("../utils/nodeutils");

var PropType = require("./proptype");

var _require = require('../utils/debug'),
    trace = _require.trace;

var _require2 = require("./parameter"),
    ParameterRef = _require2.ParameterRef;

var _require3 = require("./nodes/artboard"),
    Artboard = _require3.Artboard;

var _require4 = require("./nodes/stack"),
    Stack = _require4.Stack;

var _require5 = require("./nodes/container"),
    Container = _require5.Container;

var _require6 = require("./nodes/text"),
    Text = _require6.Text;

var _require7 = require("./nodes/component"),
    Component = _require7.Component;

var _require8 = require("./nodes/path"),
    Path = _require8.Path;

var _require9 = require("./nodes/grid"),
    Grid = _require9.Grid;

var _require10 = require("./nodes/textfield"),
    TextField = _require10.TextField;

var _require11 = require("./nodes/checkbox"),
    Checkbox = _require11.Checkbox;

var _require12 = require("./nodes/radiobutton"),
    RadioButton = _require12.RadioButton;

var _require13 = require("./nodes/dropdownmenu"),
    DropDownMenu = _require13.DropDownMenu;

var _require14 = require("./nodes/shape"),
    Shape = _require14.Shape;

var _require15 = require("./decorators/blur"),
    Blur = _require15.Blur;

var _require16 = require("./decorators/blend"),
    Blend = _require16.Blend;

var _require17 = require("./decorators/ontap"),
    OnTap = _require17.OnTap;

var _require18 = require("./decorators/prototypeinteraction"),
    PrototypeInteraction = _require18.PrototypeInteraction;

var _require19 = require("./decorators/comment"),
    Comment = _require19.Comment;

var ParseMode = Object.freeze({
  NORMAL: 0,
  SYMBOLS_AS_GROUPS: 1
});

function parse(root, targetXdNode, ctx) {
  // allInteractions.forEach(interaction => {
  // 	trace(`triggerNode.name ${interaction.triggerNode.constructor.name}`);
  // 	trace(`triggerNode.trigger.type ${interaction.interactions[0].trigger.type}`);
  // 	trace(`triggerNode.action.type ${interaction.interactions[0].action.type}`);
  // 	trace(`triggerNode.action.destination ${interaction.interactions[0].action.destination}`);
  // 	trace(`triggerNode.action.preserveScrollPosition ${interaction.interactions[0].action.preserveScrollPosition}`);
  // 	trace(`triggerNode.action.type ${interaction.interactions[0].action.transition.type}`);
  // 	trace(`triggerNode.action.duration ${interaction.interactions[0].action.transition.duration}`);
  // 	trace(`triggerNode.action.easing ${interaction.interactions[0].action.transition.easing}`);
  // });
  // Grab components and artboard from the root nodes
  gatherWidgets(root, ctx); // Parse components and artboard

  var widgets = Object.assign({}, ctx.artboards, ctx.masterComponents);

  for (var _i = 0, _Object$values = Object.values(widgets); _i < _Object$values.length; _i++) {
    var widget = _Object$values[_i];

    if (!targetXdNode || widget.xdNode === targetXdNode) {
      // This widget is being exported by the user
      ctx.useUserLog();
    } else {
      // This widget must be parsed because it's state is needed but the user hasn't explicitly
      // requested to export this widget so filter the log messages
      ctx.useDebugLog();
    }

    var o = parseScenegraphNode(widget.xdNode, ctx, ParseMode.NORMAL, true);
    combineShapes(o, ctx);
  }

  ctx.useUserLog();

  if (!targetXdNode) {
    return null;
  }

  var node = parseScenegraphNode(targetXdNode, ctx, ParseMode.NORMAL, true);

  if (node instanceof Path) {
    node = Shape.fromPath(node, ctx);
  } else {
    combineShapes(node, ctx);
  }

  return node;
}

exports.parse = parse;

function gatherWidgets(xdNode, ctx) {
  if (xdNode instanceof xd.SymbolInstance) {
    trace("".concat(xdNode.name, " ENTRA A SER CREADO COMO COMPONENTE.............................."));
    ctx.addComponentInstance(new Component(xdNode, ctx));
  } else if (xdNode instanceof xd.Artboard) {
    trace("".concat(xdNode.name, " ENTRA A SER CREADO COMO Artboard..............................")); // trace(`Parse parseScenegraphNode incomingInteractions ${xdNode.incomingInteractions.length}`);
    // xdNode.incomingInteractions.forEach(interaction => {
    // 	trace("Trigger: " + interaction.trigger.type + " -> Action: " + interaction.action.type);
    // });

    ctx.addArtboard(new Artboard(xdNode, ctx));
  }

  if (xdNode.children) {
    xdNode.children.forEach(function (o) {
      return gatherWidgets(o, ctx);
    });
  }
}

var NODE_FACTORIES = [Grid, Path, Container, Stack, Text // instantiated via .create
// Artboard, Component, Shape are special cases.
];
var DECORATOR_FACTORIES = [// order determines nesting order, first will be innermost
PrototypeInteraction, OnTap, Blur, Blend, Comment // instantiated via .create
// Layout is a special case.
];

function parseScenegraphNode(xdNode, ctx, mode) {
  var ignoreVisible = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!ignoreVisible && !xdNode.visible) {
    return null;
  }

  var node = null,
      isWidget = false;
  var isArtboard = xdNode instanceof xd.Artboard,
      isComponent = xdNode instanceof xd.SymbolInstance; // if (xdNode.name.startsWith('Select') && isComponent) {
  // 	trace(`Parse parseScenegraphNode CHECK FOR TRIGGERS; ${xdNode.name}`);
  // 	trace(`Parse parseScenegraphNode xdNode.children ${xdNode.children}`);
  // 	xdNode.children.forEach(interaction => {
  // 		trace("Children: " + interaction.name );
  // 	});
  // 	trace(`Parse parseScenegraphNode xdNode.guid  ${xdNode.guid}`);
  // 	trace(`Parse parseScenegraphNode triggeredInteractions ${JSON.stringify(xdNode.triggeredInteractions)}`);
  // 	xdNode.triggeredInteractions.forEach(interaction => {
  // 		trace("Trigger: " + interaction.trigger.type + " -> Action: " + interaction.action.type);
  // 	});
  // }

  if (xdNode instanceof xd.RootNode) {
    throw "Parse parseScenegraphNode parseScenegraphNode() run on RootNode";
  } else if (xdNode.name.startsWith('input:') && isComponent) {
    node = new TextField(xdNode, ctx);
  } else if (xdNode.name.startsWith('select:') && isComponent) {
    trace("ENTRA A else if (xdNode.name.startsWith('select:') && isComponent)");
    node = new DropDownMenu(xdNode, ctx);
  } else if (xdNode.name.startsWith('checkbox:') && isComponent) {
    node = new Checkbox(xdNode, ctx);
  } else if (xdNode.name.startsWith('radiobutton:') && isComponent) {
    node = new RadioButton(xdNode, ctx);
  } else if (isComponent && mode === ParseMode.SYMBOLS_AS_GROUPS) {
    node = new Stack(xdNode, ctx);
  } else if (isArtboard || isComponent) {
    node = isArtboard ? ctx.getArtboardFromXdNode(xdNode) : ctx.getComponentFromXdNode(xdNode);

    if (node.parsed) {
      // trace(`Parse paseScenegraphNode xdNode.name if (node.parsed) { ....`);
      return node;
    }

    if (node.responsive) {
      ctx.usesPinned();
    } // since components can be parsed out of order


    node.parsed = isWidget = true;
  } else {
    for (var i = 0; i < NODE_FACTORIES.length && !node; i++) {
      node = NODE_FACTORIES[i].create(xdNode, ctx);
    }
  }

  if (!node) {
    ctx.log.error("Unable to create export node ('".concat(xdNode.constructor.name, "')."), xdNode);
    return null;
  } // post processing:


  if (isWidget) {
    ctx.pushWidget(node);
    parseChildren(node, ctx, mode);
    ctx.popWidget();
  } else if (node instanceof Stack || node instanceof Checkbox || node instanceof TextField || node instanceof DropDownMenu || node instanceof RadioButton) {
    parseChildren(node, ctx, mode);
  } else if (node instanceof Grid) {
    if (ctx.inGrid) {
      ctx.log.warn("Nested repeat grids are currently unsupported, and may result in unexpected behaviour.", xdNode);
    }

    var kids = node.xdNode.children,
        child = kids && kids.at(0);
    ctx.pushGrid();
    node.item = child && parseScenegraphNode(child, ctx, ParseMode.SYMBOLS_AS_GROUPS);
    ctx.popGrid();
    combineShapes(node.item, ctx);
  }

  addWidgetImports(node, ctx); // add decorators:
  // if (node.xdNode.name.startsWith('op') || node.xdNode.name.startsWith('select:')) {
  // 	trace(`parse // add decorators: `);
  // }

  for (var _i2 = 0; _i2 < DECORATOR_FACTORIES.length; _i2++) {
    var decorator = DECORATOR_FACTORIES[_i2].create(node, ctx); // if (node.xdNode.name.startsWith('op') || node.xdNode.name.startsWith('select:')) {
    // 	trace(`parse decorator ${decorator}`);
    // 	trace(`parse decorator instanceof PrototypeInteraction ${decorator instanceof PrototypeInteraction}`);
    // }
    // trace(`RIGHT BEFORE ADDING DECORATOR bf the if decorator TO ${node.xdNode.name} ON PARSE, prototypeInteraction ${decorator instanceof PrototypeInteraction}`);


    if (decorator) {
      // if (node.xdNode.name.startsWith('op') || node.xdNode.name.startsWith('select:')) {
      // trace(`RIGHT BEFORE ADDING DECORATOR TO ${node.xdNode.name} ON PARSE, DECORATOR ${decorator}`);
      // trace(`RIGHT BEFORE ADDING DECORATOR TO ${node.xdNode.name} ON PARSE, prototypeInteraction ${decorator instanceof PrototypeInteraction}`);
      // }
      node.addDecorator(decorator);
    }
  }

  return node;
}

function parseChildren(node, ctx, mode) {
  var xdNodes = node.xdNode.children;

  for (var i = 0; i < xdNodes.length; ++i) {
    node.children.push(parseScenegraphNode(xdNodes.at(i), ctx, mode, false));
  }
}

function addWidgetImports(node, ctx) {
  var xdNode = node.xdNode; // Gather imports for components

  if (xdNode instanceof xd.SymbolInstance) {
    var master = ctx.masterComponents[xdNode.symbolId];

    if (master) {
      ctx.addImport("./".concat(master.widgetName, ".dart"), true);
    } else {
      trace("Didn't add import for component '".concat(xdNode.name, "' because the master was not found (parse.js,  xd-to-flutter)"));
    }
  } // Gather imports for interactions on nodes that reference other artboards


  var l = NodeUtils.getInteractionCount(xdNode);

  for (var i = 0; i < l; ++i) {
    var action = xdNode.triggeredInteractions[i].action;

    if (action.type !== "goToArtboard") {
      continue;
    }

    var artboard = ctx.getArtboardFromXdNode(action.destination);

    if (artboard) {
      ctx.addImport("./".concat(artboard.widgetName, ".dart"), true);
    } else {
      trace("Didn't add import for destination artboard '".concat(action.destination.name, "' because it was not found. This is likely due to a duplicate name."));
    }
  }
}

function combineShapes(node, ctx) {
  var aggressive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  // Combines shapes into a single SVG output. In normal mode, it will only combine adjacent Path nodes.
  // In aggressive mode, it will combine Path & Container, and collapse groups that only contain those elements.
  if (!node || !node.children || node.children.length < 1 || node.hasCombinedShapes) {
    return;
  }

  node.hasCombinedShapes = true;
  var isFile = node instanceof Artboard || node instanceof Component;

  if (isFile) {
    ctx.pushWidget(node);
  }

  var inGroup = node instanceof Artboard || node instanceof Component || node instanceof Stack;
  var shapeIndex,
      shape = null,
      kids = node.children;
  var maxCount = kids.length * 2; // TODO: GS: This is a temporary fail-safe, since infinite loops can take down XD.
  // This iterates one extra time with a null child to resolve the final shape:

  for (var i = 0; i <= kids.length; i++) {
    if (--maxCount < 0) {
      throw "infinite loop in combineShapes";
    }

    var child = kids[i];

    if (child && child.children) {
      var aggressiveGroup = aggressive || NodeUtils.getProp(child.xdNode, PropType.COMBINE_SHAPES);
      combineShapes(child, ctx, aggressiveGroup);
      var onlyChild = child.children.length === 1 && child.children[0];

      if (aggressiveGroup && inGroup && child instanceof Stack && onlyChild instanceof Shape && !Shape.hasInteraction(child)) {
        // the only child was a Shape, so we can strip the group and leave just the shape.
        // this is currently necessary despite the check below, because the id changes when the xdNode changes:
        ctx.removeShapeData(onlyChild); // set the shape's xdNode to the group, so it uses its transform:

        onlyChild.xdNode = child.xdNode; // similarly copy the group's decorators onto the child:
        // TODO: GS: test this with a blend on the child & on the group.

        onlyChild.decorators = child.decorators;
        kids.splice(i, 1, onlyChild);
        child = onlyChild; // does not become the active shape because it has to be nested to retain transform.
      }
    }

    if (!shape && Shape.canAdd(child, aggressive)) {
      // start a new shape, the child will be added to it below.
      shape = new Shape(child.xdNode, ctx);
      shapeIndex = i;
    }

    if (shape && shape.add(child, aggressive)) {
      // Added.
      if (child instanceof Shape) {
        ctx.removeShapeData(child);
      }
    } else if (shape) {
      // Not able to add the child to the current shape, so end it.
      ctx.addShapeData(shape);
      kids.splice(shapeIndex, shape.count, shape);
      i -= shape.count - 1;
      shape = null; // If the child can be added, then iterate over it again, so it starts a new shape.
      // This typically happens because it had interactivity.

      if (Shape.canAdd(child, aggressive)) {
        i--;
        continue;
      }
    }
  }

  if (isFile) {
    ctx.popWidget();
  }
}