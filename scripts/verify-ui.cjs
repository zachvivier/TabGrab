// Optional QA tooling: uses playwright-core, never bundled into the extension.
// Build first. Set PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE if not on the module path.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const Handlebars = require('handlebars');
const sass = require('sass');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'store-assets');
const qa = path.join(root, 'build', 'ui-qa');
fs.mkdirSync(qa, {recursive:true});
fs.mkdirSync(out, {recursive:true});
const messages = JSON.parse(fs.readFileSync(path.join(root,'app/_locales/en/messages.json')));
Handlebars.registerHelper('t', key => messages[key].message);
Handlebars.registerHelper('enabledSetting', (current, expected) => current === expected ? 'enabled' : '');
const template = Handlebars.compile(fs.readFileSync(path.join(root,'app/templates/popup.handlebars'),'utf8'));
const css = sass.compile(path.join(root,'app/stylesheets/popup.scss')).css;
const svg = fs.readFileSync(path.join(root,'app/images/icons/icon.svg'));
const icon = `data:image/svg+xml;base64,${svg.toString('base64')}`;
for(const mode of ['allUrls','ticketUrls','noUrls']) {
  const html = template({currentUrlDetection:mode}).replace('images/icons/icon.svg',icon);
  fs.writeFileSync(path.join(qa,`${mode}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><title>TabGrab UI preview</title><style>${css}</style><body>${html}</body></html>`);
}

(async () => {
  const extension = path.join(root,'dist/chrome');
  const context = await chromium.launchPersistentContext(path.join(qa,`profile-${Date.now()}`), {
    executablePath:process.env.CHROMIUM_EXECUTABLE,
    headless:true,
    args:[`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
    viewport:{width:360,height:600},
    deviceScaleFactor:2,
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const id = new URL(worker.url()).host;
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`chrome-extension://${id}/popup.html`);
    await page.locator('#settings-url-types a.enabled').waitFor();
    assert.equal(await page.evaluate(()=>chrome.runtime.getManifest().version), require('../package.json').version);
    assert.equal(await page.locator('#settings-url-types a').count(),3);
    assert.equal(await page.locator('#settings-url-types a.enabled').getAttribute('data-url-type'),'allUrls');
    assert.equal(await page.locator('#settings-help a').getAttribute('href'),'https://github.com/zachvivier/TabGrab');
    assert.equal(await page.locator('#settings-help a').innerText(),'View Source on GitHub');
    for(const mode of ['ticketUrls','noUrls','allUrls']) {
      await page.locator(`[data-url-type="${mode}"] .mode-title`).click();
      await page.waitForFunction(expected => document.querySelector('#settings-url-types a.enabled')?.dataset.urlType === expected, mode);
      assert.equal(await page.evaluate(async()=> (await chrome.storage.local.get('urlDetection')).urlDetection),mode);
      assert.equal(await page.locator('#settings-url-types a.enabled').count(),1);
      assert.equal(await page.evaluate(()=>chrome.action.getBadgeText({})), mode === 'noUrls' ? 'OFF' : '');
      await page.reload();
      await page.locator(`[data-url-type="${mode}"].enabled`).waitFor();
      const size = await page.locator('body').boundingBox();
      assert.equal(size.width,360);
      assert.ok(size.height < 600);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360);
      await page.mouse.move(0,0);
      await page.locator('body').screenshot({path:path.join(qa,`popup-${mode}.png`)});
    }
    // Keyboard focus remains visible and Enter still selects a mode.
    await page.locator('[data-url-type="ticketUrls"]').focus();
    assert.equal(await page.locator('[data-url-type="ticketUrls"]').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('[data-url-type="ticketUrls"]').classList.contains('enabled'));
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('[data-url-type="allUrls"]').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
    assert.deepEqual(errors,[]);
    console.log('PASS: Chromium extension popup: initial mode, all three selections, storage, reload persistence, badge state, nested-label clicks, keyboard activation, focus, reduced motion, no overflow/errors.');
    // Asset images use captures of the actual built extension, never recreated controls.
    const screenshots = {};
    for(const mode of ['allUrls','ticketUrls','noUrls']) screenshots[mode]='data:image/png;base64,'+fs.readFileSync(path.join(qa,`popup-${mode}.png`)).toString('base64');
    const height = (await page.locator('body').boundingBox()).height;
    const base = `*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#1d2025;color:#f5f7fa;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body{position:relative;padding:64px}h1,h2,p{margin:0}.muted{color:#b6bfce}.brand{display:flex;align-items:center;gap:16px;font-size:24px;font-weight:650}.brand img{width:54px;height:54px}.eyebrow{font-size:16px;color:#b6bfce;letter-spacing:2px;text-transform:uppercase}.popup{border:1px solid #555c67;border-radius:14px;box-shadow:0 24px 60px #0005;overflow:hidden;display:block}footer{position:absolute;bottom:44px;left:64px;color:#b6bfce;font-size:16px}`;
    const brand = `<div class="brand"><img src="${icon}" alt="">TabGrab <span class="muted" style="font-weight:400">for Zendesk</span></div>`;
    async function render(name,width,height,markup,extra='') {
      const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>TabGrab</title><style>${base}${extra}</style><body>${markup}</body></html>`;
      fs.writeFileSync(path.join(out,`${name}.html`),html);
      const board = await context.newPage({viewport:{width,height}});
      await board.setViewportSize({width,height});
      await board.goto(pathToFileURL(path.join(out,`${name}.html`)).href);
      await board.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
      // Explicit scale:css produces the requested pixel dimensions despite the 2x QA context.
      await board.evaluate(()=>window.scrollTo(0,0));
      await board.screenshot({path:path.join(out,`${name}.png`),scale:'css'});
      await board.close();
    }
    await render('01-overview-1280x800',1280,800,`${brand}<div style="position:absolute;left:64px;top:242px;width:570px"><p class="eyebrow">Well-behaved browser tabs</p><h1 style="font-size:66px;line-height:1.08;letter-spacing:-2.5px;margin:20px 0 26px">Fewer tabs.<br>More focus.</h1><p class="muted" style="font-size:23px;line-height:1.55;max-width:510px">Keep Zendesk links in your existing agent tab. Choose which links TabGrab handles.</p></div><img class="popup" style="position:absolute;width:432px;right:70px;top:${Math.round((800-height*1.2)/2)}px" src="${screenshots.allUrls}" alt="TabGrab popup with All agent links selected"><footer>Local processing. No tracking.</footer>`);
    await render('02-modes-1280x800',1280,800,`<h1 style="font-size:40px;letter-spacing:-1px;margin-top:0">Your links. Your choice.</h1><p class="muted" style="font-size:20px;margin-top:10px">Route all agent links, just ticket links, or let links open normally.</p><div style="display:flex;gap:28px;margin-top:40px">${['allUrls','ticketUrls','noUrls'].map(mode=>`<img class="popup" style="width:calc((100% - 56px)/3);height:auto;align-self:start" src="${screenshots[mode]}" alt="${mode}">`).join('')}</div>`);
    await render('promo-440x280',440,280,`<div style="display:flex;align-items:center;gap:18px"><img src="${icon}" width="72" height="72" alt=""><div><h1 style="font-size:32px;letter-spacing:-1px">TabGrab</h1><p class="muted" style="font-size:18px">for Zendesk</p></div></div><h2 style="font-size:32px;line-height:1.15;letter-spacing:-.8px;margin-top:28px">Fewer tabs.<br>More focus.</h2>`,`body{padding:32px}`);
    await render('marquee-1400x560',1400,560,`${brand}<h1 style="font-size:68px;line-height:1.1;letter-spacing:-2px;margin-top:72px">Fewer tabs.<br>More focus.</h1><p class="muted" style="font-size:22px;margin-top:22px">Well-behaved browser tabs for Zendesk agents.</p><img class="popup" style="position:absolute;width:360px;right:100px;top:${Math.round((560-height)/2)}px" src="${screenshots.allUrls}" alt="TabGrab popup">`);
    fs.copyFileSync(path.join(root,'app/images/icons/icon128.png'),path.join(out,'icon-128.png'));
    console.log('Created store PNGs and self-contained HTML sources in store-assets/.');
  } finally { await context.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
