console.log('renderer.js')
const print =  document.getElementsByClassName('print')[0]
print.addEventListener('click',(e)=>{
    window.ipcRenderer.send('viewpdf',{
        type:'create',
        htmlString:`hello`
    })
})