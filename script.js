const BOARD = document.getElementById('board');
const PLAYER = document.getElementById('player');
const FLOOR = document.getElementById('floor');
const GAME_OVER = document.getElementById('game-over');
const GAME_STATE = { isGameOver: false, score: 0, acceleration: 0, obstacles: [], level: 1 };
const PHYSICS = { increaseSpeed: 0.25, speed: 5, jumpMs: [50,45,40,35,30] };
const BOARD_PROPS = { width: 600, height: 200 };
const PLAYER_PROPS = { left: 60, width: 50, height: 48, bottom: 10 };
const OBSTACLE_PROPS = { left: BOARD_PROPS.width + 40, width: 40, height: 40, bottom: 6, 'font-size': '40px', 'line-height': '40px' };
const OBSTACLES_TYPES = [{ ...OBSTACLE_PROPS }, { ...OBSTACLE_PROPS, width: 50, height: 50, 'font-size': '50px', 'line-height': '50px' }];
const SYMBOLS = { cloud: '&#9729;', obstacle: '&#127797;' };
const CUSTOM_HEAD = '';
// Javi: "data:image/png;base64,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"
// Vane: "data:image/png;base64,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"

const loop = () => {
  if (GAME_STATE.isGameOver) return; else window.requestAnimationFrame(loop);

  const lastLeft = GAME_STATE.obstacles.slice(-1)[0]?.left();
  if (GAME_STATE.obstacles.length === 0 || (lastLeft < BOARD_PROPS.width / 2 && Math.random() * lastLeft < BOARD_PROPS.width / 8)) addObstacle();

  GAME_STATE.obstacles = GAME_STATE.obstacles.filter((obstacle) => { 
    const removed = (obstacle.left() <= -obstacle.width());
    if (removed) { BOARD.removeChild(obstacle); }
    return !removed;
  });
  
  for (let i = 0; i < GAME_STATE.obstacles.length; i++) {
    const obstacle = GAME_STATE.obstacles[i];

    setMove(obstacle, 'left', -(GAME_STATE.acceleration + PHYSICS.speed));

    if (obstacle.left() >= PLAYER.left() && obstacle.left() <= PLAYER.left() + PLAYER.width() && !PLAYER.jumping) {
      GAME_STATE.isGameOver = true;
      document.body.classList.add('game-over');
      return;
    }

    if (obstacle.left() < PLAYER.left() && !obstacle.scored) {
      obstacle.scored = true;
      GAME_STATE.score += 100;
      GAME_STATE.acceleration += PHYSICS.increaseSpeed;
      GAME_STATE.level = Math.floor(GAME_STATE.acceleration) + 1;
      updateStats();
    }
  }
};

function addCloud(top, color = 'initial', speed = 0, left = 'auto', inv = false) {
  const newCloud = createEl(['cloud', 'position-absolute'], null, { top, left, color, animation: speed ? `moving-cloud-${inv ? 'inv-' : ''}ani ${speed}s linear infinite` : 'none' }, SYMBOLS.cloud);
  BOARD.insertBefore(newCloud, BOARD.firstChild);
}

const restart = () => {
  removeEl('.obstacle');
  GAME_STATE.obstacles.length = 0;
  Object.assign(GAME_STATE, { isGameOver: false, score: 0, acceleration: 0, obstacles: [], level: 1 });
  updateStats();
  PLAYER.jumping = false;
  [[PLAYER, PLAYER_PROPS], [BOARD, BOARD_PROPS]].forEach((item) => setProps(...item));
  document.body.classList.remove('game-over');
  loop();
};

const setProps = (element, props) => {
  Object.entries(props).forEach(([prop, value]) => {
    element[prop] = () => getValuePx(element, prop);
    element.style[prop] = ['left', 'width', 'height', 'bottom'].includes(prop) ? value + 'px' : value;
  });
};

const createEl = (classList, addToEl, props, innerHTML) => {
  const newDiv = document.createElement('div');
  newDiv.classList.add(...classList);
  setProps(newDiv, props);
  addToEl && addToEl.appendChild(newDiv);
  innerHTML && (newDiv.innerHTML = innerHTML);
  return newDiv;
};

const completeWithZero = (number, length) => number.toString().padStart(length, '0');
const removeEl = (qSelector) => document.querySelectorAll(qSelector).forEach((el) => el.parentNode.removeChild(el));
const getValuePx = (element, prop) => parseInt(element.style[prop].replace('px', ''));
const addObstacle = () => GAME_STATE.obstacles.push(createEl(['position-absolute', 'obstacle', 'd-flex', 'justify-content-center'], BOARD, OBSTACLES_TYPES[Math.floor(Math.random() * OBSTACLES_TYPES.length)], SYMBOLS.obstacle));
const setMove = (element, prop, value, setValue) => element.style[prop] = (setValue ? value : getValuePx(element, prop) + value) + 'px';
const updateStats = () => ['score', 'level'].forEach((item) => document.getElementById(item).innerText = completeWithZero(GAME_STATE[item], item === 'score' ? 5 : 3));

document.addEventListener('DOMContentLoaded', () => {
  const jump = () => { 
    if (PLAYER.jumping) return;
    PLAYER.jumping = true; 
    PLAYER.style.animation = `jumping-animation .${PHYSICS.jumpMs[(GAME_STATE.level <= PHYSICS.jumpMs.length ? GAME_STATE.level : PHYSICS.jumpMs.length) - 1]}s linear`
  };
  document.addEventListener('keydown', () => event.keyCode === 32 && jump());
  document.addEventListener('click', () => !document.body.classList.contains('game-over') && jump());
  document.getElementById('play').addEventListener('click', (evt) => { evt.preventDefault(); evt.stopPropagation(); restart(); });
  if (CUSTOM_HEAD !== '') {
    document.getElementById('head').querySelector('img').src = CUSTOM_HEAD;
    document.getElementById('head').classList.remove('d-none');
  }
  PLAYER.addEventListener('animationend', () => { PLAYER.classList.remove('initial'); }, { once: true });  
  PLAYER.addEventListener('animationend', () => { PLAYER.style.animation = 'none'; PLAYER.jumping = false; });
  [[50, `${Math.floor(BOARD_PROPS.width * 0.75)}`], [20, `${Math.floor(BOARD_PROPS.width * 0.5)}`],  [-20, `${Math.floor(BOARD_PROPS.width * 0.25)}`], [35, `${Math.floor(BOARD_PROPS.width * 0.05)}`]].forEach((item) => addCloud(item[0] + 'px', 'var(--cloud-color-foreground)', 0, item[1]));
  [[-30, 50], [15, 20], [65, 35], [-22, 16, true], [28, 35, true], [58, 22, true]].forEach((item) => addCloud(item[0] + 'px', 'var(--cloud-color)', item[1], null, item?.[2]));
  restart();
}, false);
