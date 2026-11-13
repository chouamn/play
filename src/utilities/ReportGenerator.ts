import fs from 'fs';
import { chromium } from '@playwright/test';
import { ConfigReader } from './ConfigReader';

/**
 * ReportGenerator
 * ---------------
 * Builds the team's test report from Cucumber's JSON results:
 *   reports/ISR_Test_Report.html  – dark, interactive, for the team
 *   reports/ISR_Test_Report.pdf   – light, every scenario open, for printing and evidence
 *
 * The team never edits this file. It is run by RunTests.ts after every test run,
 * or by hand with: npm run report
 */

const JSON_REPORT = 'reports/cucumber-report.json';
const HTML_REPORT = 'reports/ISR_Test_Report.html';
const PDF_REPORT = 'reports/ISR_Test_Report.pdf';
const LOGO_FILE = 'resources/assets/census-logo.svg';
const REPORT_TITLE = 'ISR 2027 · UI Test Report';

// ---------- the shape of Cucumber's JSON report (only the parts we use) ----------
type CucumberStep = {
  keyword: string;
  name?: string;
  hidden?: boolean;
  result: { status: string; duration?: number; error_message?: string };
  embeddings?: { mime_type: string; data: string }[];
};
type CucumberScenario = {
  type: string;
  name: string;
  tags: { name: string }[];
  steps: CucumberStep[];
  before?: CucumberStep[];
  after?: CucumberStep[];
};
type CucumberFeature = { name: string; uri: string; elements: CucumberScenario[] };

// ---------- one scenario, ready to show ----------
type ScenarioResult = {
  feature: string;
  file: string;
  name: string;
  tags: string[];
  passed: boolean;
  steps: CucumberStep[];
  screenshots: string[];   // data URLs
  durationMs: number;
};

export class ReportGenerator {
  /** Builds the HTML report and then the PDF report. */
  static async generate(tagsRun: string = 'all'): Promise<void> {
    if (!fs.existsSync(JSON_REPORT)) {
      console.log(`No test results found (${JSON_REPORT}). Run the tests first.`);
      return;
    }
    const features: CucumberFeature[] = JSON.parse(fs.readFileSync(JSON_REPORT, 'utf8'));
    const scenarios = this.collectScenarios(features);

    const html = this.buildHtml(features, scenarios, tagsRun);
    fs.writeFileSync(HTML_REPORT, html);
    console.log(`HTML report: ${HTML_REPORT}`);

    await this.buildPdf();
    console.log(`PDF report:  ${PDF_REPORT}`);
  }

  // Turns Cucumber's JSON into one simple object per scenario.
  private static collectScenarios(features: CucumberFeature[]): ScenarioResult[] {
    const results: ScenarioResult[] = [];
    for (const feature of features) {
      for (const scenario of feature.elements.filter(e => e.type === 'scenario')) {
        const allSteps = [...(scenario.before ?? []), ...scenario.steps, ...(scenario.after ?? [])];
        results.push({
          feature: feature.name,
          file: feature.uri,
          name: scenario.name,
          tags: scenario.tags.map(t => t.name),
          passed: allSteps.every(s => s.result.status === 'passed' || s.result.status === 'skipped'),
          steps: scenario.steps.filter(s => !s.hidden),
          screenshots: allSteps.flatMap(s => (s.embeddings ?? [])
            .filter(e => e.mime_type.startsWith('image/'))
            .map(e => `data:${e.mime_type};base64,${e.data}`)),
          durationMs: allSteps.reduce((sum, s) => sum + (s.result.duration ?? 0) / 1e6, 0),
        });
      }
    }
    return results;
  }

  // Opens the HTML report in a hidden browser and saves it as a PDF (light theme, all scenarios open).
  private static async buildPdf(): Promise<void> {
    const browser = await this.launchBrowser();
    try {
      const page = await browser.newPage();
      await page.goto('file://' + fs.realpathSync(HTML_REPORT));
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => (d.open = true)));
      await page.pdf({
        path: PDF_REPORT,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: '10mm', bottom: '14mm', left: '8mm', right: '8mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate:
          '<div style="font-size:8px;width:100%;padding:0 8mm;color:#555;display:flex;justify-content:space-between">' +
          '<span>Internal QA report – contains test data, do not share outside the team</span>' +
          '<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
    } finally {
      await browser.close();
    }
  }

  // Same browser choice as Hooks.ts (chromium, chrome or edge), always hidden.
  private static async launchBrowser() {
    const browserName = ConfigReader.get('BROWSER');
    if (browserName === 'chrome') return chromium.launch({ channel: 'chrome' });
    if (browserName === 'edge') return chromium.launch({ channel: 'msedge' });
    return chromium.launch();
  }

  // ---------- HTML ----------
  private static buildHtml(features: CucumberFeature[], scenarios: ScenarioResult[], tagsRun: string): string {
    const total = scenarios.length;
    const passed = scenarios.filter(s => s.passed).length;
    const failed = total - passed;
    const steps = scenarios.flatMap(s => s.steps);
    const stepsPassed = steps.filter(s => s.result.status === 'passed').length;
    const stepsFailed = steps.filter(s => s.result.status !== 'passed' && s.result.status !== 'skipped').length;
    const stepsSkipped = steps.filter(s => s.result.status === 'skipped').length;
    const passRate = total ? Math.round((passed / total) * 100) : 0;
    const durationSec = (scenarios.reduce((sum, s) => sum + s.durationMs, 0) / 1000).toFixed(2);
    const runStatus = failed > 0 ? 'FAILED' : 'PASSED';
    const runDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    const logo = fs.existsSync(LOGO_FILE)
      ? `<div class="plate"><img src="data:image/svg+xml;base64,${fs.readFileSync(LOGO_FILE).toString('base64')}" alt="Logo"></div>`
      : '';

    const featureRows = features.map(f => {
      const list = scenarios.filter(s => s.feature === f.name);
      const ok = list.filter(s => s.passed).length;
      const width = list.length ? (ok / list.length) * 100 : 0;
      return `<tr><td>${this.escape(f.name)}</td><td class="mono">${this.escape(f.uri.split(/[\\/]/).pop())}</td>` +
        `<td class="mono ok">${ok}</td><td class="mono ko">${list.length - ok}</td>` +
        `<td><div class="bar"><span style="width:${width}%"></span></div></td></tr>`;
    }).join('');

    const scenarioCards = scenarios.map(s => this.scenarioCard(s)).join('');

    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${REPORT_TITLE}</title>
<style>${STYLES}</style></head><body>
<header>${logo}<div><h1>${REPORT_TITLE}</h1><div class="sub">Playwright · Cucumber · TypeScript</div></div>
<div class="status ${runStatus}">${runStatus}</div></header>
<main>
<div class="meta">
  <div><span>ENVIRONMENT</span><b>UAT</b></div>
  <div><span>BROWSER</span><b>${this.escape(ConfigReader.get('BROWSER'))}</b></div>
  <div><span>RUN DATE</span><b>${runDate}</b></div>
  <div><span>DURATION</span><b>${durationSec} s</b></div>
  <div><span>TAGS</span><b>${this.escape(tagsRun)}</b></div>
  <div><span>PROJECT</span><b>isr-2027-automation</b></div>
</div>
<div class="grid">
  <div class="kpi"><span>SCENARIOS</span><b>${total}</b><small>${features.length} features</small></div>
  <div class="kpi ok"><span>PASSED</span><b>${passed}</b><small>${stepsPassed} steps</small></div>
  <div class="kpi ko"><span>FAILED</span><b>${failed}</b><small>${stepsFailed} steps</small></div>
  <div class="kpi"><span>SKIPPED STEPS</span><b>${stepsSkipped}</b><small>after a failure</small></div>
  <div class="chart">${this.donut(passed, failed, passRate)}
    <div class="legend"><div><i class="dot ok-bg"></i>Passed ${passed}</div><div><i class="dot ko-bg"></i>Failed ${failed}</div></div></div>
</div>
<h2>Features</h2>
<table><tr><th>FEATURE</th><th>FILE</th><th>PASSED</th><th>FAILED</th><th>RESULT</th></tr>${featureRows}</table>
<h2>Scenarios</h2>${scenarioCards}
</main>
<footer><span>isr-2027-automation · internal QA report – contains test data, do not share outside the team</span><span>Generated ${runDate}</span></footer>
</body></html>`;
  }

  // One scenario: title line, its steps, the error (if any) and the screenshot (if any).
  private static scenarioCard(s: ScenarioResult): string {
    const status = s.passed ? 'passed' : 'failed';
    const stepRows = s.steps.map(step => {
      const st = step.result.status;
      const icon = st === 'passed' ? '<b class="ok">✔</b>' : st === 'skipped' ? '<b class="sk">–</b>' : '<b class="ko">✖</b>';
      const ms = Math.round((step.result.duration ?? 0) / 1e6);
      const error = step.result.error_message ? this.errorBlock(step.result.error_message) : '';
      return `<li class="${st}">${icon}<span class="kw">${this.escape(step.keyword.trim())}</span> ` +
        `${this.escape(step.name)}<span class="t">${ms} ms</span>${error}</li>`;
    }).join('');
    const shots = s.screenshots
      .map(src => `<div class="shot"><div class="cap">SCREENSHOT AT FAILURE</div><img src="${src}"></div>`)
      .join('');

    return `<details class="card ${status}" ${s.passed ? '' : 'open'}><summary>` +
      `<span class="pill ${status}">${status.toUpperCase()}</span><span class="scn">${this.escape(s.name)}</span>` +
      `<span class="tags">${s.tags.map(t => `<i>${this.escape(t)}</i>`).join('')}</span>` +
      `<span class="dur">${(s.durationMs / 1000).toFixed(2)}s</span></summary>` +
      `<div class="feat">${this.escape(s.feature)} · <code>${this.escape(s.file)}</code></div>` +
      `<ol class="steps">${stepRows}</ol>${shots}</details>`;
  }

  // The error message, without the code location lines, with "Excel has" / "Screen has" coloured.
  private static errorBlock(message: string): string {
    const lines = message.split('\n').filter(line => !line.trim().startsWith('at '));
    const coloured = lines.map(line => {
      const safe = this.escape(line);
      if (line.includes('Excel has:') || line.includes('Bold in Excel')) return `<span class="exp">${safe}</span>`;
      if (line.includes('Screen has:') || line.includes('Bold on screen')) return `<span class="act">${safe}</span>`;
      return safe;
    });
    return `<pre class="err">${coloured.join('\n')}</pre>`;
  }

  // The pass-rate ring.
  private static donut(passed: number, failed: number, passRate: number): string {
    const total = passed + failed || 1;
    const r = 54, circle = 2 * Math.PI * r;
    const passLen = (passed / total) * circle;
    return `<svg width="140" height="140" viewBox="0 0 140 140">` +
      `<circle r="${r}" cx="70" cy="70" fill="none" class="ring-ko" stroke-width="14"/>` +
      `<circle r="${r}" cx="70" cy="70" fill="none" class="ring-ok" stroke-width="14" stroke-dasharray="${passLen} ${circle - passLen}" transform="rotate(-90 70 70)"/>` +
      `<text x="70" y="66" text-anchor="middle" class="dn">${passRate}%</text>` +
      `<text x="70" y="86" text-anchor="middle" class="dl">PASS RATE</text></svg>`;
  }

  // Makes text safe to put inside HTML.
  private static escape(text: string | undefined): string {
    return String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// ---------- look of the report: dark on screen, light when printed to PDF ----------
const STYLES = `
:root{--bg:#0b0f14;--panel:#11161d;--line:#1f2a37;--text:#c9d4e0;--dim:#7d8b9c;--head:#e6edf3;--accent:#22d3ee;--ok:#22c55e;--ko:#ef4444;--errbg:#1a0f12;--errtx:#fca5a5;--exp:#86efac}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 "Segoe UI",system-ui,sans-serif}
.mono,code,pre,.t,.dur,.kpi b,.meta b,.status,.pill{font-family:"JetBrains Mono",Consolas,monospace}
header{display:flex;align-items:center;gap:18px;padding:18px 40px;border-bottom:1px solid var(--line);background:var(--panel)}
.plate{background:#fff;border-radius:8px;padding:6px 12px;display:flex;align-items:center}.plate img{height:48px;display:block}
header h1{margin:0;font-size:20px;color:var(--head)}header .sub{color:var(--dim);font-size:12px;letter-spacing:2px;text-transform:uppercase}
.status{margin-left:auto;padding:8px 18px;border-radius:6px;font-weight:700;letter-spacing:2px;border:1px solid}
.status.FAILED{color:var(--ko);border-color:var(--ko)}.status.PASSED{color:var(--ok);border-color:var(--ok)}
main{padding:28px 40px;max-width:1360px;margin:auto}
.meta{display:flex;flex-wrap:wrap;gap:28px;padding:14px 18px;border:1px solid var(--line);border-radius:8px;background:var(--panel);margin-bottom:22px}
.meta span{display:block;color:var(--dim);font-size:11px;letter-spacing:1.5px}.meta b{color:var(--head);font-weight:500}
.grid{display:grid;grid-template-columns:repeat(4,1fr) 1.4fr;gap:16px;margin-bottom:22px}
.kpi,.chart{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:16px 18px;position:relative;overflow:hidden}
.kpi:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent)}.kpi.ok:before{background:var(--ok)}.kpi.ko:before{background:var(--ko)}
.kpi span{color:var(--dim);font-size:11px;letter-spacing:1.5px}.kpi b{display:block;font-size:34px;font-weight:600;color:var(--head);margin-top:6px}.kpi small{color:var(--dim)}
.chart{display:flex;align-items:center;gap:18px}.ring-ok{stroke:var(--ok)}.ring-ko{stroke:var(--ko)}
.dn{font:700 24px "JetBrains Mono",Consolas,monospace;fill:var(--head)}.dl{font-size:9px;letter-spacing:1.5px;fill:var(--dim)}
.legend div{font-size:12px;color:var(--dim);margin:4px 0;white-space:nowrap}.dot{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:8px}.ok-bg{background:var(--ok)}.ko-bg{background:var(--ko)}
h2{font-size:12px;letter-spacing:2px;color:var(--dim);margin:26px 0 10px;text-transform:uppercase}
table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--line)}
th,td{padding:10px 14px;border-bottom:1px solid var(--line);text-align:left}th{font-size:11px;letter-spacing:1.5px;color:var(--dim);font-weight:600}
.bar{height:6px;background:#ef444455;border-radius:3px;overflow:hidden;width:180px}.bar span{display:block;height:100%;background:var(--ok)}
.ok{color:var(--ok)}.ko{color:var(--ko)}.sk{color:#64748b}
.card{background:var(--panel);border:1px solid var(--line);border-radius:8px;margin-bottom:12px}.card.failed{border-color:#ef444466}
summary{display:flex;align-items:center;gap:14px;padding:14px 18px;cursor:pointer;list-style:none}
.pill{font-size:11px;font-weight:700;padding:3px 9px;border-radius:4px;letter-spacing:1px}.pill.passed{background:#22c55e22;color:var(--ok)}.pill.failed{background:#ef444422;color:var(--ko)}
.scn{color:var(--head);font-weight:600}.tags i{font-style:normal;font-size:11px;color:var(--accent);border:1px solid #22d3ee44;border-radius:10px;padding:1px 8px;margin-right:6px}
.dur{margin-left:auto;color:var(--dim)}.feat{padding:0 18px 6px;color:var(--dim);font-size:12px}
.steps{list-style:none;margin:0;padding:6px 18px 16px}.steps li{padding:7px 0;border-top:1px dashed var(--line)}.steps .kw{color:var(--accent);font-weight:600;margin:0 6px 0 8px}
.steps .t{float:right;color:var(--dim);font-size:12px}.steps li.skipped{color:#64748b}.steps li.skipped .kw{color:#64748b}
.err{margin:10px 0 2px 26px;padding:12px 14px;background:var(--errbg);border:1px solid #ef444455;border-left:3px solid var(--ko);border-radius:6px;color:var(--errtx);font-size:12.5px;white-space:pre-wrap}
.err .exp{color:var(--exp)}.err .act{font-weight:700}
.shot{padding:0 18px 18px}.shot .cap{font-size:11px;letter-spacing:1.5px;color:var(--dim);margin-bottom:6px}.shot img{max-width:520px;border:1px solid var(--line);border-radius:6px}
footer{padding:20px 40px;color:var(--dim);font-size:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between}
@media print{
  :root{--bg:#fff;--panel:#fff;--line:#d0d7de;--text:#1f2328;--dim:#57606a;--head:#0b0f14;--accent:#0969da;--ok:#1a7f37;--ko:#cf222e;--errbg:#fff5f5;--errtx:#82071e;--exp:#1a7f37}
  main{padding:14px 0;max-width:none}header{padding:10px 0;background:#fff}.plate{border:1px solid var(--line)}
  .grid{grid-template-columns:repeat(4,1fr) 1.6fr}footer{display:none}
  .card,.err,.shot,.steps li,tr{break-inside:avoid}summary{break-after:avoid}h2{break-after:avoid}
  .shot img{max-width:420px}
}`;