(function() {
	'use strict';
	var $;
	var UploadImage = function(params) {
		if (!(this instanceof UploadImage)) return new UploadImage(params);
		var defaults = {
			onInit: function() {},
			onStart: function() {},
			onStop: function() {},
			onChanged: function() {},
			onLoad: function() {}
		};
		var s = this;
		for (var def in defaults) {
			if (typeof params[def] === 'undefined') {
				s[def] = defaults[def];
			} else {
				s[def] = params[def];
			}
		};
		//Dom Library and plugins
		if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined') {
			$ = Dom7;
		}
		if (typeof $ === 'undefined') {
			if (typeof Dom7 === 'undefined') {
				$ = window.Dom7 || window.Zepto || window.jQuery;
			} else {
				$ = Dom7;
			}
			if (!$) return;
		};
		s.$ = $;
		// Export it to Swiper instance
		var init = function() {
			// 鍒涘缓input鏍囩
			$("body").append('<input id="uploadInput" style="opacity:0;position:absolute;left:0%;top:0%;width:100%;height:60%;z-index:999" type="file" accept="image/*" />');
			s.uploadEle = $("#uploadInput");
			s.onInit();
		};
		var start = function() {
			s.uploadEle.unbind("change");
			s.uploadEle.one("change", changed);
			s.uploadEle.trigger("click");

			s.onStart();
		}
		var changed = function(evt) {
			if (this.files.length <= 0) {
				stop();
				return preventEventPropagation(evt);
			}
			var file = this.files[0];
			var reader = new FileReader();
			reader.onload = function() {
				// 杞崲浜岃繘鍒舵暟鎹�
				var binary = this.result;
				var binaryData = new BinaryFile(binary);
				// 鑾峰彇exif淇℃伅
				var imgExif = EXIF.readFromBinaryFile(binaryData);
				// alert(imgExif.Orientation);
				var fullScreenImg = new Image();
				fullScreenImg.onload = function() {
					loaded(this);
				}
				var mpImg = new MegaPixImage(file);
				mpImg.render(fullScreenImg, {
					maxWidth: 960,
					maxHeight: 960,
					orientation: imgExif.Orientation
				});
			}
			reader.readAsBinaryString(file);
			return preventEventPropagation(evt);
			s.onChanged();
		}
		var stop = function() {
			s.uploadEle.unbind("change");
			s.onStop();
		}
		var loaded = function(img) {
			s.onLoad(img);
			return false;
		}
		//
		init();
		//
		s.start = start;
	}
	function preventEventPropagation(evt) {
		var e = evt || window.event;
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		return false;
	}
	window.UploadImage = UploadImage;
})();

//      var uploadImage = new UploadImage({
//          onInit: function() {
//              console.log("init")
//          },
//          onLoad: function(self) {
//              // $("#upload_img").attr("src", self.src);
//              Base2Img(self.src, function(uploadImgSrc) {
//                  $("#img")[0].src = "https://wb.jaas.ac.cn/PaiZhao.P.0118/UpLoad/" + uploadImgSrc + ".png";
//              });
//          }
//      });
//      uploadImage.start();
