//Theme Change
let span=document.getElementById('theme');
const body=document.body;


span.addEventListener('click',function(){
  
  if(body.classList.toggle('darkmode')){
    span.textContent='Light';
  }
   else{
    body.classList.toggle('lightmode');
     span.textContent='Dark'
   }
});


//main content

let search=document.getElementById('search');
let searchform=document.getElementById('search_form');
let searchresults=document.getElementById('search_result');

async function searchwikipedia(query){
  const encodedQuery=encodeURIComponent(query);
  const endpoint=`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const responce=await fetch(endpoint)
    
  
  if(!responce.ok){
    throw new Error('!not responce');
  }
  const json=await responce.json();
  return json;
}

function displayresult(results){
  searchresults.innerHTML='';

  results.forEach((result)=>{
    const url=`https://en.wikipedia.org/?curid=${result.pageid}`;
    const titlelink=`<a target='_blank' href="${url}" >${result.title}</a>`;
    const urllink=`<a href="${url}" class="result-link" target="_blank">${url}</a>`;

    const resultitem=document.createElement('div');
    resultitem.className=`result-item`;
     resultitem.innerHTML=`
     <h3>${titlelink}</h3>
     ${urllink}
     <p class='result-snippet'>${result.snippet}</p>
     `

     searchresults.appendChild(resultitem);
  });
}
searchform.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const query=search.value.trim();

  if(!query){
    searchresults.innerHTML=`<p>Please enter a input</p>`;
    return;
  }
  searchresults.innerHTML=`<p>Loading...</p>`;

  try{
    const results=await searchwikipedia(query);
    if(results.query.searchinfo.totalhits===0){
      searchresults.innerHTML=`<p>Result not found</p>`;

    } 
    else{
      displayresult(results.query.search)
    }
  
  }
  catch(err){

    console.error(err);
    searchresults.innerHTML=`<p>An error found<p/>`
  }
})