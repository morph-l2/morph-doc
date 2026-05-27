/**
 * Python interpreter for vendor/skill-creator (PEP 668–safe venv under .local/).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MORPH_DOC_ROOT = path.join(__dirname, '../..');

export function skillCreatorRequirementsPath(root = MORPH_DOC_ROOT) {
  return path.join(root, 'scripts', 'skill-creator-requirements.txt');
}

export function skillCreatorVenvDir(root = MORPH_DOC_ROOT) {
  return path.join(root, '.local', 'skill-creator-venv');
}

export function skillCreatorVenvPython(root = MORPH_DOC_ROOT) {
  return path.join(skillCreatorVenvDir(root), 'bin', 'python3');
}

export function pythonCanImportYaml(pythonExe) {
  const r = spawnSync(pythonExe, ['-c', 'import yaml'], { encoding: 'utf8' });
  return r.status === 0;
}

/**
 * Return a python3 that can `import yaml` (project venv or system).
 * Creates `.local/skill-creator-venv` when needed (Homebrew PEP 668).
 * @param {string} [root]
 * @param {{ quiet?: boolean }} [options]
 * @returns {string}
 */
export function ensureSkillCreatorPython(root = MORPH_DOC_ROOT, options = {}) {
  const { quiet = false } = options;
  const log = quiet ? () => {} : (...args) => console.log(...args);

  const venvPy = skillCreatorVenvPython(root);
  if (fs.existsSync(venvPy) && pythonCanImportYaml(venvPy)) {
    return venvPy;
  }

  const systemPy = 'python3';
  if (pythonCanImportYaml(systemPy)) {
    return systemPy;
  }

  const venvDir = skillCreatorVenvDir(root);
  const reqFile = skillCreatorRequirementsPath(root);
  if (!fs.existsSync(reqFile)) {
    throw new Error(`Missing ${reqFile}`);
  }

  fs.mkdirSync(path.dirname(venvDir), { recursive: true });
  if (!fs.existsSync(venvPy)) {
    log(`Creating skill-creator venv at ${venvDir} …`);
    const venv = spawnSync(systemPy, ['-m', 'venv', venvDir], { stdio: quiet ? 'pipe' : 'inherit' });
    if (venv.status !== 0) {
      throw new Error('python3 -m venv failed');
    }
  }

  log('Installing Python deps into skill-creator venv (PyYAML)…');
  const pip = spawnSync(venvPy, ['-m', 'pip', 'install', '-q', '-r', reqFile], {
    stdio: quiet ? 'pipe' : 'inherit',
  });
  if (pip.status !== 0) {
    throw new Error('pip install skill-creator-requirements.txt failed');
  }

  if (!pythonCanImportYaml(venvPy)) {
    throw new Error('PyYAML not available in skill-creator venv after install');
  }

  return venvPy;
}
