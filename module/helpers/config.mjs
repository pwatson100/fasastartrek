export const FASA_STAR_TREK = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
FASA_STAR_TREK.abilities = {
	str: 'FASA_STAR_TREK.Ability.Str.long',
	end: 'FASA_STAR_TREK.Ability.End.long',
	int: 'FASA_STAR_TREK.Ability.Int.long',
	dex: 'FASA_STAR_TREK.Ability.Dex.long',
	cha: 'FASA_STAR_TREK.Ability.Cha.long',
	luc: 'FASA_STAR_TREK.Ability.Luc.long',
	psi: 'FASA_STAR_TREK.Ability.Psi.long',
};

FASA_STAR_TREK.abilityAbbreviations = {
	str: 'FASA_STAR_TREK.Ability.Str.abbr',
	end: 'FASA_STAR_TREK.Ability.End.abbr',
	int: 'FASA_STAR_TREK.Ability.Int.abbr',
	dex: 'FASA_STAR_TREK.Ability.Dex.abbr',
	cha: 'FASA_STAR_TREK.Ability.Cha.abbr',
	luc: 'FASA_STAR_TREK.Ability.Luc.abbr',
	psi: 'FASA_STAR_TREK.Ability.Psi.long',
};

FASA_STAR_TREK.race_list = {
	Human: {id:'Human', label: "Human"},
	Andorian: {id:'Andorian',label: 'Andorian'},
	Caitian: {id:'Caitian',label: 'Caitian'},
	Edoan: {id:'Edoan',label: 'Edoan'},
	Tellerite: {id:'Tellerite',label: 'Tellerite'},
	Vulcan: {id:'Vulcan',label: 'Vulcan'},
};
FASA_STAR_TREK.npc_races_list = {
	Klingon: {id:'Klingon', label: "Klingon"},
	Romulan: {id:'Romulan',label: 'Romulan'},
	OrionDominant: {id:'Orion, Dominant',label: 'Orion, Dominant'},
	OrionSlave: {id:'Orion, Slave',label: 'Orion, Slave'},
	Edoan: {id:'Edoan',label: 'Edoan'},
	Gorn: {id:'Gorn',label: 'Gorn'},
	Tholian: {id:'Tholian',label: 'Tholian'},
};

FASA_STAR_TREK.rank_list = {
	Ensign: {id:'Ensign', label: "Ensign"},
	LieutenantJG: {id:'Lieutenant, JG',label: 'Lieutenant, JG'},
	Lieutenant: {id:'Lieutenant',label: 'Lieutenant'},
	LieutenantCommander: {id:'Lieutenant Commander',label: 'Lieutenant Commander'},
	Commander: {id:'Commander',label:'Commander'},
	Captain: {id:'Captain',label:'Captain'},
	Commodore: {id:'Commodore',label:'Commodore'},
	Admiral: {id:'Admiral',label:'Admiral'}
};

FASA_STAR_TREK.department_positions_list = {
	Captain: {id:'Captain',label:'Captain'},
	FirstOfficer: {id:'First Officer', label: 'First Officer'},
	ChiefEngineer: {id:'Chief Engineer',label: 'Chief Engineer'},
	ChiefNavigator: {id:'Chief Navigator',label: 'Chief Navigator'},
	ChiefHelmWeapons: {id:'Chief Helm/Weapons',label: 'Chief Helm/Weapons'},
	ChiefComsDco: {id:'Chief Comms/DCO',label: 'Chief Comms/DCO'},
	ChiefScienceOfficer: {id:'Science Officer',label: 'Science Officer'},
	ChiefMedicalOfficer: {id:'Medical Officer',label: 'Medical Officer'},
	SecurityChief: {id:'Security Chief',label: 'Security Chief'},
	ChiefSuplyOfficer: {id:'Supply Officer',label: 'Supply Officer'},
};