import{c as b,r as p,a as k,i as E,o as u,b as h,d as a,w as g,t as m,F as _,e as D,f as v,g as y,v as C,h as S,j as w,k as I}from"./vendor.ff726ffb.js";const R=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function l(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerpolicy&&(n.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?n.credentials="include":i.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=l(i);fetch(i.href,n)}};R();function x(){const r=b(()=>window.matchMedia("(prefers-color-scheme: dark)").matches),e=p("auto"),l=b({get:()=>e.value=="auto"?r:e.value,set:i=>{e.value=i,document.documentElement.setAttribute("data-theme",i?"dark":"light")}});return{isDark:l,onChangeMode:()=>{l.value=!l.value}}}const T=`SELECT 
                        ContentID, 
                        Title
                      FROM content 
                      WHERE ContentType = 6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
                      ORDER BY DateLastRead DESC`,A=`SELECT
                    IFNULL(Title,'') as 'Book Title', 
                    IFNULL(Subtitle,'') as 'Sub Title', 
                    IFNULL(Attribution,'') as 'Author', 
                    IFNULL(Publisher,'') as 'Publisher', 
                    IFNULL(ISBN,0) as 'ISBN', 
                    IFNULL(date(DateCreated),'') as 'Release Date',
                    IFNULL(Series,'') as 'Series', 
                    IFNULL(SeriesNumber,0) as 'SeriesNumber', 
                    IFNULL(AverageRating,0) as 'Rating', 
                    IFNULL(___PercentRead,0) as 'ReadPercent',
                    IFNULL(CASE WHEN ReadStatus>0 THEN datetime(DateLastRead) END,'') as 'Last Read',
                    IFNULL(___FileSize,0) as 'File Size',
                    IFNULL(CASE WHEN Accessibility=1 THEN 'Store' ELSE CASE WHEN Accessibility=-1 THEN 'Import' ELSE CASE WHEN Accessibility=6 THEN 'Preview' ELSE 'Other' END END END,'') as 'Source'
                  FROM content
                  WHERE ContentType=6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
                  ORDER BY Source desc, Title`,F=r=>`SELECT 
            '#' || row_number() over (partition by B.Title order by T.ContentID, T.ChapterProgress), 
            TRIM(REPLACE(REPLACE(T.Text,CHAR(10),''),CHAR(9),''))
          FROM content AS B, bookmark AS T
          WHERE B.ContentID = T.VolumeID AND T.Text != '' AND T.Hidden = 'false' AND B.ContentID = '${r}'
          ORDER BY T.ContentID, T.ChapterProgress;`;var H=(r,e)=>{for(const[l,t]of e)r[l]=t;return r};const U={setup(){const{isDark:r,onChangeMode:e}=x(),{dbData:l,fileName:t,exportBookListData:i,bookTitleList:n,importFile:o}=B(),{exportHighlightData:s,previewHighlight:c}=O(l),{exportBookList:d,exportHighlight:f}=j(i,s);return{isDark:r,onChangeMode:e,dbData:l,fileName:t,exportBookListData:i,bookTitleList:n,importFile:o,exportHighlightData:s,previewHighlight:c,exportBookList:d,exportHighlight:f}}};function B(){const r=p(),e=k({loading:!1,content:""}),l=p(),t=p("Drop your .sqlite file here");return{dbData:r,fileName:t,exportBookListData:e,bookTitleList:l,importFile:n=>{let o="";const s=new FileReader;o=n.target.files||n.dataTransfer.files,t.value=o[0].name,s.onload=function(){E().then(function(c){const d=new c.Database(new Uint8Array(s.result));r.value=d;const f=[];d.each(A,{},function(N){f.push(N)}),e.loading=!0,e.content=f;const L=d.exec(T);l.value=L[0].values})},s.readAsArrayBuffer(o[0])}}}function O(r){const e=k({loading:!1,title:"",content:""});return{exportHighlightData:e,previewHighlight:(t,i)=>{var o;const n=r.value.exec(F(t));e.loading=!0,e.title=i,e.content=(o=n[0])==null?void 0:o.values.join(`

`).split(",").join(`  
`)}}}function j(r,e){const l=n=>{const o=`bookList.${n}`;let s="";n==="json"?s=JSON.stringify(r.content):n==="md"?r.content.forEach((c,d)=>{d===0&&(s+=`| ${Object.keys(c).toString().split(",").join(" | ")} |
`,s+=`${Object.keys(c).map(()=>"| --- ").toString().split(",").join("")}|
`),s+=`| ${Object.values(c).toString().split(",").join(" | ")} |
`}):r.content.forEach((c,d)=>{s+=d===0?`"${Object.keys(c).join('","')}"
`:"",s+=`"${Object.values(c).join('","')}"
`}),i(o,s)},t=()=>{i(`${e.title}.md`,e.content)},i=(n,o)=>{const s=document.createElement("a");s.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(o)),s.setAttribute("download",n),s.style.display="none",document.body.appendChild(s),s.click(),document.body.removeChild(s)};return{exportBookList:l,exportHighlight:t}}const M={class:"container"},P={class:"switch-column"},W={class:"switch"},V=["checked"],K=a("span",{class:"slider"},null,-1),q=a("h1",{class:"title"},"Kobo Book Exporter",-1),Y={class:"file"},J=a("span",{class:"small"},"* Connect your kobo reader to a computer. You can find .kobo directory (hidden by default). There should be a KoboReader.sqlite file. Drop a file here.",-1),z={key:0,class:"content"},$={class:"content-left"},G={class:"download-booklist"},Q={class:"booklist"},X={class:"booklist-scroll"},Z=["onClick"],ee={class:"content-right"},te={class:"highlight-preview"},oe={key:0,class:"highlight-details"},ie={class:"highlight-title"},ne=S('<footer class="footer"> Created by <a href="https://github.com/mollykannn">Molly Kan</a> / Retrieved from <a href="http://www.vixual.net/blog/archives/117">Kobo Exporter: \u532F\u51FA Kobo \u96FB\u5B50\u66F8\u7684\u66F8\u7C4D\u6E05\u55AE\u8207\u8A3B\u8A18\u8CC7\u6599 (\u5283\u7DDA\u8207\u7B46\u8A18) | Vixual</a><br> Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></footer>',1);function se(r,e,l,t,i,n){return u(),h("div",M,[a("div",P,[a("label",W,[a("input",{type:"checkbox",onClick:e[0]||(e[0]=o=>t.onChangeMode()),checked:t.isDark},null,8,V),K])]),q,a("div",Y,[a("div",{class:"file-upload",onClick:e[1]||(e[1]=g(o=>r.$refs.fileInput.click(),["prevent"])),onDragover:e[2]||(e[2]=g(()=>{},["prevent"])),onDrop:e[3]||(e[3]=g((...o)=>t.importFile&&t.importFile(...o),["prevent"]))},m(t.fileName),33),a("input",{type:"file",ref:"fileInput",class:"hide",onChange:e[4]||(e[4]=(...o)=>t.importFile&&t.importFile(...o))},null,544),J]),t.exportBookListData.loading?(u(),h("div",z,[a("div",$,[a("div",G,[a("button",{onClick:e[5]||(e[5]=o=>t.exportBookList("json"))},"JSON file"),a("button",{onClick:e[6]||(e[6]=o=>t.exportBookList("md"))},"Markdown file"),a("button",{onClick:e[7]||(e[7]=o=>t.exportBookList("csv"))},"CSV file")]),a("div",Q,[a("div",X,[(u(!0),h(_,null,D(t.bookTitleList,o=>(u(),h("div",{key:o.index,class:"book-title",onClick:s=>t.previewHighlight(o[0],o[1])},m(o[1]),9,Z))),128))])])]),a("div",ee,[a("div",te,[t.exportHighlightData.loading?(u(),h("div",oe,[a("div",ie,m(t.exportHighlightData.title),1),t.exportHighlightData.content?(u(),h("button",{key:0,class:"highlight-export",onClick:e[8]||(e[8]=o=>t.exportHighlight())},"Export")):v("",!0)])):v("",!0),y(a("textarea",{class:"highlight-textarea","onUpdate:modelValue":e[9]||(e[9]=o=>t.exportHighlightData.content=o)},null,512),[[C,t.exportHighlightData.content]])])])])):v("",!0),ne])}var re=H(U,[["render",se]]);function ae(r={}){const{immediate:e=!1,onNeedRefresh:l,onOfflineReady:t,onRegistered:i,onRegisterError:n}=r;let o;const s=async(c=!0)=>{};return"serviceWorker"in navigator&&(o=new w("/kobo-book-exporter/sw.js",{scope:"/kobo-book-exporter/"}),o.addEventListener("activated",c=>{c.isUpdate?window.location.reload():t==null||t()}),o.register({immediate:e}).then(c=>{i==null||i(c)}).catch(c=>{n==null||n(c)})),s}const le=ae({onNeedRefresh(){},onOfflineReady(){}});le();I(re).mount("#app");
