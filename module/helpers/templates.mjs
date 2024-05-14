/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		// Actor partials.
		'systems/fasastartrek/templates/actor/parts/actor-skills.html',
		'systems/fasastartrek/templates/actor/parts/actor-items.hbs',
		'systems/fasastartrek/templates/actor/parts/actor-effects.hbs',
		// Item partials
		'systems/fasastartrek/templates/item/parts/item-effects.hbs',
	]);
};
