
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('modes').del()
    .then(function () {
      // Inserts seed entries
      return knex('modes').insert([
        {
          mode_name: 'Wildest Dreams',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"custom","setArray":["Basic","Classic","Hall of Fame","Naxxramas","Goblins vs Gnomes","Blackrock Mountain","The Grand Tournament","The League of Explorers","Whispers of the Old Gods","One Night in Karazhan","Mean Streets of Gadgetzan"],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'Standard Procedures',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"custom","setArray":["Basic","Classic","Hall of Fame","Journey to Un'Goro","Knights of the Frozen Throne","Kobolds & Catacombs","The Witchwood","The Boomsday Project"],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null
          }
        },
        {
          mode_name: 'Classically Trained',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"custom","setArray":["Basic","Classic","Hall of Fame"],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'Feeling Adventurous',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"custom","setArray":["Naxxramas","Blackrock Mountain","The League of Explorers","One Night in Karazhan"],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'New Cards on the Block',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"custom","setArray":["Kobolds & Catacombs","The Witchwood","The Boomsday Project"],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'Living Legends',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"custom","legendaryCount":"30","epicCount":"0","rareCount":"0","typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'Spellbound',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"all","costArray":[],"classSetting":"custom","classCount":"30","raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"custom","spellCount":"30"}
        },
        {
          mode_name: 'Wisp me Away',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"custom","costArray":["0","1","2","3"],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'Aggro-a-phobic',
          type: "basic",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"custom","costArray":["7","8","9","10+"],"classSetting":"chaos","classCount":null,"raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'communityTest1',
          type: "community",
          creator_id: 2,
          settings: {"heroFilterSetting":"custom","heroArray":["Paladin","Druid","Warlock","Priest"],"setFilterSetting":"custom","setArray":["Hall of Fame","Goblins vs Gnomes","The Grand Tournament","The League of Explorers","One Night in Karazhan","Knights of the Frozen Throne"],"costFilterSetting":"custom","costArray":["1","3","6","7","8","9"],"classSetting":"custom","classCount":"19","raritySetting":"chaos","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"custom","spellCount":"16"}
        },
        {
          mode_name: 'CommunityTest2',
          type: "community",
          creator_id: 2,
          settings: {"heroFilterSetting":"custom","heroArray":["Shaman","Rogue","Paladin","Hunter","Druid"],"setFilterSetting":"custom","setArray":["Naxxramas","Goblins vs Gnomes","Blackrock Mountain","The League of Explorers","One Night in Karazhan","The Witchwood"],"costFilterSetting":"custom","costArray":["0","2","4","6","8","10+"],"classSetting":"custom","classCount":"20","raritySetting":"custom","legendaryCount":"8","epicCount":"4","rareCount":"10","typeSetting":"custom","spellCount":"5"}
        },
        {
          mode_name: 'CommunityTest3',
          type: "community",
          creator_id: 2,
          settings: {"heroFilterSetting":"custom","heroArray":["Paladin","Hunter","Druid","Mage","Priest"],"setFilterSetting":"all","setArray":[],"costFilterSetting":"custom","costArray":["1","3","5","7","9"],"classSetting":"chaos","classCount":null,"raritySetting":"custom","legendaryCount":"11","epicCount":"3","rareCount":"7","typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'userTest1',
          type: "user",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"custom","costArray":["0","1","2","9","10+"],"classSetting":"custom","classCount":"16","raritySetting":"custom","legendaryCount":"8","epicCount":"7","rareCount":"5","typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'userTest2',
          type: "user",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"all","costArray":[],"classSetting":"chaos","classCount":null,"raritySetting":"custom","legendaryCount":"15","epicCount":"15","rareCount":"0","typeSetting":"chaos","spellCount":null}
        },
        {
          mode_name: 'userTest3',
          type: "user",
          creator_id: 2,
          settings: {"heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"all","costArray":[],"classSetting":"consistent","classCount":null,"raritySetting":"consistent","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"consistent","spellCount":null}
        },
      ]);
    });
};
