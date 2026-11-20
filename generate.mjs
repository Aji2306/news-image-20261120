import fs from 'node:fs';
import zlib from 'node:zlib';

const W=1024,H=1024, pixels=new Uint8Array(W*H*3);
const C={paper:[246,242,232],ink:[24,31,38],red:[170,46,42],blue:[35,83,121],gold:[205,150,35],muted:[91,100,104],green:[39,112,78],white:[255,255,255]};
pixels.fill(0); for(let i=0;i<W*H;i++){pixels[i*3]=C.paper[0];pixels[i*3+1]=C.paper[1];pixels[i*3+2]=C.paper[2];}
function rect(x,y,w,h,c){x=Math.max(0,x|0);y=Math.max(0,y|0);w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){let p=(j*W+i)*3;pixels[p]=c[0];pixels[p+1]=c[1];pixels[p+2]=c[2];}}
function line(x1,y1,x2,y2,c,t=3){let dx=x2-x1,dy=y2-y1,n=Math.max(Math.abs(dx),Math.abs(dy));for(let k=0;k<=n;k++){let x=Math.round(x1+dx*k/n),y=Math.round(y1+dy*k/n);rect(x-t/2,y-t/2,t,t,c);}}
const glyphs={A:'01110 10001 10001 11111 10001 10001 10001',B:'11110 10001 10001 11110 10001 10001 11110',C:'01111 10000 10000 10000 10000 10000 01111',D:'11110 10001 10001 10001 10001 10001 11110',E:'11111 10000 10000 11110 10000 10000 11111',F:'11111 10000 10000 11110 10000 10000 10000',G:'01111 10000 10000 10111 10001 10001 01111',H:'10001 10001 10001 11111 10001 10001 10001',I:'11111 00100 00100 00100 00100 00100 11111',J:'00111 00010 00010 00010 10010 10010 01100',K:'10001 10010 10100 11000 10100 10010 10001',L:'10000 10000 10000 10000 10000 10000 11111',M:'10001 11011 10101 10101 10001 10001 10001',N:'10001 11001 10101 10011 10001 10001 10001',O:'01110 10001 10001 10001 10001 10001 01110',P:'11110 10001 10001 11110 10000 10000 10000',Q:'01110 10001 10001 10001 10101 10010 01101',R:'11110 10001 10001 11110 10100 10010 10001',S:'01111 10000 10000 01110 00001 00001 11110',T:'11111 00100 00100 00100 00100 00100 00100',U:'10001 10001 10001 10001 10001 10001 01110',V:'10001 10001 10001 10001 10001 01010 00100',W:'10001 10001 10001 10101 10101 10101 01010',X:'10001 10001 01010 00100 01010 10001 10001',Y:'10001 10001 01010 00100 00100 00100 00100',Z:'11111 00001 00010 00100 01000 10000 11111',0:'01110 10001 10011 10101 11001 10001 01110',1:'00100 01100 00100 00100 00100 00100 01110',2:'01110 10001 00001 00010 00100 01000 11111',3:'11110 00001 00001 01110 00001 00001 11110',4:'00010 00110 01010 10010 11111 00010 00010',5:'11111 10000 10000 11110 00001 00001 11110',6:'01110 10000 10000 11110 10001 10001 01110',7:'11111 00001 00010 00100 01000 01000 01000',8:'01110 10001 10001 01110 10001 10001 01110',9:'01110 10001 10001 01111 00001 00001 01110',':':'00000 00100 00100 00000 00100 00100 00000','-':'00000 00000 00000 11111 00000 00000 00000','/':'00001 00010 00100 01000 10000 00000 00000','.':'00000 00000 00000 00000 00000 00110 00110',',':'00000 00000 00000 00000 00000 00110 00100','?':'01110 10001 00001 00010 00100 00000 00100','!':'00100 00100 00100 00100 00100 00000 00100','&':'01100 10010 10100 01000 10101 10010 01101','(':'00010 00100 01000 01000 01000 00100 00010',')':'01000 00100 00010 00010 00010 00100 01000',' ':'00000 00000 00000 00000 00000 00000 00000'};
for(const k in glyphs)glyphs[k]=glyphs[k].split(' ').map(r=>[...r].map(Number));
const textBoxes=[], missingGlyphs=[];
function text(s,x,y,scale=4,c=C.ink){const value=s.toUpperCase();textBoxes.push({text:value,x,y,w:value.length*6*scale,h:7*scale});for(const ch of value){if(glyphs[ch]===undefined)missingGlyphs.push(ch);let g=glyphs[ch]||glyphs['?'];for(let j=0;j<7;j++)for(let i=0;i<5;i++)if(g[j][i])rect(x+i*scale,y+j*scale,scale,scale,c);x+=6*scale;}}
function wrap(s,x,y,max,scale=3,leading=10,c=C.ink){let words=s.toUpperCase().split(' '),line='',yy=y;for(const w of words){if((line+' '+w).trim().length*6*scale>max&&line){text(line,x,yy,scale,c);yy+=leading;line=w;}else line=(line+' '+w).trim();}if(line)text(line,x,yy,scale,c);return yy+leading;}
function panel(y,title,summary,accent,icon){rect(32,y,960,112,C.white);rect(32,y,10,112,accent);text(title,58,y+14,4,accent);wrap(summary,58,y+48,820,3,26,C.ink);icon(900,y+56);}
function globe(x,y){rect(x-20,y-20,40,40,C.blue);line(x-20,y,x+20,y,C.paper,2);line(x,y-20,x,y+20,C.paper,2);}
function missiles(x,y){line(x-28,y+15,x+20,y-20,C.red,8);line(x-15,y+25,x+30,y-10,C.red,8);rect(x-34,y+18,8,8,C.gold);}
function court(x,y){rect(x-28,y-25,56,8,C.blue);rect(x-22,y-17,44,34,C.paper);for(let i=-18;i<=18;i+=12)rect(x+i,y-15,5,28,C.blue);line(x-35,y+18,x+35,y+18,C.blue,6);}
function chart(x,y){line(x-30,y+20,x-10,y,C.gold,5);line(x-10,y,x+5,y+10,C.red,5);line(x+5,y+10,x+28,y-22,C.red,5);}
function tower(x,y){rect(x-18,y-28,36,56,C.blue);rect(x-12,y-20,7,7,C.gold);rect(x+5,y-20,7,7,C.gold);rect(x-12,y-5,7,7,C.gold);rect(x+5,y-5,7,7,C.gold);}
function drone(x,y){line(x-25,y,x+25,y,C.green,5);line(x,y-12,x,y+12,C.green,5);rect(x-8,y-5,16,10,C.green);}
function shield(x,y){line(x-22,y-20,x+22,y-20,C.green,6);line(x-22,y-20,x-15,y+18,C.green,6);line(x+22,y-20,x+15,y+18,C.green,6);line(x-15,y+18,x,y+29,C.green,6);line(x+15,y+18,x,y+29,C.green,6);}
rect(0,0,W,92,C.ink);text('THE DAILY CHRONICLE',32,18,7,C.paper);text('FRIDAY, 20 NOVEMBER 2026',692,68,2,C.gold);text('WORLD NEWS IN ONE IMAGE',32,108,3,C.muted);line(32,132,992,132,C.gold,4);
panel(150,'SHENZHEN SUMMIT','Trump, Xi and Putin signed a peace declaration at their first trilateral summit.',C.blue,globe);
panel(274,'RUSSIA STRIKES UKRAINE','A six hour attack killed at least five. Kyiv bridges and power systems were damaged.',C.red,missiles);
panel(398,'WORLD COURT: GENOCIDE RULING','The ICJ ruled 9-6 that Myanmar committed genocide against Rohingya in Rakhine State.',C.blue,court);
panel(522,'ANTHROPIC LISTS, MARKETS FALL','Anthropic closed 17 PCT above offer. S&P 500 fell 2 PCT. Nikkei dropped 4.8 PCT.',C.gold,chart);
panel(646,'HOUTHI STRIKES ON RIYADH','Houthi missiles hit Riyadh, damaging the Public Investment Fund tower.',C.red,tower);
panel(770,'UK DRONES FOR UKRAINE','The UK pledged over 1,000 drones in a GBP 260 million package announced in Berlin.',C.green,drone);
panel(894,'KENYA BEATS EBOLA','Kenya discharged its last Ebola patient, 37 days after its first case.',C.green,shield);
if(process.env.CHECK_LAYOUT==='1'){
  let ok=true;const boxes=textBoxes;
  const title=boxes.find(b=>b.text==='THE DAILY CHRONICLE');
  const date=boxes.find(b=>b.text==='FRIDAY, 20 NOVEMBER 2026');
  for(const b of boxes){console.log(`BOX ${JSON.stringify(b)}`);if(b.x+b.w>W||b.y+b.h>H){console.log(`FAIL bounds: ${b.text}`);ok=false;}}
  if(missingGlyphs.length){console.log(`FAIL glyph coverage: ${JSON.stringify(missingGlyphs)}`);ok=false;}else console.log('PASS glyph coverage');
  if(date&&title&&date.x<title.x+title.w&&date.x+date.w>title.x&&date.y<title.y+title.h&&date.y+date.h>title.y){console.log('FAIL header date intersects title');ok=false;}else console.log('PASS header date does not intersect title');
  for(let p=0;p<7;p++){const body=boxes.filter(b=>b.y>=150+p*124+48&&b.y<150+p*124+112);if(body.length>2){console.log(`FAIL body has ${body.length} lines in panel ${p+1}`);ok=false;}for(let i=0;i<body.length;i++)for(let j=i+1;j<body.length;j++)if(body[i].y<body[j].y+body[j].h&&body[i].y+body[i].h>body[j].y){console.log(`FAIL body overlap panel ${p+1}: ${body[i].text} / ${body[j].text}`);ok=false;}}
  console.log(ok?'PASS layout checks':'FAIL layout checks');if(!ok)process.exitCode=1;
}
function crc32(buf){let c=~0;for(const b of buf){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (~c)>>>0;}
function chunk(type,data){let t=Buffer.from(type),d=Buffer.from(data),o=Buffer.alloc(12+d.length);o.writeUInt32BE(d.length,0);t.copy(o,4);d.copy(o,8);o.writeUInt32BE(crc32(Buffer.concat([t,d])),8+d.length);return o;}
const raw=Buffer.alloc(H*(1+W*3));for(let y=0;y<H;y++){raw[y*(1+W*3)]=0;Buffer.from(pixels.buffer,y*W*3,W*3).copy(raw,y*(1+W*3)+1);}
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Buffer.from([0,0,4,0,0,0,4,0,8,2,0,0,0])),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(new URL('./entry.png',import.meta.url),png); console.log(`wrote ${png.length} bytes`);
