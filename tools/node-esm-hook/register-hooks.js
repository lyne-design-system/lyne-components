import { register } from 'node:module';

register('./raw-hook.js', import.meta.url);
register('./sass-hook.js', import.meta.url);
register('./typescript-hook.js', import.meta.url);
