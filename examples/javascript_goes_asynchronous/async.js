/**
 * Third Example:
 *  使用async 完成
 */
function getJsonPromise(url){
  return Promise.resolve(function(resolve, reject){
    var xhr = new XMLHttpRequest
    xhr.open('get', url)
    xhr.onload = function(){
      if(xhr.status === 200){
        resolve(xhr.response)    
      } else {
        reject('Unable to load Data') 
      }
    }

    xhr.onerror = function(e) {
      reject('Error: ', e)  
    }
  })
}

(async function(url){
  var data = await getJsonPromise(url)
  console.log(data.name)

})("https://api.github.com/users/jjvein")

