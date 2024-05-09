export default class FASASTARTREKActorBase extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = {};

		schema.ap = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 18 }),
		});
		schema.age = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			max: new fields.NumberField({ ...requiredInteger, initial: 100 }),
		});
		schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
		schema.race = new fields.StringField({ required: true, blank: true });
		schema.sex = new fields.StringField({ required: true, blank: true });

		return schema;
	}
}
