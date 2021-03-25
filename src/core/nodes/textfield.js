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
const PropType = require("../proptype");
const { trace } = require('../../utils/debug');


// Represents an Ellipse or Rectangle that can be exported as a decorated TextField
class TextField extends AbstractNode {
	static create(xdNode, ctx) {
		// trace(`TextField create xdNode.name ${xdNode.name}`);
		if (xdNode instanceof xd.Group) {
			// trace(`TextField create entra xdNode instanceof xd.Group`);
			return new TextField(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.children = [];

		ctx.addParam(this.addParam("onTap", NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.IMAGE));
	}

	_serialize(ctx) {
		// trace(`TextField _serialize this.xdNode.name----> ${this.xdNode.name}`);
		if (!this.hasChildren) { return ""; }

		let xdNode = this.xdNode;
		if (xdNode.mask) {
			ctx.log.warn("Group masks aren't supported.", xdNode);
		}
		let arreglo = this._getChildTextInput(ctx);
		arreglo.forEach(e=>trace(`AAAArreglo------${e}`));
		
		let str='Container()';
		if (arreglo != null && arreglo != undefined && arreglo.length>3) {
			// str=`TextField(
			// 	obscureText: true,
			// 	decoration: InputDecoration(
			// 	  border: OutlineInputBorder(),
			// 	  labelText: 'Password',
			// 	), , color: const Color()
			//   )`;
			// let colorTemp=arreglo[1].substring(arreglo[1].indexOf('color:'));
			// colorTemp=colorTemp.substring(0, colorTemp.indexOf(','));
			  str=`TextField(
				decoration: InputDecoration(
				hintText: '${arreglo.length != 5 ? 'No le llegó nada de texto al TextField' : arreglo[3]}',
				// helperText: 'Helper Text',
				// counterText: '0 characters',
				prefixIcon: ${arreglo[1]},
				border: OutlineInputBorder(
					borderSide: BorderSide(${arreglo[0].includes(' - ') ? arreglo[0].split(' - ')[1] : ''}),
					borderRadius: ${arreglo[0].includes(' - ') ? arreglo[0].split(' - ')[0] : 'BorderRadius.circular(1.0)'},
				),
				),
				${arreglo.length != 5 ? 'style: TextStyle(),' : arreglo[2]}
				onChanged: (String value) async {
					//Ponga aquí lo que quiere que pase cada vez que haya un cambio en el TextField
				},
				onSubmitted: (String value) async {
					//Ponga aquí lo que quiere que pase cada vez que se entrege el resultado del TextField
				},
				)`;
		}


		// trace(`TextField _serialize str1----> ${str}`);
		if (!this.responsive) { str = this._addSizedBox(str, xdNode.localBounds, ctx); }

		// trace(`TextField _serialize str2----> ${str}`);
		// trace(`TextField _serialize str --> ${str}`);
		return str;
	}

	//Returns [decoration: (container), style: (TextoIcono), style: (TextoPlaceholder), TextoIcono, TextoPlaceHolder]
	//Returns [decoration: (container), Icon() , style: (TextoPlaceholder),  TextoPlaceHolder]
	_getChildTextInput(ctx) {
		let res = [];
		let len = this._getChildList(ctx).split('Pinned.fromSize');
		// trace(`TextField this.xdNode.children ================ ${this.xdNode.children}`);

		// let iconName='';
		// this.xdNode.children.forEach(element => {
		// 	if(element.name.startsWith('icon:')){
		// 		iconName=element.name.substring('icon:'.length);
		// 	}
			// trace(`Element.name -----> ${element.name}`);
		// });

		// trace(`---------------------------------len ${len}`)
		// trace(`len.length ${len.length}`)
		let containerDecoration = '';
		//styles[0]=iconStyle, styles[1]=placeholderStyle 
		let style='';
		//texts[0]=iconText, texts[1]=placeholderText 
		let text= '';
		let icono='';
		// let longestText = -1;
		if (len.length == 4) {
			for (let i = 0; i < len.length; i++) {
				const element = len[i];
				if (element.includes('Container(')) {
					let modification1 = element.substring(element.indexOf('decoration'));
					modification1 = modification1.substring(0, modification1.length - 6);
					if (modification1.includes('borderRadius:') && modification1.includes('border: ')) {

						let modification2 = modification1.substring(modification1.indexOf('borderRadius:') + 'borderRadius:'.length);
						// trace(`mModificacion2 ${modification2}`)

						modification2 = modification2.substring(0, modification2.indexOf(','));
						// trace(`modificacion2 ${modification2}`)

						let modificacion3 = modification1.substring(modification1.indexOf('Border.all(') + 'Border.all('.length);
						// trace(`mModificacion3 ${modificacion3}`)

						modificacion3 = modificacion3.substring(0, modificacion3.lastIndexOf(',') - 4);
						// trace(`modificacion3 ${modificacion3}`)
						containerDecoration = modification2 + ' - ' + modificacion3;
					} else {
						containerDecoration = modification1;
					}

					// trace(`containerDecoration ==== ${containerDecoration}`)
				} if (element.includes('Text(')) {
					text = element.substring(element.indexOf('Text(\'') + 'Text(\''.length);
					text = text.substring(0, text.indexOf('\''));
					// longestText = texto.length > longestText ? texto.length : longestText;
					style = element.substring(element.indexOf('style'), element.length - 6);

				}
				if (element.includes('Icon(')) {
					
					// trace(`ICONOpre ${element}`);
					icono = element.substring(element.indexOf('Icon(Icons.'));

					//sacar iconos
					icono = icono.substring(0, icono.lastIndexOf(', ),'));
					// trace(`ICONO ${icono}`);
				}
			}
			res.push(containerDecoration);
			// res = res.concat(styles).concat(texts);
			res.push(icono);
			res.push(style);
			res.push(text);
			// res.push(iconName);
		} else {
			trace(`Solo pueden haber 3 partes en el inputText: Container, Text(Icon), Text(placeholder)`);
		}
		return res;
	}

	_getChildList(ctx) {
		let str = "";
		this.children.forEach(node => {
			let childStr = node && node.serialize(ctx);
			if (childStr) { str += childStr + ", "; }
		});
		// trace(`TextField _getChildList str---> ${str}`)
		return str;
	}

}
exports.TextField = TextField;

