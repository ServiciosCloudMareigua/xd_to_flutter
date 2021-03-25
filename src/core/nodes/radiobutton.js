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


// Represents an Ellipse or Rectangle that can be exported as a decorated RadioButton
class RadioButton extends AbstractNode {
	static create(xdNode, ctx) {
		// trace(`RadioButton create xdNode.name ${xdNode.name}`);
		if (xdNode instanceof xd.Group) {
			// trace(`RadioButton create entra xdNode instanceof xd.Group`);
			return new RadioButton(xdNode, ctx);
		}
	}

	constructor(xdNode, ctx) {
		super(xdNode, ctx);
		this.children = [];

		ctx.addParam(this.addParam("onTap", NodeUtils.getProp(this.xdNode, PropType.TAP_CALLBACK_NAME), DartType.IMAGE));
	}

	_serialize(ctx) {
		if (!this.hasChildren) { return ""; }

		let xdNode = this.xdNode;
		if (xdNode.mask) {
			ctx.log.warn("Group masks aren't supported.", xdNode);
		}
		// trace(`RadioButton _serialize this.xdNode.name4----> ${xdNode.name}`);
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
		let lista = this._getChildCheckBox(ctx);
		// trace(`RadioButton res---->${lista[0].substring(lista[0].indexOf('Color('))}`);
		
		let str = `Row(
			mainAxisAlignment: MainAxisAlignment.start,
			children: [
			  SizedBox(
				height: 24.0,
				width: 24.0,
				child: Radio(
                    value: 'grup.Value(valorDelTexto generalmente)',
                    groupValue: 'group.Value2',
                    onChanged: (String value) {
                    //   setState(() {
                    //      _character = value;
                    //   });
                    },
                  ),
			  ),
			  ${lista[1]}
			],
		  )`;

		// trace(`RadioButton _serialize str1----> ${str}`);
		if (!this.responsive) { str = this._addSizedBox(str, xdNode.localBounds, ctx); }

		// trace(`RadioButton _serialize str --> ${str}`);
		return str;
	}

	//retorna el color y del borde del radiobutton y el parametro Text() del label 
	_getChildCheckBox(ctx) {
		let res = [];
		let texto = '';
		let containerDecoration = '';
		let len = this._getChildList(ctx).split('Pinned.fromSize');
		if (len.length == 3) {
			for (let i = 0; i < len.length; i++) {
				const element = len[i];
				if (element.includes('Container(')) {
					let modification1 = element.substring(element.indexOf('decoration'));
					modification1 = modification1.substring(0, modification1.length - 6);
					if (modification1.includes('border: ')) {

						let modificacion3 = modification1.substring(modification1.indexOf('Border.all(') + 'Border.all('.length);
						// trace(`mModificacion3 ${modificacion3}`)

						modificacion3 = modificacion3.substring(0, modificacion3.lastIndexOf(',') - 4);
						// trace(`modificacion3 ${modificacion3}`)
						containerDecoration = modificacion3;
					} else {
						trace(`esto no es un RadioButton, no tiene todos los bordes.`)
					}
					// trace(`containerDecoration ==== ${containerDecoration}`)
				} if (element.includes('Text(')) {
					texto = element.substring(element.indexOf('Text(\''));
					texto = texto.substring(0, texto.lastIndexOf(')'));
				}
			}
			res.push(containerDecoration);
			res.push(texto);

		} else {
			trace(`Solo pueden haber 2 partes en el inputText: Container, Text(Icon), Text(placeholder)`);
		}
		return res;
	}

	_getChildList(ctx) {
		let str = "";
		this.children.forEach(node => {
			let childStr = node && node.serialize(ctx);
			if (childStr) { str += childStr + ", "; }
		});
		// trace(`RadioButton _getChildList str---> ${str}`)
		return str;
	}

}
exports.RadioButton = RadioButton;

