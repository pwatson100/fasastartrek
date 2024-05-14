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
			value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0, max: 100 }),
			// max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.uncthresh = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0, max: 100 }),
			// max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.maxopend = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.curropend = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
		});
		schema.tohitmod = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.tohithth = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.tohit = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.woundhealrate = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.fatiguehealrate = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.barehanddamage = new fields.StringField({ required: true, blank: true });
		schema.damage = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.modernmarksmanship = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});
		schema.unarmedconbat = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 0 }),
		});

		// Iterate over ability names and create a new SchemaField for each.
		schema.abilities = new fields.SchemaField(
			Object.keys(CONFIG.FASA_STAR_TREK.abilityAbbreviations).reduce((obj, ability) => {
				obj[ability] = new fields.SchemaField({
					value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					mod: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					total: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					label: new fields.StringField({ required: true, blank: true }),
				});
				return obj;
			}, {})
		);

		return schema;
	}

	prepareDerivedData() {
		let bhd = '';
		let bhd10 = '1d10';
		let bhd20 = '2d10';
		let bhd30 = '3d10';

		switch (this.race) {
			case 'Human':
				this.abilities.str.mod = 0;
				this.abilities.end.mod = 0;
				this.abilities.int.mod = 0;
				this.abilities.dex.mod = 0;
				this.abilities.cha.mod = 0;
				this.abilities.luc.mod = 0;
				this.abilities.psi.mod = -30;
				break;
			case 'Andorian':
				this.abilities.str.mod = +10;
				this.abilities.end.mod = +5;
				this.abilities.int.mod = 0;
				this.abilities.dex.mod = 0;
				this.abilities.cha.mod = 0;
				this.abilities.luc.mod = -20;
				this.abilities.psi.mod - 30;
				break;
			case 'Catian':
				this.abilities.str.mod = 0;
				this.abilities.end.mod = -5;
				this.abilities.int.mod = 0;
				this.abilities.dex.mod = +20;
				this.abilities.cha.mod = +5;
				this.abilities.luc.mod = -20;
				this.abilities.psi.mod = -20;
				break;
			case 'Tellerite':
				this.abilities.str.mod = +5;
				this.abilities.end.mod = +5;
				this.abilities.int.mod = 0;
				this.abilities.dex.mod = 0;
				this.abilities.cha.mod = -10;
				this.abilities.luc.mod = -20;
				this.abilities.psi.mod = -40;
				break;
			case 'Vulcan':
				this.abilities.str.mod = +20;
				this.abilities.end.mod = +10;
				this.abilities.dex.mod = 0;
				this.abilities.cha.mod = 0;
				this.abilities.int.mod = +10;
				this.abilities.luc.mod = -40;
				this.abilities.psi.mod = 0;
				break;
			default:
				break;
		}

		// Loop through ability scores, and add their modifiers to our sheet output.
		for (const key in this.abilities) {
			// Calculate the modifier using d20 rules.
			this.abilities[key].total = this.abilities[key].value + this.abilities[key].mod;
			// Handle ability label localization.
			this.abilities[key].label = game.i18n.localize(CONFIG.FASA_STAR_TREK.abilityAbbreviations[key]) ?? key;
		}

		this.woundhealrate.value = Math.floor(this.abilities.end.total / 20);
		this.fatiguehealrate.value = Math.floor(this.abilities.end.total / 10);
		this.ap.value = Math.floor(this.abilities.dex.total / 10 + 4);
		this.tohitmod.value = Math.ceil(this.abilities.dex.total + this.modernmarksmanship.value);
		this.tohithth.value = Math.ceil(this.abilities.dex.total + this.unarmedconbat.value);

		if (this.abilities.str.total <= 25) {
			bhd = bhd10 + `-` + (3 + Math.floor(this.unarmedconbat.value / 10));
			this.barehanddamage = bhd.toString();
		} else if (this.abilities.str.total <= 50) {
			this.barehanddamage = bhd10.toString();
		} else if (this.abilities.str.total <= 75) {
			bhd = bhd10 + `+` + (3 + Math.floor(this.unarmedconbat.value / 10));
			this.barehanddamage = bhd.toString();
		} else if (this.abilities.str.total <= 100) {
			this.barehanddamage = bhd20.toString();
		} else if (this.abilities.str.total <= 125) {
			bhd = bhd20 + `+` + (3 + Math.floor(this.unarmedconbat.value / 10));
			this.barehanddamage = bhd.toString();
		} else if (this.abilities.str.total <= 150) {
			this.barehanddamage = bhd30.toString();
		} else if (this.abilities.str.total <= 175) {
			bhd = bhd30 + `+` + (3 + Math.floor(this.unarmedconbat.value / 10));
			this.barehanddamage = bhd.toString();
		}
		// console.log(bhd);
		// this.barehanddamage.value = Math.floor(this.abilities.str.total + this.unarmedconbat.value);
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
