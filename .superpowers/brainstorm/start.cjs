const path = require('path');
const sessionDir = path.resolve(__dirname, 'session-1');
process.env.BRAINSTORM_DIR = sessionDir;
process.env.BRAINSTORM_OPEN = '1';
process.env.BRAINSTORM_PORT_FILE = path.resolve(__dirname, 'port');
process.env.BRAINSTORM_TOKEN_FILE = path.resolve(__dirname, 'token');
require(path.resolve(__dirname, '../../.agents/skills/brainstorming/scripts/server.cjs'));
