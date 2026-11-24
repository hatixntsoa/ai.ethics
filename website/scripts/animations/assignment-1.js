import { DOCS } from '../data/docs.js';
import { section, pager, finishDoc } from '../docReader.js';
const doc = document.getElementById('doc');
section(doc, 'h-brief', 'Brief', DOCS.a1.problem);
section(doc, 'h-solution', 'Solution', DOCS.a1.solution);
pager(doc, 'assignment-1'); finishDoc();
