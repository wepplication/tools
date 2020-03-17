/*부트스트랩3 출력 사이즈 찾기*/
function findBootstrapEnvironment() {
	var envs = ['xs', 'sm', 'md', 'lg'];

	var $el = $('<div>');
	$el.appendTo($('body'));

	for (var i = envs.length - 1; i >= 0; i--) {
			var env = envs[i];

			$el.addClass('hidden-'+env);
			if ($el.is(':hidden')) {
					$el.remove();
					return env;
			}
	}
}

/* 반복이벤트 적당히 실행하기 */
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout (timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// 멀티 파일 DataURL 읽기
function readmultifiles(files, load, done) {
	var reader = new FileReader();  

	function readFile(index) {
			if( index >= files.length ){
				done();
				return;
			} 

			var file = files[index];
			reader.onload = function(e) { 
					var dataUrl = e.target.result; 
					load(dataUrl);
					readFile(index+1)
			}
			reader.readAsDataURL(file);
	}
	readFile(0);
}

// String에서 html tag 제거
// ex) var str = strip_tags('<strong>Kevin</strong> <b>van</b> <i>Zonneveld</i>', '<strong><b>');
function strip_tags (input, allowed) {
		allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
}

// url 체크
function isURL(str) {
	// var pattern = new RegExp("(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?");
	// return pattern.test(str);
	return /^(ftp|http|https|rtmp):\/\/[^ "]+$/.test(str);
}

function dataURItoBlob(dataURI){
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++)
	{
			ia[i] = byteString.charCodeAt(i);
	}

	var bb = new Blob([ab], { "type": mimeString });
	return bb;
}

// 문자열의 Byte 체크
function getByteLength(s,b,i,c){
		for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
		return b;
}

function ValidUrl(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // 프로토콜
	'((([a-z\d](([a-z\d-]*[a-z\d])|([ㄱ-힣]))*)\.)+[a-z]{2,}|'+ // 도메인명
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // 아이피
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // 포트번호
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // 쿼리스트링
	'(\\#[-a-z\\d_]*)?$','i'); // 해쉬테그들
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}
