# maximum-reality-space-adventures
16-bit side-scrolling platformer with physics puzzle mini-scenes

1. Game Concept

Title: Maximum Reality: Space Adventures
Genre: 16-bit side-scrolling platformer with physics puzzle mini-scenes
Main Characters:
	•	Azul: Hairless Sphynx cat, floating, bioluminescent. Player controls him. Smart, curious, teaches science lessons.
	•	Mochkil: Tiny brown mouse, mischievous, oversized ears, constantly eating objects. AI-controlled sidekick that can trigger funny mishaps.

Setting:
	•	Various planets, spaceships, asteroid fields, alien labs. Each “world” represents a different scientific concept (gravity, magnetism, chemical reactions, planetary systems, etc.).

Tone & Style:
	•	16-bit pixel art with bright, bioluminescent effects.
	•	Whimsical, humorous, educational but not preachy.
	•	Physics-based interactions in mini-scenes (Mochkil jumps and bounces, Azul can float/fly).

⸻

2. Core Mechanics

Player Mechanics (Azul)
	•	Move: Left / Right
	•	Jump / Float (Azul can hover for short periods)
	•	Interact: Activate devices or solve science puzzles
	•	Collect: Science items, energy orbs, “Maximum Reality” tokens
	•	Combat / Avoid: Minor enemies or hazards, e.g., rogue robots

Sidekick Mechanics (Mochkil)
	•	Auto-follow: AI tracks Azul
	•	Mischief: Tries to eat items, trigger puzzle changes
	•	Bonus: Can accidentally reveal hidden science items

Physics Mini-Games
	•	Certain areas behave like Angry Birds-style physics puzzles:
	•	Launch objects to hit targets
	•	Bounce off surfaces to reach new areas
	•	Combine items to complete experiments

Level Progression
	•	Scroll like Mario: left-to-right movement
	•	Each level teaches a mini science lesson, e.g., gravity on a moon vs. Earth
	•	Boss / challenge at end of each planet (science experiment or obstacle puzzle)

⸻

3. Technical Stack

Front-end Game Engine:
	•	Phaser.js (v3 or v4) – Perfect for 16-bit side-scrollers with physics
	•	HTML5 + CSS3 for UI and overlays
	•	Optional: WebGL for glowing/bioluminescent effects

Back-end / Hosting:
	•	GitHub Pages (static site hosting) – no server needed initially

Assets:
	•	16-bit pixel sprites for Azul, Mochkil, enemies, and environments
	•	Tilemaps for scrolling worlds (Tiled Map Editor is perfect)
	•	Sound effects + 16-bit background music

File Structure (GitHub Ready)

maximum-reality-space-adventures/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── player.js
│   ├── mochkil.js
│   ├── levelManager.js
│   ├── physicsPuzzles.js
├── assets/
│   ├── sprites/
│   │   ├── azul.png
│   │   ├── mochkil.png
│   │   ├── enemies.png
│   │   └── tileset.png
│   ├── sounds/
│   └── music/
└── README.md


⸻

4. Level & Puzzle Ideas
World
Science Lesson
Puzzle / Mini-game
Mochkil Behavior
Planet Gravity
Gravity differences
Bounce objects to reach platforms
Eats gravity balls
Magnetar Lab
Magnetism & polarity
Move magnetic blocks
Nibbles on metal orbs
Asteroid Belt
Orbital mechanics
Launch asteroids to hit targets
Chases floating food items
Chemistry Station
Reactions
Combine ingredients
Knocks over beakers accidentally
Alien Garden
Biology
Match DNA strands / patterns

5. GitHub Deployment Plan
	1.	Create GitHub repository: maximum-reality-space-adventures
	2.	Push game structure (HTML, CSS, JS, assets)
	3.	Enable GitHub Pages in repo settings (default branch: main)
	4.	Access game online via https://<username>.github.io/maximum-reality-space-adventures/

⸻

6. Next Steps / Milestones
	1.	Design sprites & tilemaps for Azul, Mochkil, enemies, platforms
	2.	Set up Phaser.js project with scrolling levels
	3.	Implement Azul’s movement & Mochkil AI
	4.	Create one sample level with a physics puzzle
	5.	Add collectibles & basic UI
	6.	Deploy on GitHub Pages


