import FASASTARTREKActorBase from './actor-base.mjs';

export default class FASASTARTREKStarFleet extends FASASTARTREKActorBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.rank = new fields.StringField({ required: true, blank: true });
		schema.assignment = new fields.StringField({ required: true, blank: true });
		schema.ship = new fields.StringField({ required: true, blank: true });
		schema.position = new fields.StringField({ required: true, blank: true });

		schema.inactsave = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
			// max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.uncthresh = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
			// max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.maxopend = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.curropend = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.tohitmod = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.tohithth = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.tohit = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.woundhealrate = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.fatiguehealrate = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.barehanddamage = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.damage = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});

		// Iterate over ability names and create a new SchemaField for each.
		schema.abilities = new fields.SchemaField(
			Object.keys(CONFIG.FASA_STAR_TREK.abilityAbbreviations).reduce((obj, ability) => {
				obj[ability] = new fields.SchemaField({
					value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
					mod: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					label: new fields.StringField({ required: true, blank: true }),
				});
				return obj;
			}, {})
		);

		return schema;
	}

	prepareDerivedData() {
		// Loop through ability scores, and add their modifiers to our sheet output.
		for (const key in this.abilities) {
			// Calculate the modifier using d20 rules.
			this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
			// Handle ability label localization.
			this.abilities[key].label = game.i18n.localize(CONFIG.FASA_STAR_TREK.abilityAbbreviations[key]) ?? key;
		}
	}

	getRollData() {
		const data = {};

		// Copy the ability scores to the top level, so that rolls can use
		// formulas like `@str.mod + 4`.
		if (this.abilities) {
			for (let [k, v] of Object.entries(this.abilities)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}

		// data.lvl = this.attributes.level.value;

		return data;
	}
}
