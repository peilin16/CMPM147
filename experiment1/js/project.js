const fillers = {
  role: ["Game Designer", "Level Architect", "Systems Programmer", "UI Wizard", "Narrative Designer", "Gameplay Engineer", "Tech Artist", "CSGD Student", "Huang"],
  challenge: ["core loop", "combat system", "city layout", "UI flow", "dialogue tree", "economy balance", "pathfinding AI", "multiplayer sync", "shader code"],
  problem: ["broken", "unbalanced", "unoptimized", "unintuitive", "buggy", "unfun", "too easy", "too hard", "visually dull"],
  tool: ["Unity", "Unreal Engine", "Godot", "C++", "JavaScript", "Blueprints", "Shadergraph", "Aseprite", "Blender"],
  fix: ["refactor", "redesign", "optimize", "debug", "rewrite", "balance", "polish", "test", "document"],
  reward: ["Steam release", "5-star review", "feature in GameDev Magazine", "job offer", "award nomination", "Twitter fame", "Discord hype", "itch.io feature"],
  urgency: ["before the deadline", "for the playtest tomorrow", "before the publisher sees it", "for the portfolio review", "before the build submission"],
  reaction: ["Panic!", "Emergency!", "Help needed!", "URGENT!", "Mayday!", "SOS!", "911!"],
};

const template = `$reaction $role Attention!

The game's $challenge is completely $problem! 
We need you to $fix it using $tool $urgency!

If you can solve this, we might get our $reward!
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}
let story = template;
function generate() {
  story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}
$("#box").text(story);
$("#clicker").click(generate);
