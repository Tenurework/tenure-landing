import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const out = "C:/Users/adiab/tenure-landing/.shots/dialog";
const base = process.env.BASE || "http://localhost:3100";
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const theme of ["light", "dark"]) {
  for (const v of [{t:"desktop",w:1440,h:1000},{t:"mobile",w:390,h:844}]) {
    const p = await b.newPage({ viewport:{width:v.w,height:v.h}, deviceScaleFactor:1 });
    await p.addInitScript((t)=>{localStorage.setItem("tenure-theme",t);document.documentElement.setAttribute("data-theme",t);},theme);
    await p.goto(base + "/contact",{waitUntil:"networkidle"});
    // networkidle is not hydration: the dialog is client state, so a click fired
    // against server HTML is simply dropped. Wait for React to own the header.
    await p.waitForFunction(() => {
      const el = document.querySelector("header");
      return !!el && Object.keys(el).some((k) => k.startsWith("__react"));
    }, undefined, { timeout: 30000 });
    await p.addStyleTag({content:"*{animation-duration:0s!important;transition-duration:0s!important}"});
    await p.getByRole("button",{name:"Request a walkthrough"}).click();
    await p.getByLabel("Your name").fill("Alex Mercer");
    await p.getByLabel("Organization name").fill("Northside Community Trust");
    await p.getByLabel("Kind of organization").selectOption("NGOs & nonprofits");
    await p.getByRole("checkbox",{name:/handoff packet/i}).check();
    await p.waitForTimeout(300);
    await p.screenshot({path:`${out}/dialog-${theme}-${v.t}.png`});
    await p.close();
  }
}
await b.close(); console.log("done");
