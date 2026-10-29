import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n');
const skill = read('SKILL.md');
const chineseSkill = read('SKILL.zh-CN.md');
const scenarios = read('tests/behavior-scenarios.yaml');
const readme = read('README.md');
const chineseReadme = read('README.zh-CN.md');
const version = scenarios.match(/^version: "([^"]+)"/m)?.[1];
const anchorSection = scenarios.split(/^rule_anchors:\s*$/m)[1]?.split(/^scenarios:\s*$/m)[0];
const anchors = [...(anchorSection ?? '').matchAll(/^  "([^"]+)": (.+)$/gm)];
const anchorNames = new Set(anchors.map((match) => match[1]));
const cases = [...scenarios.matchAll(/^  - id: ([^\n]+)\n([\s\S]*?)(?=^  - id: |$(?![\s\S]))/gm)];

function check(name, action) {
  try {
    action();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}

check('entry files and version', () => {
  assert.match(skill, /^---\nname: ooda\ndescription:/);
  assert.match(chineseSkill, /^---\nname: ooda\ndescription:/);
  const description = skill.match(/^---\n[\s\S]*?\ndescription: >-\n([\s\S]*?)\n---/)?.[1];
  assert.ok(description, 'missing complete frontmatter description');
  assert.match(description, /adversarial scenarios, layered verification,/);
  // Route-skipping wording is asserted in full by "trigger stays mandatory and
  // forces a declared route"; duplicating it here only creates a second edit point.
  assert.match(description, /verified solved/);
  assert.ok(version);
  assert.ok(readme.includes(`| ${version} |`));
  assert.ok(chineseReadme.includes(`| ${version} |`));
  assert.match(read('agents/openai.yaml'), /state-R\{N\}\.md/);
});

check('scenario structure and rule references', () => {
  // Baseline lock: adding or deleting a scenario must be a deliberate act.
  // Keep this number equal to the count published in tests/README*.md and README*.md,
  // which the "scenario count matches published counts" check verifies from the docs.
  assert.equal(cases.length, 40);
  assert.equal(new Set(cases.map((match) => match[1])).size, cases.length);
  assert.ok(anchors.length > 0);
  for (const [, id, body] of cases) {
    const rules = body.match(/^    required_rules:\n((?:      - .+\n)+)/m)?.[1];
    assert.ok(rules, `${id}: missing required_rules`);
    for (const rule of rules.matchAll(/^      - "([^"]+)"/gm)) {
      assert.ok(anchorNames.has(rule[1]), `${id}: unknown rule ${rule[1]}`);
    }
    assert.match(body, /^    expected_result: pass$/m, `${id}: pass means correct behavior, including refusal`);
    assert.match(body, /^    verification_status: (static|behavior|pending-behavior)$/m);
  }
  for (const [, name, location] of anchors) {
    if (location === 'heading') {
      assert.ok(skill.split('\n').some((line) => {
        if (!/^#{2,3} /.test(line)) return false;
        const title = line.replace(/^#{2,3} (?:\d+(?:\.\d+)*\. ?)?/, '');
        return title === name || title.startsWith(`${name} `);
      }), `missing heading: ${name}`);
    }
  }
});

check('guardrail text and installation', () => {
  assert.ok(skill.indexOf('Irreversibility check') < skill.indexOf('- **Trivial**', skill.indexOf('## Purpose First')));
  assert.ok(skill.indexOf('**Behavioral-scope check:**') < skill.indexOf('- **Trivial**', skill.indexOf('## Purpose First')));
  assert.match(chineseSkill, /\*\*行为影响检查：\*\*/);
  assert.match(skill, /state-R\{N-1\}\.md/);
  assert.match(skill, /NEVER overwritten/);
  assert.match(chineseSkill, /state-R\{N-1\}\.md/);
  assert.match(skill, /Structural skill-upgrade default/);
  assert.match(chineseSkill, /结构性 skill 升级默认严格/);
  assert.match(skill, /Typos, purely local wording, and clearly scoped read-only inspections/);
  assert.match(chineseSkill, /00-purpose\.md/);
  assert.match(chineseSkill, /01-round-1\.md/);
  assert.doesNotMatch(chineseSkill, /00-目的\.md|01-第一轮\.md/);
  for (const installer of ['install.sh', 'install.ps1']) {
    if (existsSync(resolve(root, installer))) assert.match(read(installer), /SKILL\.md/);
  }
});

check('routing gate precedes every action', () => {
  // The routing gate must be readable before anything tells the agent to act.
  const gate = skill.indexOf('## Purpose First');
  assert.ok(gate > 0, 'missing Purpose First section');
  assert.ok(gate < skill.indexOf('## First Action'), 'Purpose First must precede First Action');
  assert.ok(gate < skill.indexOf('## Core Rule'), 'Purpose First must precede Core Rule');
  // The first-action rule must be conditional on a declared route.
  assert.doesNotMatch(skill, /The first action after skill activation: create task 1\./);
  assert.match(skill, /The first action after a loop route is declared/);
  // Exempt routes must override the first-action rule explicitly.
  assert.match(skill, /overrides "Highest match wins"/);
  // Route declaration must precede task creation, not follow it.
  assert.doesNotMatch(skill, /for loop routes, immediately after the task list is created/);
  assert.match(skill, /emitted before any task is created/);
  // Escalation must be anchored to the bucket tier, not to a file count.
  assert.match(skill, /What size alone would give" means the tier the buckets produced/);
  assert.match(skill, /take the HIGHER tier, never the lower/);
  // The first task must not claim to be created on activation.
  assert.doesNotMatch(skill, /Immediately on activation/);
  assert.match(chineseSkill, /声明循环路线之后/);
});

check('trigger stays mandatory and forces a declared route', () => {
  const description = skill.match(/^---\n[\s\S]*?\ndescription: >-\n([\s\S]*?)\n---/)?.[1] ?? '';
  // Mandatory is the original design intent: the loop was never meant to be optional.
  assert.match(description, /mandatory OODA execution loop/);
  assert.match(description, /Trigger automatically/);
  // Nothing may be skipped off the record; every short route must still be declared.
  assert.match(description, /Nothing is skipped silently/);
  const zhDescription = chineseSkill.match(/^---\n[\s\S]*?\ndescription:\s*(.+)\n---/)?.[1] ?? '';
  assert.match(zhDescription, /强制 OODA 执行循环/);
  assert.match(zhDescription, /复杂、模糊或多步骤任务时自动触发/);
  assert.match(zhDescription, /不得静默跳过/);
  // The historical ≤5-file carve-out must not survive in either language.
  assert.doesNotMatch(skill, /batch mechanical replacement across ≤5 files/);
  assert.doesNotMatch(chineseSkill, /≤5 文件的批量同质机械替换且无设计决策/);
});

check('completeness check carries every item in both languages', () => {
  const items = [
    [/All sections A-F are non-empty: A is the compression-restore anchor/, /A-F 字段全部非空/],
    [/Every command recorded in section C carries a real timestamp/, /C 段每条命令都带真实时间戳/],
    [/Overwrite guard: the current file is `state-R\{N\}\.md`/, /防覆写守卫/],
    [/No vague claims/, /无模糊表述/],
  ];
  for (const [en, zh] of items) {
    assert.match(skill, en, `SKILL.md missing completeness item ${en}`);
    assert.match(chineseSkill, zh, `SKILL.zh-CN.md missing completeness item ${zh}`);
  }
});

check('large batches stay trivial but carry an evidence floor', () => {
  assert.match(skill, /Large batches carry an evidence floor/);
  assert.match(skill, /touches more than 5 files/);
  assert.match(skill, /This is an evidence requirement, not a tier change/);
  assert.match(chineseSkill, /大批改动带有证据下限/);
  assert.match(chineseSkill, /超过 5 个文件/);
  assert.match(chineseSkill, /这是证据要求，不是升档/);
});

check('bilingual section parity', () => {
  const pairs = [
    ['## Core Rule', '## 核心规则'],
    ['## Purpose First', '## 目的优先'],
    ['## Loop Scale', '## 循环规模'],
    ['## Analysis/Verification Short Path', '## 分析/验证类简化路径'],
    ['## First Action', '## 首要动作'],
  ];
  for (const [en, zh] of pairs) {
    assert.ok(skill.includes(en), `SKILL.md missing ${en}`);
    assert.ok(chineseSkill.includes(zh), `SKILL.zh-CN.md missing ${zh}`);
  }
  // Tier authority must be stated on both sides.
  assert.match(skill, /This table is the authoritative tier\./);
  assert.match(chineseSkill, /本节是档位的权威口径/);
});

check('historical archive is quarantined', () => {
  const archive = read('references/ooda-full.md');
  assert.match(archive, /HISTORICAL ARCHIVE — NOT RUNTIME INSTRUCTIONS/);
  assert.match(archive, /Never execute a rule from this file/);
  // The leftover YAML fragment that made the archive look loadable must be gone.
  assert.doesNotMatch(archive, /^description: OODA 循环（Observe-Orient-Decide-Act）是 John Boyd/m);
  assert.doesNotMatch(archive, /Start with `OODA 循环技能 v2\.1` for the current lightweight workflow/);
});

check('scenario count matches published counts', () => {
  const expected = String(cases.length);
  for (const file of ['tests/README.md', 'tests/README.zh-CN.md', 'tests/TEST-PLAN.zh-CN.md']) {
    const body = read(file);
    assert.ok(
      body.includes(`${expected} scenarios`) || body.includes(`${expected} 个场景`),
      `${file} does not state ${expected} scenarios`,
    );
  }
});

check('README language purity', () => {
  // The English README once carried Chinese-only labels inside its history table
  // (stage chain, check names, source tags). It must read as English throughout.
  assert.doesNotMatch(
    readme,
    /[\u4e00-\u9fff]/,
    'English README contains Chinese characters',
  );

  // The Chinese README keeps proper nouns and identifiers in English on purpose
  // (`TaskCreate`, `SKILL.md`, `ADR`, `5W1H`, ...). What must not survive is a run
  // of English words forming a sentence fragment inside Chinese prose.
  for (const line of chineseReadme.split('\n')) {
    if (!/^\| \d+\.\d+\.\d+ \|/.test(line)) continue;
    const body = line
      .replace(/`[^`]*`/g, '')
      .replace(/\([^()]*\)/g, '');
    const fragment = body.match(/\b[A-Za-z]+(?:\s+[A-Za-z]+){3,}\b/g) ?? [];
    assert.deepEqual(
      fragment,
      [],
      `Chinese README row has an English sentence fragment: ${fragment.join(' | ')}`,
    );
  }
});

const bytes = readFileSync(resolve(root, 'SKILL.md'));
const crlf = (bytes.toString().match(/\r\n/g) ?? []).length;
console.log(`INFO SKILL.md line endings: CRLF=${crlf}, LF=${(bytes.toString().match(/(?<!\r)\n/g) ?? []).length}; discovery must be checked on the target host.`);
console.log(`INFO scenarios=${cases.length}; static checks do not prove agent behavior or Windows skill discovery.`);
