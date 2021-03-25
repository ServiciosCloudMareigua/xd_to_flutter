/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/


const xd = require("scenegraph");

const NodeUtils = require("../../utils/nodeutils");
const { DartType } = require("../../utils/exportutils");

const { AbstractNode } = require("./abstractnode");
const { AbstractDecorator } = require("../decorators/abstractdecorator");
const PropType = require("../proptype");
const { trace } = require('../../utils/debug');
const { PrototypeInteraction } = require("../decorators/prototypeinteraction");



// Represents an Ellipse or Rectangle that can be exported as a decorated TextField
class DropDownMenu extends AbstractNode {
	static create(xdNode, ctx) {
		trace(`DropDownMenu create xdNode.name ${xdNode.name}`);
		if (xdNode instanceof xd.Group) {
			// trace(`DropDownMenu create entra xdNode instanceof xd.Group`);
			return new DropDownMenu(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.children = [];

		ctx.addParam(this.addParam("onTap", NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.IMAGE));
	}

	_getDecorators(selectpanel, lista) {
		//selectpanel es una convención importante
		if (selectpanel.xdNode.name == 'selectpanel') {
			for (let i = 0; i < selectpanel.children.length; i++) {
				const element = selectpanel.children[i];
				if (element.xdNode.name.startsWith('op')) {
					if (element.hasDecorators) {
						element.decorators.forEach((e) => {
							if (e instanceof PrototypeInteraction) {
								lista.push(e);
								trace(`_getdecorators element.xdnode.name ${element.xdNode.name} `);
								trace(`_getdecorators e ${e} `);

							}
						});
					}
				}

			}
		}
		trace(`lista _getDecoratoes ${lista}`)
	}

	_serialize(ctx) {

		trace(`DropDownMenu _serialize this.xdNode.name----> ${this.xdNode.name}`);
		let arreglo = this._getChildDropDownMenu(ctx);
		var listaDecorators = [];// hay la misma cantidad de decorators 
		var listaLinks = [];
		//llena la lista de tantos decorators como opciones en el menu
		this.children.forEach((e) => this._getDecorators(e, listaDecorators));
		trace(`------listaDecorators.length  ${listaDecorators.length }`)                 
		trace(`------arreglo[0].length-1  ${arreglo[0].length-1 }`)

		if(listaDecorators.length == arreglo[0].length-1){
			trace(` DropDownMenu this.xdNode.parent.name ${this.xdNode.parent.name} `);
			// trace(`_getdecorators arreglo[0] ${arreglo[0]} `);
			listaLinks.push(`PageLink(links: [PageLinkInfo(transition: LinkTransition.Fade, ease: Curves.easeOut, duration: 0.3, pageBuilder: () => ${this.xdNode.parent.name.trim().replace(/\s/g, '').replace('–', '')}(), ), ], child: Text(${arreglo[0][0]}), )`);
			// decorators.length = links.length+1 (el primer ). TODOS LOS LINKS TIENEN QUE TENER UN LINK A OTRO ARTBOARD
			for (let i = 0; i < listaDecorators.length; i++) {
				const dec = listaDecorators[i];
				const opcion = arreglo[0][i + 1];
				// trace(`opcion ${opcion}`);
				// trace(`_getdecorators PUSHING f.serialize(Text('XXX') ${dec.serialize(`Text(${opcion})`, ctx)} `);
				listaLinks.push(dec.serialize(`Text(${opcion})`, ctx));
			}
			// trace(`_getdecorators listaLinks ${listaLinks} `);
		}


		if (!this.hasChildren) { return ""; }
		let xdNode = this.xdNode;
		if (xdNode.mask) {
			ctx.log.warn("Group masks aren't supported.", xdNode);
		}

		let str = arreglo[1].toString();
		str += arreglo[2].toString();

		// value: ${listaLinks[0].toString()},
		if(listaDecorators.length == arreglo[0].length-1){
			str += `DropdownButtonHideUnderline (
				child: DropdownButton<PageLink>(
					isExpanded: true,
					elevation: 16,
					style: ${arreglo[3].toString()}
					// underline: Container(
		  //   height: 2,
		  //   color: Colors.deepPurpleAccent,
		  // ),
		  onChanged: (PageLink newValue) {
			  //   setState(() {
				  //           dropdownValue = newValue;
				  //   });
				},
				items: <PageLink>[${listaLinks.toString()}]
			  .map<DropdownMenuItem<PageLink>>((PageLink value) {
				  return DropdownMenuItem<PageLink>(
					  value: value,
					  child: value,
					  );
					}).toList(),
					),
					),
		),)
		`;
	}else{
			str += `DropdownButtonHideUnderline (
				child: DropdownButton<String>(
				value: ${arreglo[0][0].toString()},
				isExpanded: true,
				elevation: 16,
				style: ${arreglo[3].toString()}
				// underline: Container(
				//   height: 2,
				//   color: Colors.deepPurpleAccent,
				// ),
				onChanged: (String newValue) {
				//   setState(() {
		  //           dropdownValue = newValue;
				//   });
				},
				items: <String>[${arreglo[0].toString()}]
					.map<DropdownMenuItem<String>>((String value) {
				  return DropdownMenuItem<String>(
					value: value,
					child: Text(value),
				  );
				}).toList(),
			  ),
			  ),
			  ),)
			  `;
	}

		// }


		// trace(`DropDownMenu _serialize str1----> ${str}`);
		if (!this.responsive) { str = this._addSizedBox(str, xdNode.localBounds, ctx); }

		// trace(`DropDownMenu _serialize str2----> ${str}`);
		// trace(`DropDownMenu _serialize str --> ${str}`);
		return str;
	}

	//Returns [[textos del DDM], Pinned.fromSize(del DDM), containerPart, textStylePart]
	_getChildDropDownMenu(ctx) {
		let res = [];
		let textos = [];
		let len = this._getChildList(ctx);
		//Se coge el pinned del primer grupo (la opcion principal, el default, el otro que no es el selectpanel)
		//Se cogen los valores del primer contenedor y el primer texto.
		let pinnedDDM = len.substring(0, len.indexOf('child:') + 'child:'.length);
		let entireContainer = len.substring(len.indexOf('Container('), len.indexOf('Pinned.fromSize(', len.indexOf('Container(')));
		let containerPart = entireContainer.substring(0, entireContainer.lastIndexOf('), ),')) + 'child: ';
		let entireText = len.substring(len.indexOf('Text('), len.indexOf('Pinned.fromSize(', len.indexOf('Text(')));
		// entireText.substring(entireText.indexOf('TextStyle('), entireText.lastIndexOf('), ), '));
		let textStylePart = entireText.substring(entireText.indexOf('TextStyle('), entireText.lastIndexOf('textAlign'));

		let i = '';
		let lenEnTexts = len.split('Text(')
		lenEnTexts.forEach(element => {
			// trace(`element --> ${element}`);
			i = element.substring(0, element.indexOf(','));
			// trace(`i --> ${i}`);
			if (i.startsWith('\'')) {
				textos.push(i.replace('\'', '\'    '));
			}
		});
		res.push(textos);
		res.push(pinnedDDM);
		res.push(containerPart);
		res.push(textStylePart);
		return res;
	}

	_getChildList(ctx) {
		let str = "";
		this.children.forEach(node => {
			let childStr = node && node.serialize(ctx);
			if (childStr) { str += childStr + ", "; }
		});
		// trace(`DropDownMenu _getChildList str---> ${str}`)
		return str;
	}

}
exports.DropDownMenu = DropDownMenu;

