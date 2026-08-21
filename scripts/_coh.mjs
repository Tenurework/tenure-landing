import { chromium } from "playwright";
const SP=process.argv[2];
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,
  userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"});
try{
  const r=await p.goto("https://cohere.com/",{waitUntil:"domcontentloaded",timeout:60000});
  console.log("status",r.status());
  await p.waitForTimeout(4000);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  console.log("page height",H,"screens",(H/1000).toFixed(1));
  for(let i=0;i<5;i++){
    await p.evaluate(y=>window.scrollTo(0,y), i*1000);
    await p.waitForTimeout(900);
    await p.screenshot({path:`${SP}/coh-${i+1}.png`});
  }
}catch(e){console.log("ERR",e.message.slice(0,200));}
await b.close();
