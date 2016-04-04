/*
 *  First example:
 * Original XHR request.
 * 通过Public API 获取我的github信息
 * 代码测试： 将以上代码输入到Jsbin中测试。
 */
function fetchJson(url) {
  var xhr = new XMLHttpRequest()

  xhr.open('get', url)
  xhr.onload = function(){
    if(xhr.status == 200){
      //success
      //console.log(xhr.response)
      var data = JSON.parse(xhr.responseText)
      console.log(data.name)
    }
  }

  xhr.onerror = function(e){
    console.log('Error: ', e)
  }

  xhr.send()

}


var url = "https://api.github.com/users/jjvein"
fetchJson(url)
