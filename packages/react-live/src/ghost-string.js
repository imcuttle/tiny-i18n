
function hide(string, {chars = []} = {}) {
  for (let codePoint of string) {
    // UTF-16代码
    console.log(codePoint.codePointAt(0).toString(2))
  }
}

hide('hi\ud83d\udc0e\ud83d\udc71\u2764')

function show() {

}
