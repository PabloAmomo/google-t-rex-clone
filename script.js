const BOARD = document.getElementById('board');
const PLAYER = document.getElementById('player');
const FLOOR = document.getElementById('floor');
const GAME_STATE = { isGameOver: false, speed: 5, score: 0, acceleration: 0 };
const PHYSICS = { jumpDown: -4, jumpHeight: 80, jumpStep: 5, increaseSpeed: 0.25 };
const BOARD_PROPS = { width: 600, height: 200 };
const PLAYER_PROPS = { left: 60, width: 50, height: 48, bottom: 10 };
const OBSTACLE_PROPS = { left: BOARD_PROPS.width + 40, width: 40, height: 40, bottom: 6, 'font-size': '40px', 'line-height': '40px' };
const OBSTACLES = [];
const OBSTACLES_TYPES = [{ ...OBSTACLE_PROPS }, { ...OBSTACLE_PROPS, width: 50, height: 50, 'font-size': '50px', 'line-height': '50px' }];
const SYMBOLS = { cloud: '&#9729;', obstacle: '&#127797;' };

const loop = (loopTimer) => {
  handleObstacles(loopTimer);
  if (PLAYER.jumping !== '') handleJumping();
};

const handleObstacles = (loopTimer) => {
  if (OBSTACLES.length === 0 || (OBSTACLES[OBSTACLES.length - 1].left() < BOARD_PROPS.width / 2 && Math.random() * OBSTACLES[OBSTACLES.length - 1].left() < BOARD_PROPS.width / 8))
    addObstacle();

  for (let i = 0; i < OBSTACLES.length; i++) {
    const obstacle = OBSTACLES[i];

    obstacle.left() > -obstacle.width() && !GAME_STATE.isGameOver && setMove(obstacle, 'left', -(GAME_STATE.acceleration + GAME_STATE.speed));

    if (obstacle.left() >= PLAYER.left() && obstacle.left() <= PLAYER.left() + PLAYER.width() && PLAYER.bottom() <= obstacle.bottom() + 4) {
      clearInterval(loopTimer);
      GAME_STATE.isGameOver = true;
      document.body.classList.add('game-over');
      break;
    }

    if (obstacle.left() < PLAYER.left() && !obstacle.scored) {
      GAME_STATE.score += 100;
      GAME_STATE.acceleration += PHYSICS.increaseSpeed;
      obstacle.scored = true;
      document.getElementById('score').innerText = completeWithZero(GAME_STATE.score, 5);
      document.getElementById('level').innerText = 'Level ' + completeWithZero(Math.floor(GAME_STATE.acceleration) + 1, 3);
    }
  }
};

const handleJumping = () => {
  const speedPlus = PHYSICS.jumpStep + GAME_STATE.acceleration;
  if (PLAYER.jumping === 'up' && PLAYER.bottom() < PHYSICS.jumpHeight + PLAYER_PROPS.bottom) setMove(PLAYER, 'bottom', speedPlus);
  else {
    PLAYER.jumping = 'down';
    if (PLAYER.bottom() > PLAYER_PROPS.bottom)
      setMove(PLAYER, 'bottom', PLAYER.bottom() <= PHYSICS.jumpHeight / 2 ? -speedPlus : PHYSICS.jumpDown - GAME_STATE.acceleration);
    else {
      PLAYER.jumping = '';
      setMove(PLAYER, 'bottom', PLAYER_PROPS.bottom, true);
    }
  }
};

function addCloud(top, color = 'initial', speed = 0, left = 'auto', inv = false) {
  const newCloud = createEl(['cloud', 'position-absolute'], null, { top, left, color, animation: speed ? `moving-cloud-${inv ? 'inv-' : ''}ani ${speed}s linear infinite` : 'none' }, SYMBOLS.cloud);
  BOARD.insertBefore(newCloud, BOARD.firstChild);
}

const addObstacle = (removeIndex) => {
  if (removeIndex >= 0) {
    BOARD.removeChild(OBSTACLES[removeIndex]);
    OBSTACLES.splice(removeIndex, 1);
  }
  OBSTACLES.push(createEl(['position-absolute', 'obstacle', 'd-flex', 'justify-content-center'], BOARD, OBSTACLES_TYPES[Math.floor(Math.random() * OBSTACLES_TYPES.length)], SYMBOLS.obstacle));
};

const restart = () => {
  GAME_STATE.isGameOver = false;
  GAME_STATE.score = 0;
  GAME_STATE.acceleration = 0;
  document.getElementById('score').innerText = completeWithZero(0, 5);
  document.getElementById('level').innerText = 'Level ' + completeWithZero(Math.floor(GAME_STATE.acceleration) + 1, 3);
  PLAYER.jumping = '';
  [[PLAYER, PLAYER_PROPS], [BOARD, BOARD_PROPS]].forEach((item) => setProps(...item));
  removeEl('.obstacle');
  OBSTACLES.length = 0;
  const loopTimer = setInterval(() => loop(loopTimer), 20);
  document.body.classList.remove('game-over');
};

const setMove = (element, prop, value, setValue) => {
  const current = getValuePx(element, prop);
  element.style[prop] = (setValue ? value : current + value) + 'px';
};

const setProps = (element, props) => {
  const pxType = ['left', 'width', 'height', 'bottom'];
  pxType.forEach((prop) => (element[prop] = () => getValuePx(element, prop)));
  Object.entries(props).forEach(([prop, value]) => (element.style[prop] = pxType.includes(prop) ? value + 'px' : value));
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
const jump = () => PLAYER.jumping === '' && (PLAYER.jumping = 'up');
const getValuePx = (element, prop) => parseInt(element.style[prop].replace('px', ''));

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keyup', () => event.keyCode === 32 && jump());
    document.addEventListener('click', () => !document.body.classList.contains('game-over') && jump());
    document.getElementById('play').addEventListener('click', (evt) => { evt.preventDefault(); evt.stopPropagation(); restart(); });
    setTimeout(() => PLAYER.classList.remove('player-start'), 250);
    [[50, `${Math.floor(BOARD_PROPS.width * 0.75)}`], [20, `${Math.floor(BOARD_PROPS.width * 0.5)}`], [-20, `${Math.floor(BOARD_PROPS.width * 0.25)}`], [35, `${Math.floor(BOARD_PROPS.width * 0.05)}`]].forEach((item) => addCloud(item[0] + 'px', 'var(--cloud-color-foreground)', 0, item[1]));
    [[-30, 50], [15, 20], [65, 35], [-22, 16, true], [28, 35, true], [58, 22, true]].forEach((item) => addCloud(item[0] + 'px', 'var(--cloud-color)', item[1], null, item?.[2]));
    restart();
  }, false);
