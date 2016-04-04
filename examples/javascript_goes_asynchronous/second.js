/**
 * Second Example: 
 * 使用Promise 进行实现
 */


function fetchJson(url){
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest
    xhr.open('get', url)
    xhr.onload = function(){
      if(xhr.status == 200){
        resolve(xhr.response)
      } else {
        reject('Unable to load data')
      }
    }

    xhr.onerror = function(){
      reject('Unable to load data')
    }
    xhr.send()
  })
}

var url = "https://api.github.com/users/jjvein"
fetchJson(url).then(function(data){
  data = JSON.parse(data)
  console.log(data.name)
})

.catch(function(e){console.log(e)})
