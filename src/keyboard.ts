const keysDown: Map<string, boolean> = new Map();

let onChange: (key: string, isDown: boolean) => boolean = () => false;
let setupDone = false;

export function isKeyDown(key: string): boolean {
  return keysDown.has(key);
}

function onKey(ev: KeyboardEvent) {
  const isDown = ev.type === 'keydown';
  const key = ev.key;
  let processed = false;
  if (isDown) {
    if (!keysDown.has(key)) {
      keysDown.set(key, true);
      processed = onChange(key, true);
    }
  } else {
    if (keysDown.has(key)) {
      keysDown.delete(key);
      processed = onChange(key, false);
    }
  }
  if (processed) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}

export function setupKeyHandling(
  _onChange: (key: string, isDown: boolean) => boolean,
  _preventByDefault = true,
) {
  if (setupDone) return;
  onChange = _onChange;
  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKey);
  setupDone = true;
}

export function unsetKeyHandling() {
  if (!setupDone) return;
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKey);
  setupDone = false;
}
