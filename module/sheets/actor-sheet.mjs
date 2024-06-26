import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.mjs';
import { logger } from '../helpers/logger.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class FASASTARTREKActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['fasastartrek', 'sheet', 'actor'],
			width: 600,
			height: 600,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'skills',
				},
			],
		});
	}

	/** @override */
	get template() {
		return `systems/fasastartrek/templates/actor/actor-${this.actor.type}-sheet.html`;
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();

		// Use a safe clone of the actor data for further operations.
		const actorData = context.data;

		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = actorData.system;
		context.flags = actorData.flags;

		// Prepare character data and items.
		if (actorData.type == 'starfleet') {
			this._prepareItems(context);
			this._prepareCharacterData(context);
		}

		// Prepare NPC data and items.
		if (actorData.type == 'npc') {
			this._prepareItems(context);
		}

		// Add roll data for TinyMCE editors.
		context.rollData = context.actor.getRollData();

		// Prepare active effects
		context.effects = prepareActiveEffectCategories(
			// A generator that returns all effects stored on the actor
			// as well as any items
			this.actor.allApplicableEffects()
		);

		context.race_list = CONFIG.FASA_STAR_TREK.race_list;
		context.npc_races_list = CONFIG.FASA_STAR_TREK.npc_races_list;
		context.rank_list = CONFIG.FASA_STAR_TREK.rank_list;
		context.department_positions_list = CONFIG.FASA_STAR_TREK.department_positions_list;

		logger.debug('Actor Sheet derived data:', context);

		return context;
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	_prepareCharacterData(context) {
		// Handle ability scores.
		// for (let [k, v] of Object.entries(context.system.abilities)) {
		//   v.label = game.i18n.localize(CONFIG.FASA_STAR_TREK.abilities[k]) ?? k;
		// }
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	_prepareItems(context) {
		// Initialize containers.
		const gear = [];
		const skills = [];

		// Iterate through items, allocating to containers
		for (let i of context.items) {
			i.img = i.img || Item.DEFAULT_ICON;
			// Append to gear.
			if (i.type === 'item') {
				gear.push(i);
			}
			// Append to skills.
			else if (i.type === 'skills') {
				skills.push(i);
			}
		}

		// Assign and return
		context.gear = gear;
		context.skills = skills;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Render the item sheet for viewing/editing prior to the editable check.
		html.on('click', '.item-edit', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.on('click', '.item-create', this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on('click', '.item-delete', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// Active Effect management
		html.on('click', '.effect-control', (ev) => {
			const row = ev.currentTarget.closest('li');
			const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		// Rollable abilities.
		html.on('click', '.rollable', this._onRoll.bind(this));

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return;
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		}
	}

	/**
	 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system['type'];

		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		let d100die = '1d100';
		let rollData = {};
		// Handle item rolls.
		if (dataset.rollType) {
			if (dataset.rollType == 'item') {
				const itemId = element.closest('.item').dataset.itemId;
				const item = this.actor.items.get(itemId);
				if (item) return item.roll();
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let baseRoll = new Roll(d100die).evaluate({ async: false });
			if (baseRoll.total <= dataset.value) {
				rollData = {
					hasSucceed: true,
				};
			} else {
				rollData = {
					hasSucceed: false,
				};
			}

			const html = renderTemplate('systems/fasastartrek/templates/chat/roll.hbs', rollData);
			let chatData = {
				user: game.user.id,
				speaker: ChatMessage.getSpeaker({
					alias: this.actor.name,
					actor: this.actor.id,
				}),
				// type: CONST.CHAT_MESSAGE_TYPES.ROLL,
				// roll: JSON.stringify(createRollData(baseRoll)),
				roll: baseRoll,
				rollMode: game.settings.get('core', 'rollMode'),
				content: html,
			};
			if (['gmroll', 'blindroll'].includes(chatData.rollMode)) {
				chatData.whisper = ChatMessage.getWhisperRecipients('GM');
			} else if (chatData.rollMode === 'selfroll') {
				chatData.whisper = [game.user];
			}
			ChatMessage.create(chatData);
			return baseRoll;

			// let label = dataset.label ? `[ability] ${dataset.label}` : '';
			// let roll = new Roll(dataset.roll, this.actor.getRollData());
			// roll.toMessage({
			// 	speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			// 	flavor: label,
			// 	rollMode: game.settings.get('core', 'rollMode'),
			// });
			return roll;
		}
	}
}
