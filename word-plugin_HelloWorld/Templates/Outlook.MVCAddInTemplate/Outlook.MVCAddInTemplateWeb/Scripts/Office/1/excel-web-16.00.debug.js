/* Excel web application specific API library */
/* Version: 16.0.7114.1000 */
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

/*
* @overview es6-promise - a tiny implementation of Promises/A+.
* @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
* @license   Licensed under MIT license
*            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
* @version   2.3.0
*/

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var OfficeExt;
(function (OfficeExt) {
	var MicrosoftAjaxFactory=(function () {
		function MicrosoftAjaxFactory() {
		}
		MicrosoftAjaxFactory.prototype.isMsAjaxLoaded=function () {
			if (typeof (Sys) !=='undefined' && typeof (Type) !=='undefined' &&
				Sys.StringBuilder && typeof (Sys.StringBuilder)==="function" &&
				Type.registerNamespace && typeof (Type.registerNamespace)==="function" &&
				Type.registerClass && typeof (Type.registerClass)==="function" &&
				typeof (Function._validateParams)==="function" &&
				Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof (Sys.Serialization.JavaScriptSerializer.serialize)==="function") {
				return true;
			}
			else {
				return false;
			}
		};
		MicrosoftAjaxFactory.prototype.loadMsAjaxFull=function (callback) {
			var msAjaxCDNPath=(window.location.protocol.toLowerCase()==='https:' ? 'https:' : 'http:')+'//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js';
			OSF.OUtil.loadScript(msAjaxCDNPath, callback);
		};
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxError", {
			get: function () {
				if (this._msAjaxError==null && this.isMsAjaxLoaded()) {
					this._msAjaxError=Error;
				}
				return this._msAjaxError;
			},
			set: function (errorClass) {
				this._msAjaxError=errorClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxSerializer", {
			get: function () {
				if (this._msAjaxSerializer==null && this.isMsAjaxLoaded()) {
					this._msAjaxSerializer=Sys.Serialization.JavaScriptSerializer;
				}
				return this._msAjaxSerializer;
			},
			set: function (serializerClass) {
				this._msAjaxSerializer=serializerClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxString", {
			get: function () {
				if (this._msAjaxString==null && this.isMsAjaxLoaded()) {
					this._msAjaxSerializer=String;
				}
				return this._msAjaxString;
			},
			set: function (stringClass) {
				this._msAjaxString=stringClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxDebug", {
			get: function () {
				if (this._msAjaxDebug==null && this.isMsAjaxLoaded()) {
					this._msAjaxDebug=Sys.Debug;
				}
				return this._msAjaxDebug;
			},
			set: function (debugClass) {
				this._msAjaxDebug=debugClass;
			},
			enumerable: true,
			configurable: true
		});
		return MicrosoftAjaxFactory;
	})();
	OfficeExt.MicrosoftAjaxFactory=MicrosoftAjaxFactory;
})(OfficeExt || (OfficeExt={}));
var OsfMsAjaxFactory=new OfficeExt.MicrosoftAjaxFactory();
var OSF=OSF || {};
var OfficeExt;
(function (OfficeExt) {
	var SafeStorage=(function () {
		function SafeStorage(_internalStorage) {
			this._internalStorage=_internalStorage;
		}
		SafeStorage.prototype.getItem=function (key) {
			try {
				return this._internalStorage && this._internalStorage.getItem(key);
			}
			catch (e) {
				return null;
			}
		};
		SafeStorage.prototype.setItem=function (key, data) {
			try {
				this._internalStorage && this._internalStorage.setItem(key, data);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.clear=function () {
			try {
				this._internalStorage && this._internalStorage.clear();
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.removeItem=function (key) {
			try {
				this._internalStorage && this._internalStorage.removeItem(key);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.getKeysWithPrefix=function (keyPrefix) {
			var keyList=[];
			try {
				var len=this._internalStorage && this._internalStorage.length || 0;
				for (var i=0; i < len; i++) {
					var key=this._internalStorage.key(i);
					if (key.indexOf(keyPrefix)===0) {
						keyList.push(key);
					}
				}
			}
			catch (e) {
			}
			return keyList;
		};
		return SafeStorage;
	})();
	OfficeExt.SafeStorage=SafeStorage;
})(OfficeExt || (OfficeExt={}));
OSF.XdmFieldName={
	ConversationUrl: "ConversationUrl",
	AppId: "AppId"
};
OSF.OUtil=(function () {
	var _uniqueId=-1;
	var _xdmInfoKey='&_xdm_Info=';
	var _serializerVersionKey='&_serializer_version=';
	var _xdmSessionKeyPrefix='_xdm_';
	var _serializerVersionKeyPrefix='_serializer_version=';
	var _fragmentSeparator='#';
	var _fragmentInfoDelimiter='&';
	var _classN="class";
	var _loadedScripts={};
	var _defaultScriptLoadingTimeout=30000;
	var _safeSessionStorage=null;
	var _safeLocalStorage=null;
	var _rndentropy=new Date().getTime();
	function _random() {
		var nextrand=0x7fffffff * (Math.random());
		nextrand ^=_rndentropy ^ ((new Date().getMilliseconds()) << Math.floor(Math.random() * (31 - 10)));
		return nextrand.toString(16);
	}
	;
	function _getSessionStorage() {
		if (!_safeSessionStorage) {
			try {
				var sessionStorage=window.sessionStorage;
			}
			catch (ex) {
				sessionStorage=null;
			}
			_safeSessionStorage=new OfficeExt.SafeStorage(sessionStorage);
		}
		return _safeSessionStorage;
	}
	;
	function _reOrderTabbableElements(elements) {
		var bucket0=[];
		var bucketPositive=[];
		var i;
		var len=elements.length;
		var ele;
		for (i=0; i < len; i++) {
			ele=elements[i];
			if (ele.tabIndex) {
				if (ele.tabIndex > 0) {
					bucketPositive.push(ele);
				}
				else if (ele.tabIndex===0) {
					bucket0.push(ele);
				}
			}
			else {
				bucket0.push(ele);
			}
		}
		bucketPositive=bucketPositive.sort(function (left, right) {
			var diff=left.tabIndex - right.tabIndex;
			if (diff===0) {
				diff=bucketPositive.indexOf(left) - bucketPositive.indexOf(right);
			}
			return diff;
		});
		return [].concat(bucketPositive, bucket0);
	}
	;
	return {
		set_entropy: function OSF_OUtil$set_entropy(entropy) {
			if (typeof entropy=="string") {
				for (var i=0; i < entropy.length; i+=4) {
					var temp=0;
					for (var j=0; j < 4 && i+j < entropy.length; j++) {
						temp=(temp << 8)+entropy.charCodeAt(i+j);
					}
					_rndentropy ^=temp;
				}
			}
			else if (typeof entropy=="number") {
				_rndentropy ^=entropy;
			}
			else {
				_rndentropy ^=0x7fffffff * Math.random();
			}
			_rndentropy &=0x7fffffff;
		},
		extend: function OSF_OUtil$extend(child, parent) {
			var F=function () { };
			F.prototype=parent.prototype;
			child.prototype=new F();
			child.prototype.constructor=child;
			child.uber=parent.prototype;
			if (parent.prototype.constructor===Object.prototype.constructor) {
				parent.prototype.constructor=parent;
			}
		},
		setNamespace: function OSF_OUtil$setNamespace(name, parent) {
			if (parent && name && !parent[name]) {
				parent[name]={};
			}
		},
		unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent) {
			if (parent && name && parent[name]) {
				delete parent[name];
			}
		},
		loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs) {
			if (url && callback) {
				var doc=window.document;
				var _loadedScriptEntry=_loadedScripts[url];
				if (!_loadedScriptEntry) {
					var script=doc.createElement("script");
					script.type="text/javascript";
					_loadedScriptEntry={ loaded: false, pendingCallbacks: [callback], timer: null };
					_loadedScripts[url]=_loadedScriptEntry;
					var onLoadCallback=function OSF_OUtil_loadScript$onLoadCallback() {
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						_loadedScriptEntry.loaded=true;
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					var onLoadError=function OSF_OUtil_loadScript$onLoadError() {
						delete _loadedScripts[url];
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					if (script.readyState) {
						script.onreadystatechange=function () {
							if (script.readyState=="loaded" || script.readyState=="complete") {
								script.onreadystatechange=null;
								onLoadCallback();
							}
						};
					}
					else {
						script.onload=onLoadCallback;
					}
					script.onerror=onLoadError;
					timeoutInMs=timeoutInMs || _defaultScriptLoadingTimeout;
					_loadedScriptEntry.timer=setTimeout(onLoadError, timeoutInMs);
					script.src=url;
					doc.getElementsByTagName("head")[0].appendChild(script);
				}
				else if (_loadedScriptEntry.loaded) {
					callback();
				}
				else {
					_loadedScriptEntry.pendingCallbacks.push(callback);
				}
			}
		},
		loadCSS: function OSF_OUtil$loadCSS(url) {
			if (url) {
				var doc=window.document;
				var link=doc.createElement("link");
				link.type="text/css";
				link.rel="stylesheet";
				link.href=url;
				doc.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		parseEnum: function OSF_OUtil$parseEnum(str, enumObject) {
			var parsed=enumObject[str.trim()];
			if (typeof (parsed)=='undefined') {
				OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:"+str);
				throw OsfMsAjaxFactory.msAjaxError.argument("str");
			}
			return parsed;
		},
		delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache() {
			var obj={ calc: arguments[0] };
			return function () {
				if (obj.calc) {
					obj.val=obj.calc.apply(this, arguments);
					delete obj.calc;
				}
				return obj.val;
			};
		},
		getUniqueId: function OSF_OUtil$getUniqueId() {
			_uniqueId=_uniqueId+1;
			return _uniqueId.toString();
		},
		formatString: function OSF_OUtil$formatString() {
			var args=arguments;
			var source=args[0];
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10)+1;
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		},
		generateConversationId: function OSF_OUtil$generateConversationId() {
			return [_random(), _random(), (new Date()).getTime().toString()].join('_');
		},
		getFrameNameAndConversationId: function OSF_OUtil$getFrameNameAndConversationId(cacheKey, frame) {
			var frameName=_xdmSessionKeyPrefix+cacheKey+this.generateConversationId();
			frame.setAttribute("name", frameName);
			return this.generateConversationId();
		},
		addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue) {
			return OSF.OUtil.addInfoAsHash(url, _xdmInfoKey, xdmInfoValue, false);
		},
		addSerializerVersionAsHash: function OSF_OUtil$addSerializerVersionAsHash(url, serializerVersion) {
			return OSF.OUtil.addInfoAsHash(url, _serializerVersionKey, serializerVersion, true);
		},
		addInfoAsHash: function OSF_OUtil$addInfoAsHash(url, keyName, infoValue, encodeInfo) {
			url=url.trim() || '';
			var urlParts=url.split(_fragmentSeparator);
			var urlWithoutFragment=urlParts.shift();
			var fragment=urlParts.join(_fragmentSeparator);
			var newFragment;
			if (encodeInfo) {
				newFragment=[keyName, encodeURIComponent(infoValue), fragment].join('');
			}
			else {
				newFragment=[fragment, keyName, infoValue].join('');
			}
			return [urlWithoutFragment, _fragmentSeparator, newFragment].join('');
		},
		parseXdmInfo: function OSF_OUtil$parseXdmInfo(skipSessionStorage) {
			return OSF.OUtil.parseXdmInfoWithGivenFragment(skipSessionStorage, window.location.hash);
		},
		parseXdmInfoWithGivenFragment: function OSF_OUtil$parseXdmInfoWithGivenFragment(skipSessionStorage, fragment) {
			return OSF.OUtil.parseInfoWithGivenFragment(_xdmInfoKey, _xdmSessionKeyPrefix, false, skipSessionStorage, fragment);
		},
		parseSerializerVersion: function OSF_OUtil$parseSerializerVersion(skipSessionStorage) {
			return OSF.OUtil.parseSerializerVersionWithGivenFragment(skipSessionStorage, window.location.hash);
		},
		parseSerializerVersionWithGivenFragment: function OSF_OUtil$parseSerializerVersionWithGivenFragment(skipSessionStorage, fragment) {
			return parseInt(OSF.OUtil.parseInfoWithGivenFragment(_serializerVersionKey, _serializerVersionKeyPrefix, true, skipSessionStorage, fragment));
		},
		parseInfoWithGivenFragment: function OSF_OUtil$parseInfoWithGivenFragment(infoKey, infoKeyPrefix, decodeInfo, skipSessionStorage, fragment) {
			var fragmentParts=fragment.split(infoKey);
			var infoValue=fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
			if (decodeInfo && infoValue !=null) {
				if (infoValue.indexOf(_fragmentInfoDelimiter) >=0) {
					infoValue=infoValue.split(_fragmentInfoDelimiter)[0];
				}
				infoValue=decodeURIComponent(infoValue);
			}
			var osfSessionStorage=_getSessionStorage();
			if (!skipSessionStorage && osfSessionStorage) {
				var sessionKeyStart=window.name.indexOf(infoKeyPrefix);
				if (sessionKeyStart > -1) {
					var sessionKeyEnd=window.name.indexOf(";", sessionKeyStart);
					if (sessionKeyEnd==-1) {
						sessionKeyEnd=window.name.length;
					}
					var sessionKey=window.name.substring(sessionKeyStart, sessionKeyEnd);
					if (infoValue) {
						osfSessionStorage.setItem(sessionKey, infoValue);
					}
					else {
						infoValue=osfSessionStorage.getItem(sessionKey);
					}
				}
			}
			return infoValue;
		},
		getConversationId: function OSF_OUtil$getConversationId() {
			var searchString=window.location.search;
			var conversationId=null;
			if (searchString) {
				var index=searchString.indexOf("&");
				conversationId=index > 0 ? searchString.substring(1, index) : searchString.substr(1);
				if (conversationId && conversationId.charAt(conversationId.length - 1)==='=') {
					conversationId=conversationId.substring(0, conversationId.length - 1);
					if (conversationId) {
						conversationId=decodeURIComponent(conversationId);
					}
				}
			}
			return conversationId;
		},
		getInfoItems: function OSF_OUtil$getInfoItems(strInfo) {
			var items=strInfo.split("$");
			if (typeof items[1]=="undefined") {
				items=strInfo.split("|");
			}
			return items;
		},
		getXdmFieldValue: function OSF_OUtil$getXdmFieldValue(xdmFieldName, skipSessionStorage) {
			var fieldValue='';
			var xdmInfoValue=OSF.OUtil.parseXdmInfo(skipSessionStorage);
			if (xdmInfoValue) {
				var items=OSF.OUtil.getInfoItems(xdmInfoValue);
				if (items !=undefined && items.length >=3) {
					switch (xdmFieldName) {
						case OSF.XdmFieldName.ConversationUrl:
							fieldValue=items[2];
						case OSF.XdmFieldName.AppId:
							fieldValue=items[1];
					}
				}
			}
			return fieldValue;
		},
		validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback) {
			var e=Function._validateParams(arguments, [{ name: "params", type: Object, mayBeNull: false },
				{ name: "expectedProperties", type: Object, mayBeNull: false },
				{ name: "callback", type: Function, mayBeNull: true }
			]);
			if (e)
				throw e;
			for (var p in expectedProperties) {
				e=Function._validateParameter(params[p], expectedProperties[p], p);
				if (e)
					throw e;
			}
		},
		writeProfilerMark: function OSF_OUtil$writeProfilerMark(text) {
			if (window.msWriteProfilerMark) {
				window.msWriteProfilerMark(text);
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		outputDebug: function OSF_OUtil$outputDebug(text) {
			if (typeof (OsfMsAjaxFactory) !=='undefined' && OsfMsAjaxFactory.msAjaxDebug && OsfMsAjaxFactory.msAjaxDebug.trace) {
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes) {
			descriptor=descriptor || {};
			for (var nd in attributes) {
				var attribute=attributes[nd];
				if (descriptor[attribute]==undefined) {
					descriptor[attribute]=true;
				}
			}
			Object.defineProperty(obj, prop, descriptor);
			return obj;
		},
		defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes) {
			descriptors=descriptors || {};
			for (var prop in descriptors) {
				OSF.OUtil.defineNondefaultProperty(obj, prop, descriptors[prop], attributes);
			}
			return obj;
		},
		defineEnumerableProperty: function OSF_OUtil$defineEnumerableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["enumerable"]);
		},
		defineEnumerableProperties: function OSF_OUtil$defineEnumerableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["enumerable"]);
		},
		defineMutableProperty: function OSF_OUtil$defineMutableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["writable", "enumerable", "configurable"]);
		},
		defineMutableProperties: function OSF_OUtil$defineMutableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["writable", "enumerable", "configurable"]);
		},
		finalizeProperties: function OSF_OUtil$finalizeProperties(obj, descriptor) {
			descriptor=descriptor || {};
			var props=Object.getOwnPropertyNames(obj);
			var propsLength=props.length;
			for (var i=0; i < propsLength; i++) {
				var prop=props[i];
				var desc=Object.getOwnPropertyDescriptor(obj, prop);
				if (!desc.get && !desc.set) {
					desc.writable=descriptor.writable || false;
				}
				desc.configurable=descriptor.configurable || false;
				desc.enumerable=descriptor.enumerable || true;
				Object.defineProperty(obj, prop, desc);
			}
			return obj;
		},
		mapList: function OSF_OUtil$MapList(list, mapFunction) {
			var ret=[];
			if (list) {
				for (var item in list) {
					ret.push(mapFunction(list[item]));
				}
			}
			return ret;
		},
		listContainsKey: function OSF_OUtil$listContainsKey(list, key) {
			for (var item in list) {
				if (key==item) {
					return true;
				}
			}
			return false;
		},
		listContainsValue: function OSF_OUtil$listContainsElement(list, value) {
			for (var item in list) {
				if (value==list[item]) {
					return true;
				}
			}
			return false;
		},
		augmentList: function OSF_OUtil$augmentList(list, addenda) {
			var add=list.push ? function (key, value) { list.push(value); } : function (key, value) { list[key]=value; };
			for (var key in addenda) {
				add(key, addenda[key]);
			}
		},
		redefineList: function OSF_Outil$redefineList(oldList, newList) {
			for (var key1 in oldList) {
				delete oldList[key1];
			}
			for (var key2 in newList) {
				oldList[key2]=newList[key2];
			}
		},
		isArray: function OSF_OUtil$isArray(obj) {
			return Object.prototype.toString.apply(obj)==="[object Array]";
		},
		isFunction: function OSF_OUtil$isFunction(obj) {
			return Object.prototype.toString.apply(obj)==="[object Function]";
		},
		isDate: function OSF_OUtil$isDate(obj) {
			return Object.prototype.toString.apply(obj)==="[object Date]";
		},
		addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener) {
			if (element.addEventListener) {
				element.addEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.attachEvent) {
				element.attachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=listener;
			}
		},
		removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener) {
			if (element.removeEventListener) {
				element.removeEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.detachEvent) {
				element.detachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=null;
			}
		},
		getCookieValue: function OSF_OUtil$getCookieValue(cookieName) {
			var tmpCookieString=RegExp(cookieName+"[^;]+").exec(document.cookie);
			return tmpCookieString.toString().replace(/^[^=]+./, "");
		},
		xhrGet: function OSF_OUtil$xhrGet(url, onSuccess, onError) {
			var xmlhttp;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp.responseText);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		xhrGetFull: function OSF_OUtil$xhrGetFull(url, oneDriveFileName, onSuccess, onError) {
			var xmlhttp;
			var requestedFileName=oneDriveFileName;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp, requestedFileName);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		encodeBase64: function OSF_Outil$encodeBase64(input) {
			if (!input)
				return input;
			var codex="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/=";
			var output=[];
			var temp=[];
			var index=0;
			var c1, c2, c3, a, b, c;
			var i;
			var length=input.length;
			do {
				c1=input.charCodeAt(index++);
				c2=input.charCodeAt(index++);
				c3=input.charCodeAt(index++);
				i=0;
				a=c1 & 255;
				b=c1 >> 8;
				c=c2 & 255;
				temp[i++]=a >> 2;
				temp[i++]=((a & 3) << 4) | (b >> 4);
				temp[i++]=((b & 15) << 2) | (c >> 6);
				temp[i++]=c & 63;
				if (!isNaN(c2)) {
					a=c2 >> 8;
					b=c3 & 255;
					c=c3 >> 8;
					temp[i++]=a >> 2;
					temp[i++]=((a & 3) << 4) | (b >> 4);
					temp[i++]=((b & 15) << 2) | (c >> 6);
					temp[i++]=c & 63;
				}
				if (isNaN(c2)) {
					temp[i - 1]=64;
				}
				else if (isNaN(c3)) {
					temp[i - 2]=64;
					temp[i - 1]=64;
				}
				for (var t=0; t < i; t++) {
					output.push(codex.charAt(temp[t]));
				}
			} while (index < length);
			return output.join("");
		},
		getSessionStorage: function OSF_Outil$getSessionStorage() {
			return _getSessionStorage();
		},
		getLocalStorage: function OSF_Outil$getLocalStorage() {
			if (!_safeLocalStorage) {
				try {
					var localStorage=window.localStorage;
				}
				catch (ex) {
					localStorage=null;
				}
				_safeLocalStorage=new OfficeExt.SafeStorage(localStorage);
			}
			return _safeLocalStorage;
		},
		convertIntToCssHexColor: function OSF_Outil$convertIntToCssHexColor(val) {
			var hex="#"+(Number(val)+0x1000000).toString(16).slice(-6);
			return hex;
		},
		attachClickHandler: function OSF_Outil$attachClickHandler(element, handler) {
			element.onclick=function (e) {
				handler();
			};
			element.ontouchend=function (e) {
				handler();
				e.preventDefault();
			};
		},
		getQueryStringParamValue: function OSF_Outil$getQueryStringParamValue(queryString, paramName) {
			var e=Function._validateParams(arguments, [{ name: "queryString", type: String, mayBeNull: false },
				{ name: "paramName", type: String, mayBeNull: false }
			]);
			if (e) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: Parameters cannot be null.");
				return "";
			}
			var queryExp=new RegExp("[\\?&]"+paramName+"=([^&#]*)", "i");
			if (!queryExp.test(queryString)) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: The parameter is not found.");
				return "";
			}
			return queryExp.exec(queryString)[1];
		},
		isiOS: function OSF_Outil$isiOS() {
			return (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
		},
		isChrome: function OSF_Outil$isChrome() {
			return (window.navigator.userAgent.indexOf("Chrome") > 0) && !OSF.OUtil.isEdge();
		},
		isEdge: function OSF_Outil$isEdge() {
			return window.navigator.userAgent.indexOf("Edge") > 0;
		},
		isIE: function OSF_Outil$isIE() {
			return window.navigator.userAgent.indexOf("Trident") > 0;
		},
		isFirefox: function OSF_Outil$isFirefox() {
			return window.navigator.userAgent.indexOf("Firefox") > 0;
		},
		shallowCopy: function OSF_Outil$shallowCopy(sourceObj) {
			var copyObj=sourceObj.constructor();
			for (var property in sourceObj) {
				if (sourceObj.hasOwnProperty(property)) {
					copyObj[property]=sourceObj[property];
				}
			}
			return copyObj;
		},
		createObject: function OSF_Outil$createObject(properties) {
			var obj=null;
			if (properties) {
				obj={};
				var len=properties.length;
				for (var i=0; i < len; i++) {
					obj[properties[i].name]=properties[i].value;
				}
			}
			return obj;
		},
		addClass: function OSF_OUtil$addClass(elmt, val) {
			if (!OSF.OUtil.hasClass(elmt, val)) {
				var className=elmt.getAttribute(_classN);
				if (className) {
					elmt.setAttribute(_classN, className+" "+val);
				}
				else {
					elmt.setAttribute(_classN, val);
				}
			}
		},
		hasClass: function OSF_OUtil$hasClass(elmt, clsName) {
			var className=elmt.getAttribute(_classN);
			return className && className.match(new RegExp('(\\s|^)'+clsName+'(\\s|$)'));
		},
		focusToFirstTabbable: function OSF_OUtil$focusToFirstTabbable(all, backward) {
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findNextPos=function (allLen, currPos, backward) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && backward) {
					return -1;
				}
				else if (currPos===allLen - 1 && !backward) {
					return -1;
				}
				if (backward) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			next=backward ? all.length - 1 : 0;
			if (all.length===0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				window.focus();
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, backward);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		},
		focusToNextTabbable: function OSF_OUtil$focusToNextTabbable(all, curr, shift) {
			var currPos;
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findCurrPos=function (all, curr) {
				var i=0;
				for (; i < all.length; i++) {
					if (all[i]===curr) {
						return i;
					}
				}
				return -1;
			};
			var findNextPos=function (allLen, currPos, shift) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && shift) {
					return -1;
				}
				else if (currPos===allLen - 1 && !shift) {
					return -1;
				}
				if (shift) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			currPos=findCurrPos(all, curr);
			next=findNextPos(all.length, currPos, shift);
			if (next < 0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, shift);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		}
	};
})();
OSF.OUtil.Guid=(function () {
	var hexCode=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	return {
		generateNewGuid: function OSF_Outil_Guid$generateNewGuid() {
			var result="";
			var tick=(new Date()).getTime();
			var index=0;
			for (; index < 32 && tick > 0; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[tick % 16];
				tick=Math.floor(tick / 16);
			}
			for (; index < 32; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[Math.floor(Math.random() * 16)];
			}
			return result;
		}
	};
})();
window.OSF=OSF;
OSF.OUtil.setNamespace("OSF", window);
OSF.AppName={
	Unsupported: 0,
	Excel: 1,
	Word: 2,
	PowerPoint: 4,
	Outlook: 8,
	ExcelWebApp: 16,
	WordWebApp: 32,
	OutlookWebApp: 64,
	Project: 128,
	AccessWebApp: 256,
	PowerpointWebApp: 512,
	ExcelIOS: 1024,
	Sway: 2048,
	WordIOS: 4096,
	PowerPointIOS: 8192,
	Access: 16384,
	Lync: 32768,
	OutlookIOS: 65536,
	OneNoteWebApp: 131072,
	OneNote: 262144,
	ExcelWinRT: 524288,
	WordWinRT: 1048576,
	PowerpointWinRT: 2097152,
	OutlookAndroid: 4194304,
	OneNoteWinRT: 8388608
};
OSF.InternalPerfMarker={
	DataCoercionBegin: "Agave.HostCall.CoerceDataStart",
	DataCoercionEnd: "Agave.HostCall.CoerceDataEnd"
};
OSF.HostCallPerfMarker={
	IssueCall: "Agave.HostCall.IssueCall",
	ReceiveResponse: "Agave.HostCall.ReceiveResponse",
	RuntimeExceptionRaised: "Agave.HostCall.RuntimeExecptionRaised"
};
OSF.AgaveHostAction={
	"Select": 0,
	"UnSelect": 1,
	"CancelDialog": 2,
	"InsertAgave": 3,
	"CtrlF6In": 4,
	"CtrlF6Exit": 5,
	"CtrlF6ExitShift": 6,
	"SelectWithError": 7,
	"NotifyHostError": 8,
	"RefreshAddinCommands": 9,
	"PageIsReady": 10,
	"TabIn": 11,
	"TabInShift": 12,
	"TabExit": 13,
	"TabExitShift": 14,
	"EscExit": 15,
	"F2Exit": 16,
	"ExitNoFocusable": 17,
	"ExitNoFocusableShift": 18
};
OSF.SharedConstants={
	"NotificationConversationIdSuffix": '_ntf'
};
OSF.DialogMessageType={
	DialogMessageReceived: 0,
	DialogClosed: 1,
	NavigationFailed: 2,
	InvalidSchema: 3
};
OSF.OfficeAppContext=function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix, hostCustomMessage) {
	this._id=id;
	this._appName=appName;
	this._appVersion=appVersion;
	this._appUILocale=appUILocale;
	this._dataLocale=dataLocale;
	this._docUrl=docUrl;
	this._clientMode=clientMode;
	this._settings=settings;
	this._reason=reason;
	this._osfControlType=osfControlType;
	this._eToken=eToken;
	this._correlationId=correlationId;
	this._appInstanceId=appInstanceId;
	this._touchEnabled=touchEnabled;
	this._commerceAllowed=commerceAllowed;
	this._appMinorVersion=appMinorVersion;
	this._requirementMatrix=requirementMatrix;
	this._hostCustomMessage=hostCustomMessage;
	this._isDialog=false;
	this.get_id=function get_id() { return this._id; };
	this.get_appName=function get_appName() { return this._appName; };
	this.get_appVersion=function get_appVersion() { return this._appVersion; };
	this.get_appUILocale=function get_appUILocale() { return this._appUILocale; };
	this.get_dataLocale=function get_dataLocale() { return this._dataLocale; };
	this.get_docUrl=function get_docUrl() { return this._docUrl; };
	this.get_clientMode=function get_clientMode() { return this._clientMode; };
	this.get_bindings=function get_bindings() { return this._bindings; };
	this.get_settings=function get_settings() { return this._settings; };
	this.get_reason=function get_reason() { return this._reason; };
	this.get_osfControlType=function get_osfControlType() { return this._osfControlType; };
	this.get_eToken=function get_eToken() { return this._eToken; };
	this.get_correlationId=function get_correlationId() { return this._correlationId; };
	this.get_appInstanceId=function get_appInstanceId() { return this._appInstanceId; };
	this.get_touchEnabled=function get_touchEnabled() { return this._touchEnabled; };
	this.get_commerceAllowed=function get_commerceAllowed() { return this._commerceAllowed; };
	this.get_appMinorVersion=function get_appMinorVersion() { return this._appMinorVersion; };
	this.get_requirementMatrix=function get_requirementMatrix() { return this._requirementMatrix; };
	this.get_hostCustomMessage=function get_hostCustomMessage() { return this._hostCustomMessage; };
	this.get_isDialog=function get_isDialog() { return this._isDialog; };
};
OSF.OsfControlType={
	DocumentLevel: 0,
	ContainerLevel: 1
};
OSF.ClientMode={
	ReadOnly: 0,
	ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Client", Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension", Microsoft.Office);
Microsoft.Office.WebExtension.InitializationReason={
	Inserted: "inserted",
	DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ValueFormat={
	Unformatted: "unformatted",
	Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType={
	All: "all"
};
Microsoft.Office.WebExtension.Parameters={
	BindingType: "bindingType",
	CoercionType: "coercionType",
	ValueFormat: "valueFormat",
	FilterType: "filterType",
	Columns: "columns",
	SampleData: "sampleData",
	GoToType: "goToType",
	SelectionMode: "selectionMode",
	Id: "id",
	PromptText: "promptText",
	ItemName: "itemName",
	FailOnCollision: "failOnCollision",
	StartRow: "startRow",
	StartColumn: "startColumn",
	RowCount: "rowCount",
	ColumnCount: "columnCount",
	Callback: "callback",
	AsyncContext: "asyncContext",
	Data: "data",
	Rows: "rows",
	OverwriteIfStale: "overwriteIfStale",
	FileType: "fileType",
	EventType: "eventType",
	Handler: "handler",
	SliceSize: "sliceSize",
	SliceIndex: "sliceIndex",
	ActiveView: "activeView",
	Status: "status",
	Xml: "xml",
	Namespace: "namespace",
	Prefix: "prefix",
	XPath: "xPath",
	Text: "text",
	ImageLeft: "imageLeft",
	ImageTop: "imageTop",
	ImageWidth: "imageWidth",
	ImageHeight: "imageHeight",
	TaskId: "taskId",
	FieldId: "fieldId",
	FieldValue: "fieldValue",
	ServerUrl: "serverUrl",
	ListName: "listName",
	ResourceId: "resourceId",
	ViewType: "viewType",
	ViewName: "viewName",
	GetRawValue: "getRawValue",
	CellFormat: "cellFormat",
	TableOptions: "tableOptions",
	TaskIndex: "taskIndex",
	ResourceIndex: "resourceIndex",
	Url: "url",
	MessageHandler: "messageHandler",
	Width: "width",
	Height: "height",
	RequireHTTPs: "requireHTTPS",
	MessageToParent: "messageToParent",
	XFrameDenySafe: "xFrameDenySafe"
};
OSF.OUtil.setNamespace("DDA", OSF);
OSF.DDA.DocumentMode={
	ReadOnly: 1,
	ReadWrite: 0
};
OSF.DDA.PropertyDescriptors={
	AsyncResultStatus: "AsyncResultStatus"
};
OSF.DDA.EventDescriptors={};
OSF.DDA.ListDescriptors={};
OSF.DDA.UI={};
OSF.DDA.getXdmEventName=function OSF_DDA$GetXdmEventName(bindingId, eventType) {
	if (eventType==Microsoft.Office.WebExtension.EventType.BindingSelectionChanged || eventType==Microsoft.Office.WebExtension.EventType.BindingDataChanged) {
		return bindingId+"_"+eventType;
	}
	else {
		return eventType;
	}
};
OSF.DDA.MethodDispId={
	dispidMethodMin: 64,
	dispidGetSelectedDataMethod: 64,
	dispidSetSelectedDataMethod: 65,
	dispidAddBindingFromSelectionMethod: 66,
	dispidAddBindingFromPromptMethod: 67,
	dispidGetBindingMethod: 68,
	dispidReleaseBindingMethod: 69,
	dispidGetBindingDataMethod: 70,
	dispidSetBindingDataMethod: 71,
	dispidAddRowsMethod: 72,
	dispidClearAllRowsMethod: 73,
	dispidGetAllBindingsMethod: 74,
	dispidLoadSettingsMethod: 75,
	dispidSaveSettingsMethod: 76,
	dispidGetDocumentCopyMethod: 77,
	dispidAddBindingFromNamedItemMethod: 78,
	dispidAddColumnsMethod: 79,
	dispidGetDocumentCopyChunkMethod: 80,
	dispidReleaseDocumentCopyMethod: 81,
	dispidNavigateToMethod: 82,
	dispidGetActiveViewMethod: 83,
	dispidGetDocumentThemeMethod: 84,
	dispidGetOfficeThemeMethod: 85,
	dispidGetFilePropertiesMethod: 86,
	dispidClearFormatsMethod: 87,
	dispidSetTableOptionsMethod: 88,
	dispidSetFormatsMethod: 89,
	dispidExecuteRichApiRequestMethod: 93,
	dispidAppCommandInvocationCompletedMethod: 94,
	dispidAddDataPartMethod: 128,
	dispidGetDataPartByIdMethod: 129,
	dispidGetDataPartsByNamespaceMethod: 130,
	dispidGetDataPartXmlMethod: 131,
	dispidGetDataPartNodesMethod: 132,
	dispidDeleteDataPartMethod: 133,
	dispidGetDataNodeValueMethod: 134,
	dispidGetDataNodeXmlMethod: 135,
	dispidGetDataNodesMethod: 136,
	dispidSetDataNodeValueMethod: 137,
	dispidSetDataNodeXmlMethod: 138,
	dispidAddDataNamespaceMethod: 139,
	dispidGetDataUriByPrefixMethod: 140,
	dispidGetDataPrefixByUriMethod: 141,
	dispidGetDataNodeTextMethod: 142,
	dispidSetDataNodeTextMethod: 143,
	dispidMessageParentMethod: 144,
	dispidMethodMax: 144,
	dispidGetSelectedTaskMethod: 110,
	dispidGetSelectedResourceMethod: 111,
	dispidGetTaskMethod: 112,
	dispidGetResourceFieldMethod: 113,
	dispidGetWSSUrlMethod: 114,
	dispidGetTaskFieldMethod: 115,
	dispidGetProjectFieldMethod: 116,
	dispidGetSelectedViewMethod: 117,
	dispidGetTaskByIndexMethod: 118,
	dispidGetResourceByIndexMethod: 119,
	dispidSetTaskFieldMethod: 120,
	dispidSetResourceFieldMethod: 121,
	dispidGetMaxTaskIndexMethod: 122,
	dispidGetMaxResourceIndexMethod: 123
};
OSF.DDA.EventDispId={
	dispidEventMin: 0,
	dispidInitializeEvent: 0,
	dispidSettingsChangedEvent: 1,
	dispidDocumentSelectionChangedEvent: 2,
	dispidBindingSelectionChangedEvent: 3,
	dispidBindingDataChangedEvent: 4,
	dispidDocumentOpenEvent: 5,
	dispidDocumentCloseEvent: 6,
	dispidActiveViewChangedEvent: 7,
	dispidDocumentThemeChangedEvent: 8,
	dispidOfficeThemeChangedEvent: 9,
	dispidDialogMessageReceivedEvent: 10,
	dispidActivationStatusChangedEvent: 32,
	dispidAppCommandInvokedEvent: 39,
	dispidTaskSelectionChangedEvent: 56,
	dispidResourceSelectionChangedEvent: 57,
	dispidViewSelectionChangedEvent: 58,
	dispidDataNodeAddedEvent: 60,
	dispidDataNodeReplacedEvent: 61,
	dispidDataNodeDeletedEvent: 62,
	dispidEventMax: 63
};
OSF.DDA.ErrorCodeManager=(function () {
	var _errorMappings={};
	return {
		getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode) {
			var errorArgs=_errorMappings[errorCode];
			if (!errorArgs) {
				errorArgs=_errorMappings[this.errorCodes.ooeInternalError];
			}
			else {
				if (!errorArgs.name) {
					errorArgs.name=_errorMappings[this.errorCodes.ooeInternalError].name;
				}
				if (!errorArgs.message) {
					errorArgs.message=_errorMappings[this.errorCodes.ooeInternalError].message;
				}
			}
			return errorArgs;
		},
		addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage) {
			_errorMappings[errorCode]=errorNameMessage;
		},
		errorCodes: {
			ooeSuccess: 0,
			ooeChunkResult: 1,
			ooeCoercionTypeNotSupported: 1000,
			ooeGetSelectionNotMatchDataType: 1001,
			ooeCoercionTypeNotMatchBinding: 1002,
			ooeInvalidGetRowColumnCounts: 1003,
			ooeSelectionNotSupportCoercionType: 1004,
			ooeInvalidGetStartRowColumn: 1005,
			ooeNonUniformPartialGetNotSupported: 1006,
			ooeGetDataIsTooLarge: 1008,
			ooeFileTypeNotSupported: 1009,
			ooeGetDataParametersConflict: 1010,
			ooeInvalidGetColumns: 1011,
			ooeInvalidGetRows: 1012,
			ooeInvalidReadForBlankRow: 1013,
			ooeUnsupportedDataObject: 2000,
			ooeCannotWriteToSelection: 2001,
			ooeDataNotMatchSelection: 2002,
			ooeOverwriteWorksheetData: 2003,
			ooeDataNotMatchBindingSize: 2004,
			ooeInvalidSetStartRowColumn: 2005,
			ooeInvalidDataFormat: 2006,
			ooeDataNotMatchCoercionType: 2007,
			ooeDataNotMatchBindingType: 2008,
			ooeSetDataIsTooLarge: 2009,
			ooeNonUniformPartialSetNotSupported: 2010,
			ooeInvalidSetColumns: 2011,
			ooeInvalidSetRows: 2012,
			ooeSetDataParametersConflict: 2013,
			ooeCellDataAmountBeyondLimits: 2014,
			ooeSelectionCannotBound: 3000,
			ooeBindingNotExist: 3002,
			ooeBindingToMultipleSelection: 3003,
			ooeInvalidSelectionForBindingType: 3004,
			ooeOperationNotSupportedOnThisBindingType: 3005,
			ooeNamedItemNotFound: 3006,
			ooeMultipleNamedItemFound: 3007,
			ooeInvalidNamedItemForBindingType: 3008,
			ooeUnknownBindingType: 3009,
			ooeOperationNotSupportedOnMatrixData: 3010,
			ooeInvalidColumnsForBinding: 3011,
			ooeSettingNameNotExist: 4000,
			ooeSettingsCannotSave: 4001,
			ooeSettingsAreStale: 4002,
			ooeOperationNotSupported: 5000,
			ooeInternalError: 5001,
			ooeDocumentReadOnly: 5002,
			ooeEventHandlerNotExist: 5003,
			ooeInvalidApiCallInContext: 5004,
			ooeShuttingDown: 5005,
			ooeUnsupportedEnumeration: 5007,
			ooeIndexOutOfRange: 5008,
			ooeBrowserAPINotSupported: 5009,
			ooeInvalidParam: 5010,
			ooeRequestTimeout: 5011,
			ooeTooManyIncompleteRequests: 5100,
			ooeRequestTokenUnavailable: 5101,
			ooeActivityLimitReached: 5102,
			ooeCustomXmlNodeNotFound: 6000,
			ooeCustomXmlError: 6100,
			ooeCustomXmlExceedQuota: 6101,
			ooeCustomXmlOutOfDate: 6102,
			ooeNoCapability: 7000,
			ooeCannotNavTo: 7001,
			ooeSpecifiedIdNotExist: 7002,
			ooeNavOutOfBound: 7004,
			ooeElementMissing: 8000,
			ooeProtectedError: 8001,
			ooeInvalidCellsValue: 8010,
			ooeInvalidTableOptionValue: 8011,
			ooeInvalidFormatValue: 8012,
			ooeRowIndexOutOfRange: 8020,
			ooeColIndexOutOfRange: 8021,
			ooeFormatValueOutOfRange: 8022,
			ooeCellFormatAmountBeyondLimits: 8023,
			ooeMemoryFileLimit: 11000,
			ooeNetworkProblemRetrieveFile: 11001,
			ooeInvalidSliceSize: 11002,
			ooeInvalidCallback: 11101,
			ooeInvalidWidth: 12000,
			ooeInvalidHeight: 12001,
			ooeNavigationError: 12002,
			ooeInvalidScheme: 12003,
			ooeAppDomains: 12004,
			ooeRequireHTTPS: 12005,
			ooeWebDialogClosed: 12006,
			ooeDialogAlreadyOpened: 12007,
			ooeEndUserAllow: 12008,
			ooeEndUserIgnore: 12009
		},
		initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS) {
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType]={ name: stringNS.L_DataReadError, message: stringNS.L_GetSelectionNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotMatchBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRowColumnCounts };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType]={ name: stringNS.L_DataReadError, message: stringNS.L_SelectionNotSupportCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_NonUniformPartialGetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_FileTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataParametersConflict]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetColumns]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRows]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidReadForBlankRow]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidReadForBlankRow };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject]={ name: stringNS.L_DataWriteError, message: stringNS.L_UnsupportedDataObject };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_CannotWriteToSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData]={ name: stringNS.L_DataWriteError, message: stringNS.L_OverwriteWorksheetData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchBindingSize };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat]={ name: stringNS.L_InvalidFormat, message: stringNS.L_InvalidDataFormat };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported]={ name: stringNS.L_DataWriteError, message: stringNS.L_NonUniformPartialSetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetColumns]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetRows]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataParametersConflict]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_SelectionCannotBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist]={ name: stringNS.L_InvalidBindingError, message: stringNS.L_BindingNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection]={ name: stringNS.L_BindingCreationError, message: stringNS.L_BindingToMultipleSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidSelectionForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnThisBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_NamedItemNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_MultipleNamedItemFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidNamedItemForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType]={ name: stringNS.L_InvalidBinding, message: stringNS.L_UnknownBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnMatrixData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidColumnsForBinding]={ name: stringNS.L_InvalidBinding, message: stringNS.L_InvalidColumnsForBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist]={ name: stringNS.L_ReadSettingsError, message: stringNS.L_SettingNameNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave]={ name: stringNS.L_SaveSettingsError, message: stringNS.L_SettingsCannotSave };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale]={ name: stringNS.L_SettingsStaleError, message: stringNS.L_SettingsAreStale };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported]={ name: stringNS.L_HostError, message: stringNS.L_OperationNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError]={ name: stringNS.L_InternalError, message: stringNS.L_InternalErrorDescription };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly]={ name: stringNS.L_PermissionDenied, message: stringNS.L_DocumentReadOnly };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist]={ name: stringNS.L_EventRegistrationError, message: stringNS.L_EventHandlerNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext]={ name: stringNS.L_InvalidAPICall, message: stringNS.L_InvalidApiCallInContext };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown]={ name: stringNS.L_ShuttingDown, message: stringNS.L_ShuttingDown };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration]={ name: stringNS.L_UnsupportedEnumeration, message: stringNS.L_UnsupportedEnumerationMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBrowserAPINotSupported]={ name: stringNS.L_APINotSupported, message: stringNS.L_BrowserAPINotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTimeout]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTimeout };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeTooManyIncompleteRequests]={ name: stringNS.L_APICallFailed, message: stringNS.L_TooManyIncompleteRequests };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTokenUnavailable]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTokenUnavailable };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeActivityLimitReached]={ name: stringNS.L_APICallFailed, message: stringNS.L_ActivityLimitReached };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound]={ name: stringNS.L_InvalidNode, message: stringNS.L_CustomXmlNodeNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlExceedQuota]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlOutOfDate]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo]={ name: stringNS.L_CannotNavigateTo, message: stringNS.L_CannotNavigateTo };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist]={ name: stringNS.L_SpecifiedIdNotExist, message: stringNS.L_SpecifiedIdNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound]={ name: stringNS.L_NavOutOfBound, message: stringNS.L_NavOutOfBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellDataAmountBeyondLimits]={ name: stringNS.L_DataWriteReminder, message: stringNS.L_CellDataAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing]={ name: stringNS.L_MissingParameter, message: stringNS.L_ElementMissing };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidCellsValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidTableOptionValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidFormatValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_RowIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_ColIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_FormatValueOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellFormatAmountBeyondLimits]={ name: stringNS.L_FormattingReminder, message: stringNS.L_CellFormatAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMemoryFileLimit]={ name: stringNS.L_MemoryLimit, message: stringNS.L_CloseFileBeforeRetrieve };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNetworkProblemRetrieveFile]={ name: stringNS.L_NetworkProblem, message: stringNS.L_NetworkProblemRetrieveFile };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize]={ name: stringNS.L_InvalidValue, message: stringNS.L_SliceSizeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAlreadyOpened };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidWidth]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidHeight]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavigationError]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_NetworkProblem };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme]={ name: stringNS.L_DialogNavigateError, message: stringNS.L_DialogAddressNotTrusted };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAppDomains]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_UserClickIgnore };
		}
	};
})();
var OfficeExt;
(function (OfficeExt) {
	var Requirement;
	(function (Requirement) {
		var RequirementMatrix=(function () {
			function RequirementMatrix(_setMap) {
				this.isSetSupported=function _isSetSupported(name, minVersion) {
					if (name==undefined) {
						return false;
					}
					if (minVersion==undefined) {
						minVersion=0;
					}
					var setSupportArray=this._setMap;
					var sets=setSupportArray._sets;
					if (sets.hasOwnProperty(name.toLowerCase())) {
						var setMaxVersion=sets[name.toLowerCase()];
						return setMaxVersion > 0 && setMaxVersion >=minVersion;
					}
					else {
						return false;
					}
				};
				this._setMap=_setMap;
			}
			return RequirementMatrix;
		})();
		Requirement.RequirementMatrix=RequirementMatrix;
		var DefaultSetRequirement=(function () {
			function DefaultSetRequirement(setMap) {
				this._addSetMap=function DefaultSetRequirement_addSetMap(addedSet) {
					for (var name in addedSet) {
						this._sets[name]=addedSet[name];
					}
				};
				this._sets=setMap;
			}
			return DefaultSetRequirement;
		})();
		Requirement.DefaultSetRequirement=DefaultSetRequirement;
		var ExcelClientDefaultSetRequirement=(function (_super) {
			__extends(ExcelClientDefaultSetRequirement, _super);
			function ExcelClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"excelapi": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelClientDefaultSetRequirement=ExcelClientDefaultSetRequirement;
		var ExcelClientV1DefaultSetRequirement=(function (_super) {
			__extends(ExcelClientV1DefaultSetRequirement, _super);
			function ExcelClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return ExcelClientV1DefaultSetRequirement;
		})(ExcelClientDefaultSetRequirement);
		Requirement.ExcelClientV1DefaultSetRequirement=ExcelClientV1DefaultSetRequirement;
		var OutlookClientDefaultSetRequirement=(function (_super) {
			__extends(OutlookClientDefaultSetRequirement, _super);
			function OutlookClientDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientDefaultSetRequirement=OutlookClientDefaultSetRequirement;
		var WordClientDefaultSetRequirement=(function (_super) {
			__extends(WordClientDefaultSetRequirement, _super);
			function WordClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1,
					"wordapi": 1.1
				});
			}
			return WordClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordClientDefaultSetRequirement=WordClientDefaultSetRequirement;
		var WordClientV1DefaultSetRequirement=(function (_super) {
			__extends(WordClientV1DefaultSetRequirement, _super);
			function WordClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2,
					"imagecoercion": 1.1
				});
			}
			return WordClientV1DefaultSetRequirement;
		})(WordClientDefaultSetRequirement);
		Requirement.WordClientV1DefaultSetRequirement=WordClientV1DefaultSetRequirement;
		var PowerpointClientDefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientDefaultSetRequirement, _super);
			function PowerpointClientDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointClientDefaultSetRequirement=PowerpointClientDefaultSetRequirement;
		var PowerpointClientV1DefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientV1DefaultSetRequirement, _super);
			function PowerpointClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return PowerpointClientV1DefaultSetRequirement;
		})(PowerpointClientDefaultSetRequirement);
		Requirement.PowerpointClientV1DefaultSetRequirement=PowerpointClientV1DefaultSetRequirement;
		var ProjectClientDefaultSetRequirement=(function (_super) {
			__extends(ProjectClientDefaultSetRequirement, _super);
			function ProjectClientDefaultSetRequirement() {
				_super.call(this, {
					"selection": 1.1,
					"textcoercion": 1.1
				});
			}
			return ProjectClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ProjectClientDefaultSetRequirement=ProjectClientDefaultSetRequirement;
		var ExcelWebDefaultSetRequirement=(function (_super) {
			__extends(ExcelWebDefaultSetRequirement, _super);
			function ExcelWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"file": 1.1
				});
			}
			return ExcelWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelWebDefaultSetRequirement=ExcelWebDefaultSetRequirement;
		var WordWebDefaultSetRequirement=(function (_super) {
			__extends(WordWebDefaultSetRequirement, _super);
			function WordWebDefaultSetRequirement() {
				_super.call(this, {
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"ooxmlcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return WordWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordWebDefaultSetRequirement=WordWebDefaultSetRequirement;
		var PowerpointWebDefaultSetRequirement=(function (_super) {
			__extends(PowerpointWebDefaultSetRequirement, _super);
			function PowerpointWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"settings": 1.1
				});
			}
			return PowerpointWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointWebDefaultSetRequirement=PowerpointWebDefaultSetRequirement;
		var OutlookWebDefaultSetRequirement=(function (_super) {
			__extends(OutlookWebDefaultSetRequirement, _super);
			function OutlookWebDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookWebDefaultSetRequirement=OutlookWebDefaultSetRequirement;
		var SwayWebDefaultSetRequirement=(function (_super) {
			__extends(SwayWebDefaultSetRequirement, _super);
			function SwayWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"documentevents": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return SwayWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.SwayWebDefaultSetRequirement=SwayWebDefaultSetRequirement;
		var AccessWebDefaultSetRequirement=(function (_super) {
			__extends(AccessWebDefaultSetRequirement, _super);
			function AccessWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"partialtablebindings": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1
				});
			}
			return AccessWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.AccessWebDefaultSetRequirement=AccessWebDefaultSetRequirement;
		var ExcelIOSDefaultSetRequirement=(function (_super) {
			__extends(ExcelIOSDefaultSetRequirement, _super);
			function ExcelIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelIOSDefaultSetRequirement=ExcelIOSDefaultSetRequirement;
		var WordIOSDefaultSetRequirement=(function (_super) {
			__extends(WordIOSDefaultSetRequirement, _super);
			function WordIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordIOSDefaultSetRequirement=WordIOSDefaultSetRequirement;
		var WordIOSV1DefaultSetRequirement=(function (_super) {
			__extends(WordIOSV1DefaultSetRequirement, _super);
			function WordIOSV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2
				});
			}
			return WordIOSV1DefaultSetRequirement;
		})(WordIOSDefaultSetRequirement);
		Requirement.WordIOSV1DefaultSetRequirement=WordIOSV1DefaultSetRequirement;
		var PowerpointIOSDefaultSetRequirement=(function (_super) {
			__extends(PowerpointIOSDefaultSetRequirement, _super);
			function PowerpointIOSDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointIOSDefaultSetRequirement=PowerpointIOSDefaultSetRequirement;
		var OutlookIOSDefaultSetRequirement=(function (_super) {
			__extends(OutlookIOSDefaultSetRequirement, _super);
			function OutlookIOSDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookIOSDefaultSetRequirement=OutlookIOSDefaultSetRequirement;
		var RequirementsMatrixFactory=(function () {
			function RequirementsMatrixFactory() {
			}
			RequirementsMatrixFactory.initializeOsfDda=function () {
				OSF.OUtil.setNamespace("Requirement", OSF.DDA);
			};
			RequirementsMatrixFactory.getDefaultRequirementMatrix=function (appContext) {
				this.initializeDefaultSetMatrix();
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_requirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				}
				else {
					var appLocator=RequirementsMatrixFactory.getClientFullVersionString(appContext);
					if (RequirementsMatrixFactory.DefaultSetArrayMatrix !=undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] !=undefined) {
						defaultRequirementMatrix=new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
					}
					else {
						defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement({}));
					}
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.getClientFullVersionString=function (appContext) {
				var appMinorVersion=appContext.get_appMinorVersion();
				var appMinorVersionString="";
				var appFullVersion="";
				var appName=appContext.get_appName();
				var isIOSClient=appName==1024 ||
					appName==4096 ||
					appName==8192 ||
					appName==65536;
				if (isIOSClient && appContext.get_appVersion()==1) {
					if (appName==4096 && appMinorVersion >=15) {
						appFullVersion="16.00.01";
					}
					else {
						appFullVersion="16.00";
					}
				}
				else if (appContext.get_appName()==64) {
					appFullVersion=appContext.get_appVersion();
				}
				else {
					if (appMinorVersion < 10) {
						appMinorVersionString="0"+appMinorVersion;
					}
					else {
						appMinorVersionString=""+appMinorVersion;
					}
					appFullVersion=appContext.get_appVersion()+"."+appMinorVersionString;
				}
				return appContext.get_appName()+"-"+appFullVersion;
			};
			RequirementsMatrixFactory.initializeDefaultSetMatrix=function () {
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1600]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1600]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1600]=new PowerpointClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1601]=new ExcelClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1601]=new WordClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1601]=new PowerpointClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1600]=new OutlookClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1600]=new ExcelWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_WAC_1600]=new WordWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1600]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1601]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1600]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Access_WAC_1600]=new AccessWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_WAC_1600]=new PowerpointWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1600]=new ExcelIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.SWAY_WAC_1600]=new SwayWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1600]=new WordIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_16001]=new WordIOSV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1600]=new PowerpointIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_IOS_1600]=new OutlookIOSDefaultSetRequirement();
			};
			RequirementsMatrixFactory.Excel_RCLIENT_1600="1-16.00";
			RequirementsMatrixFactory.Excel_RCLIENT_1601="1-16.01";
			RequirementsMatrixFactory.Word_RCLIENT_1600="2-16.00";
			RequirementsMatrixFactory.Word_RCLIENT_1601="2-16.01";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1600="4-16.00";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1601="4-16.01";
			RequirementsMatrixFactory.Outlook_RCLIENT_1600="8-16.00";
			RequirementsMatrixFactory.Excel_WAC_1600="16-16.00";
			RequirementsMatrixFactory.Word_WAC_1600="32-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1600="64-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1601="64-16.01";
			RequirementsMatrixFactory.Project_RCLIENT_1600="128-16.00";
			RequirementsMatrixFactory.Access_WAC_1600="256-16.00";
			RequirementsMatrixFactory.PowerPoint_WAC_1600="512-16.00";
			RequirementsMatrixFactory.Excel_IOS_1600="1024-16.00";
			RequirementsMatrixFactory.SWAY_WAC_1600="2048-16.00";
			RequirementsMatrixFactory.Word_IOS_1600="4096-16.00";
			RequirementsMatrixFactory.Word_IOS_16001="4096-16.00.01";
			RequirementsMatrixFactory.PowerPoint_IOS_1600="8192-16.00";
			RequirementsMatrixFactory.Outlook_IOS_1600="65536-16.00";
			RequirementsMatrixFactory.DefaultSetArrayMatrix={};
			return RequirementsMatrixFactory;
		})();
		Requirement.RequirementsMatrixFactory=RequirementsMatrixFactory;
	})(Requirement=OfficeExt.Requirement || (OfficeExt.Requirement={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
Microsoft.Office.WebExtension.ApplicationMode={
	WebEditor: "webEditor",
	WebViewer: "webViewer",
	Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode={
	ReadOnly: "readOnly",
	ReadWrite: "readWrite"
};
OSF.NamespaceManager=(function OSF_NamespaceManager() {
	var _userOffice;
	var _useShortcut=false;
	return {
		enableShortcut: function OSF_NamespaceManager$enableShortcut() {
			if (!_useShortcut) {
				if (window.Office) {
					_userOffice=window.Office;
				}
				else {
					OSF.OUtil.setNamespace("Office", window);
				}
				window.Office=Microsoft.Office.WebExtension;
				_useShortcut=true;
			}
		},
		disableShortcut: function OSF_NamespaceManager$disableShortcut() {
			if (_useShortcut) {
				if (_userOffice) {
					window.Office=_userOffice;
				}
				else {
					OSF.OUtil.unsetNamespace("Office", window);
				}
				_useShortcut=false;
			}
		}
	};
})();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.useShortNamespace=function Microsoft_Office_WebExtension_useShortNamespace(useShortcut) {
	if (useShortcut) {
		OSF.NamespaceManager.enableShortcut();
	}
	else {
		OSF.NamespaceManager.disableShortcut();
	}
};
Microsoft.Office.WebExtension.select=function Microsoft_Office_WebExtension_select(str, errorCallback) {
	var promise;
	if (str && typeof str=="string") {
		var index=str.indexOf("#");
		if (index !=-1) {
			var op=str.substring(0, index);
			var target=str.substring(index+1);
			switch (op) {
				case "binding":
				case "bindings":
					if (target) {
						promise=new OSF.DDA.BindingPromise(target);
					}
					break;
			}
		}
	}
	if (!promise) {
		if (errorCallback) {
			var callbackType=typeof errorCallback;
			if (callbackType=="function") {
				var callArgs={};
				callArgs[Microsoft.Office.WebExtension.Parameters.Callback]=errorCallback;
				OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext, OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext));
			}
			else {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, callbackType);
			}
		}
	}
	else {
		promise.onFail=errorCallback;
		return promise;
	}
};
OSF.DDA.Context=function OSF_DDA_Context(officeAppContext, document, license, appOM, getOfficeTheme) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"contentLanguage": {
			value: officeAppContext.get_dataLocale()
		},
		"displayLanguage": {
			value: officeAppContext.get_appUILocale()
		},
		"touchEnabled": {
			value: officeAppContext.get_touchEnabled()
		},
		"commerceAllowed": {
			value: officeAppContext.get_commerceAllowed()
		}
	});
	if (license) {
		OSF.OUtil.defineEnumerableProperty(this, "license", {
			value: license
		});
	}
	if (officeAppContext.ui) {
		OSF.OUtil.defineEnumerableProperty(this, "ui", {
			value: officeAppContext.ui
		});
	}
	if (!officeAppContext.get_isDialog()) {
		if (document) {
			OSF.OUtil.defineEnumerableProperty(this, "document", {
				value: document
			});
		}
		if (appOM) {
			var displayName=appOM.displayName || "appOM";
			delete appOM.displayName;
			OSF.OUtil.defineEnumerableProperty(this, displayName, {
				value: appOM
			});
		}
		if (getOfficeTheme) {
			OSF.OUtil.defineEnumerableProperty(this, "officeTheme", {
				get: function () {
					return getOfficeTheme();
				}
			});
		}
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this, "requirements", {
			value: requirements
		});
	}
};
OSF.DDA.OutlookContext=function OSF_DDA_OutlookContext(appContext, settings, license, appOM, getOfficeTheme) {
	OSF.DDA.OutlookContext.uber.constructor.call(this, appContext, null, license, appOM, getOfficeTheme);
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "roamingSettings", {
			value: settings
		});
	}
};
OSF.OUtil.extend(OSF.DDA.OutlookContext, OSF.DDA.Context);
OSF.DDA.OutlookAppOm=function OSF_DDA_OutlookAppOm(appContext, window, appReady) { };
OSF.DDA.Document=function OSF_DDA_Document(officeAppContext, settings) {
	var mode;
	switch (officeAppContext.get_clientMode()) {
		case OSF.ClientMode.ReadOnly:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadOnly;
			break;
		case OSF.ClientMode.ReadWrite:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadWrite;
			break;
	}
	;
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "settings", {
			value: settings
		});
	}
	;
	OSF.OUtil.defineMutableProperties(this, {
		"mode": {
			value: mode
		},
		"url": {
			value: officeAppContext.get_docUrl()
		}
	});
};
OSF.DDA.JsomDocument=function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings) {
	OSF.DDA.JsomDocument.uber.constructor.call(this, officeAppContext, settings);
	if (bindingFacade) {
		OSF.OUtil.defineEnumerableProperty(this, "bindings", {
			get: function OSF_DDA_Document$GetBindings() { return bindingFacade; }
		});
	}
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetSelectedDataAsync,
		am.SetSelectedDataAsync
	]);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
};
OSF.OUtil.extend(OSF.DDA.JsomDocument, OSF.DDA.Document);
OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension, "context", {
	get: function Microsoft_Office_WebExtension$GetContext() {
		var context;
		if (OSF && OSF._OfficeAppFactory) {
			context=OSF._OfficeAppFactory.getContext();
		}
		return context;
	}
});
OSF.DDA.License=function OSF_DDA_License(eToken) {
	OSF.OUtil.defineEnumerableProperty(this, "value", {
		value: eToken
	});
};
OSF.DDA.ApiMethodCall=function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var getInvalidParameterString=OSF.OUtil.delayExecutionAndCache(function () {
		return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters, displayName);
	});
	this.verifyArguments=function OSF_DDA_ApiMethodCall$VerifyArguments(params, args) {
		for (var name in params) {
			var param=params[name];
			var arg=args[name];
			if (param["enum"]) {
				switch (typeof arg) {
					case "string":
						if (OSF.OUtil.listContainsValue(param["enum"], arg)) {
							break;
						}
					case "undefined":
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration;
					default:
						throw getInvalidParameterString();
				}
			}
			if (param["types"]) {
				if (!OSF.OUtil.listContainsValue(param["types"], typeof arg)) {
					throw getInvalidParameterString();
				}
			}
		}
	};
	this.extractRequiredArguments=function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo) {
		if (userArgs.length < requiredCount) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
		}
		var requiredArgs=[];
		var index;
		for (index=0; index < requiredCount; index++) {
			requiredArgs.push(userArgs[index]);
		}
		this.verifyArguments(requiredParameters, requiredArgs);
		var ret={};
		for (index=0; index < requiredCount; index++) {
			var param=requiredParameters[index];
			var arg=requiredArgs[index];
			if (param.verify) {
				var isValid=param.verify(arg, caller, stateInfo);
				if (!isValid) {
					throw getInvalidParameterString();
				}
			}
			ret[param.name]=arg;
		}
		return ret;
	},
		this.fillOptions=function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo) {
			options=options || {};
			for (var optionName in supportedOptions) {
				if (!OSF.OUtil.listContainsKey(options, optionName)) {
					var value=undefined;
					var option=supportedOptions[optionName];
					if (option.calculate && requiredArgs) {
						value=option.calculate(requiredArgs, caller, stateInfo);
					}
					if (!value && option.defaultValue !==undefined) {
						value=option.defaultValue;
					}
					options[optionName]=value;
				}
			}
			return options;
		};
	this.constructCallArgs=function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo) {
		var callArgs={};
		for (var r in required) {
			callArgs[r]=required[r];
		}
		for (var o in options) {
			callArgs[o]=options[o];
		}
		for (var s in privateStateCallbacks) {
			callArgs[s]=privateStateCallbacks[s](caller, stateInfo);
		}
		if (checkCallArgs) {
			callArgs=checkCallArgs(callArgs, caller, stateInfo);
		}
		return callArgs;
	};
};
OSF.OUtil.setNamespace("AsyncResultEnum", OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties={
	Context: "Context",
	Value: "Value",
	Status: "Status",
	Error: "Error"
};
Microsoft.Office.WebExtension.AsyncResultStatus={
	Succeeded: "succeeded",
	Failed: "failed"
};
OSF.DDA.AsyncResultEnum.ErrorCode={
	Success: 0,
	Failed: 1
};
OSF.DDA.AsyncResultEnum.ErrorProperties={
	Name: "Name",
	Message: "Message",
	Code: "Code"
};
OSF.DDA.AsyncMethodNames={};
OSF.DDA.AsyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.AsyncMethodNames[entry]=am;
	}
};
OSF.DDA.AsyncMethodCall=function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+2) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				case "function":
					if (parameterCallback) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
					}
					else {
						parameterCallback=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		if (parameterCallback) {
			if (options[Microsoft.Office.WebExtension.Parameters.Callback]) {
				throw Strings.OfficeOM.L_RedundantCallbackSpecification;
			}
			else {
				options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
			}
		}
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
	this.processResponse=function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, caller, callArgs) {
		var payload;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			if (onSucceeded) {
				payload=onSucceeded(response, caller, callArgs);
			}
			else {
				payload=response;
			}
		}
		else {
			if (onFailed) {
				payload=onFailed(status, response);
			}
			else {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
		}
		return payload;
	};
	this.getCallArgs=function (suppliedArgs) {
		var options, parameterCallback;
		for (var i=suppliedArgs.length - 1; i >=requiredCount; i--) {
			var argument=suppliedArgs[i];
			switch (typeof argument) {
				case "object":
					options=argument;
					break;
				case "function":
					parameterCallback=argument;
					break;
			}
		}
		options=options || {};
		if (parameterCallback) {
			options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
		}
		return options;
	};
};
OSF.DDA.AsyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			var privateStateCallbacks=params.privateStateCallbacks ? OSF.OUtil.createObject(params.privateStateCallbacks) : [];
			return new OSF.DDA.AsyncMethodCall(params.requiredArguments || [], supportedOptions, privateStateCallbacks, params.onSucceeded, params.onFailed, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.AsyncMethodCalls={};
OSF.DDA.AsyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.AsyncMethodCalls[callDefinition.method.id]=OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.Error=function OSF_DDA_Error(name, message, code) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"name": {
			value: name
		},
		"message": {
			value: message
		},
		"code": {
			value: code
		}
	});
};
OSF.DDA.AsyncResult=function OSF_DDA_AsyncResult(initArgs, errorArgs) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"value": {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]
		},
		"status": {
			value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded
		}
	});
	if (initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]) {
		OSF.OUtil.defineEnumerableProperty(this, "asyncContext", {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]
		});
	}
	if (errorArgs) {
		OSF.OUtil.defineEnumerableProperty(this, "error", {
			value: new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])
		});
	}
};
OSF.DDA.issueAsyncResult=function OSF_DDA$IssueAsyncResult(callArgs, status, payload) {
	var callback=callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
	if (callback) {
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
		var errorArgs;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
		}
		else {
			errorArgs={};
			payload=payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
		}
		callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
	}
};
OSF.DDA.SyncMethodNames={};
OSF.DDA.SyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.SyncMethodNames[entry]=am;
	}
};
OSF.DDA.SyncMethodCall=function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+1) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
};
OSF.DDA.SyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			return new OSF.DDA.SyncMethodCall(params.requiredArguments || [], supportedOptions, params.privateStateCallbacks, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.SyncMethodCalls={};
OSF.DDA.SyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.SyncMethodCalls[callDefinition.method.id]=OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.ListType=(function () {
	var listTypes={};
	return {
		setListType: function OSF_DDA_ListType$AddListType(t, prop) { listTypes[t]=prop; },
		isListType: function OSF_DDA_ListType$IsListType(t) { return OSF.OUtil.listContainsKey(listTypes, t); },
		getDescriptor: function OSF_DDA_ListType$getDescriptor(t) { return listTypes[t]; }
	};
})();
OSF.DDA.HostParameterMap=function (specialProcessor, mappings) {
	var toHostMap="toHost";
	var fromHostMap="fromHost";
	var self="self";
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]={
		toHost: function (data) {
			if (data !=null && data.rows !==undefined) {
				var tableData={};
				tableData[OSF.DDA.TableDataProperties.TableRows]=data.rows;
				tableData[OSF.DDA.TableDataProperties.TableHeaders]=data.headers;
				data=tableData;
			}
			return data;
		},
		fromHost: function (args) {
			return args;
		}
	};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.SampleData]=dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data];
	function mapValues(preimageSet, mapping) {
		var ret=preimageSet ? {} : undefined;
		for (var entry in preimageSet) {
			var preimage=preimageSet[entry];
			var image;
			if (OSF.DDA.ListType.isListType(entry)) {
				image=[];
				for (var subEntry in preimage) {
					image.push(mapValues(preimage[subEntry], mapping));
				}
			}
			else if (OSF.OUtil.listContainsKey(dynamicTypes, entry)) {
				image=dynamicTypes[entry][mapping](preimage);
			}
			else if (mapping==fromHostMap && specialProcessor.preserveNesting(entry)) {
				image=mapValues(preimage, mapping);
			}
			else {
				var maps=mappings[entry];
				if (maps) {
					var map=maps[mapping];
					if (map) {
						image=map[preimage];
						if (image===undefined) {
							image=preimage;
						}
					}
				}
				else {
					image=preimage;
				}
			}
			ret[entry]=image;
		}
		return ret;
	}
	;
	function generateArguments(imageSet, parameters) {
		var ret;
		for (var param in parameters) {
			var arg;
			if (specialProcessor.isComplexType(param)) {
				arg=generateArguments(imageSet, mappings[param][toHostMap]);
			}
			else {
				arg=imageSet[param];
			}
			if (arg !=undefined) {
				if (!ret) {
					ret={};
				}
				var index=parameters[param];
				if (index==self) {
					index=param;
				}
				ret[index]=specialProcessor.pack(param, arg);
			}
		}
		return ret;
	}
	;
	function extractArguments(source, parameters, extracted) {
		if (!extracted) {
			extracted={};
		}
		for (var param in parameters) {
			var index=parameters[param];
			var value;
			if (index==self) {
				value=source;
			}
			else {
				value=source[index];
			}
			if (value===null || value===undefined) {
				extracted[param]=undefined;
			}
			else {
				value=specialProcessor.unpack(param, value);
				var map;
				if (specialProcessor.isComplexType(param)) {
					map=mappings[param][fromHostMap];
					if (specialProcessor.preserveNesting(param)) {
						extracted[param]=extractArguments(value, map);
					}
					else {
						extractArguments(value, map, extracted);
					}
				}
				else {
					if (OSF.DDA.ListType.isListType(param)) {
						map={};
						var entryDescriptor=OSF.DDA.ListType.getDescriptor(param);
						map[entryDescriptor]=self;
						var extractedValues=new Array(value.length);
						for (var item in value) {
							extractedValues[item]=extractArguments(value[item], map);
						}
						extracted[param]=extractedValues;
					}
					else {
						extracted[param]=value;
					}
				}
			}
		}
		return extracted;
	}
	;
	function applyMap(mapName, preimage, mapping) {
		var parameters=mappings[mapName][mapping];
		var image;
		if (mapping=="toHost") {
			var imageSet=mapValues(preimage, mapping);
			image=generateArguments(imageSet, parameters);
		}
		else if (mapping=="fromHost") {
			var argumentSet=extractArguments(preimage, parameters);
			image=mapValues(argumentSet, mapping);
		}
		return image;
	}
	;
	if (!mappings) {
		mappings={};
	}
	this.addMapping=function (mapName, description) {
		var toHost, fromHost;
		if (description.map) {
			toHost=description.map;
			fromHost={};
			for (var preimage in toHost) {
				var image=toHost[preimage];
				if (image==self) {
					image=preimage;
				}
				fromHost[image]=preimage;
			}
		}
		else {
			toHost=description.toHost;
			fromHost=description.fromHost;
		}
		var pair=mappings[mapName];
		if (pair) {
			var currMap=pair[toHostMap];
			for (var th in currMap)
				toHost[th]=currMap[th];
			currMap=pair[fromHostMap];
			for (var fh in currMap)
				fromHost[fh]=currMap[fh];
		}
		else {
			pair=mappings[mapName]={};
		}
		pair[toHostMap]=toHost;
		pair[fromHostMap]=fromHost;
	};
	this.toHost=function (mapName, preimage) { return applyMap(mapName, preimage, toHostMap); };
	this.fromHost=function (mapName, image) { return applyMap(mapName, image, fromHostMap); };
	this.self=self;
	this.addComplexType=function (ct) { specialProcessor.addComplexType(ct); };
	this.getDynamicType=function (dt) { return specialProcessor.getDynamicType(dt); };
	this.setDynamicType=function (dt, handler) { specialProcessor.setDynamicType(dt, handler); };
	this.dynamicTypes=dynamicTypes;
	this.doMapValues=function (preimageSet, mapping) { return mapValues(preimageSet, mapping); };
};
OSF.DDA.SpecialProcessor=function (complexTypes, dynamicTypes) {
	this.addComplexType=function OSF_DDA_SpecialProcessor$addComplexType(ct) {
		complexTypes.push(ct);
	};
	this.getDynamicType=function OSF_DDA_SpecialProcessor$getDynamicType(dt) {
		return dynamicTypes[dt];
	};
	this.setDynamicType=function OSF_DDA_SpecialProcessor$setDynamicType(dt, handler) {
		dynamicTypes[dt]=handler;
	};
	this.isComplexType=function OSF_DDA_SpecialProcessor$isComplexType(t) {
		return OSF.OUtil.listContainsValue(complexTypes, t);
	};
	this.isDynamicType=function OSF_DDA_SpecialProcessor$isDynamicType(p) {
		return OSF.OUtil.listContainsKey(dynamicTypes, p);
	};
	this.preserveNesting=function OSF_DDA_SpecialProcessor$preserveNesting(p) {
		var pn=[];
		if (OSF.DDA.PropertyDescriptors)
			pn.push(OSF.DDA.PropertyDescriptors.Subset);
		if (OSF.DDA.DataNodeEventProperties) {
			pn=pn.concat([
				OSF.DDA.DataNodeEventProperties.OldNode,
				OSF.DDA.DataNodeEventProperties.NewNode,
				OSF.DDA.DataNodeEventProperties.NextSiblingNode
			]);
		}
		return OSF.OUtil.listContainsValue(pn, p);
	};
	this.pack=function OSF_DDA_SpecialProcessor$pack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].toHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
	this.unpack=function OSF_DDA_SpecialProcessor$unpack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].fromHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
};
OSF.DDA.getDecoratedParameterMap=function (specialProcessor, initialDefs) {
	var parameterMap=new OSF.DDA.HostParameterMap(specialProcessor);
	var self=parameterMap.self;
	function createObject(properties) {
		var obj=null;
		if (properties) {
			obj={};
			var len=properties.length;
			for (var i=0; i < len; i++) {
				obj[properties[i].name]=properties[i].value;
			}
		}
		return obj;
	}
	parameterMap.define=function define(definition) {
		var args={};
		var toHost=createObject(definition.toHost);
		if (definition.invertible) {
			args.map=toHost;
		}
		else if (definition.canonical) {
			args.toHost=args.fromHost=toHost;
		}
		else {
			args.toHost=toHost;
			args.fromHost=createObject(definition.fromHost);
		}
		parameterMap.addMapping(definition.type, args);
		if (definition.isComplexType)
			parameterMap.addComplexType(definition.type);
	};
	for (var id in initialDefs)
		parameterMap.define(initialDefs[id]);
	return parameterMap;
};
OSF.OUtil.setNamespace("DispIdHost", OSF.DDA);
OSF.DDA.DispIdHost.Methods={
	InvokeMethod: "invokeMethod",
	AddEventHandler: "addEventHandler",
	RemoveEventHandler: "removeEventHandler",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent"
};
OSF.DDA.DispIdHost.Delegates={
	ExecuteAsync: "executeAsync",
	RegisterEventAsync: "registerEventAsync",
	UnregisterEventAsync: "unregisterEventAsync",
	ParameterMap: "parameterMap",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent"
};
OSF.DDA.DispIdHost.Facade=function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap) {
	var dispIdMap={};
	var jsom=OSF.DDA.AsyncMethodNames;
	var did=OSF.DDA.MethodDispId;
	var methodMap={
		"GoToByIdAsync": did.dispidNavigateToMethod,
		"GetSelectedDataAsync": did.dispidGetSelectedDataMethod,
		"SetSelectedDataAsync": did.dispidSetSelectedDataMethod,
		"GetDocumentCopyChunkAsync": did.dispidGetDocumentCopyChunkMethod,
		"ReleaseDocumentCopyAsync": did.dispidReleaseDocumentCopyMethod,
		"GetDocumentCopyAsync": did.dispidGetDocumentCopyMethod,
		"AddFromSelectionAsync": did.dispidAddBindingFromSelectionMethod,
		"AddFromPromptAsync": did.dispidAddBindingFromPromptMethod,
		"AddFromNamedItemAsync": did.dispidAddBindingFromNamedItemMethod,
		"GetAllAsync": did.dispidGetAllBindingsMethod,
		"GetByIdAsync": did.dispidGetBindingMethod,
		"ReleaseByIdAsync": did.dispidReleaseBindingMethod,
		"GetDataAsync": did.dispidGetBindingDataMethod,
		"SetDataAsync": did.dispidSetBindingDataMethod,
		"AddRowsAsync": did.dispidAddRowsMethod,
		"AddColumnsAsync": did.dispidAddColumnsMethod,
		"DeleteAllDataValuesAsync": did.dispidClearAllRowsMethod,
		"RefreshAsync": did.dispidLoadSettingsMethod,
		"SaveAsync": did.dispidSaveSettingsMethod,
		"GetActiveViewAsync": did.dispidGetActiveViewMethod,
		"GetFilePropertiesAsync": did.dispidGetFilePropertiesMethod,
		"GetOfficeThemeAsync": did.dispidGetOfficeThemeMethod,
		"GetDocumentThemeAsync": did.dispidGetDocumentThemeMethod,
		"ClearFormatsAsync": did.dispidClearFormatsMethod,
		"SetTableOptionsAsync": did.dispidSetTableOptionsMethod,
		"SetFormatsAsync": did.dispidSetFormatsMethod,
		"ExecuteRichApiRequestAsync": did.dispidExecuteRichApiRequestMethod,
		"AppCommandInvocationCompletedAsync": did.dispidAppCommandInvocationCompletedMethod,
		"AddDataPartAsync": did.dispidAddDataPartMethod,
		"GetDataPartByIdAsync": did.dispidGetDataPartByIdMethod,
		"GetDataPartsByNameSpaceAsync": did.dispidGetDataPartsByNamespaceMethod,
		"GetPartXmlAsync": did.dispidGetDataPartXmlMethod,
		"GetPartNodesAsync": did.dispidGetDataPartNodesMethod,
		"DeleteDataPartAsync": did.dispidDeleteDataPartMethod,
		"GetNodeValueAsync": did.dispidGetDataNodeValueMethod,
		"GetNodeXmlAsync": did.dispidGetDataNodeXmlMethod,
		"GetRelativeNodesAsync": did.dispidGetDataNodesMethod,
		"SetNodeValueAsync": did.dispidSetDataNodeValueMethod,
		"SetNodeXmlAsync": did.dispidSetDataNodeXmlMethod,
		"AddDataPartNamespaceAsync": did.dispidAddDataNamespaceMethod,
		"GetDataPartNamespaceAsync": did.dispidGetDataUriByPrefixMethod,
		"GetDataPartPrefixAsync": did.dispidGetDataPrefixByUriMethod,
		"GetNodeTextAsync": did.dispidGetDataNodeTextMethod,
		"SetNodeTextAsync": did.dispidSetDataNodeTextMethod,
		"GetSelectedTask": did.dispidGetSelectedTaskMethod,
		"GetTask": did.dispidGetTaskMethod,
		"GetWSSUrl": did.dispidGetWSSUrlMethod,
		"GetTaskField": did.dispidGetTaskFieldMethod,
		"GetSelectedResource": did.dispidGetSelectedResourceMethod,
		"GetResourceField": did.dispidGetResourceFieldMethod,
		"GetProjectField": did.dispidGetProjectFieldMethod,
		"GetSelectedView": did.dispidGetSelectedViewMethod,
		"GetTaskByIndex": did.dispidGetTaskByIndexMethod,
		"GetResourceByIndex": did.dispidGetResourceByIndexMethod,
		"SetTaskField": did.dispidSetTaskFieldMethod,
		"SetResourceField": did.dispidSetResourceFieldMethod,
		"GetMaxTaskIndex": did.dispidGetMaxTaskIndexMethod,
		"GetMaxResourceIndex": did.dispidGetMaxResourceIndexMethod
	};
	for (var method in methodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=methodMap[method];
		}
	}
	jsom=OSF.DDA.SyncMethodNames;
	did=OSF.DDA.MethodDispId;
	var asyncMethodMap={
		"MessageParent": did.dispidMessageParentMethod
	};
	for (var method in asyncMethodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=asyncMethodMap[method];
		}
	}
	jsom=Microsoft.Office.WebExtension.EventType;
	did=OSF.DDA.EventDispId;
	var eventMap={
		"SettingsChanged": did.dispidSettingsChangedEvent,
		"DocumentSelectionChanged": did.dispidDocumentSelectionChangedEvent,
		"BindingSelectionChanged": did.dispidBindingSelectionChangedEvent,
		"BindingDataChanged": did.dispidBindingDataChangedEvent,
		"ActiveViewChanged": did.dispidActiveViewChangedEvent,
		"OfficeThemeChanged": did.dispidOfficeThemeChangedEvent,
		"DocumentThemeChanged": did.dispidDocumentThemeChangedEvent,
		"AppCommandInvoked": did.dispidAppCommandInvokedEvent,
		"DialogMessageReceived": did.dispidDialogMessageReceivedEvent,
		"TaskSelectionChanged": did.dispidTaskSelectionChangedEvent,
		"ResourceSelectionChanged": did.dispidResourceSelectionChangedEvent,
		"ViewSelectionChanged": did.dispidViewSelectionChangedEvent,
		"DataNodeInserted": did.dispidDataNodeAddedEvent,
		"DataNodeReplaced": did.dispidDataNodeReplacedEvent,
		"DataNodeDeleted": did.dispidDataNodeDeletedEvent
	};
	for (var event in eventMap) {
		if (jsom[event]) {
			dispIdMap[jsom[event]]=eventMap[event];
		}
	}
	function onException(ex, asyncMethodCall, suppliedArgs, callArgs) {
		if (typeof ex=="number") {
			if (!callArgs) {
				callArgs=asyncMethodCall.getCallArgs(suppliedArgs);
			}
			OSF.DDA.issueAsyncResult(callArgs, ex, OSF.DDA.ErrorCodeManager.getErrorArgs(ex));
		}
		else {
			throw ex;
		}
	}
	;
	this[OSF.DDA.DispIdHost.Methods.InvokeMethod]=function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, caller, privateState) {
		var callArgs;
		try {
			var methodName=method.id;
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[methodName];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, privateState);
			var dispId=dispIdMap[methodName];
			var delegate=getDelegateMethods(methodName);
			var richApiInExcelMethodSubstitution=null;
			if (window.Excel && window.Office.context.requirements.isSetSupported("RedirectV1Api")) {
				window.Excel._RedirectV1APIs=true;
			}
			if (window.Excel && window.Excel._RedirectV1APIs && (richApiInExcelMethodSubstitution=window.Excel._V1APIMap[methodName])) {
				if (richApiInExcelMethodSubstitution.preprocess) {
					callArgs=richApiInExcelMethodSubstitution.preprocess(callArgs);
				}
				var ctx=new window.Excel.RequestContext();
				var result=richApiInExcelMethodSubstitution.call(ctx, callArgs);
				ctx.sync()
					.then(function () {
					var response=result.value;
					var status=response.status;
					delete response["status"];
					delete response["@odata.type"];
					if (richApiInExcelMethodSubstitution.postprocess) {
						response=richApiInExcelMethodSubstitution.postprocess(response, callArgs);
					}
					if (status !=0) {
						response=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, response);
				})["catch"](function (error) {
					OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeFailure, null);
				});
			}
			else {
				var hostCallArgs;
				if (parameterMap.toHost) {
					hostCallArgs=parameterMap.toHost(dispId, callArgs);
				}
				else {
					hostCallArgs=callArgs;
				}
				delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
					"dispId": dispId,
					"hostCallArgs": hostCallArgs,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": function (status, hostResponseArgs) {
						var responseArgs;
						if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
							if (parameterMap.fromHost) {
								responseArgs=parameterMap.fromHost(dispId, hostResponseArgs);
							}
							else {
								responseArgs=hostResponseArgs;
							}
						}
						else {
							responseArgs=hostResponseArgs;
						}
						var payload=asyncMethodCall.processResponse(status, responseArgs, caller, callArgs);
						OSF.DDA.issueAsyncResult(callArgs, status, payload);
					}
				});
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.AddEventHandler]=function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var eventType, handler;
		function onEnsureRegistration(status) {
			if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				var added=eventDispatch.addEventHandler(eventType, handler);
				if (!added) {
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed;
				}
			}
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			if (eventDispatch.getEventHandlerCount(eventType)==0) {
				var dispId=dispIdMap[eventType];
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": caller.id || "",
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration,
					"onEvent": function handleEvent(hostArgs) {
						var args=parameterMap.fromHost(dispId, hostArgs);
						eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType, caller, args));
					}
				});
			}
			else {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler]=function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var eventType, handler;
		function onEnsureRegistration(status) {
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			var status, removeSuccess;
			if (handler===null) {
				removeSuccess=eventDispatch.clearEventHandlers(eventType);
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
			}
			else {
				removeSuccess=eventDispatch.removeEventHandler(eventType, handler);
				status=removeSuccess ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist;
			}
			if (removeSuccess && eventDispatch.getEventHandlerCount(eventType)==0) {
				var dispId=dispIdMap[eventType];
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": caller.id || "",
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration
				});
			}
			else {
				onEnsureRegistration(status);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.OpenDialog]=function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var targetId;
		var dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
		var dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
		function onEnsureRegistration(status) {
			var payload;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			else {
				var onSucceedArgs={};
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id]=targetId;
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data]=eventDispatch;
				var payload=asyncMethodCall.processResponse(status, onSucceedArgs, caller, callArgs);
				OSF.DialogShownStatus.hasDialogShown=true;
				eventDispatch.clearEventHandlers(dialogMessageEvent);
				eventDispatch.clearEventHandlers(dialogOtherEvent);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, payload);
		}
		try {
			if (dialogMessageEvent==undefined || dialogOtherEvent==undefined) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported);
			}
			if (OSF.DDA.AsyncMethodNames.DisplayDialogAsync==null) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				return;
			}
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
			targetId=JSON.stringify(callArgs);
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": onEnsureRegistration,
				"onEvent": function handleEvent(hostArgs) {
					var args=parameterMap.fromHost(dispId, hostArgs);
					var event=OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent, caller, args);
					if (event.type==dialogOtherEvent) {
						var payload=OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
						var errorArgs={};
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
						event.error=new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]);
					}
					eventDispatch.fireOrQueueEvent(event);
					if (args[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogClosed) {
						eventDispatch.clearEventHandlers(dialogMessageEvent);
						eventDispatch.clearEventHandlers(dialogOtherEvent);
						OSF.DialogShownStatus.hasDialogShown=false;
					}
				}
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.CloseDialog]=function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller) {
		var callArgs;
		var dialogMessageEvent, dialogOtherEvent;
		var closeStatus=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
		function closeCallback(status) {
			closeStatus=status;
			OSF.DialogShownStatus.hasDialogShown=false;
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
			dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
			eventDispatch.clearEventHandlers(dialogMessageEvent);
			eventDispatch.clearEventHandlers(dialogOtherEvent);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": closeCallback
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
		if (closeStatus !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed, OSF.DDA.AsyncMethodNames.CloseAsync.displayName, closeStatus);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.MessageParent]=function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller) {
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
		return invoker({
			"dispId": dispId,
			"hostCallArgs": callArgs,
			"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
			"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
		});
	};
};
OSF.DDA.DispIdHost.addAsyncMethods=function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState) {
	for (var entry in asyncMethodNames) {
		var method=asyncMethodNames[entry];
		var name=method.displayName;
		if (!target[name]) {
			OSF.OUtil.defineEnumerableProperty(target, name, {
				value: (function (asyncMethod) {
					return function () {
						var invokeMethod=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
						invokeMethod(asyncMethod, arguments, target, privateState);
					};
				})(method)
			});
		}
	}
};
OSF.DDA.DispIdHost.addEventSupport=function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch) {
	var add=OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
	var remove=OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
	if (!target[add]) {
		OSF.OUtil.defineEnumerableProperty(target, add, {
			value: function () {
				var addEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
				addEventHandler(arguments, eventDispatch, target);
			}
		});
	}
	if (!target[remove]) {
		OSF.OUtil.defineEnumerableProperty(target, remove, {
			value: function () {
				var removeEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
				removeEventHandler(arguments, eventDispatch, target);
			}
		});
	}
};
OSF.ShowWindowDialogParameterKeys={
	WindowUrl: "windowUrl",
	WindowSpecs: "windowSpecs",
	WindowName: "windowName",
	MarketPlaceId: "marketPlaceId"
};
var OfficeExt;
(function (OfficeExt) {
	var WACUtils;
	(function (WACUtils) {
		var _appContextKey='&_app_context=';
		var _appContextKeyPrefix='_app_context=';
		function addAppContextAsHash(url, appContext) {
			return OSF.OUtil.addInfoAsHash(url, _appContextKey, appContext, true);
		}
		WACUtils.addAppContextAsHash=addAppContextAsHash;
		function parseAppContextWithGivenFragment(skipSessionStorage, fragment) {
			return OSF.OUtil.parseInfoWithGivenFragment(_appContextKey, _appContextKeyPrefix, true, skipSessionStorage, fragment);
		}
		WACUtils.parseAppContextWithGivenFragment=parseAppContextWithGivenFragment;
		function serializeObjectToString(response) {
			if (typeof (JSON) !=="undefined") {
				try {
					return JSON.stringify(response);
				}
				catch (ex) {
				}
			}
			return "";
		}
		WACUtils.serializeObjectToString=serializeObjectToString;
	})(WACUtils=OfficeExt.WACUtils || (OfficeExt.WACUtils={}));
})(OfficeExt || (OfficeExt={}));
var OfficeExt;
(function (OfficeExt) {
	var MsAjaxTypeHelper=(function () {
		function MsAjaxTypeHelper() {
		}
		MsAjaxTypeHelper.isInstanceOfType=function (type, instance) {
			if (typeof (instance)==="undefined" || instance===null)
				return false;
			if (instance instanceof type)
				return true;
			var instanceType=instance.constructor;
			if (!instanceType || (typeof (instanceType) !=="function") || instanceType.__typeName==='Object') {
				instanceType=Object;
			}
			return !!(instanceType===type) ||
				(instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
				(instanceType.implementsInterface && instanceType.implementsInterface(type));
		};
		return MsAjaxTypeHelper;
	})();
	OfficeExt.MsAjaxTypeHelper=MsAjaxTypeHelper;
	var MsAjaxError=(function () {
		function MsAjaxError() {
		}
		MsAjaxError.create=function (message, errorInfo) {
			var err=new Error(message);
			err.message=message;
			if (errorInfo) {
				for (var v in errorInfo) {
					err[v]=errorInfo[v];
				}
			}
			err.popStackFrame();
			return err;
		};
		MsAjaxError.parameterCount=function (message) {
			var displayMessage="Sys.ParameterCountException: "+(message ? message : "Parameter count mismatch.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.ParameterCountException' });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argument=function (paramName, message) {
			var displayMessage="Sys.ArgumentException: "+(message ? message : "Value does not fall within the expected range.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentNull=function (paramName, message) {
			var displayMessage="Sys.ArgumentNullException: "+(message ? message : "Value cannot be null.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentOutOfRange=function (paramName, actualValue, message) {
			var displayMessage="Sys.ArgumentOutOfRangeException: "+(message ? message : "Specified argument was out of the range of valid values.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			if (typeof (actualValue) !=="undefined" && actualValue !==null) {
				displayMessage+="\n"+MsAjaxString.format("Actual value was {0}.", actualValue);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentOutOfRangeException",
				paramName: paramName,
				actualValue: actualValue
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentType=function (paramName, actualType, expectedType, message) {
			var displayMessage="Sys.ArgumentTypeException: ";
			if (message) {
				displayMessage+=message;
			}
			else if (actualType && expectedType) {
				displayMessage+=MsAjaxString.format("Object of type '{0}' cannot be converted to type '{1}'.", actualType.getName ? actualType.getName() : actualType, expectedType.getName ? expectedType.getName() : expectedType);
			}
			else {
				displayMessage+="Object cannot be converted to the required type.";
			}
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentTypeException",
				paramName: paramName,
				actualType: actualType,
				expectedType: expectedType
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentUndefined=function (paramName, message) {
			var displayMessage="Sys.ArgumentUndefinedException: "+(message ? message : "Value cannot be undefined.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.invalidOperation=function (message) {
			var displayMessage="Sys.InvalidOperationException: "+(message ? message : "Operation is not valid due to the current state of the object.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.InvalidOperationException' });
			err.popStackFrame();
			return err;
		};
		return MsAjaxError;
	})();
	OfficeExt.MsAjaxError=MsAjaxError;
	var MsAjaxString=(function () {
		function MsAjaxString() {
		}
		MsAjaxString.format=function (format) {
			var args=[];
			for (var _i=1; _i < arguments.length; _i++) {
				args[_i - 1]=arguments[_i];
			}
			var source=format;
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10);
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		};
		MsAjaxString.startsWith=function (str, prefix) {
			return (str.substr(0, prefix.length)===prefix);
		};
		return MsAjaxString;
	})();
	OfficeExt.MsAjaxString=MsAjaxString;
	var MsAjaxDebug=(function () {
		function MsAjaxDebug() {
		}
		MsAjaxDebug.trace=function (text) {
			if (typeof Debug !=="undefined" && Debug.writeln)
				Debug.writeln(text);
			if (window.console && window.console.log)
				window.console.log(text);
			if (window.opera && window.opera.postError)
				window.opera.postError(text);
			if (window.debugService && window.debugService.trace)
				window.debugService.trace(text);
			var a=document.getElementById("TraceConsole");
			if (a && a.tagName.toUpperCase()==="TEXTAREA") {
				a.innerHTML+=text+"\n";
			}
		};
		return MsAjaxDebug;
	})();
	OfficeExt.MsAjaxDebug=MsAjaxDebug;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		if (!Function.createCallback) {
			Function.createCallback=function Function$createCallback(method, context) {
				var e=Function._validateParams(arguments, [
					{ name: "method", type: Function },
					{ name: "context", mayBeNull: true }
				]);
				if (e)
					throw e;
				return function () {
					var l=arguments.length;
					if (l > 0) {
						var args=[];
						for (var i=0; i < l; i++) {
							args[i]=arguments[i];
						}
						args[l]=context;
						return method.apply(this, args);
					}
					return method.call(this, context);
				};
			};
		}
		if (!Function.createDelegate) {
			Function.createDelegate=function Function$createDelegate(instance, method) {
				var e=Function._validateParams(arguments, [
					{ name: "instance", mayBeNull: true },
					{ name: "method", type: Function }
				]);
				if (e)
					throw e;
				return function () {
					return method.apply(instance, arguments);
				};
			};
		}
		if (!Function._validateParams) {
			Function._validateParams=function (params, expectedParams, validateParameterCount) {
				var e, expectedLength=expectedParams.length;
				validateParameterCount=validateParameterCount || (typeof (validateParameterCount)==="undefined");
				e=Function._validateParameterCount(params, expectedParams, validateParameterCount);
				if (e) {
					e.popStackFrame();
					return e;
				}
				for (var i=0, l=params.length; i < l; i++) {
					var expectedParam=expectedParams[Math.min(i, expectedLength - 1)], paramName=expectedParam.name;
					if (expectedParam.parameterArray) {
						paramName+="["+(i - expectedLength+1)+"]";
					}
					else if (!validateParameterCount && (i >=expectedLength)) {
						break;
					}
					e=Function._validateParameter(params[i], expectedParam, paramName);
					if (e) {
						e.popStackFrame();
						return e;
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterCount) {
			Function._validateParameterCount=function (params, expectedParams, validateParameterCount) {
				var i, error, expectedLen=expectedParams.length, actualLen=params.length;
				if (actualLen < expectedLen) {
					var minParams=expectedLen;
					for (i=0; i < expectedLen; i++) {
						var param=expectedParams[i];
						if (param.optional || param.parameterArray) {
							minParams--;
						}
					}
					if (actualLen < minParams) {
						error=true;
					}
				}
				else if (validateParameterCount && (actualLen > expectedLen)) {
					error=true;
					for (i=0; i < expectedLen; i++) {
						if (expectedParams[i].parameterArray) {
							error=false;
							break;
						}
					}
				}
				if (error) {
					var e=MsAjaxError.parameterCount();
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!Function._validateParameter) {
			Function._validateParameter=function (param, expectedParam, paramName) {
				var e, expectedType=expectedParam.type, expectedInteger=!!expectedParam.integer, expectedDomElement=!!expectedParam.domElement, mayBeNull=!!expectedParam.mayBeNull;
				e=Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
				if (e) {
					e.popStackFrame();
					return e;
				}
				var expectedElementType=expectedParam.elementType, elementMayBeNull=!!expectedParam.elementMayBeNull;
				if (expectedType===Array && typeof (param) !=="undefined" && param !==null &&
					(expectedElementType || !elementMayBeNull)) {
					var expectedElementInteger=!!expectedParam.elementInteger, expectedElementDomElement=!!expectedParam.elementDomElement;
					for (var i=0; i < param.length; i++) {
						var elem=param[i];
						e=Function._validateParameterType(elem, expectedElementType, expectedElementInteger, expectedElementDomElement, elementMayBeNull, paramName+"["+i+"]");
						if (e) {
							e.popStackFrame();
							return e;
						}
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterType) {
			Function._validateParameterType=function (param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
				var e, i;
				if (typeof (param)==="undefined") {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentUndefined(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (param===null) {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentNull(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (expectedType && !OfficeExt.MsAjaxTypeHelper.isInstanceOfType(expectedType, param)) {
					e=OfficeExt.MsAjaxError.argumentType(paramName, typeof (param), expectedType);
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!window.Type) {
			window.Type=Function;
		}
		if (!Type.registerNamespace) {
			Type.registerNamespace=function (ns) {
				var namespaceParts=ns.split('.');
				var currentNamespace=window;
				for (var i=0; i < namespaceParts.length; i++) {
					currentNamespace[namespaceParts[i]]=currentNamespace[namespaceParts[i]] || {};
					currentNamespace=currentNamespace[namespaceParts[i]];
				}
			};
		}
		if (!Type.prototype.registerClass) {
			Type.prototype.registerClass=function (cls) { cls={}; };
		}
		if (typeof (Sys)==="undefined") {
			Type.registerNamespace('Sys');
		}
		if (!Error.prototype.popStackFrame) {
			Error.prototype.popStackFrame=function () {
				if (arguments.length !==0)
					throw MsAjaxError.parameterCount();
				if (typeof (this.stack)==="undefined" || this.stack===null ||
					typeof (this.fileName)==="undefined" || this.fileName===null ||
					typeof (this.lineNumber)==="undefined" || this.lineNumber===null) {
					return;
				}
				var stackFrames=this.stack.split("\n");
				var currentFrame=stackFrames[0];
				var pattern=this.fileName+":"+this.lineNumber;
				while (typeof (currentFrame) !=="undefined" &&
					currentFrame !==null &&
					currentFrame.indexOf(pattern)===-1) {
					stackFrames.shift();
					currentFrame=stackFrames[0];
				}
				var nextFrame=stackFrames[1];
				if (typeof (nextFrame)==="undefined" || nextFrame===null) {
					return;
				}
				var nextFrameParts=nextFrame.match(/@(.*):(\d+)$/);
				if (typeof (nextFrameParts)==="undefined" || nextFrameParts===null) {
					return;
				}
				this.fileName=nextFrameParts[1];
				this.lineNumber=parseInt(nextFrameParts[2]);
				stackFrames.shift();
				this.stack=stackFrames.join("\n");
			};
		}
		OsfMsAjaxFactory.msAjaxError=MsAjaxError;
		OsfMsAjaxFactory.msAjaxString=MsAjaxString;
		OsfMsAjaxFactory.msAjaxDebug=MsAjaxDebug;
	}
})(OfficeExt || (OfficeExt={}));
var OfficeExt;
(function (OfficeExt) {
	var MsAjaxJavaScriptSerializer=(function () {
		function MsAjaxJavaScriptSerializer() {
		}
		MsAjaxJavaScriptSerializer._init=function () {
			var replaceChars=['\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',
				'\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011',
				'\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019',
				'\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f'];
			MsAjaxJavaScriptSerializer._charsToEscape[0]='\\';
			MsAjaxJavaScriptSerializer._charsToEscapeRegExs['\\']=new RegExp('\\\\', 'g');
			MsAjaxJavaScriptSerializer._escapeChars['\\']='\\\\';
			MsAjaxJavaScriptSerializer._charsToEscape[1]='"';
			MsAjaxJavaScriptSerializer._charsToEscapeRegExs['"']=new RegExp('"', 'g');
			MsAjaxJavaScriptSerializer._escapeChars['"']='\\"';
			for (var i=0; i < 32; i++) {
				var c=String.fromCharCode(i);
				MsAjaxJavaScriptSerializer._charsToEscape[i+2]=c;
				MsAjaxJavaScriptSerializer._charsToEscapeRegExs[c]=new RegExp(c, 'g');
				MsAjaxJavaScriptSerializer._escapeChars[c]=replaceChars[i];
			}
		};
		MsAjaxJavaScriptSerializer.serialize=function (object) {
			var stringBuilder=new MsAjaxStringBuilder();
			MsAjaxJavaScriptSerializer.serializeWithBuilder(object, stringBuilder, false);
			return stringBuilder.toString();
		};
		MsAjaxJavaScriptSerializer.deserialize=function (data, secure) {
			if (data.length===0)
				throw OfficeExt.MsAjaxError.argument('data', "Cannot deserialize empty string.");
			try {
				var exp=data.replace(MsAjaxJavaScriptSerializer._dateRegEx, "$1new Date($2)");
				if (secure && MsAjaxJavaScriptSerializer._jsonRegEx.test(exp.replace(MsAjaxJavaScriptSerializer._jsonStringRegEx, '')))
					throw null;
				return eval('('+exp+')');
			}
			catch (e) {
				throw OfficeExt.MsAjaxError.argument('data', "Cannot deserialize. The data does not correspond to valid JSON.");
			}
		};
		MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder=function (object, stringBuilder) {
			stringBuilder.append(object.toString());
		};
		MsAjaxJavaScriptSerializer.serializeNumberWithBuilder=function (object, stringBuilder) {
			if (isFinite(object)) {
				stringBuilder.append(String(object));
			}
			else {
				throw OfficeExt.MsAjaxError.invalidOperation("Cannot serialize non finite numbers.");
			}
		};
		MsAjaxJavaScriptSerializer.serializeStringWithBuilder=function (str, stringBuilder) {
			stringBuilder.append('"');
			if (MsAjaxJavaScriptSerializer._escapeRegEx.test(str)) {
				if (MsAjaxJavaScriptSerializer._charsToEscape.length===0) {
					MsAjaxJavaScriptSerializer._init();
				}
				if (str.length < 128) {
					str=str.replace(MsAjaxJavaScriptSerializer._escapeRegExGlobal, function (x) { return MsAjaxJavaScriptSerializer._escapeChars[x]; });
				}
				else {
					for (var i=0; i < 34; i++) {
						var c=MsAjaxJavaScriptSerializer._charsToEscape[i];
						if (str.indexOf(c) !==-1) {
							if ((navigator.userAgent.indexOf("OPR/") > -1) || (navigator.userAgent.indexOf("Firefox") > -1)) {
								str=str.split(c).join(MsAjaxJavaScriptSerializer._escapeChars[c]);
							}
							else {
								str=str.replace(MsAjaxJavaScriptSerializer._charsToEscapeRegExs[c], MsAjaxJavaScriptSerializer._escapeChars[c]);
							}
						}
					}
				}
			}
			stringBuilder.append(str);
			stringBuilder.append('"');
		};
		MsAjaxJavaScriptSerializer.serializeWithBuilder=function (object, stringBuilder, sort, prevObjects) {
			var i;
			switch (typeof object) {
				case 'object':
					if (object) {
						if (prevObjects) {
							for (var j=0; j < prevObjects.length; j++) {
								if (prevObjects[j]===object) {
									throw OfficeExt.MsAjaxError.invalidOperation("Cannot serialize object with cyclic reference within child properties.");
								}
							}
						}
						else {
							prevObjects=new Array();
						}
						try {
							OfficeExt.MsAjaxArray.add(prevObjects, object);
							if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Number, object)) {
								MsAjaxJavaScriptSerializer.serializeNumberWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Boolean, object)) {
								MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(String, object)) {
								MsAjaxJavaScriptSerializer.serializeStringWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Array, object)) {
								stringBuilder.append('[');
								for (i=0; i < object.length;++i) {
									if (i > 0) {
										stringBuilder.append(',');
									}
									MsAjaxJavaScriptSerializer.serializeWithBuilder(object[i], stringBuilder, false, prevObjects);
								}
								stringBuilder.append(']');
							}
							else {
								if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Date, object)) {
									stringBuilder.append('"\\/Date(');
									stringBuilder.append(object.getTime());
									stringBuilder.append(')\\/"');
									break;
								}
								var properties=[];
								var propertyCount=0;
								for (var name in object) {
									if (OfficeExt.MsAjaxString.startsWith(name, '$')) {
										continue;
									}
									if (name===MsAjaxJavaScriptSerializer._serverTypeFieldName && propertyCount !==0) {
										properties[propertyCount++]=properties[0];
										properties[0]=name;
									}
									else {
										properties[propertyCount++]=name;
									}
								}
								if (sort)
									properties.sort();
								stringBuilder.append('{');
								var needComma=false;
								for (i=0; i < propertyCount; i++) {
									var value=object[properties[i]];
									if (typeof value !=='undefined' && typeof value !=='function') {
										if (needComma) {
											stringBuilder.append(',');
										}
										else {
											needComma=true;
										}
										MsAjaxJavaScriptSerializer.serializeWithBuilder(properties[i], stringBuilder, sort, prevObjects);
										stringBuilder.append(':');
										MsAjaxJavaScriptSerializer.serializeWithBuilder(value, stringBuilder, sort, prevObjects);
									}
								}
								stringBuilder.append('}');
							}
						}
						finally {
							OfficeExt.MsAjaxArray.removeAt(prevObjects, prevObjects.length - 1);
						}
					}
					else {
						stringBuilder.append('null');
					}
					break;
				case 'number':
					MsAjaxJavaScriptSerializer.serializeNumberWithBuilder(object, stringBuilder);
					break;
				case 'string':
					MsAjaxJavaScriptSerializer.serializeStringWithBuilder(object, stringBuilder);
					break;
				case 'boolean':
					MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder(object, stringBuilder);
					break;
				default:
					stringBuilder.append('null');
					break;
			}
		};
		MsAjaxJavaScriptSerializer.__patchVersion=0;
		MsAjaxJavaScriptSerializer._charsToEscapeRegExs=[];
		MsAjaxJavaScriptSerializer._charsToEscape=[];
		MsAjaxJavaScriptSerializer._dateRegEx=new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
		MsAjaxJavaScriptSerializer._escapeChars={};
		MsAjaxJavaScriptSerializer._escapeRegEx=new RegExp('["\\\\\\x00-\\x1F]', 'i');
		MsAjaxJavaScriptSerializer._escapeRegExGlobal=new RegExp('["\\\\\\x00-\\x1F]', 'g');
		MsAjaxJavaScriptSerializer._jsonRegEx=new RegExp('[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g');
		MsAjaxJavaScriptSerializer._jsonStringRegEx=new RegExp('"(\\\\.|[^"\\\\])*"', 'g');
		MsAjaxJavaScriptSerializer._serverTypeFieldName='__type';
		return MsAjaxJavaScriptSerializer;
	})();
	OfficeExt.MsAjaxJavaScriptSerializer=MsAjaxJavaScriptSerializer;
	var MsAjaxArray=(function () {
		function MsAjaxArray() {
		}
		MsAjaxArray.add=function (array, item) {
			array[array.length]=item;
		};
		MsAjaxArray.removeAt=function (array, index) {
			array.splice(index, 1);
		};
		MsAjaxArray.clone=function (array) {
			if (array.length===1) {
				return [array[0]];
			}
			else {
				return Array.apply(null, array);
			}
		};
		MsAjaxArray.remove=function (array, item) {
			var index=MsAjaxArray.indexOf(array, item);
			if (index >=0) {
				array.splice(index, 1);
			}
			return (index >=0);
		};
		MsAjaxArray.indexOf=function (array, item, start) {
			if (typeof (item)==="undefined")
				return -1;
			var length=array.length;
			if (length !==0) {
				start=start - 0;
				if (isNaN(start)) {
					start=0;
				}
				else {
					if (isFinite(start)) {
						start=start - (start % 1);
					}
					if (start < 0) {
						start=Math.max(0, length+start);
					}
				}
				for (var i=start; i < length; i++) {
					if ((typeof (array[i]) !=="undefined") && (array[i]===item)) {
						return i;
					}
				}
			}
			return -1;
		};
		return MsAjaxArray;
	})();
	OfficeExt.MsAjaxArray=MsAjaxArray;
	var MsAjaxStringBuilder=(function () {
		function MsAjaxStringBuilder(initialText) {
			this._parts=(typeof (initialText) !=='undefined' && initialText !==null && initialText !=='') ?
				[initialText.toString()] : [];
			this._value={};
			this._len=0;
		}
		MsAjaxStringBuilder.prototype.append=function (text) {
			this._parts[this._parts.length]=text;
		};
		MsAjaxStringBuilder.prototype.toString=function (separator) {
			separator=separator || '';
			var parts=this._parts;
			if (this._len !==parts.length) {
				this._value={};
				this._len=parts.length;
			}
			var val=this._value;
			if (typeof (val[separator])==='undefined') {
				if (separator !=='') {
					for (var i=0; i < parts.length;) {
						if ((typeof (parts[i])==='undefined') || (parts[i]==='') || (parts[i]===null)) {
							parts.splice(i, 1);
						}
						else {
							i++;
						}
					}
				}
				val[separator]=this._parts.join(separator);
			}
			return val[separator];
		};
		return MsAjaxStringBuilder;
	})();
	OfficeExt.MsAjaxStringBuilder=MsAjaxStringBuilder;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		OsfMsAjaxFactory.msAjaxSerializer=MsAjaxJavaScriptSerializer;
	}
})(OfficeExt || (OfficeExt={}));
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Common", Microsoft.Office);
OSF.SerializerVersion={
	MsAjax: 0,
	Browser: 1
};
var OfficeExt;
(function (OfficeExt) {
	function appSpecificCheckOriginFunction(url, eventObj, messageObj, checkOriginFunction) {
		return true;
	}
	;
	OfficeExt.appSpecificCheckOrigin=appSpecificCheckOriginFunction;
})(OfficeExt || (OfficeExt={}));
(function (window) {
	"use strict";
	var stringRegEx=new RegExp('"(\\\\.|[^"\\\\])*"', 'g'), trueFalseNullRegEx=new RegExp('\\b(true|false|null)\\b', 'g'), numbersRegEx=new RegExp('-?(0|([1-9]\\d*))(\\.\\d+)?([eE][+-]?\\d+)?', 'g'), badBracketsRegEx=new RegExp('[^{:,\\[\\s](?=\\s*\\[)'), badRemainderRegEx=new RegExp('[^\\s\\[\\]{}:,]'), jsonErrorMsg="Cannot deserialize. The data does not correspond to valid JSON.";
	function addHandler(element, eventName, handler) {
		if (element.addEventListener) {
			element.addEventListener(eventName, handler, false);
		}
		else if (element.attachEvent) {
			element.attachEvent("on"+eventName, handler);
		}
	}
	function getAjaxSerializer() {
		if (OsfMsAjaxFactory.msAjaxSerializer) {
			return OsfMsAjaxFactory.msAjaxSerializer;
		}
		return null;
	}
	function deserialize(data, secure, oldDeserialize) {
		var transformed;
		if (!secure) {
			return oldDeserialize(data);
		}
		if (window.JSON && window.JSON.parse) {
			return window.JSON.parse(data);
		}
		transformed=data.replace(stringRegEx, "[]");
		transformed=transformed.replace(trueFalseNullRegEx, "[]");
		transformed=transformed.replace(numbersRegEx, "[]");
		if (badBracketsRegEx.test(transformed)) {
			throw jsonErrorMsg;
		}
		if (badRemainderRegEx.test(transformed)) {
			throw jsonErrorMsg;
		}
		try {
			eval("("+data+")");
		}
		catch (e) {
			throw jsonErrorMsg;
		}
	}
	function patchDeserializer() {
		var serializer=getAjaxSerializer(), oldDeserialize;
		if (serializer===null || typeof (serializer.deserialize) !=="function") {
			return false;
		}
		if (serializer.__patchVersion >=1) {
			return true;
		}
		oldDeserialize=serializer.deserialize;
		serializer.deserialize=function (data, secure) {
			return deserialize(data, true, oldDeserialize);
		};
		serializer.__patchVersion=1;
		return true;
	}
	if (!patchDeserializer()) {
		addHandler(window, "load", function () {
			patchDeserializer();
		});
	}
}(window));
Microsoft.Office.Common.InvokeType={ "async": 0,
	"sync": 1,
	"asyncRegisterEvent": 2,
	"asyncUnregisterEvent": 3,
	"syncRegisterEvent": 4,
	"syncUnregisterEvent": 5
};
Microsoft.Office.Common.InvokeResultCode={
	"noError": 0,
	"errorInRequest": -1,
	"errorHandlingRequest": -2,
	"errorInResponse": -3,
	"errorHandlingResponse": -4,
	"errorHandlingRequestAccessDenied": -5,
	"errorHandlingMethodCallTimedout": -6
};
Microsoft.Office.Common.MessageType={ "request": 0,
	"response": 1
};
Microsoft.Office.Common.ActionType={ "invoke": 0,
	"registerEvent": 1,
	"unregisterEvent": 2 };
Microsoft.Office.Common.ResponseType={ "forCalling": 0,
	"forEventing": 1
};
Microsoft.Office.Common.MethodObject=function Microsoft_Office_Common_MethodObject(method, invokeType, blockingOthers) {
	this._method=method;
	this._invokeType=invokeType;
	this._blockingOthers=blockingOthers;
};
Microsoft.Office.Common.MethodObject.prototype={
	getMethod: function Microsoft_Office_Common_MethodObject$getMethod() {
		return this._method;
	},
	getInvokeType: function Microsoft_Office_Common_MethodObject$getInvokeType() {
		return this._invokeType;
	},
	getBlockingFlag: function Microsoft_Office_Common_MethodObject$getBlockingFlag() {
		return this._blockingOthers;
	}
};
Microsoft.Office.Common.EventMethodObject=function Microsoft_Office_Common_EventMethodObject(registerMethodObject, unregisterMethodObject) {
	this._registerMethodObject=registerMethodObject;
	this._unregisterMethodObject=unregisterMethodObject;
};
Microsoft.Office.Common.EventMethodObject.prototype={
	getRegisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getRegisterMethodObject() {
		return this._registerMethodObject;
	},
	getUnregisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getUnregisterMethodObject() {
		return this._unregisterMethodObject;
	}
};
Microsoft.Office.Common.ServiceEndPoint=function Microsoft_Office_Common_ServiceEndPoint(serviceEndPointId) {
	var e=Function._validateParams(arguments, [
		{ name: "serviceEndPointId", type: String, mayBeNull: false }
	]);
	if (e)
		throw e;
	this._methodObjectList={};
	this._eventHandlerProxyList={};
	this._Id=serviceEndPointId;
	this._conversations={};
	this._policyManager=null;
	this._appDomains={};
	this._onHandleRequestError=null;
};
Microsoft.Office.Common.ServiceEndPoint.prototype={
	registerMethod: function Microsoft_Office_Common_ServiceEndPoint$registerMethod(methodName, method, invokeType, blockingOthers) {
		var e=Function._validateParams(arguments, [{ name: "methodName", type: String, mayBeNull: false },
			{ name: "method", type: Function, mayBeNull: false },
			{ name: "invokeType", type: Number, mayBeNull: false },
			{ name: "blockingOthers", type: Boolean, mayBeNull: false }
		]);
		if (e)
			throw e;
		if (invokeType !==Microsoft.Office.Common.InvokeType.async
			&& invokeType !==Microsoft.Office.Common.InvokeType.sync) {
			throw OsfMsAjaxFactory.msAjaxError.argument("invokeType");
		}
		var methodObject=new Microsoft.Office.Common.MethodObject(method, invokeType, blockingOthers);
		this._methodObjectList[methodName]=methodObject;
	},
	unregisterMethod: function Microsoft_Office_Common_ServiceEndPoint$unregisterMethod(methodName) {
		var e=Function._validateParams(arguments, [
			{ name: "methodName", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		delete this._methodObjectList[methodName];
	},
	registerEvent: function Microsoft_Office_Common_ServiceEndPoint$registerEvent(eventName, registerMethod, unregisterMethod) {
		var e=Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false }
		]);
		if (e)
			throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, Microsoft.Office.Common.InvokeType.syncRegisterEvent, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, Microsoft.Office.Common.InvokeType.syncUnregisterEvent, false));
		this._methodObjectList[eventName]=methodObject;
	},
	registerEventEx: function Microsoft_Office_Common_ServiceEndPoint$registerEventEx(eventName, registerMethod, registerMethodInvokeType, unregisterMethod, unregisterMethodInvokeType) {
		var e=Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "registerMethodInvokeType", type: Number, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethodInvokeType", type: Number, mayBeNull: false }
		]);
		if (e)
			throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, registerMethodInvokeType, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, unregisterMethodInvokeType, false));
		this._methodObjectList[eventName]=methodObject;
	},
	unregisterEvent: function (eventName) {
		var e=Function._validateParams(arguments, [
			{ name: "eventName", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		this.unregisterMethod(eventName);
	},
	registerConversation: function Microsoft_Office_Common_ServiceEndPoint$registerConversation(conversationId, conversationUrl, appDomains, serializerVersion) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false },
			{ name: "conversationUrl", type: String, mayBeNull: false, optional: true },
			{ name: "appDomains", type: Object, mayBeNull: true, optional: true },
			{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		;
		if (appDomains) {
			if (!(appDomains instanceof Array)) {
				throw OsfMsAjaxFactory.msAjaxError.argument("appDomains");
			}
			this._appDomains[conversationId]=appDomains;
		}
		this._conversations[conversationId]={ url: conversationUrl, serializerVersion: serializerVersion };
	},
	unregisterConversation: function Microsoft_Office_Common_ServiceEndPoint$unregisterConversation(conversationId) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false }
		]);
		if (e)
			throw e;
		delete this._conversations[conversationId];
	},
	setPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$setPolicyManager(policyManager) {
		var e=Function._validateParams(arguments, [
			{ name: "policyManager", type: Object, mayBeNull: false }
		]);
		if (e)
			throw e;
		if (!policyManager.checkPermission) {
			throw OsfMsAjaxFactory.msAjaxError.argument("policyManager");
		}
		this._policyManager=policyManager;
	},
	getPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$getPolicyManager() {
		return this._policyManager;
	}
};
Microsoft.Office.Common.ClientEndPoint=function Microsoft_Office_Common_ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion) {
	var e=Function._validateParams(arguments, [
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "targetWindow", mayBeNull: false },
		{ name: "targetUrl", type: String, mayBeNull: false },
		{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	try {
		if (!targetWindow.postMessage) {
			throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
		}
	}
	catch (ex) {
		if (!Object.prototype.hasOwnProperty.call(targetWindow, "postMessage")) {
			throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
		}
	}
	this._conversationId=conversationId;
	this._targetWindow=targetWindow;
	this._targetUrl=targetUrl;
	this._callingIndex=0;
	this._callbackList={};
	this._eventHandlerList={};
	if (serializerVersion !=null) {
		this._serializerVersion=serializerVersion;
	}
	else {
		this._serializerVersion=OSF.SerializerVersion.MsAjax;
	}
};
Microsoft.Office.Common.ClientEndPoint.prototype={
	invoke: function Microsoft_Office_Common_ClientEndPoint$invoke(targetMethodName, callback, param) {
		var e=Function._validateParams(arguments, [{ name: "targetMethodName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "param", mayBeNull: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		var callbackEntry={ "callback": callback, "createdOn": now.getTime() };
		if (param && typeof param==="object" && typeof param.__timeout__==="number") {
			callbackEntry.timeout=param.__timeout__;
			delete param.__timeout__;
		}
		this._callbackList[correlationId]=callbackEntry;
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetMethodName, Microsoft.Office.Common.ActionType.invoke, this._conversationId, correlationId, param);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null)
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	registerForEvent: function Microsoft_Office_Common_ClientEndPoint$registerForEvent(targetEventName, eventHandler, callback, data) {
		var e=Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "eventHandler", type: Function, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={ "callback": callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.registerEvent, this._conversationId, correlationId, data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
			this._eventHandlerList[targetEventName]=eventHandler;
		}
		catch (ex) {
			try {
				if (callback !==null) {
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
				}
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	unregisterForEvent: function Microsoft_Office_Common_ClientEndPoint$unregisterForEvent(targetEventName, callback, data) {
		var e=Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e)
			throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={ "callback": callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.unregisterEvent, this._conversationId, correlationId, data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null) {
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
				}
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
		finally {
			delete this._eventHandlerList[targetEventName];
		}
	}
};
Microsoft.Office.Common.XdmCommunicationManager=(function () {
	var _invokerQueue=[];
	var _lastMessageProcessTime=null;
	var _messageProcessingTimer=null;
	var _processInterval=10;
	var _blockingFlag=false;
	var _methodTimeoutTimer=null;
	var _methodTimeoutProcessInterval=2000;
	var _methodTimeoutDefault=65000;
	var _methodTimeout=_methodTimeoutDefault;
	var _serviceEndPoints={};
	var _clientEndPoints={};
	var _initialized=false;
	function _lookupServiceEndPoint(conversationId) {
		for (var id in _serviceEndPoints) {
			if (_serviceEndPoints[id]._conversations[conversationId]) {
				return _serviceEndPoints[id];
			}
		}
		OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
		throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
	}
	;
	function _lookupClientEndPoint(conversationId) {
		var clientEndPoint=_clientEndPoints[conversationId];
		if (!clientEndPoint) {
			OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
			throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
		}
		return clientEndPoint;
	}
	;
	function _lookupMethodObject(serviceEndPoint, messageObject) {
		var methodOrEventMethodObject=serviceEndPoint._methodObjectList[messageObject._actionName];
		if (!methodOrEventMethodObject) {
			OsfMsAjaxFactory.msAjaxDebug.trace("The specified method is not registered on service endpoint:"+messageObject._actionName);
			throw OsfMsAjaxFactory.msAjaxError.argument("messageObject");
		}
		var methodObject=null;
		if (messageObject._actionType===Microsoft.Office.Common.ActionType.invoke) {
			methodObject=methodOrEventMethodObject;
		}
		else if (messageObject._actionType===Microsoft.Office.Common.ActionType.registerEvent) {
			methodObject=methodOrEventMethodObject.getRegisterMethodObject();
		}
		else {
			methodObject=methodOrEventMethodObject.getUnregisterMethodObject();
		}
		return methodObject;
	}
	;
	function _enqueInvoker(invoker) {
		_invokerQueue.push(invoker);
	}
	;
	function _dequeInvoker() {
		if (_messageProcessingTimer !==null) {
			if (!_blockingFlag) {
				if (_invokerQueue.length > 0) {
					var invoker=_invokerQueue.shift();
					_executeCommand(invoker);
				}
				else {
					clearInterval(_messageProcessingTimer);
					_messageProcessingTimer=null;
				}
			}
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	}
	;
	function _executeCommand(invoker) {
		_blockingFlag=invoker.getInvokeBlockingFlag();
		invoker.invoke();
		_lastMessageProcessTime=(new Date()).getTime();
	}
	;
	function _checkMethodTimeout() {
		if (_methodTimeoutTimer) {
			var clientEndPoint;
			var methodCallsNotTimedout=0;
			var now=new Date();
			var timeoutValue;
			for (var conversationId in _clientEndPoints) {
				clientEndPoint=_clientEndPoints[conversationId];
				for (var correlationId in clientEndPoint._callbackList) {
					var callbackEntry=clientEndPoint._callbackList[correlationId];
					timeoutValue=callbackEntry.timeout ? callbackEntry.timeout : _methodTimeout;
					if (timeoutValue >=0 && Math.abs(now.getTime() - callbackEntry.createdOn) >=timeoutValue) {
						try {
							if (callbackEntry.callback) {
								callbackEntry.callback(Microsoft.Office.Common.InvokeResultCode.errorHandlingMethodCallTimedout, null);
							}
						}
						finally {
							delete clientEndPoint._callbackList[correlationId];
						}
					}
					else {
						methodCallsNotTimedout++;
					}
					;
				}
			}
			if (methodCallsNotTimedout===0) {
				clearInterval(_methodTimeoutTimer);
				_methodTimeoutTimer=null;
			}
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	}
	;
	function _postCallbackHandler() {
		_blockingFlag=false;
	}
	;
	function _registerListener(listener) {
		if (window.addEventListener) {
			window.addEventListener("message", listener, false);
		}
		else if ((navigator.userAgent.indexOf("MSIE") > -1) && window.attachEvent) {
			window.attachEvent("onmessage", listener);
		}
		else {
			OsfMsAjaxFactory.msAjaxDebug.trace("Browser doesn't support the required API.");
			throw OsfMsAjaxFactory.msAjaxError.argument("Browser");
		}
	}
	;
	function _checkOrigin(url, origin) {
		var res=false;
		if (url===true) {
			return true;
		}
		if (!url || !origin || !url.length || !origin.length) {
			return res;
		}
		var url_parser, org_parser;
		url_parser=document.createElement('a');
		org_parser=document.createElement('a');
		url_parser.href=url;
		org_parser.href=origin;
		res=_urlCompare(url_parser, org_parser);
		delete url_parser, org_parser;
		return res;
	}
	function _checkOriginWithAppDomains(allowed_domains, origin) {
		var res=false;
		if (!origin || !origin.length || !(allowed_domains) || !(allowed_domains instanceof Array) || !allowed_domains.length) {
			return res;
		}
		var org_parser=document.createElement('a');
		var app_domain_parser=document.createElement('a');
		org_parser.href=origin;
		for (var i=0; i < allowed_domains.length && !res; i++) {
			if (allowed_domains[i].indexOf("://") !==-1) {
				app_domain_parser.href=allowed_domains[i];
				res=_urlCompare(org_parser, app_domain_parser);
			}
		}
		delete org_parser, app_domain_parser;
		return res;
	}
	function _urlCompare(url_parser1, url_parser2) {
		return ((url_parser1.hostname==url_parser2.hostname) &&
			(url_parser1.protocol==url_parser2.protocol) &&
			(url_parser1.port==url_parser2.port));
	}
	function _receive(e) {
		if (e.data !='') {
			var messageObject;
			var serializerVersion=OSF.SerializerVersion.MsAjax;
			var serializedMessage=e.data;
			try {
				messageObject=Microsoft.Office.Common.MessagePackager.unenvelope(serializedMessage, OSF.SerializerVersion.Browser);
				serializerVersion=messageObject._serializerVersion !=null ? messageObject._serializerVersion : serializerVersion;
			}
			catch (ex) {
			}
			if (serializerVersion !=OSF.SerializerVersion.Browser) {
				try {
					messageObject=Microsoft.Office.Common.MessagePackager.unenvelope(serializedMessage, serializerVersion);
				}
				catch (ex) {
					return;
				}
			}
			if (typeof (messageObject._messageType)=='undefined') {
				return;
			}
			if (messageObject._messageType===Microsoft.Office.Common.MessageType.request) {
				var requesterUrl=(e.origin==null || e.origin=="null") ? messageObject._origin : e.origin;
				try {
					var serviceEndPoint=_lookupServiceEndPoint(messageObject._conversationId);
					;
					var conversation=serviceEndPoint._conversations[messageObject._conversationId];
					serializerVersion=conversation.serializerVersion !=null ? conversation.serializerVersion : serializerVersion;
					;
					if (!_checkOrigin(conversation.url, e.origin) &&
						!_checkOriginWithAppDomains(serviceEndPoint._appDomains[messageObject._conversationId], e.origin) &&
						!OfficeExt.appSpecificCheckOrigin(conversation.url, e, messageObject, _checkOrigin)) {
						throw "Failed origin check";
					}
					var policyManager=serviceEndPoint.getPolicyManager();
					if (policyManager && !policyManager.checkPermission(messageObject._conversationId, messageObject._actionName, messageObject._data)) {
						throw "Access Denied";
					}
					var methodObject=_lookupMethodObject(serviceEndPoint, messageObject);
					var invokeCompleteCallback=new Microsoft.Office.Common.InvokeCompleteCallback(e.source, requesterUrl, messageObject._actionName, messageObject._conversationId, messageObject._correlationId, _postCallbackHandler, serializerVersion);
					var invoker=new Microsoft.Office.Common.Invoker(methodObject, messageObject._data, invokeCompleteCallback, serviceEndPoint._eventHandlerProxyList, messageObject._conversationId, messageObject._actionName, serializerVersion);
					var shouldEnque=true;
					if (_messageProcessingTimer==null) {
						if ((_lastMessageProcessTime==null || (new Date()).getTime() - _lastMessageProcessTime > _processInterval) && !_blockingFlag) {
							_executeCommand(invoker);
							shouldEnque=false;
						}
						else {
							_messageProcessingTimer=setInterval(_dequeInvoker, _processInterval);
						}
					}
					if (shouldEnque) {
						_enqueInvoker(invoker);
					}
				}
				catch (ex) {
					if (serviceEndPoint && serviceEndPoint._onHandleRequestError) {
						serviceEndPoint._onHandleRequestError(messageObject, ex);
					}
					var errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequest;
					if (ex=="Access Denied") {
						errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied;
					}
					var callResponse=new Microsoft.Office.Common.Response(messageObject._actionName, messageObject._conversationId, messageObject._correlationId, errorCode, Microsoft.Office.Common.ResponseType.forCalling, ex);
					var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(callResponse, serializerVersion);
					if (e.source && e.source.postMessage) {
						e.source.postMessage(envelopedResult, requesterUrl);
					}
				}
			}
			else if (messageObject._messageType===Microsoft.Office.Common.MessageType.response) {
				var clientEndPoint=_lookupClientEndPoint(messageObject._conversationId);
				clientEndPoint._serializerVersion=serializerVersion;
				;
				if (!_checkOrigin(clientEndPoint._targetUrl, e.origin)) {
					throw "Failed orgin check";
				}
				if (messageObject._responseType===Microsoft.Office.Common.ResponseType.forCalling) {
					var callbackEntry=clientEndPoint._callbackList[messageObject._correlationId];
					if (callbackEntry) {
						try {
							if (callbackEntry.callback)
								callbackEntry.callback(messageObject._errorCode, messageObject._data);
						}
						finally {
							delete clientEndPoint._callbackList[messageObject._correlationId];
						}
					}
				}
				else {
					var eventhandler=clientEndPoint._eventHandlerList[messageObject._actionName];
					if (eventhandler !==undefined && eventhandler !==null) {
						eventhandler(messageObject._data);
					}
				}
			}
			else {
				return;
			}
		}
	}
	;
	function _initialize() {
		if (!_initialized) {
			_registerListener(_receive);
			_initialized=true;
		}
	}
	;
	return {
		connect: function Microsoft_Office_Common_XdmCommunicationManager$connect(conversationId, targetWindow, targetUrl, serializerVersion) {
			var clientEndPoint=_clientEndPoints[conversationId];
			if (!clientEndPoint) {
				_initialize();
				clientEndPoint=new Microsoft.Office.Common.ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion);
				_clientEndPoints[conversationId]=clientEndPoint;
			}
			return clientEndPoint;
		},
		getClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{ name: "conversationId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			return _clientEndPoints[conversationId];
		},
		createServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$createServiceEndPoint(serviceEndPointId) {
			_initialize();
			var serviceEndPoint=new Microsoft.Office.Common.ServiceEndPoint(serviceEndPointId);
			_serviceEndPoints[serviceEndPointId]=serviceEndPoint;
			return serviceEndPoint;
		},
		getServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getServiceEndPoint(serviceEndPointId) {
			var e=Function._validateParams(arguments, [
				{ name: "serviceEndPointId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			return _serviceEndPoints[serviceEndPointId];
		},
		deleteClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$deleteClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{ name: "conversationId", type: String, mayBeNull: false }
			]);
			if (e)
				throw e;
			delete _clientEndPoints[conversationId];
		},
		_setMethodTimeout: function Microsoft_Office_Common_XdmCommunicationManager$_setMethodTimeout(methodTimeout) {
			var e=Function._validateParams(arguments, [
				{ name: "methodTimeout", type: Number, mayBeNull: false }
			]);
			if (e)
				throw e;
			_methodTimeout=(methodTimeout <=0) ? _methodTimeoutDefault : methodTimeout;
		},
		_startMethodTimeoutTimer: function Microsoft_Office_Common_XdmCommunicationManager$_startMethodTimeoutTimer() {
			if (!_methodTimeoutTimer) {
				_methodTimeoutTimer=setInterval(_checkMethodTimeout, _methodTimeoutProcessInterval);
			}
		}
	};
})();
Microsoft.Office.Common.Message=function Microsoft_Office_Common_Message(messageType, actionName, conversationId, correlationId, data) {
	var e=Function._validateParams(arguments, [{ name: "messageType", type: Number, mayBeNull: false },
		{ name: "actionName", type: String, mayBeNull: false },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "correlationId", mayBeNull: false },
		{ name: "data", mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._messageType=messageType;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._origin=window.location.href;
	if (typeof data=="undefined") {
		this._data=null;
	}
	else {
		this._data=data;
	}
};
Microsoft.Office.Common.Message.prototype={
	getActionName: function Microsoft_Office_Common_Message$getActionName() {
		return this._actionName;
	},
	getConversationId: function Microsoft_Office_Common_Message$getConversationId() {
		return this._conversationId;
	},
	getCorrelationId: function Microsoft_Office_Common_Message$getCorrelationId() {
		return this._correlationId;
	},
	getOrigin: function Microsoft_Office_Common_Message$getOrigin() {
		return this._origin;
	},
	getData: function Microsoft_Office_Common_Message$getData() {
		return this._data;
	},
	getMessageType: function Microsoft_Office_Common_Message$getMessageType() {
		return this._messageType;
	}
};
Microsoft.Office.Common.Request=function Microsoft_Office_Common_Request(actionName, actionType, conversationId, correlationId, data) {
	Microsoft.Office.Common.Request.uber.constructor.call(this, Microsoft.Office.Common.MessageType.request, actionName, conversationId, correlationId, data);
	this._actionType=actionType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Request, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Request.prototype.getActionType=function Microsoft_Office_Common_Request$getActionType() {
	return this._actionType;
};
Microsoft.Office.Common.Response=function Microsoft_Office_Common_Response(actionName, conversationId, correlationId, errorCode, responseType, data) {
	Microsoft.Office.Common.Response.uber.constructor.call(this, Microsoft.Office.Common.MessageType.response, actionName, conversationId, correlationId, data);
	this._errorCode=errorCode;
	this._responseType=responseType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Response, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Response.prototype.getErrorCode=function Microsoft_Office_Common_Response$getErrorCode() {
	return this._errorCode;
};
Microsoft.Office.Common.Response.prototype.getResponseType=function Microsoft_Office_Common_Response$getResponseType() {
	return this._responseType;
};
Microsoft.Office.Common.MessagePackager={
	envelope: function Microsoft_Office_Common_MessagePackager$envelope(messageObject, serializerVersion) {
		if (serializerVersion==OSF.SerializerVersion.Browser && (typeof (JSON) !=="undefined")) {
			if (typeof (messageObject)==="object") {
				messageObject._serializerVersion=serializerVersion;
			}
			return JSON.stringify(messageObject);
		}
		else {
			if (typeof (messageObject)==="object") {
				messageObject._serializerVersion=OSF.SerializerVersion.MsAjax;
			}
			return OsfMsAjaxFactory.msAjaxSerializer.serialize(messageObject);
		}
	},
	unenvelope: function Microsoft_Office_Common_MessagePackager$unenvelope(messageObject, serializerVersion) {
		if (serializerVersion==OSF.SerializerVersion.Browser && (typeof (JSON) !=="undefined")) {
			return JSON.parse(messageObject);
		}
		else {
			return OsfMsAjaxFactory.msAjaxSerializer.deserialize(messageObject, true);
		}
	}
};
Microsoft.Office.Common.ResponseSender=function Microsoft_Office_Common_ResponseSender(requesterWindow, requesterUrl, actionName, conversationId, correlationId, responseType, serializerVersion) {
	var e=Function._validateParams(arguments, [{ name: "requesterWindow", mayBeNull: false },
		{ name: "requesterUrl", type: String, mayBeNull: false },
		{ name: "actionName", type: String, mayBeNull: false },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "correlationId", mayBeNull: false },
		{ name: "responsetype", type: Number, maybeNull: false },
		{ name: "serializerVersion", type: Number, maybeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._requesterWindow=requesterWindow;
	this._requesterUrl=requesterUrl;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._invokeResultCode=Microsoft.Office.Common.InvokeResultCode.noError;
	this._responseType=responseType;
	var me=this;
	this._send=function (result) {
		try {
			var response=new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
			var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
			me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
			;
		}
		catch (ex) {
			OsfMsAjaxFactory.msAjaxDebug.trace("ResponseSender._send error:"+ex.message);
		}
	};
};
Microsoft.Office.Common.ResponseSender.prototype={
	getRequesterWindow: function Microsoft_Office_Common_ResponseSender$getRequesterWindow() {
		return this._requesterWindow;
	},
	getRequesterUrl: function Microsoft_Office_Common_ResponseSender$getRequesterUrl() {
		return this._requesterUrl;
	},
	getActionName: function Microsoft_Office_Common_ResponseSender$getActionName() {
		return this._actionName;
	},
	getConversationId: function Microsoft_Office_Common_ResponseSender$getConversationId() {
		return this._conversationId;
	},
	getCorrelationId: function Microsoft_Office_Common_ResponseSender$getCorrelationId() {
		return this._correlationId;
	},
	getSend: function Microsoft_Office_Common_ResponseSender$getSend() {
		return this._send;
	},
	setResultCode: function Microsoft_Office_Common_ResponseSender$setResultCode(resultCode) {
		this._invokeResultCode=resultCode;
	}
};
Microsoft.Office.Common.InvokeCompleteCallback=function Microsoft_Office_Common_InvokeCompleteCallback(requesterWindow, requesterUrl, actionName, conversationId, correlationId, postCallbackHandler, serializerVersion) {
	Microsoft.Office.Common.InvokeCompleteCallback.uber.constructor.call(this, requesterWindow, requesterUrl, actionName, conversationId, correlationId, Microsoft.Office.Common.ResponseType.forCalling, serializerVersion);
	this._postCallbackHandler=postCallbackHandler;
	var me=this;
	this._send=function (result) {
		try {
			var response=new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
			var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
			me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
			me._postCallbackHandler();
		}
		catch (ex) {
			OsfMsAjaxFactory.msAjaxDebug.trace("InvokeCompleteCallback._send error:"+ex.message);
		}
	};
};
OSF.OUtil.extend(Microsoft.Office.Common.InvokeCompleteCallback, Microsoft.Office.Common.ResponseSender);
Microsoft.Office.Common.Invoker=function Microsoft_Office_Common_Invoker(methodObject, paramValue, invokeCompleteCallback, eventHandlerProxyList, conversationId, eventName, serializerVersion) {
	var e=Function._validateParams(arguments, [
		{ name: "methodObject", mayBeNull: false },
		{ name: "paramValue", mayBeNull: true },
		{ name: "invokeCompleteCallback", mayBeNull: false },
		{ name: "eventHandlerProxyList", mayBeNull: true },
		{ name: "conversationId", type: String, mayBeNull: false },
		{ name: "eventName", type: String, mayBeNull: false },
		{ name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
	]);
	if (e)
		throw e;
	this._methodObject=methodObject;
	this._param=paramValue;
	this._invokeCompleteCallback=invokeCompleteCallback;
	this._eventHandlerProxyList=eventHandlerProxyList;
	this._conversationId=conversationId;
	this._eventName=eventName;
	this._serializerVersion=serializerVersion;
};
Microsoft.Office.Common.Invoker.prototype={
	invoke: function Microsoft_Office_Common_Invoker$invoke() {
		try {
			var result;
			switch (this._methodObject.getInvokeType()) {
				case Microsoft.Office.Common.InvokeType.async:
					this._methodObject.getMethod()(this._param, this._invokeCompleteCallback.getSend());
					break;
				case Microsoft.Office.Common.InvokeType.sync:
					result=this._methodObject.getMethod()(this._param);
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncRegisterEvent:
					var eventHandlerProxy=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					result=this._methodObject.getMethod()(eventHandlerProxy.getSend(), this._param);
					this._eventHandlerProxyList[this._conversationId+this._eventName]=eventHandlerProxy.getSend();
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncUnregisterEvent:
					var eventHandler=this._eventHandlerProxyList[this._conversationId+this._eventName];
					result=this._methodObject.getMethod()(eventHandler, this._param);
					delete this._eventHandlerProxyList[this._conversationId+this._eventName];
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.asyncRegisterEvent:
					var eventHandlerProxyAsync=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					this._methodObject.getMethod()(eventHandlerProxyAsync.getSend(), this._invokeCompleteCallback.getSend(), this._param);
					this._eventHandlerProxyList[this._callerId+this._eventName]=eventHandlerProxyAsync.getSend();
					break;
				case Microsoft.Office.Common.InvokeType.asyncUnregisterEvent:
					var eventHandlerAsync=this._eventHandlerProxyList[this._callerId+this._eventName];
					this._methodObject.getMethod()(eventHandlerAsync, this._invokeCompleteCallback.getSend(), this._param);
					delete this._eventHandlerProxyList[this._callerId+this._eventName];
					break;
				default:
					break;
			}
		}
		catch (ex) {
			this._invokeCompleteCallback.setResultCode(Microsoft.Office.Common.InvokeResultCode.errorInResponse);
			this._invokeCompleteCallback.getSend()(ex);
		}
	},
	getInvokeBlockingFlag: function Microsoft_Office_Common_Invoker$getInvokeBlockingFlag() {
		return this._methodObject.getBlockingFlag();
	},
	_createEventHandlerProxyObject: function Microsoft_Office_Common_Invoker$_createEventHandlerProxyObject(invokeCompleteObject) {
		return new Microsoft.Office.Common.ResponseSender(invokeCompleteObject.getRequesterWindow(), invokeCompleteObject.getRequesterUrl(), invokeCompleteObject.getActionName(), invokeCompleteObject.getConversationId(), invokeCompleteObject.getCorrelationId(), Microsoft.Office.Common.ResponseType.forEventing, this._serializerVersion);
	}
};
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.DDA.WAC.UniqueArguments={
	Data: "Data",
	Properties: "Properties",
	BindingRequest: "DdaBindingsMethod",
	BindingResponse: "Bindings",
	SingleBindingResponse: "singleBindingResponse",
	GetData: "DdaGetBindingData",
	AddRowsColumns: "DdaAddRowsColumns",
	SetData: "DdaSetBindingData",
	ClearFormats: "DdaClearBindingFormats",
	SetFormats: "DdaSetBindingFormats",
	SettingsRequest: "DdaSettingsMethod",
	BindingEventSource: "ddaBinding",
	ArrayData: "ArrayData"
};
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.Delegate.SpecialProcessor=function OSF_DDA_WAC_Delegate_SpecialProcessor() {
	var complexTypes=[
		OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
		OSF.DDA.WAC.UniqueArguments.BindingRequest,
		OSF.DDA.WAC.UniqueArguments.BindingResponse,
		OSF.DDA.WAC.UniqueArguments.GetData,
		OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
		OSF.DDA.WAC.UniqueArguments.SetData,
		OSF.DDA.WAC.UniqueArguments.ClearFormats,
		OSF.DDA.WAC.UniqueArguments.SetFormats,
		OSF.DDA.WAC.UniqueArguments.SettingsRequest,
		OSF.DDA.WAC.UniqueArguments.BindingEventSource
	];
	var dynamicTypes={};
	OSF.DDA.WAC.Delegate.SpecialProcessor.uber.constructor.call(this, complexTypes, dynamicTypes);
};
OSF.OUtil.extend(OSF.DDA.WAC.Delegate.SpecialProcessor, OSF.DDA.SpecialProcessor);
OSF.DDA.WAC.Delegate.ParameterMap=OSF.DDA.getDecoratedParameterMap(new OSF.DDA.WAC.Delegate.SpecialProcessor(), []);
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.getDelegateMethods=function OSF_DDA_WAC_getDelegateMethods() {
	var delegateMethods={};
	delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.WAC.Delegate.executeAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync]=OSF.DDA.WAC.Delegate.registerEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync]=OSF.DDA.WAC.Delegate.unregisterEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog]=OSF.DDA.WAC.Delegate.openDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent]=OSF.DDA.WAC.Delegate.messageParent;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog]=OSF.DDA.WAC.Delegate.closeDialog;
	return delegateMethods;
};
OSF.DDA.WAC.Delegate.version=1;
OSF.DDA.WAC.Delegate.executeAsync=function OSF_DDA_WAC_Delegate$executeAsync(args) {
	if (!args.hostCallArgs) {
		args.hostCallArgs={};
	}
	args.hostCallArgs["DdaMethod"]={
		"ControlId": OSF._OfficeAppFactory.getId(),
		"Version": OSF.DDA.WAC.Delegate.version,
		"DispatchId": args.dispId
	};
	args.hostCallArgs["__timeout__"]=-1;
	if (args.onCalling) {
		args.onCalling();
	}
	var startTime=(new Date()).getTime();
	OSF.getClientEndPoint().invoke("executeMethod", function OSF_DDA_WAC_Delegate$OMFacade$OnResponse(xdmStatus, payload) {
		if (args.onReceiving) {
			args.onReceiving();
		}
		var error;
		if (xdmStatus==Microsoft.Office.Common.InvokeResultCode.noError) {
			OSF.DDA.WAC.Delegate.version=payload["Version"];
			error=payload["Error"];
		}
		else {
			switch (xdmStatus) {
				case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
					error=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
					break;
				default:
					error=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					break;
			}
		}
		if (args.onComplete) {
			args.onComplete(error, payload);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), error);
		}
	}, args.hostCallArgs);
};
OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent=function OSF_DDA_WAC_Delegate$GetOnAfterRegisterEvent(register, args) {
	var startTime=(new Date()).getTime();
	return function OSF_DDA_WAC_Delegate$OnAfterRegisterEvent(xdmStatus, payload) {
		if (args.onReceiving) {
			args.onReceiving();
		}
		var status;
		if (xdmStatus !=Microsoft.Office.Common.InvokeResultCode.noError) {
			switch (xdmStatus) {
				case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
					break;
				default:
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					break;
			}
		}
		else {
			if (payload) {
				if (payload["Error"]) {
					status=payload["Error"];
				}
				else {
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
				}
			}
			else {
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			}
		}
		if (args.onComplete) {
			args.onComplete(status);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onRegisterDone(register, args.dispId, Math.abs((new Date()).getTime() - startTime), status);
		}
	};
};
OSF.DDA.WAC.Delegate.registerEventAsync=function OSF_DDA_WAC_Delegate$RegisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	OSF.getClientEndPoint().registerForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), function OSF_DDA_WACOMFacade$OnEvent(payload) {
		if (args.onEvent) {
			args.onEvent(payload);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onEventDone(args.dispId);
		}
	}, OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args), {
		"controlId": OSF._OfficeAppFactory.getId(),
		"eventDispId": args.dispId,
		"targetId": args.targetId
	});
};
OSF.DDA.WAC.Delegate.unregisterEventAsync=function OSF_DDA_WAC_Delegate$UnregisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	OSF.getClientEndPoint().unregisterForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args), {
		"controlId": OSF._OfficeAppFactory.getId(),
		"eventDispId": args.dispId,
		"targetId": args.targetId
	});
};
var OfficeExt;
(function (OfficeExt) {
	var AddinNativeAction;
	(function (AddinNativeAction) {
		var Dialog;
		(function (Dialog) {
			var windowInstance=null;
			var handler=null;
			var closeDialogKey="action=closeDialog";
			var showDialogCallback=null;
			var checkWindowDialogCloseInterval=-1;
			function showDialog(args) {
				var showDialogArgs=args.input;
				var appContext=OSF._OfficeAppFactory.getInitializationHelper()._appContext;
				appContext._id=showDialogArgs[OSF.ShowWindowDialogParameterKeys.MarketPlaceId];
				var windowUrl=showDialogArgs[OSF.ShowWindowDialogParameterKeys.WindowUrl];
				windowUrl=OfficeExt.WACUtils.addAppContextAsHash(windowUrl, OfficeExt.WACUtils.serializeObjectToString(appContext));
				windowInstance=window.open(windowUrl, showDialogArgs[OSF.ShowWindowDialogParameterKeys.WindowName], showDialogArgs[OSF.ShowWindowDialogParameterKeys.WindowSpecs]);
				function receiveMessage(event) {
					if (event.source==windowInstance) {
						try {
							handler([OSF.DialogMessageType.DialogMessageReceived, event.data]);
						}
						catch (e) {
							OsfMsAjaxFactory.msAjaxDebug.trace("Error happened during message handler. Exception: "+e);
						}
					}
				}
				window.addEventListener("message", receiveMessage);
				function checkWindowClose() {
					try {
						if (windowInstance==null || windowInstance.closed) {
							window.clearInterval(checkWindowDialogCloseInterval);
							handler([OSF.DialogMessageType.DialogClosed]);
						}
					}
					catch (e) {
						OsfMsAjaxFactory.msAjaxDebug.trace("Error happened during check or handle window close. Exception: "+e);
					}
				}
				checkWindowDialogCloseInterval=window.setInterval(checkWindowClose, 1000);
				if (showDialogCallback !=null) {
					showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
				}
				else {
					OsfMsAjaxFactory.msAjaxDebug.trace("showDialogCallback can not be null.");
				}
				args.completed();
			}
			Dialog.showDialog=showDialog;
			;
			function closeDialog(callback) {
				if (windowInstance !=null) {
					windowInstance.postMessage(closeDialogKey, getWindowLocationOrigin());
					window.clearInterval(checkWindowDialogCloseInterval);
					windowInstance=null;
					callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
				}
				else {
					callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				}
			}
			Dialog.closeDialog=closeDialog;
			;
			function messageParent(params) {
				var message=params.hostCallArgs[Microsoft.Office.WebExtension.Parameters.MessageToParent];
				window.opener.postMessage(message, getWindowLocationOrigin());
			}
			Dialog.messageParent=messageParent;
			function registerMessageReceivedEvent() {
				function receiveCloseDialogMessage(event) {
					if (event.source==window.opener && event.data.indexOf(closeDialogKey) > -1) {
						window.close();
					}
				}
				window.addEventListener("message", receiveCloseDialogMessage);
			}
			Dialog.registerMessageReceivedEvent=registerMessageReceivedEvent;
			function setHandlerAndShowDialogCallback(onEventHandler, callback) {
				handler=onEventHandler;
				showDialogCallback=callback;
			}
			Dialog.setHandlerAndShowDialogCallback=setHandlerAndShowDialogCallback;
			function getWindowLocationOrigin() {
				if (!window.location.origin) {
					return window.location.protocol+"//"+window.location.hostname+(window.location.port ? ':'+window.location.port : '');
				}
				return window.location.origin;
			}
		})(Dialog=AddinNativeAction.Dialog || (AddinNativeAction.Dialog={}));
	})(AddinNativeAction=OfficeExt.AddinNativeAction || (OfficeExt.AddinNativeAction={}));
})(OfficeExt || (OfficeExt={}));
OSF.OUtil.setNamespace("WebApp", OSF);
OSF.WebApp.AddHostInfoAndXdmInfo=function OSF_WebApp$AddHostInfoAndXdmInfo(url) {
	if (OSF._OfficeAppFactory.getWindowLocationSearch && OSF._OfficeAppFactory.getWindowLocationHash) {
		return url+OSF._OfficeAppFactory.getWindowLocationSearch()+OSF._OfficeAppFactory.getWindowLocationHash();
	}
	else {
		return url;
	}
};
OSF.WebApp._UpdateLinksForHostAndXdmInfo=function OSF_WebApp$_UpdateLinksForHostAndXdmInfo() {
	var links=document.querySelectorAll("a[data-officejs-navigate]");
	for (var i=0; i < links.length; i++) {
		if (OSF.WebApp._isGoodUrl(links[i].href)) {
			links[i].href=OSF.WebApp.AddHostInfoAndXdmInfo(links[i].href);
		}
	}
	var forms=document.querySelectorAll("form[data-officejs-navigate]");
	for (var i=0; i < forms.length; i++) {
		var form=forms[i];
		if (OSF.WebApp._isGoodUrl(form.action)) {
			form.action=OSF.WebApp.AddHostInfoAndXdmInfo(form.action);
		}
	}
};
OSF.WebApp._isGoodUrl=function OSF_WebApp$_isGoodUrl(url) {
	if (typeof url=='undefined')
		return false;
	url=url.trim();
	var colonIndex=url.indexOf(':');
	var protocol=colonIndex > 0 ? url.substr(0, colonIndex) : null;
	var goodUrl=protocol !==null ? protocol.toLowerCase()==="http" || protocol.toLowerCase()==="https" : true;
	goodUrl=goodUrl && url !="#" && url !="/" && url !="" && url !=OSF._OfficeAppFactory.getWebAppState().webAppUrl;
	return goodUrl;
};
OSF.InitializationHelper=function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
	this._hostInfo=hostInfo;
	this._webAppState=webAppState;
	this._context=context;
	this._settings=settings;
	this._hostFacade=hostFacade;
	this._appContext={};
	this._initializeSettings=function OSF_InitializationHelper$initializeSettings(appContext, refreshSupported) {
		var settings;
		var serializedSettings=appContext.get_settings();
		var osfSessionStorage=OSF.OUtil.getSessionStorage();
		if (osfSessionStorage) {
			var storageSettings=osfSessionStorage.getItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey());
			if (storageSettings) {
				serializedSettings=typeof (JSON) !=="undefined" ? JSON.parse(storageSettings) : OsfMsAjaxFactory.msAjaxSerializer.deserialize(storageSettings, true);
			}
			else {
				storageSettings=typeof (JSON) !=="undefined" ? JSON.stringify(serializedSettings) : OsfMsAjaxFactory.msAjaxSerializer.serialize(serializedSettings);
				osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
			}
		}
		var deserializedSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		if (refreshSupported) {
			settings=new OSF.DDA.RefreshableSettings(deserializedSettings);
		}
		else {
			settings=new OSF.DDA.Settings(deserializedSettings);
		}
		return settings;
	};
	var windowOpen=function OSF_InitializationHelper$windowOpen(windowObj) {
		var proxy=window.open;
		windowObj.open=function (strUrl, strWindowName, strWindowFeatures) {
			var windowObject=null;
			try {
				windowObject=proxy(strUrl, strWindowName, strWindowFeatures);
			}
			catch (ex) {
				if (OSF.AppTelemetry) {
					OSF.AppTelemetry.logAppCommonMessage("Exception happens at windowOpen."+ex);
				}
			}
			if (!windowObject) {
				var params={
					"strUrl": strUrl,
					"strWindowName": strWindowName,
					"strWindowFeatures": strWindowFeatures
				};
				OSF._OfficeAppFactory.getClientEndPoint().invoke("ContextActivationManager_openWindowInHost", null, params);
			}
			return windowObject;
		};
	};
	windowOpen(window);
};
OSF.InitializationHelper.prototype.saveAndSetDialogInfo=function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue) {
	var getAppIdFromWindowLocation=function OSF_InitializationHelper$getAppIdFromWindowLocation() {
		var xdmInfoValue=OSF.OUtil.parseXdmInfo(true);
		if (xdmInfoValue) {
			var items=xdmInfoValue.split("|");
			return items[1];
		}
		return null;
	};
	var osfSessionStorage=OSF.OUtil.getSessionStorage();
	if (osfSessionStorage) {
		if (hostInfoValue && hostInfoValue.indexOf("isDialog") > -1) {
			var appId=getAppIdFromWindowLocation();
			if (appId !=null) {
				osfSessionStorage.setItem(appId+"IsDialog", "true");
			}
		}
		this._hostInfo.isDialog=osfSessionStorage.getItem(OSF.OUtil.getXdmFieldValue(OSF.XdmFieldName.AppId, false)+"IsDialog") !=null ? true : false;
	}
};
OSF.InitializationHelper.prototype.getAppContext=function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
	var me=this;
	var getInvocationCallbackWebApp=function OSF_InitializationHelper_getAppContextAsync$getInvocationCallbackWebApp(errorCode, appContext) {
		var settings;
		if (appContext._appName===OSF.AppName.ExcelWebApp) {
			var serializedSettings=appContext._settings;
			settings={};
			for (var index in serializedSettings) {
				var setting=serializedSettings[index];
				settings[setting[0]]=setting[1];
			}
		}
		else {
			settings=appContext._settings;
		}
		if (errorCode===0 && appContext._id !=undefined && appContext._appName !=undefined && appContext._appVersion !=undefined && appContext._appUILocale !=undefined && appContext._dataLocale !=undefined &&
			appContext._docUrl !=undefined && appContext._clientMode !=undefined && appContext._settings !=undefined && appContext._reason !=undefined) {
			me._appContext=appContext;
			var appInstanceId=(appContext._appInstanceId ? appContext._appInstanceId : appContext._id);
			var touchEnabled=false;
			var commerceAllowed=true;
			var minorVersion=0;
			if (appContext._appMinorVersion !=undefined) {
				minorVersion=appContext._appMinorVersion;
			}
			var requirementMatrix=undefined;
			if (appContext._requirementMatrix !=undefined) {
				requirementMatrix=appContext._requirementMatrix;
			}
			var returnedContext=new OSF.OfficeAppContext(appContext._id, appContext._appName, appContext._appVersion, appContext._appUILocale, appContext._dataLocale, appContext._docUrl, appContext._clientMode, settings, appContext._reason, appContext._osfControlType, appContext._eToken, appContext._correlationId, appInstanceId, touchEnabled, commerceAllowed, minorVersion, requirementMatrix, appContext._hostCustomMessage);
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.initialize(returnedContext);
			}
			gotAppContext(returnedContext);
		}
		else {
			var errorMsg="Function ContextActivationManager_getAppContextAsync call failed. ErrorCode is "+errorCode+", exception: "+appContext;
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.logAppException(errorMsg);
			}
			throw errorMsg;
		}
	};
	try {
		if (this._hostInfo.isDialog && window.opener !=null) {
			var appContext=OfficeExt.WACUtils.parseAppContextWithGivenFragment(true, OSF._OfficeAppFactory.getWindowLocationHash());
			appContext=appContext !=null ? decodeURIComponent(appContext) : null;
			var appId=OSF.OUtil.getXdmFieldValue(OSF.XdmFieldName.AppId, false);
			var appContextKey=appId+"AppContext";
			var osfSessionStorage=window.sessionStorage;
			if (!appContext && osfSessionStorage && osfSessionStorage.getItem(appContextKey)) {
				appContext=osfSessionStorage.getItem(appContextKey);
			}
			if (appContext !=null) {
				osfSessionStorage.setItem(appContextKey, appContext);
				var appContextObject=JSON.parse(appContext);
				appContextObject._correlationId=this._hostInfo.osfControlAppCorrelationId;
				appContextObject._appInstanceId=appId;
				getInvocationCallbackWebApp(0, appContextObject);
			}
		}
		else {
			this._webAppState.clientEndPoint.invoke("ContextActivationManager_getAppContextAsync", getInvocationCallbackWebApp, this._webAppState.id);
		}
	}
	catch (ex) {
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.logAppException("Exception thrown when trying to invoke getAppContextAsync. Exception:["+ex+"]");
		}
		throw ex;
	}
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication=function OSF_InitializationHelper$setAgaveHostCommunication() {
	try {
		var me=this;
		var xdmInfoValue=OSF.OUtil.parseXdmInfoWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
		if (xdmInfoValue) {
			var xdmItems=OSF.OUtil.getInfoItems(xdmInfoValue);
			if (xdmItems !=undefined && xdmItems.length >=3) {
				me._webAppState.conversationID=xdmItems[0];
				me._webAppState.id=xdmItems[1];
				me._webAppState.webAppUrl=xdmItems[2].indexOf(":") >=0 ? xdmItems[2] : decodeURIComponent(xdmItems[2]);
			}
		}
		me._webAppState.wnd=window.opener !=null ? window.opener : window.parent;
		me._webAppState.serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
		me._webAppState.clientEndPoint=Microsoft.Office.Common.XdmCommunicationManager.connect(me._webAppState.conversationID, me._webAppState.wnd, me._webAppState.webAppUrl, me._webAppState.serializerVersion);
		me._webAppState.serviceEndPoint=Microsoft.Office.Common.XdmCommunicationManager.createServiceEndPoint(me._webAppState.id);
		var notificationConversationId=me._webAppState.conversationID+OSF.SharedConstants.NotificationConversationIdSuffix;
		me._webAppState.serviceEndPoint.registerConversation(notificationConversationId, me._webAppState.webAppUrl);
		var tabbableElements="a[href]:not([tabindex='-1']),"+"area[href]:not([tabindex='-1']),"+"button:not([disabled]):not([tabindex='-1']),"+"input:not([disabled]):not([tabindex='-1']),"+"select:not([disabled]):not([tabindex='-1']),"+"textarea:not([disabled]):not([tabindex='-1']),"+"*[tabindex]:not([tabindex='-1']),"+"*[contenteditable]:not([disabled]):not([tabindex='-1'])";
		var notifyAgave=function OSF__OfficeAppFactory_initialize$notifyAgave(actionId) {
			switch (actionId) {
				case OSF.AgaveHostAction.Select:
					me._webAppState.focused=true;
					break;
				case OSF.AgaveHostAction.UnSelect:
					me._webAppState.focused=false;
					break;
				case OSF.AgaveHostAction.TabIn:
				case OSF.AgaveHostAction.CtrlF6In:
					window.focus();
					var list=document.querySelectorAll(tabbableElements);
					var focused=OSF.OUtil.focusToFirstTabbable(list, false);
					if (!focused) {
						window.blur();
						me._webAppState.focused=false;
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusable]);
					}
					break;
				case OSF.AgaveHostAction.TabInShift:
					window.focus();
					var list=document.querySelectorAll(tabbableElements);
					var focused=OSF.OUtil.focusToFirstTabbable(list, true);
					if (!focused) {
						window.blur();
						me._webAppState.focused=false;
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusableShift]);
					}
					break;
				default:
					OsfMsAjaxFactory.msAjaxDebug.trace("actionId "+actionId+" notifyAgave is wrong.");
					break;
			}
		};
		me._webAppState.serviceEndPoint.registerMethod("Office_notifyAgave", notifyAgave, Microsoft.Office.Common.InvokeType.async, false);
		OSF.OUtil.addEventListener(window, "focus", function () {
			if (!me._webAppState.focused) {
				me._webAppState.focused=true;
			}
			me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.Select]);
		});
		OSF.OUtil.addEventListener(window, "blur", function () {
			if (me._webAppState.focused) {
				me._webAppState.focused=false;
			}
			me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.UnSelect]);
		});
		OSF.OUtil.addEventListener(window, "keydown", function (e) {
			e.preventDefault=e.preventDefault || function () {
				e.returnValue=false;
			};
			if (e.keyCode==117 && (e.ctrlKey || e.metaKey)) {
				var actionId=OSF.AgaveHostAction.CtrlF6Exit;
				if (e.shiftKey) {
					actionId=OSF.AgaveHostAction.CtrlF6ExitShift;
				}
				me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, actionId]);
			}
			else if (e.keyCode==9) {
				e.preventDefault();
				var allTabbableElements=document.querySelectorAll(tabbableElements);
				var focused=OSF.OUtil.focusToNextTabbable(allTabbableElements, e.target || e.srcElement, e.shiftKey);
				if (!focused) {
					if (e.shiftKey) {
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExitShift]);
					}
					else {
						me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExit]);
					}
				}
			}
			else if (e.keyCode==27) {
				e.preventDefault();
				me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.EscExit]);
			}
			else if (e.keyCode==113) {
				e.preventDefault();
				me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.F2Exit]);
			}
		});
		OSF.OUtil.addEventListener(window, "keypress", function (e) {
			if (e.keyCode==117 && e.ctrlKey) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				else {
					e.returnValue=false;
				}
			}
		});
	}
	catch (ex) {
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.logAppException("Exception thrown in setAgaveHostCommunication. Exception:["+ex+"]");
		}
		throw ex;
	}
};
OSF.InitializationHelper.prototype.initWebDialog=function OSF_InitializationHelper$initWebDialog(appContext) {
	if (appContext.get_isDialog()) {
		if (OSF.DDA.UI.ChildUI) {
			appContext.ui=new OSF.DDA.UI.ChildUI();
			if (window.opener !=null) {
				OfficeExt.AddinNativeAction.Dialog.registerMessageReceivedEvent();
			}
		}
	}
	else {
		if (OSF.DDA.UI.ParentUI) {
			appContext.ui=new OSF.DDA.UI.ParentUI();
		}
	}
};
OSF.getClientEndPoint=function OSF$getClientEndPoint() {
	var initializationHelper=OSF._OfficeAppFactory.getInitializationHelper();
	return initializationHelper._webAppState.clientEndPoint;
};
var OSFLog;
(function (OSFLog) {
	var BaseUsageData=(function () {
		function BaseUsageData(table) {
			this._table=table;
			this._fields={};
		}
		Object.defineProperty(BaseUsageData.prototype, "Fields", {
			get: function () {
				return this._fields;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BaseUsageData.prototype, "Table", {
			get: function () {
				return this._table;
			},
			enumerable: true,
			configurable: true
		});
		BaseUsageData.prototype.SerializeFields=function () {
		};
		BaseUsageData.prototype.SetSerializedField=function (key, value) {
			if (typeof (value) !=="undefined" && value !==null) {
				this._serializedFields[key]=value.toString();
			}
		};
		BaseUsageData.prototype.SerializeRow=function () {
			this._serializedFields={};
			this.SetSerializedField("Table", this._table);
			this.SerializeFields();
			return JSON.stringify(this._serializedFields);
		};
		return BaseUsageData;
	})();
	OSFLog.BaseUsageData=BaseUsageData;
	var AppActivatedUsageData=(function (_super) {
		__extends(AppActivatedUsageData, _super);
		function AppActivatedUsageData() {
			_super.call(this, "AppActivated");
		}
		Object.defineProperty(AppActivatedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppId", {
			get: function () { return this.Fields["AppId"]; },
			set: function (value) { this.Fields["AppId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppInstanceId", {
			get: function () { return this.Fields["AppInstanceId"]; },
			set: function (value) { this.Fields["AppInstanceId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppURL", {
			get: function () { return this.Fields["AppURL"]; },
			set: function (value) { this.Fields["AppURL"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AssetId", {
			get: function () { return this.Fields["AssetId"]; },
			set: function (value) { this.Fields["AssetId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Browser", {
			get: function () { return this.Fields["Browser"]; },
			set: function (value) { this.Fields["Browser"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "UserId", {
			get: function () { return this.Fields["UserId"]; },
			set: function (value) { this.Fields["UserId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Host", {
			get: function () { return this.Fields["Host"]; },
			set: function (value) { this.Fields["Host"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostVersion", {
			get: function () { return this.Fields["HostVersion"]; },
			set: function (value) { this.Fields["HostVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "ClientId", {
			get: function () { return this.Fields["ClientId"]; },
			set: function (value) { this.Fields["ClientId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeWidth", {
			get: function () { return this.Fields["AppSizeWidth"]; },
			set: function (value) { this.Fields["AppSizeWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeHeight", {
			get: function () { return this.Fields["AppSizeHeight"]; },
			set: function (value) { this.Fields["AppSizeHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		AppActivatedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("AppId", this.AppId);
			this.SetSerializedField("AppInstanceId", this.AppInstanceId);
			this.SetSerializedField("AppURL", this.AppURL);
			this.SetSerializedField("AssetId", this.AssetId);
			this.SetSerializedField("Browser", this.Browser);
			this.SetSerializedField("UserId", this.UserId);
			this.SetSerializedField("Host", this.Host);
			this.SetSerializedField("HostVersion", this.HostVersion);
			this.SetSerializedField("ClientId", this.ClientId);
			this.SetSerializedField("AppSizeWidth", this.AppSizeWidth);
			this.SetSerializedField("AppSizeHeight", this.AppSizeHeight);
			this.SetSerializedField("Message", this.Message);
		};
		return AppActivatedUsageData;
	})(BaseUsageData);
	OSFLog.AppActivatedUsageData=AppActivatedUsageData;
	var ScriptLoadUsageData=(function (_super) {
		__extends(ScriptLoadUsageData, _super);
		function ScriptLoadUsageData() {
			_super.call(this, "ScriptLoad");
		}
		Object.defineProperty(ScriptLoadUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ScriptId", {
			get: function () { return this.Fields["ScriptId"]; },
			set: function (value) { this.Fields["ScriptId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "StartTime", {
			get: function () { return this.Fields["StartTime"]; },
			set: function (value) { this.Fields["StartTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		ScriptLoadUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("ScriptId", this.ScriptId);
			this.SetSerializedField("StartTime", this.StartTime);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
		};
		return ScriptLoadUsageData;
	})(BaseUsageData);
	OSFLog.ScriptLoadUsageData=ScriptLoadUsageData;
	var AppClosedUsageData=(function (_super) {
		__extends(AppClosedUsageData, _super);
		function AppClosedUsageData() {
			_super.call(this, "AppClosed");
		}
		Object.defineProperty(AppClosedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "FocusTime", {
			get: function () { return this.Fields["FocusTime"]; },
			set: function (value) { this.Fields["FocusTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalWidth", {
			get: function () { return this.Fields["AppSizeFinalWidth"]; },
			set: function (value) { this.Fields["AppSizeFinalWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalHeight", {
			get: function () { return this.Fields["AppSizeFinalHeight"]; },
			set: function (value) { this.Fields["AppSizeFinalHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "OpenTime", {
			get: function () { return this.Fields["OpenTime"]; },
			set: function (value) { this.Fields["OpenTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "CloseMethod", {
			get: function () { return this.Fields["CloseMethod"]; },
			set: function (value) { this.Fields["CloseMethod"]=value; },
			enumerable: true,
			configurable: true
		});
		AppClosedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("FocusTime", this.FocusTime);
			this.SetSerializedField("AppSizeFinalWidth", this.AppSizeFinalWidth);
			this.SetSerializedField("AppSizeFinalHeight", this.AppSizeFinalHeight);
			this.SetSerializedField("OpenTime", this.OpenTime);
			this.SetSerializedField("CloseMethod", this.CloseMethod);
		};
		return AppClosedUsageData;
	})(BaseUsageData);
	OSFLog.AppClosedUsageData=AppClosedUsageData;
	var APIUsageUsageData=(function (_super) {
		__extends(APIUsageUsageData, _super);
		function APIUsageUsageData() {
			_super.call(this, "APIUsage");
		}
		Object.defineProperty(APIUsageUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIType", {
			get: function () { return this.Fields["APIType"]; },
			set: function (value) { this.Fields["APIType"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIID", {
			get: function () { return this.Fields["APIID"]; },
			set: function (value) { this.Fields["APIID"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "Parameters", {
			get: function () { return this.Fields["Parameters"]; },
			set: function (value) { this.Fields["Parameters"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ErrorType", {
			get: function () { return this.Fields["ErrorType"]; },
			set: function (value) { this.Fields["ErrorType"]=value; },
			enumerable: true,
			configurable: true
		});
		APIUsageUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("APIType", this.APIType);
			this.SetSerializedField("APIID", this.APIID);
			this.SetSerializedField("Parameters", this.Parameters);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
			this.SetSerializedField("ErrorType", this.ErrorType);
		};
		return APIUsageUsageData;
	})(BaseUsageData);
	OSFLog.APIUsageUsageData=APIUsageUsageData;
	var AppInitializationUsageData=(function (_super) {
		__extends(AppInitializationUsageData, _super);
		function AppInitializationUsageData() {
			_super.call(this, "AppInitialization");
		}
		Object.defineProperty(AppInitializationUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SuccessCode", {
			get: function () { return this.Fields["SuccessCode"]; },
			set: function (value) { this.Fields["SuccessCode"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		AppInitializationUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("SuccessCode", this.SuccessCode);
			this.SetSerializedField("Message", this.Message);
		};
		return AppInitializationUsageData;
	})(BaseUsageData);
	OSFLog.AppInitializationUsageData=AppInitializationUsageData;
})(OSFLog || (OSFLog={}));
var Logger;
(function (Logger) {
	"use strict";
	(function (TraceLevel) {
		TraceLevel[TraceLevel["info"]=0]="info";
		TraceLevel[TraceLevel["warning"]=1]="warning";
		TraceLevel[TraceLevel["error"]=2]="error";
	})(Logger.TraceLevel || (Logger.TraceLevel={}));
	var TraceLevel=Logger.TraceLevel;
	(function (SendFlag) {
		SendFlag[SendFlag["none"]=0]="none";
		SendFlag[SendFlag["flush"]=1]="flush";
	})(Logger.SendFlag || (Logger.SendFlag={}));
	var SendFlag=Logger.SendFlag;
	function allowUploadingData() {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			OSF.Logger.ulsEndpoint.loadProxyFrame();
		}
	}
	Logger.allowUploadingData=allowUploadingData;
	function sendLog(traceLevel, message, flag) {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			var jsonObj={ traceLevel: traceLevel, message: message, flag: flag, internalLog: true };
			var logs=JSON.stringify(jsonObj);
			OSF.Logger.ulsEndpoint.writeLog(logs);
		}
	}
	Logger.sendLog=sendLog;
	function creatULSEndpoint() {
		try {
			return new ULSEndpointProxy();
		}
		catch (e) {
			return null;
		}
	}
	var ULSEndpointProxy=(function () {
		function ULSEndpointProxy() {
			var _this=this;
			this.proxyFrame=null;
			this.telemetryEndPoint="https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
			this.buffer=[];
			this.proxyFrameReady=false;
			OSF.OUtil.addEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			setTimeout(function () {
				_this.loadProxyFrame();
			}, 3000);
		}
		ULSEndpointProxy.prototype.writeLog=function (log) {
			if (this.proxyFrameReady===true) {
				this.proxyFrame.contentWindow.postMessage(log, ULSEndpointProxy.telemetryOrigin);
			}
			else {
				if (this.buffer.length < 128) {
					this.buffer.push(log);
				}
			}
		};
		ULSEndpointProxy.prototype.loadProxyFrame=function () {
			if (this.proxyFrame==null) {
				this.proxyFrame=document.createElement("iframe");
				this.proxyFrame.setAttribute("style", "display:none");
				this.proxyFrame.setAttribute("src", this.telemetryEndPoint);
				document.head.appendChild(this.proxyFrame);
			}
		};
		ULSEndpointProxy.prototype.tellProxyFrameReady=function (e) {
			var _this=this;
			if (e.data==="ProxyFrameReadyToLog") {
				this.proxyFrameReady=true;
				for (var i=0; i < this.buffer.length; i++) {
					this.writeLog(this.buffer[i]);
				}
				this.buffer.length=0;
				OSF.OUtil.removeEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			}
			else if (e.data==="ProxyFrameReadyToInit") {
				var initJson={ appName: "Office APPs", sessionId: OSF.OUtil.Guid.generateNewGuid() };
				var initStr=JSON.stringify(initJson);
				this.proxyFrame.contentWindow.postMessage(initStr, ULSEndpointProxy.telemetryOrigin);
			}
		};
		ULSEndpointProxy.telemetryOrigin="https://telemetryservice.firstpartyapps.oaspapps.com";
		return ULSEndpointProxy;
	})();
	if (!OSF.Logger) {
		OSF.Logger=Logger;
	}
	Logger.ulsEndpoint=creatULSEndpoint();
})(Logger || (Logger={}));
var OSFAppTelemetry;
(function (OSFAppTelemetry) {
	"use strict";
	var appInfo;
	var sessionId=OSF.OUtil.Guid.generateNewGuid();
	var osfControlAppCorrelationId="";
	;
	var AppInfo=(function () {
		function AppInfo() {
		}
		return AppInfo;
	})();
	var Event=(function () {
		function Event(name, handler) {
			this.name=name;
			this.handler=handler;
		}
		return Event;
	})();
	var AppStorage=(function () {
		function AppStorage() {
			this.clientIDKey="Office API client";
			this.logIdSetKey="Office App Log Id Set";
		}
		AppStorage.prototype.getClientId=function () {
			var clientId=this.getValue(this.clientIDKey);
			if (!clientId || clientId.length <=0 || clientId.length > 40) {
				clientId=OSF.OUtil.Guid.generateNewGuid();
				this.setValue(this.clientIDKey, clientId);
			}
			return clientId;
		};
		AppStorage.prototype.saveLog=function (logId, log) {
			var logIdSet=this.getValue(this.logIdSetKey);
			logIdSet=((logIdSet && logIdSet.length > 0) ? (logIdSet+";") : "")+logId;
			this.setValue(this.logIdSetKey, logIdSet);
			this.setValue(logId, log);
		};
		AppStorage.prototype.enumerateLog=function (callback, clean) {
			var logIdSet=this.getValue(this.logIdSetKey);
			if (logIdSet) {
				var ids=logIdSet.split(";");
				for (var id in ids) {
					var logId=ids[id];
					var log=this.getValue(logId);
					if (log) {
						if (callback) {
							callback(logId, log);
						}
						if (clean) {
							this.remove(logId);
						}
					}
				}
				if (clean) {
					this.remove(this.logIdSetKey);
				}
			}
		};
		AppStorage.prototype.getValue=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			var value="";
			if (osfLocalStorage) {
				value=osfLocalStorage.getItem(key);
			}
			return value;
		};
		AppStorage.prototype.setValue=function (key, value) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				osfLocalStorage.setItem(key, value);
			}
		};
		AppStorage.prototype.remove=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				try {
					osfLocalStorage.removeItem(key);
				}
				catch (ex) {
				}
			}
		};
		return AppStorage;
	})();
	var AppLogger=(function () {
		function AppLogger() {
		}
		AppLogger.prototype.LogData=function (data) {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, data.SerializeRow(), OSF.Logger.SendFlag.none);
		};
		AppLogger.prototype.LogRawData=function (log) {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, log, OSF.Logger.SendFlag.none);
		};
		return AppLogger;
	})();
	function initialize(context) {
		if (!OSF.Logger) {
			return;
		}
		if (appInfo) {
			return;
		}
		appInfo=new AppInfo();
		appInfo.hostVersion=context.get_appVersion();
		appInfo.appId=context.get_id();
		appInfo.host=context.get_appName();
		appInfo.browser=window.navigator.userAgent;
		appInfo.correlationId=context.get_correlationId();
		appInfo.clientId=(new AppStorage()).getClientId();
		appInfo.appInstanceId=context.get_appInstanceId();
		if (appInfo.appInstanceId) {
			appInfo.appInstanceId=appInfo.appInstanceId.replace(/[{}]/g, "").toLowerCase();
		}
		appInfo.message=context.get_hostCustomMessage();
		var index=location.href.indexOf("?");
		appInfo.appURL=(index==-1) ? location.href : location.href.substring(0, index);
		(function getUserIdAndAssetIdFromToken(token, appInfo) {
			var xmlContent;
			var parser;
			var xmlDoc;
			appInfo.assetId="";
			appInfo.userId="";
			try {
				xmlContent=decodeURIComponent(token);
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(xmlContent, "text/xml");
				appInfo.userId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid").nodeValue;
				appInfo.assetId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue;
			}
			catch (e) {
			}
			finally {
				xmlContent=null;
				xmlDoc=null;
				parser=null;
			}
		})(context.get_eToken(), appInfo);
		(function handleLifecycle() {
			var startTime=new Date();
			var lastFocus=null;
			var focusTime=0;
			var finished=false;
			var adjustFocusTime=function () {
				if (document.hasFocus()) {
					if (lastFocus==null) {
						lastFocus=new Date();
					}
				}
				else if (lastFocus) {
					focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
					lastFocus=null;
				}
			};
			var eventList=[];
			eventList.push(new Event("focus", adjustFocusTime));
			eventList.push(new Event("blur", adjustFocusTime));
			eventList.push(new Event("focusout", adjustFocusTime));
			eventList.push(new Event("focusin", adjustFocusTime));
			var exitFunction=function () {
				for (var i=0; i < eventList.length; i++) {
					OSF.OUtil.removeEventListener(window, eventList[i].name, eventList[i].handler);
				}
				eventList.length=0;
				if (!finished) {
					if (document.hasFocus() && lastFocus) {
						focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
						lastFocus=null;
					}
					OSFAppTelemetry.onAppClosed(Math.abs((new Date()).getTime() - startTime.getTime()), focusTime);
					finished=true;
				}
			};
			eventList.push(new Event("beforeunload", exitFunction));
			eventList.push(new Event("unload", exitFunction));
			for (var i=0; i < eventList.length; i++) {
				OSF.OUtil.addEventListener(window, eventList[i].name, eventList[i].handler);
			}
			adjustFocusTime();
		})();
		OSFAppTelemetry.onAppActivated();
	}
	OSFAppTelemetry.initialize=initialize;
	function onAppActivated() {
		if (!appInfo) {
			return;
		}
		(new AppStorage()).enumerateLog(function (id, log) { return (new AppLogger()).LogRawData(log); }, true);
		var data=new OSFLog.AppActivatedUsageData();
		data.SessionId=sessionId;
		data.AppId=appInfo.appId;
		data.AssetId=appInfo.assetId;
		data.AppURL=appInfo.appURL;
		data.UserId=appInfo.userId;
		data.ClientId=appInfo.clientId;
		data.Browser=appInfo.browser;
		data.Host=appInfo.host;
		data.HostVersion=appInfo.hostVersion;
		data.CorrelationId=appInfo.correlationId;
		data.AppSizeWidth=window.innerWidth;
		data.AppSizeHeight=window.innerHeight;
		data.AppInstanceId=appInfo.appInstanceId;
		data.Message=appInfo.message;
		(new AppLogger()).LogData(data);
		setTimeout(function () {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.allowUploadingData();
		}, 100);
	}
	OSFAppTelemetry.onAppActivated=onAppActivated;
	function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId) {
		var data=new OSFLog.ScriptLoadUsageData();
		data.CorrelationId=appCorrelationId;
		data.SessionId=sessionId;
		data.ScriptId=scriptId;
		data.StartTime=msStartTime;
		data.ResponseTime=msResponseTime;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onScriptDone=onScriptDone;
	function onCallDone(apiType, id, parameters, msResponseTime, errorType) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.APIUsageUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.APIType=apiType;
		data.APIID=id;
		data.Parameters=parameters;
		data.ResponseTime=msResponseTime;
		data.ErrorType=errorType;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onCallDone=onCallDone;
	;
	function onMethodDone(id, args, msResponseTime, errorType) {
		var parameters=null;
		if (args) {
			if (typeof args=="number") {
				parameters=String(args);
			}
			else if (typeof args==="object") {
				for (var index in args) {
					if (parameters !==null) {
						parameters+=",";
					}
					else {
						parameters="";
					}
					if (typeof args[index]=="number") {
						parameters+=String(args[index]);
					}
				}
			}
			else {
				parameters="";
			}
		}
		OSF.AppTelemetry.onCallDone("method", id, parameters, msResponseTime, errorType);
	}
	OSFAppTelemetry.onMethodDone=onMethodDone;
	function onPropertyDone(propertyName, msResponseTime) {
		OSF.AppTelemetry.onCallDone("property", -1, propertyName, msResponseTime);
	}
	OSFAppTelemetry.onPropertyDone=onPropertyDone;
	function onEventDone(id, errorType) {
		OSF.AppTelemetry.onCallDone("event", id, null, 0, errorType);
	}
	OSFAppTelemetry.onEventDone=onEventDone;
	function onRegisterDone(register, id, msResponseTime, errorType) {
		OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent", id, null, msResponseTime, errorType);
	}
	OSFAppTelemetry.onRegisterDone=onRegisterDone;
	function onAppClosed(openTime, focusTime) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.AppClosedUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.FocusTime=focusTime;
		data.OpenTime=openTime;
		data.AppSizeFinalWidth=window.innerWidth;
		data.AppSizeFinalHeight=window.innerHeight;
		(new AppStorage()).saveLog(sessionId, data.SerializeRow());
	}
	OSFAppTelemetry.onAppClosed=onAppClosed;
	function setOsfControlAppCorrelationId(correlationId) {
		osfControlAppCorrelationId=correlationId;
	}
	OSFAppTelemetry.setOsfControlAppCorrelationId=setOsfControlAppCorrelationId;
	function doAppInitializationLogging(isException, message) {
		var data=new OSFLog.AppInitializationUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.SuccessCode=isException ? 1 : 0;
		data.Message=message;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.doAppInitializationLogging=doAppInitializationLogging;
	function logAppCommonMessage(message) {
		doAppInitializationLogging(false, message);
	}
	OSFAppTelemetry.logAppCommonMessage=logAppCommonMessage;
	function logAppException(errorMessage) {
		doAppInitializationLogging(true, errorMessage);
	}
	OSFAppTelemetry.logAppException=logAppException;
	OSF.AppTelemetry=OSFAppTelemetry;
})(OSFAppTelemetry || (OSFAppTelemetry={}));
Microsoft.Office.WebExtension.FileType={
	Text: "text",
	Compressed: "compressed",
	Pdf: "pdf"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FileProperties: "FileProperties",
	FileSliceProperties: "FileSliceProperties"
});
OSF.DDA.FileProperties={
	Handle: "FileHandle",
	FileSize: "FileSize",
	SliceSize: Microsoft.Office.WebExtension.Parameters.SliceSize
};
OSF.DDA.File=function OSF_DDA_File(handle, fileSize, sliceSize) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"size": {
			value: fileSize
		},
		"sliceCount": {
			value: Math.ceil(fileSize / sliceSize)
		}
	});
	var privateState={};
	privateState[OSF.DDA.FileProperties.Handle]=handle;
	privateState[OSF.DDA.FileProperties.SliceSize]=sliceSize;
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDocumentCopyChunkAsync,
		am.ReleaseDocumentCopyAsync
	], privateState);
};
OSF.DDA.FileSliceOffset="fileSliceoffset";
OSF.DDA.AsyncMethodNames.addNames({
	GetDocumentCopyAsync: "getFileAsync",
	GetDocumentCopyChunkAsync: "getSliceAsync",
	ReleaseDocumentCopyAsync: "closeAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.FileType,
			"enum": Microsoft.Office.WebExtension.FileType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SliceSize,
			value: {
				"types": ["number"],
				"defaultValue": 4 * 1024 * 1024
			}
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var sliceSize=callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize];
		if (sliceSize <=0 || sliceSize > (4 * 1024 * 1024)) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize;
		}
		return callArgs;
	},
	onSucceeded: function (fileDescriptor, caller, callArgs) {
		return new OSF.DDA.File(fileDescriptor[OSF.DDA.FileProperties.Handle], fileDescriptor[OSF.DDA.FileProperties.FileSize], callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize]);
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyChunkAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.SliceIndex,
			"types": ["number"]
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		},
		{
			name: OSF.DDA.FileProperties.SliceSize,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.SliceSize]; }
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var index=callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex];
		if (index < 0 || index >=caller.sliceCount) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange;
		}
		callArgs[OSF.DDA.FileSliceOffset]=parseInt((index * stateInfo[OSF.DDA.FileProperties.SliceSize]).toString());
		return callArgs;
	},
	onSucceeded: function (sliceDescriptor, caller, callArgs) {
		var slice={};
		OSF.OUtil.defineEnumerableProperties(slice, {
			"data": {
				value: sliceDescriptor[Microsoft.Office.WebExtension.Parameters.Data]
			},
			"index": {
				value: callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex]
			},
			"size": {
				value: sliceDescriptor[OSF.DDA.FileProperties.SliceSize]
			}
		});
		return slice;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ReleaseDocumentCopyAsync,
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		}
	]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("File", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_File_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_File_FilePropertiesKeys) {
	OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["Handle"]=0]="Handle";
	OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["FileSize"]=1]="FileSize";
})(OSF_DDA_Marshaling_File_FilePropertiesKeys || (OSF_DDA_Marshaling_File_FilePropertiesKeys={}));
;
OSF.DDA.Marshaling.File.FilePropertiesKeys=OSF_DDA_Marshaling_File_FilePropertiesKeys;
var OSF_DDA_Marshaling_File_SlicePropertiesKeys;
(function (OSF_DDA_Marshaling_File_SlicePropertiesKeys) {
	OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["Data"]=0]="Data";
	OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["SliceSize"]=1]="SliceSize";
})(OSF_DDA_Marshaling_File_SlicePropertiesKeys || (OSF_DDA_Marshaling_File_SlicePropertiesKeys={}));
;
OSF.DDA.Marshaling.File.SlicePropertiesKeys=OSF_DDA_Marshaling_File_SlicePropertiesKeys;
var OSF_DDA_Marshaling_File_FileType;
(function (OSF_DDA_Marshaling_File_FileType) {
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Text"]=0]="Text";
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Compressed"]=1]="Compressed";
	OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Pdf"]=2]="Pdf";
})(OSF_DDA_Marshaling_File_FileType || (OSF_DDA_Marshaling_File_FileType={}));
;
OSF.DDA.Marshaling.File.FileType=OSF_DDA_Marshaling_File_FileType;
var OSF_DDA_Marshaling_File_ParameterKeys;
(function (OSF_DDA_Marshaling_File_ParameterKeys) {
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["FileType"]=0]="FileType";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceSize"]=1]="SliceSize";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["Handle"]=2]="Handle";
	OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceIndex"]=3]="SliceIndex";
})(OSF_DDA_Marshaling_File_ParameterKeys || (OSF_DDA_Marshaling_File_ParameterKeys={}));
;
OSF.DDA.Marshaling.File.ParameterKeys=OSF_DDA_Marshaling_File_ParameterKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileProperties);
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileSliceProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileProperties,
	fromHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.Handle },
		{ name: OSF.DDA.FileProperties.FileSize, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.FileSize }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileSliceProperties,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.Data },
		{ name: OSF.DDA.FileProperties.SliceSize, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.SliceSize }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.FileType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.FileType.Text, value: OSF.DDA.Marshaling.File.FileType.Text },
		{ name: Microsoft.Office.WebExtension.FileType.Compressed, value: OSF.DDA.Marshaling.File.FileType.Compressed },
		{ name: Microsoft.Office.WebExtension.FileType.Pdf, value: OSF.DDA.Marshaling.File.FileType.Pdf }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.FileType, value: OSF.DDA.Marshaling.File.ParameterKeys.FileType },
		{ name: Microsoft.Office.WebExtension.Parameters.SliceSize, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceSize }
	],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyChunkMethod,
	toHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle },
		{ name: Microsoft.Office.WebExtension.Parameters.SliceIndex, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceIndex }
	],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileSliceProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseDocumentCopyMethod,
	toHost: [{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle }]
});
Microsoft.Office.WebExtension.TableData=function Microsoft_Office_WebExtension_TableData(rows, headers) {
	function fixData(data) {
		if (data==null || data==undefined) {
			return null;
		}
		try {
			for (var dim=OSF.DDA.DataCoercion.findArrayDimensionality(data, 2); dim < 2; dim++) {
				data=[data];
			}
			return data;
		}
		catch (ex) {
		}
	}
	;
	OSF.OUtil.defineEnumerableProperties(this, {
		"headers": {
			get: function () { return headers; },
			set: function (value) {
				headers=fixData(value);
			}
		},
		"rows": {
			get: function () { return rows; },
			set: function (value) {
				rows=(value==null || (OSF.OUtil.isArray(value) && (value.length==0))) ?
					[] :
					fixData(value);
			}
		}
	});
	this.headers=headers;
	this.rows=rows;
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureTableData=function OSF_DDA_OMFactory$manufactureTableData(tableDataProperties) {
	return new Microsoft.Office.WebExtension.TableData(tableDataProperties[OSF.DDA.TableDataProperties.TableRows], tableDataProperties[OSF.DDA.TableDataProperties.TableHeaders]);
};
Microsoft.Office.WebExtension.CoercionType={
	Text: "text",
	Matrix: "matrix",
	Table: "table"
};
OSF.DDA.DataCoercion=(function OSF_DDA_DataCoercion() {
	return {
		findArrayDimensionality: function OSF_DDA_DataCoercion$findArrayDimensionality(obj) {
			if (OSF.OUtil.isArray(obj)) {
				var dim=0;
				for (var index=0; index < obj.length; index++) {
					dim=Math.max(dim, OSF.DDA.DataCoercion.findArrayDimensionality(obj[index]));
				}
				return dim+1;
			}
			else {
				return 0;
			}
		},
		getCoercionDefaultForBinding: function OSF_DDA_DataCoercion$getCoercionDefaultForBinding(bindingType) {
			switch (bindingType) {
				case Microsoft.Office.WebExtension.BindingType.Matrix: return Microsoft.Office.WebExtension.CoercionType.Matrix;
				case Microsoft.Office.WebExtension.BindingType.Table: return Microsoft.Office.WebExtension.CoercionType.Table;
				case Microsoft.Office.WebExtension.BindingType.Text:
				default:
					return Microsoft.Office.WebExtension.CoercionType.Text;
			}
		},
		getBindingDefaultForCoercion: function OSF_DDA_DataCoercion$getBindingDefaultForCoercion(coercionType) {
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Matrix: return Microsoft.Office.WebExtension.BindingType.Matrix;
				case Microsoft.Office.WebExtension.CoercionType.Table: return Microsoft.Office.WebExtension.BindingType.Table;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					return Microsoft.Office.WebExtension.BindingType.Text;
			}
		},
		determineCoercionType: function OSF_DDA_DataCoercion$determineCoercionType(data) {
			if (data==null || data==undefined)
				return null;
			var sourceType=null;
			var runtimeType=typeof data;
			if (data.rows !==undefined) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Table;
			}
			else if (OSF.OUtil.isArray(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Matrix;
			}
			else if (runtimeType=="string" || runtimeType=="number" || runtimeType=="boolean" || OSF.OUtil.isDate(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Text;
			}
			else {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject;
			}
			return sourceType;
		},
		coerceData: function OSF_DDA_DataCoercion$coerceData(data, destinationType, sourceType) {
			sourceType=sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
			if (sourceType && sourceType !=destinationType) {
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionBegin);
				data=OSF.DDA.DataCoercion._coerceDataFromTable(destinationType, OSF.DDA.DataCoercion._coerceDataToTable(data, sourceType));
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionEnd);
			}
			return data;
		},
		_matrixToText: function OSF_DDA_DataCoercion$_matrixToText(matrix) {
			if (matrix.length==1 && matrix[0].length==1)
				return ""+matrix[0][0];
			var val="";
			for (var i=0; i < matrix.length; i++) {
				val+=matrix[i].join("\t")+"\n";
			}
			return val.substring(0, val.length - 1);
		},
		_textToMatrix: function OSF_DDA_DataCoercion$_textToMatrix(text) {
			var ret=text.split("\n");
			for (var i=0; i < ret.length; i++)
				ret[i]=ret[i].split("\t");
			return ret;
		},
		_tableToText: function OSF_DDA_DataCoercion$_tableToText(table) {
			var headers="";
			if (table.headers !=null) {
				headers=OSF.DDA.DataCoercion._matrixToText([table.headers])+"\n";
			}
			var rows=OSF.DDA.DataCoercion._matrixToText(table.rows);
			if (rows=="") {
				headers=headers.substring(0, headers.length - 1);
			}
			return headers+rows;
		},
		_tableToMatrix: function OSF_DDA_DataCoercion$_tableToMatrix(table) {
			var matrix=table.rows;
			if (table.headers !=null) {
				matrix.unshift(table.headers);
			}
			return matrix;
		},
		_coerceDataFromTable: function OSF_DDA_DataCoercion$_coerceDataFromTable(coercionType, table) {
			var value;
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=table;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=OSF.DDA.DataCoercion._tableToMatrix(table);
					break;
				case Microsoft.Office.WebExtension.CoercionType.SlideRange:
					value=null;
					if (OSF.DDA.OMFactory.manufactureSlideRange) {
						value=OSF.DDA.OMFactory.manufactureSlideRange(OSF.DDA.DataCoercion._tableToText(table));
					}
					if (value==null) {
						value=OSF.DDA.DataCoercion._tableToText(table);
					}
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=OSF.DDA.DataCoercion._tableToText(table);
					break;
			}
			return value;
		},
		_coerceDataToTable: function OSF_DDA_DataCoercion$_coerceDataToTable(data, sourceType) {
			if (sourceType==undefined) {
				sourceType=OSF.DDA.DataCoercion.determineCoercionType(data);
			}
			var value;
			switch (sourceType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=data;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=new Microsoft.Office.WebExtension.TableData(data);
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=new Microsoft.Office.WebExtension.TableData(OSF.DDA.DataCoercion._textToMatrix(data));
					break;
			}
			return value;
		}
	};
})();
OSF.DDA.AsyncMethodNames.addNames({
	GetSelectedDataAsync: "getSelectedDataAsync",
	SetSelectedDataAsync: "setSelectedDataAsync"
});
(function () {
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.CoercionType,
				"enum": Microsoft.Office.WebExtension.CoercionType
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) {
						return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]);
					}
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageLeft,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageTop,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageWidth,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageHeight,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			}
		],
		privateStateCallbacks: []
	});
})();
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.GetData,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
		{ name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: "ValueFormat" },
		{ name: Microsoft.Office.WebExtension.Parameters.FilterType, value: "FilterType" },
		{ name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
		{ name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SetData,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data },
		{ name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageLeft, value: "ImageLeft" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageTop, value: "ImageTop" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageWidth, value: "ImageWidth" },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageHeight, value: "ImageHeight" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SettingsManager={
	SerializedSettings: "serializedSettings",
	RefreshingSettings: "refreshingSettings",
	DateJSONPrefix: "Date(",
	DataJSONSuffix: ")",
	serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection) {
		var ret={};
		for (var key in settingsCollection) {
			var value=settingsCollection[key];
			try {
				if (JSON) {
					value=JSON.stringify(value, function dateReplacer(k, v) {
						return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix+this[k].getTime()+OSF.DDA.SettingsManager.DataJSONSuffix : v;
					});
				}
				else {
					value=Sys.Serialization.JavaScriptSerializer.serialize(value);
				}
				ret[key]=value;
			}
			catch (ex) {
			}
		}
		return ret;
	},
	deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings) {
		var ret={};
		serializedSettings=serializedSettings || {};
		for (var key in serializedSettings) {
			var value=serializedSettings[key];
			try {
				if (JSON) {
					value=JSON.parse(value, function dateReviver(k, v) {
						var d;
						if (typeof v==='string' && v && v.length > 6 && v.slice(0, 5)===OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1)===OSF.DDA.SettingsManager.DataJSONSuffix) {
							d=new Date(parseInt(v.slice(5, -1)));
							if (d) {
								return d;
							}
						}
						return v;
					});
				}
				else {
					value=Sys.Serialization.JavaScriptSerializer.deserialize(value, true);
				}
				ret[key]=value;
			}
			catch (ex) {
			}
		}
		return ret;
	}
};
OSF.DDA.Settings=function OSF_DDA_Settings(settings) {
	settings=settings || {};
	var cacheSessionSettings=function (settings) {
		var osfSessionStorage=OSF.OUtil.getSessionStorage();
		if (osfSessionStorage) {
			var serializedSettings=OSF.DDA.SettingsManager.serializeSettings(settings);
			var storageSettings=JSON ? JSON.stringify(serializedSettings) : Sys.Serialization.JavaScriptSerializer.serialize(serializedSettings);
			osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
		}
	};
	OSF.OUtil.defineEnumerableProperties(this, {
		"get": {
			value: function OSF_DDA_Settings$get(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				var setting=settings[name];
				return typeof (setting)==='undefined' ? null : setting;
			}
		},
		"set": {
			value: function OSF_DDA_Settings$set(name, value) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false },
					{ name: "value", mayBeNull: true }
				]);
				if (e)
					throw e;
				settings[name]=value;
				cacheSessionSettings(settings);
			}
		},
		"remove": {
			value: function OSF_DDA_Settings$remove(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				delete settings[name];
				cacheSessionSettings(settings);
			}
		}
	});
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.SaveAsync], settings);
};
OSF.DDA.RefreshableSettings=function OSF_DDA_RefreshableSettings(settings) {
	OSF.DDA.RefreshableSettings.uber.constructor.call(this, settings);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.RefreshAsync], settings);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.SettingsChanged]));
};
OSF.OUtil.extend(OSF.DDA.RefreshableSettings, OSF.DDA.Settings);
Microsoft.Office.WebExtension.EventType={};
OSF.EventDispatch=function OSF_EventDispatch(eventTypes) {
	this._eventHandlers={};
	this._queuedEventsArgs={};
	for (var entry in eventTypes) {
		var eventType=eventTypes[entry];
		this._eventHandlers[eventType]=[];
		this._queuedEventsArgs[eventType]=[];
	}
};
OSF.EventDispatch.prototype={
	getSupportedEvents: function OSF_EventDispatch$getSupportedEvents() {
		var events=[];
		for (var eventName in this._eventHandlers)
			events.push(eventName);
		return events;
	},
	supportsEvent: function OSF_EventDispatch$supportsEvent(event) {
		var isSupported=false;
		for (var eventName in this._eventHandlers) {
			if (event==eventName) {
				isSupported=true;
				break;
			}
		}
		return isSupported;
	},
	hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var h in handlers) {
				if (handlers[h]===handler)
					return true;
			}
		}
		return false;
	},
	addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler) {
		if (typeof handler !="function") {
			return false;
		}
		var handlers=this._eventHandlers[eventType];
		if (handlers && !this.hasEventHandler(eventType, handler)) {
			handlers.push(handler);
			return true;
		}
		else {
			return false;
		}
	},
	addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		var isFirstHandler=handlers.length==0;
		var succeed=this.addEventHandler(eventType, handler);
		if (isFirstHandler && succeed) {
			this.fireQueuedEvent(eventType);
		}
		return succeed;
	},
	removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var index=0; index < handlers.length; index++) {
				if (handlers[index]===handler) {
					handlers.splice(index, 1);
					return true;
				}
			}
		}
		return false;
	},
	clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType) {
		if (typeof this._eventHandlers[eventType] !="undefined" && this._eventHandlers[eventType].length > 0) {
			this._eventHandlers[eventType]=[];
			return true;
		}
		return false;
	},
	getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType) {
		return this._eventHandlers[eventType] !=undefined ? this._eventHandlers[eventType].length : -1;
	},
	fireEvent: function OSF_EventDispatch$fireEvent(eventArgs) {
		if (eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			for (var handler in eventHandlers)
				eventHandlers[handler](eventArgs);
			return true;
		}
		else {
			return false;
		}
	},
	fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs) {
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length==0) {
				queuedEvents.push(eventArgs);
			}
			else {
				this.fireEvent(eventArgs);
			}
			return true;
		}
		else {
			return false;
		}
	},
	fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType) {
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length > 0) {
				var eventHandler=eventHandlers[0];
				while (queuedEvents.length > 0) {
					var eventArgs=queuedEvents.shift();
					eventHandler(eventArgs);
				}
				return true;
			}
		}
		return false;
	}
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureEventArgs=function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties) {
	var args;
	switch (eventType) {
		case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
			args=new OSF.DDA.DocumentSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
			args=new OSF.DDA.BindingSelectionChangedEventArgs(this.manufactureBinding(eventProperties, target.document), eventProperties[OSF.DDA.PropertyDescriptors.Subset]);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
			args=new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties, target.document));
			break;
		case Microsoft.Office.WebExtension.EventType.SettingsChanged:
			args=new OSF.DDA.SettingsChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
			args=new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.OfficeThemeChanged:
			args=new OSF.DDA.Theming.OfficeThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DocumentThemeChanged:
			args=new OSF.DDA.Theming.DocumentThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
			args=OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
			args=new OSF.DDA.NodeInsertedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
			args=new OSF.DDA.NodeReplacedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
			args=new OSF.DDA.NodeDeletedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.TaskSelectionChanged:
			args=new OSF.DDA.TaskSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ResourceSelectionChanged:
			args=new OSF.DDA.ResourceSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ViewSelectionChanged:
			args=new OSF.DDA.ViewSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.DialogMessageReceived:
			args=new OSF.DDA.DialogEventArgs(eventProperties);
			break;
		default:
			throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
	}
	return args;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddHandlerAsync: "addHandlerAsync",
	RemoveHandlerAsync: "removeHandlerAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddHandlerAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			value: {
				"types": ["function", "object"],
				"defaultValue": null
			}
		}
	],
	privateStateCallbacks: []
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	SettingsChanged: "settingsChanged"
});
OSF.DDA.SettingsChangedEventArgs=function OSF_DDA_SettingsChangedEventArgs(settingsInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.SettingsChanged
		},
		"settings": {
			value: settingsInstance
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({
	RefreshAsync: "refreshAsync",
	SaveAsync: "saveAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RefreshAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.RefreshingSettings,
			value: function getRefreshingSettings(settingsInstance, settingsCollection) {
				return settingsCollection;
			}
		}
	],
	onSucceeded: function deserializeSettings(serializedSettingsDescriptor, refreshingSettings, refreshingSettingsArgs) {
		var serializedSettings=serializedSettingsDescriptor[OSF.DDA.SettingsManager.SerializedSettings];
		var newSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		var oldSettings=refreshingSettingsArgs[OSF.DDA.SettingsManager.RefreshingSettings];
		for (var setting in oldSettings) {
			refreshingSettings.remove(setting);
		}
		for (var setting in newSettings) {
			refreshingSettings.set(setting, newSettings[setting]);
		}
		return refreshingSettings;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.SaveAsync,
	requiredArguments: [],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.SerializedSettings,
			value: function serializeSettings(settingsInstance, settingsCollection) {
				return OSF.DDA.SettingsManager.serializeSettings(settingsCollection);
			}
		}
	]
});
OSF.DDA.WAC.SettingsTranslator=(function () {
	var keyIndex=0;
	var valueIndex=1;
	return {
		read: function OSF_DDA_WAC_SettingsTranslator$read(payload) {
			var serializedSettings={};
			var settingsPayload=payload.Settings;
			for (var index in settingsPayload) {
				var setting=settingsPayload[index];
				serializedSettings[setting[keyIndex]]=setting[valueIndex];
			}
			return serializedSettings;
		},
		write: function OSF_DDA_WAC_SettingsTranslator$write(serializedSettings) {
			var settingsPayload=[];
			for (var key in serializedSettings) {
				var setting=[];
				setting[keyIndex]=key;
				setting[valueIndex]=serializedSettings[key];
				settingsPayload.push(setting);
			}
			return settingsPayload;
		}
	};
})();
OSF.DDA.WAC.Delegate.ParameterMap.setDynamicType(OSF.DDA.SettingsManager.SerializedSettings, {
	toHost: OSF.DDA.WAC.SettingsTranslator.write,
	fromHost: OSF.DDA.WAC.SettingsTranslator.read
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SettingsRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale, value: "OverwriteIfStale" },
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
	],
	invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidLoadSettingsMethod,
	fromHost: [
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSaveSettingsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SettingsRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidSettingsChangedEvent });
Microsoft.Office.WebExtension.BindingType={
	Table: "table",
	Text: "text",
	Matrix: "matrix"
};
OSF.DDA.BindingProperties={
	Id: "BindingId",
	Type: Microsoft.Office.WebExtension.Parameters.BindingType
};
OSF.OUtil.augmentList(OSF.DDA.ListDescriptors, { BindingList: "BindingList" });
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	Subset: "subset",
	BindingProperties: "BindingProperties"
});
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.BindingList, OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.BindingPromise=function OSF_DDA_BindingPromise(bindingId, errorCallback) {
	this._id=bindingId;
	OSF.OUtil.defineEnumerableProperty(this, "onFail", {
		get: function () {
			return errorCallback;
		},
		set: function (onError) {
			var t=typeof onError;
			if (t !="undefined" && t !="function") {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, t);
			}
			errorCallback=onError;
		}
	});
};
OSF.DDA.BindingPromise.prototype={
	_fetch: function OSF_DDA_BindingPromise$_fetch(onComplete) {
		if (this.binding) {
			if (onComplete)
				onComplete(this.binding);
		}
		else {
			if (!this._binding) {
				var me=this;
				Microsoft.Office.WebExtension.context.document.bindings.getByIdAsync(this._id, function (asyncResult) {
					if (asyncResult.status==Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded) {
						OSF.OUtil.defineEnumerableProperty(me, "binding", {
							value: asyncResult.value
						});
						if (onComplete)
							onComplete(me.binding);
					}
					else {
						if (me.onFail)
							me.onFail(asyncResult);
					}
				});
			}
		}
		return this;
	},
	getDataAsync: function OSF_DDA_BindingPromise$getDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.getDataAsync.apply(binding, args); });
		return this;
	},
	setDataAsync: function OSF_DDA_BindingPromise$setDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.setDataAsync.apply(binding, args); });
		return this;
	},
	addHandlerAsync: function OSF_DDA_BindingPromise$addHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.addHandlerAsync.apply(binding, args); });
		return this;
	},
	removeHandlerAsync: function OSF_DDA_BindingPromise$removeHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.removeHandlerAsync.apply(binding, args); });
		return this;
	}
};
OSF.DDA.BindingFacade=function OSF_DDA_BindingFacade(docInstance) {
	this._eventDispatches=[];
	OSF.OUtil.defineEnumerableProperty(this, "document", {
		value: docInstance
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddFromSelectionAsync,
		am.AddFromNamedItemAsync,
		am.GetAllAsync,
		am.GetByIdAsync,
		am.ReleaseByIdAsync
	]);
};
OSF.DDA.UnknownBinding=function OSF_DDA_UknonwnBinding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": { value: docInstance },
		"id": { value: id }
	});
};
OSF.DDA.Binding=function OSF_DDA_Binding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": {
			value: docInstance
		},
		"id": {
			value: id
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDataAsync,
		am.SetDataAsync
	]);
	var et=Microsoft.Office.WebExtension.EventType;
	var bindingEventDispatches=docInstance.bindings._eventDispatches;
	if (!bindingEventDispatches[id]) {
		bindingEventDispatches[id]=new OSF.EventDispatch([
			et.BindingSelectionChanged,
			et.BindingDataChanged
		]);
	}
	var eventDispatch=bindingEventDispatches[id];
	OSF.DDA.DispIdHost.addEventSupport(this, eventDispatch);
};
OSF.DDA.generateBindingId=function OSF_DDA$GenerateBindingId() {
	return "UnnamedBinding_"+OSF.OUtil.getUniqueId()+"_"+new Date().getTime();
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureBinding=function OSF_DDA_OMFactory$manufactureBinding(bindingProperties, containingDocument) {
	var id=bindingProperties[OSF.DDA.BindingProperties.Id];
	var rows=bindingProperties[OSF.DDA.BindingProperties.RowCount];
	var cols=bindingProperties[OSF.DDA.BindingProperties.ColumnCount];
	var hasHeaders=bindingProperties[OSF.DDA.BindingProperties.HasHeaders];
	var binding;
	switch (bindingProperties[OSF.DDA.BindingProperties.Type]) {
		case Microsoft.Office.WebExtension.BindingType.Text:
			binding=new OSF.DDA.TextBinding(id, containingDocument);
			break;
		case Microsoft.Office.WebExtension.BindingType.Matrix:
			binding=new OSF.DDA.MatrixBinding(id, containingDocument, rows, cols);
			break;
		case Microsoft.Office.WebExtension.BindingType.Table:
			var isExcelApp=function () {
				return (OSF.DDA.ExcelDocument)
					&& (Microsoft.Office.WebExtension.context.document)
					&& (Microsoft.Office.WebExtension.context.document instanceof OSF.DDA.ExcelDocument);
			};
			var tableBindingObject;
			if (isExcelApp() && OSF.DDA.ExcelTableBinding) {
				tableBindingObject=OSF.DDA.ExcelTableBinding;
			}
			else {
				tableBindingObject=OSF.DDA.TableBinding;
			}
			binding=new tableBindingObject(id, containingDocument, rows, cols, hasHeaders);
			break;
		default:
			binding=new OSF.DDA.UnknownBinding(id, containingDocument);
	}
	return binding;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddFromSelectionAsync: "addFromSelectionAsync",
	AddFromNamedItemAsync: "addFromNamedItemAsync",
	GetAllAsync: "getAllAsync",
	GetByIdAsync: "getByIdAsync",
	ReleaseByIdAsync: "releaseByIdAsync",
	GetDataAsync: "getDataAsync",
	SetDataAsync: "setDataAsync"
});
(function () {
	function processBinding(bindingDescriptor) {
		return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document);
	}
	function getObjectId(obj) { return obj.id; }
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromSelectionAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromNamedItemAsync,
		requiredArguments: [{
				"name": Microsoft.Office.WebExtension.Parameters.ItemName,
				"types": ["string"]
			},
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.FailOnCollision,
				value: function () { return true; }
			}
		],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetAllAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.BindingList], processBinding); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.ReleaseByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response, caller, callArgs) {
			var id=callArgs[Microsoft.Office.WebExtension.Parameters.Id];
			delete caller._eventDispatches[id];
		}
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataAsync,
		requiredArguments: [],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs, binding) { return OSF.DDA.DataCoercion.getCoercionDefaultForBinding(binding.type); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.RowCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ColumnCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.RowCount]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.RowCount];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, { TableDataProperties: "TableDataProperties" });
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.TableDataProperties={
	TableRows: "TableRows",
	TableHeaders: "TableHeaders"
};
OSF.DDA.TableBinding=function OSF_DDA_TableBinding(id, docInstance, rows, cols, hasHeaders) {
	OSF.DDA.TableBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Table
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		},
		"hasHeaders": {
			value: hasHeaders ? hasHeaders : false
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddRowsAsync,
		am.AddColumnsAsync,
		am.DeleteAllDataValuesAsync
	]);
};
OSF.OUtil.extend(OSF.DDA.TableBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({
	AddRowsAsync: "addRowsAsync",
	AddColumnsAsync: "addColumnsAsync",
	DeleteAllDataValuesAsync: "deleteAllDataValuesAsync"
});
(function () {
	function getObjectId(obj) { return obj.id; }
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddRowsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddColumnsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.DeleteAllDataValuesAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.BindingRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.ItemName, value: "ItemName" },
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.BindingType, value: "BindingType" },
		{ name: Microsoft.Office.WebExtension.Parameters.PromptText, value: "PromptText" },
		{ name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
		{ name: Microsoft.Office.WebExtension.Parameters.SampleData, value: "SampleData" },
		{ name: Microsoft.Office.WebExtension.Parameters.FailOnCollision, value: "FailOnCollision" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.BindingType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.BindingType.Text, value: 2 },
		{ name: Microsoft.Office.WebExtension.BindingType.Matrix, value: 3 },
		{ name: Microsoft.Office.WebExtension.BindingType.Table, value: 1 }
	],
	invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.BindingProperties,
	fromHost: [
		{ name: OSF.DDA.BindingProperties.Id, value: "Name" },
		{ name: OSF.DDA.BindingProperties.Type, value: "BindingType" },
		{ name: OSF.DDA.BindingProperties.RowCount, value: "RowCount" },
		{ name: OSF.DDA.BindingProperties.ColumnCount, value: "ColCount" },
		{ name: OSF.DDA.BindingProperties.HasHeaders, value: "HasHeaders" }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: 0 }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromSelectionMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromNamedItemMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseBindingMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetAllBindingsMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.BindingList, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddRowsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddColumnsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidClearAllRowsMethod,
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.Subset,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
		{ name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
		{ name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
	]
});
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.MatrixBinding=function OSF_DDA_MatrixBinding(id, docInstance, rows, cols) {
	OSF.DDA.MatrixBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Matrix
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		}
	});
};
OSF.OUtil.extend(OSF.DDA.MatrixBinding, OSF.DDA.Binding);
OSF.DDA.TextBinding=function OSF_DDA_TextBinding(id, docInstance) {
	OSF.DDA.TextBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperty(this, "type", {
		value: Microsoft.Office.WebExtension.BindingType.Text
	});
};
OSF.OUtil.extend(OSF.DDA.TextBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({ AddFromPromptAsync: "addFromPromptAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddFromPromptAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.BindingType,
			"enum": Microsoft.Office.WebExtension.BindingType
		}
	],
	supportedOptions: [{
			name: Microsoft.Office.WebExtension.Parameters.Id,
			value: {
				"types": ["string"],
				"calculate": OSF.DDA.generateBindingId
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.PromptText,
			value: {
				"types": ["string"],
				"calculate": function () { return Strings.OfficeOM.L_AddBindingFromPromptDefaultText; }
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.SampleData,
			value: {
				"types": ["object"],
				"defaultValue": null
			}
		}
	],
	privateStateCallbacks: [],
	onSucceeded: function (bindingDescriptor) { return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document); }
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromPromptMethod,
	fromHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
	],
	toHost: [
		{ name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { DocumentSelectionChanged: "documentSelectionChanged" });
OSF.DDA.DocumentSelectionChangedEventArgs=function OSF_DDA_DocumentSelectionChangedEventArgs(docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged
		},
		"document": {
			value: docInstance
		}
	});
};
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidDocumentSelectionChangedEvent });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	BindingSelectionChanged: "bindingSelectionChanged",
	BindingDataChanged: "bindingDataChanged"
});
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, { BindingSelectionChangedEvent: "BindingSelectionChangedEvent" });
OSF.DDA.BindingSelectionChangedEventArgs=function OSF_DDA_BindingSelectionChangedEventArgs(bindingInstance, subset) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingSelectionChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
	for (var prop in subset) {
		OSF.OUtil.defineEnumerableProperty(this, prop, {
			value: subset[prop]
		});
	}
};
OSF.DDA.BindingDataChangedEventArgs=function OSF_DDA_BindingDataChangedEventArgs(bindingInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingDataChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
};
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.BindingSelectionChangedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.WAC.UniqueArguments.BindingEventSource },
		{ name: OSF.DDA.PropertyDescriptors.Subset, value: OSF.DDA.PropertyDescriptors.Subset }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingDataChangedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.WAC.UniqueArguments.BindingEventSource }
	]
});
OSF.DDA.FilePropertiesDescriptor={
	Url: "Url"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FilePropertiesDescriptor: "FilePropertiesDescriptor"
});
Microsoft.Office.WebExtension.FileProperties=function Microsoft_Office_WebExtension_FileProperties(filePropertiesDescriptor) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"url": {
			value: filePropertiesDescriptor[OSF.DDA.FilePropertiesDescriptor.Url]
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({ GetFilePropertiesAsync: "getFilePropertiesAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: 0 }
	],
	requiredArguments: [],
	supportedOptions: [],
	onSucceeded: function (filePropertiesDescriptor, caller, callArgs) {
		return new Microsoft.Office.WebExtension.FileProperties(filePropertiesDescriptor);
	}
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
var OSF_DDA_Marshaling_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_FilePropertiesKeys) {
	OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Properties"]=0]="Properties";
	OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Url"]=1]="Url";
})(OSF_DDA_Marshaling_FilePropertiesKeys || (OSF_DDA_Marshaling_FilePropertiesKeys={}));
;
OSF.DDA.Marshaling.FilePropertiesKeys=OSF_DDA_Marshaling_FilePropertiesKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor,
	fromHost: [
		{ name: OSF.DDA.FilePropertiesDescriptor.Url, value: OSF.DDA.Marshaling.FilePropertiesKeys.Url }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetFilePropertiesMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: OSF.DDA.Marshaling.FilePropertiesKeys.Properties }
	]
});
Microsoft.Office.WebExtension.GoToType={
	Binding: "binding",
	NamedItem: "namedItem",
	Slide: "slide",
	Index: "index"
};
Microsoft.Office.WebExtension.SelectionMode={
	Default: "default",
	Selected: "selected",
	None: "none"
};
Microsoft.Office.WebExtension.Index={
	First: "first",
	Last: "last",
	Next: "next",
	Previous: "previous"
};
OSF.DDA.AsyncMethodNames.addNames({ GoToByIdAsync: "goToByIdAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GoToByIdAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.Id,
			"types": ["string", "number"]
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.GoToType,
			"enum": Microsoft.Office.WebExtension.GoToType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SelectionMode,
			value: {
				"enum": Microsoft.Office.WebExtension.SelectionMode,
				"defaultValue": Microsoft.Office.WebExtension.SelectionMode.Default
			}
		}
	]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.DDA.Marshaling.NavigationKeys={
	NavigationRequest: "DdaGoToByIdMethod",
	Id: "Id",
	GoToType: "GoToType",
	SelectionMode: "SelectionMode"
};
var OSF_DDA_Marshaling_GoToType;
(function (OSF_DDA_Marshaling_GoToType) {
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Binding"]=0]="Binding";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["NamedItem"]=1]="NamedItem";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Slide"]=2]="Slide";
	OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Index"]=3]="Index";
})(OSF_DDA_Marshaling_GoToType || (OSF_DDA_Marshaling_GoToType={}));
;
OSF.DDA.Marshaling.GoToType=OSF_DDA_Marshaling_GoToType;
var OSF_DDA_Marshaling_SelectionMode;
(function (OSF_DDA_Marshaling_SelectionMode) {
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Default"]=0]="Default";
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Selected"]=1]="Selected";
	OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["None"]=2]="None";
})(OSF_DDA_Marshaling_SelectionMode || (OSF_DDA_Marshaling_SelectionMode={}));
;
OSF.DDA.Marshaling.SelectionMode=OSF_DDA_Marshaling_SelectionMode;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.Marshaling.NavigationKeys.NavigationRequest);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.NavigationKeys.Id },
		{ name: Microsoft.Office.WebExtension.Parameters.GoToType, value: OSF.DDA.Marshaling.NavigationKeys.GoToType },
		{ name: Microsoft.Office.WebExtension.Parameters.SelectionMode, value: OSF.DDA.Marshaling.NavigationKeys.SelectionMode }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.GoToType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.GoToType.Binding, value: OSF.DDA.Marshaling.GoToType.Binding },
		{ name: Microsoft.Office.WebExtension.GoToType.NamedItem, value: OSF.DDA.Marshaling.GoToType.NamedItem },
		{ name: Microsoft.Office.WebExtension.GoToType.Slide, value: OSF.DDA.Marshaling.GoToType.Slide },
		{ name: Microsoft.Office.WebExtension.GoToType.Index, value: OSF.DDA.Marshaling.GoToType.Index }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.SelectionMode,
	toHost: [
		{ name: Microsoft.Office.WebExtension.SelectionMode.Default, value: OSF.DDA.Marshaling.SelectionMode.Default },
		{ name: Microsoft.Office.WebExtension.SelectionMode.Selected, value: OSF.DDA.Marshaling.SelectionMode.Selected },
		{ name: Microsoft.Office.WebExtension.SelectionMode.None, value: OSF.DDA.Marshaling.SelectionMode.None }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidNavigateToMethod,
	toHost: [
		{ name: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.ExcelTableBinding=function OSF_DDA_ExcelTableBinding(id, docInstance, rows, cols, hasHeaders) {
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.ClearFormatsAsync,
		am.SetTableOptionsAsync,
		am.SetFormatsAsync
	]);
	OSF.DDA.ExcelTableBinding.uber.constructor.call(this, id, docInstance, rows, cols, hasHeaders);
	OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.ExcelTableBinding, OSF.DDA.TableBinding);
(function () {
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.CellFormat,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.TableOptions,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			}
		],
		privateStateCallbacks: []
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.CellFormat,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.TableOptions,
				value: {
					"types": ["object"],
					"defaultValue": []
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			var Parameters=Microsoft.Office.WebExtension.Parameters;
			if (callArgs[Parameters.StartRow]==0 &&
				callArgs[Parameters.StartColumn]==0 &&
				OSF.OUtil.isArray(callArgs[Parameters.CellFormat]) && callArgs[Parameters.CellFormat].length===0 &&
				OSF.OUtil.isArray(callArgs[Parameters.TableOptions]) && callArgs[Parameters.TableOptions].length===0) {
				delete callArgs[Parameters.StartRow];
				delete callArgs[Parameters.StartColumn];
				delete callArgs[Parameters.CellFormat];
				delete callArgs[Parameters.TableOptions];
			}
			if (callArgs[Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				((callArgs[Parameters.StartRow] && callArgs[Parameters.StartRow] !=0) ||
					(callArgs[Parameters.StartColumn] && callArgs[Parameters.StartColumn] !=0) ||
					callArgs[Parameters.CellFormat] ||
					callArgs[Parameters.TableOptions])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: function (obj) { return obj.id; }
			}
		]
	});
	OSF.DDA.BindingPromise.prototype.setTableOptionsAsync=function OSF_DDA_BindingPromise$setTableOptionsAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.setTableOptionsAsync.apply(binding, args); });
		return this;
	},
		OSF.DDA.BindingPromise.prototype.setFormatsAsync=function OSF_DDA_BindingPromise$setFormatsAsync() {
			var args=arguments;
			this._fetch(function onComplete(binding) { binding.setFormatsAsync.apply(binding, args); });
			return this;
		},
		OSF.DDA.BindingPromise.prototype.clearFormatsAsync=function OSF_DDA_BindingPromise$clearFormatsAsync() {
			var args=arguments;
			this._fetch(function onComplete(binding) { binding.clearFormatsAsync.apply(binding, args); });
			return this;
		};
})();
(function () {
	function getObjectId(obj) { return obj.id; }
	OSF.DDA.AsyncMethodNames.addNames({
		ClearFormatsAsync: "clearFormatsAsync",
		SetTableOptionsAsync: "setTableOptionsAsync",
		SetFormatsAsync: "setFormatsAsync"
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.ClearFormatsAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetTableOptionsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.TableOptions,
				"defaultValue": []
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetFormatsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.CellFormat,
				"defaultValue": []
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.DDA.Marshaling.FormatKeys={
	Id: "BindingId",
	CellFormat: "CellFormat",
	TableOptions: "TableOptions"
};
var OSF_DDA_Marshaling_TableOptionProperties;
(function (OSF_DDA_Marshaling_TableOptionProperties) {
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["headerRow"]=0]="headerRow";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["bandedRows"]=1]="bandedRows";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["firstColumn"]=2]="firstColumn";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["lastColumn"]=3]="lastColumn";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["bandedColumns"]=4]="bandedColumns";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["filterButton"]=5]="filterButton";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["style"]=6]="style";
	OSF_DDA_Marshaling_TableOptionProperties[OSF_DDA_Marshaling_TableOptionProperties["totalRow"]=7]="totalRow";
})(OSF_DDA_Marshaling_TableOptionProperties || (OSF_DDA_Marshaling_TableOptionProperties={}));
;
OSF.DDA.Marshaling.TableOptionProperties=OSF_DDA_Marshaling_TableOptionProperties;
var OSF_DDA_Marshaling_CellProperties;
(function (OSF_DDA_Marshaling_CellProperties) {
	OSF_DDA_Marshaling_CellProperties[OSF_DDA_Marshaling_CellProperties["row"]=0]="row";
	OSF_DDA_Marshaling_CellProperties[OSF_DDA_Marshaling_CellProperties["column"]=1]="column";
})(OSF_DDA_Marshaling_CellProperties || (OSF_DDA_Marshaling_CellProperties={}));
;
OSF.DDA.Marshaling.CellProperties=OSF_DDA_Marshaling_CellProperties;
var OSF_DDA_Marshaling_CellFormatProperties;
(function (OSF_DDA_Marshaling_CellFormatProperties) {
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["alignHorizontal"]=1]="alignHorizontal";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["alignVertical"]=2]="alignVertical";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["backgroundColor"]=101]="backgroundColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderStyle"]=201]="borderStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderColor"]=202]="borderColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderTopStyle"]=203]="borderTopStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderTopColor"]=204]="borderTopColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderBottomStyle"]=205]="borderBottomStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderBottomColor"]=206]="borderBottomColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderLeftStyle"]=207]="borderLeftStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderLeftColor"]=208]="borderLeftColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderRightStyle"]=209]="borderRightStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderRightColor"]=210]="borderRightColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderOutlineStyle"]=211]="borderOutlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderOutlineColor"]=212]="borderOutlineColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderInlineStyle"]=213]="borderInlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["borderInlineColor"]=214]="borderInlineColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontFamily"]=301]="fontFamily";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontStyle"]=302]="fontStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSize"]=303]="fontSize";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontUnderlineStyle"]=304]="fontUnderlineStyle";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontColor"]=305]="fontColor";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontDirection"]=306]="fontDirection";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontStrikethrough"]=307]="fontStrikethrough";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSuperscript"]=308]="fontSuperscript";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontSubscript"]=309]="fontSubscript";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["fontNormal"]=310]="fontNormal";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["indentLeft"]=401]="indentLeft";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["indentRight"]=402]="indentRight";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["numberFormat"]=501]="numberFormat";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["width"]=701]="width";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["height"]=702]="height";
	OSF_DDA_Marshaling_CellFormatProperties[OSF_DDA_Marshaling_CellFormatProperties["wrapping"]=703]="wrapping";
})(OSF_DDA_Marshaling_CellFormatProperties || (OSF_DDA_Marshaling_CellFormatProperties={}));
;
OSF.DDA.Marshaling.CellFormatProperties=OSF_DDA_Marshaling_CellFormatProperties;
var OSF_DDA_Marshaling_BorderStyleType;
(function (OSF_DDA_Marshaling_BorderStyleType) {
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["none"]=0]="none";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["thin"]=1]="thin";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["medium"]=2]="medium";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashed"]=3]="dashed";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dotted"]=4]="dotted";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["thick"]=5]="thick";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["double"]=6]="double";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["hair"]=7]="hair";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashed"]=8]="mediumDashed";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashDot"]=9]="dashDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashDot"]=10]="mediumDashDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["dashDotDot"]=11]="dashDotDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["mediumDashDotDot"]=12]="mediumDashDotDot";
	OSF_DDA_Marshaling_BorderStyleType[OSF_DDA_Marshaling_BorderStyleType["slantDashDot"]=13]="slantDashDot";
})(OSF_DDA_Marshaling_BorderStyleType || (OSF_DDA_Marshaling_BorderStyleType={}));
;
OSF.DDA.Marshaling.BorderStyleType=OSF_DDA_Marshaling_BorderStyleType;
var OSF_DDA_Marshaling_ColorType;
(function (OSF_DDA_Marshaling_ColorType) {
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["none"]=0]="none";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["black"]=1]="black";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["blue"]=2]="blue";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["gray"]=3]="gray";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["green"]=4]="green";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["orange"]=5]="orange";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["pink"]=6]="pink";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["purple"]=7]="purple";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["red"]=8]="red";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["teal"]=9]="teal";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["turquoise"]=10]="turquoise";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["violet"]=11]="violet";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["white"]=12]="white";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["yellow"]=13]="yellow";
	OSF_DDA_Marshaling_ColorType[OSF_DDA_Marshaling_ColorType["automatic"]=14]="automatic";
})(OSF_DDA_Marshaling_ColorType || (OSF_DDA_Marshaling_ColorType={}));
;
OSF.DDA.Marshaling.ColorType=OSF_DDA_Marshaling_ColorType;
var OSF_DDA_Marshaling_AlignHorizontalType;
(function (OSF_DDA_Marshaling_AlignHorizontalType) {
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["general"]=0]="general";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["left"]=1]="left";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["center"]=2]="center";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["right"]=3]="right";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["fill"]=4]="fill";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["justify"]=5]="justify";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["centerAcrossSelection"]=6]="centerAcrossSelection";
	OSF_DDA_Marshaling_AlignHorizontalType[OSF_DDA_Marshaling_AlignHorizontalType["distributed"]=7]="distributed";
})(OSF_DDA_Marshaling_AlignHorizontalType || (OSF_DDA_Marshaling_AlignHorizontalType={}));
;
OSF.DDA.Marshaling.AlignHorizontalType=OSF_DDA_Marshaling_AlignHorizontalType;
var OSF_DDA_Marshaling_AlignVerticalType;
(function (OSF_DDA_Marshaling_AlignVerticalType) {
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["top"]=0]="top";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["center"]=1]="center";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["bottom"]=2]="bottom";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["justify"]=3]="justify";
	OSF_DDA_Marshaling_AlignVerticalType[OSF_DDA_Marshaling_AlignVerticalType["distributed"]=4]="distributed";
})(OSF_DDA_Marshaling_AlignVerticalType || (OSF_DDA_Marshaling_AlignVerticalType={}));
;
OSF.DDA.Marshaling.AlignVerticalType=OSF_DDA_Marshaling_AlignVerticalType;
var OSF_DDA_Marshaling_FontStyleType;
(function (OSF_DDA_Marshaling_FontStyleType) {
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["regular"]=0]="regular";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["italic"]=1]="italic";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["bold"]=2]="bold";
	OSF_DDA_Marshaling_FontStyleType[OSF_DDA_Marshaling_FontStyleType["boldItalic"]=3]="boldItalic";
})(OSF_DDA_Marshaling_FontStyleType || (OSF_DDA_Marshaling_FontStyleType={}));
;
OSF.DDA.Marshaling.FontStyleType=OSF_DDA_Marshaling_FontStyleType;
var OSF_DDA_Marshaling_FontUnderlineStyleType;
(function (OSF_DDA_Marshaling_FontUnderlineStyleType) {
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["none"]=0]="none";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["single"]=1]="single";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["double"]=2]="double";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["singleAccounting"]=3]="singleAccounting";
	OSF_DDA_Marshaling_FontUnderlineStyleType[OSF_DDA_Marshaling_FontUnderlineStyleType["doubleAccounting"]=4]="doubleAccounting";
})(OSF_DDA_Marshaling_FontUnderlineStyleType || (OSF_DDA_Marshaling_FontUnderlineStyleType={}));
;
OSF.DDA.Marshaling.FontUnderlineStyleType=OSF_DDA_Marshaling_FontUnderlineStyleType;
var OSF_DDA_Marshaling_FontDirectionType;
(function (OSF_DDA_Marshaling_FontDirectionType) {
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["context"]=0]="context";
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["leftToRight"]=1]="leftToRight";
	OSF_DDA_Marshaling_FontDirectionType[OSF_DDA_Marshaling_FontDirectionType["rightToLeft"]=2]="rightToLeft";
})(OSF_DDA_Marshaling_FontDirectionType || (OSF_DDA_Marshaling_FontDirectionType={}));
;
OSF.DDA.Marshaling.FontDirectionType=OSF_DDA_Marshaling_FontDirectionType;
var OSF_DDA_Marshaling_WidthType;
(function (OSF_DDA_Marshaling_WidthType) {
	OSF_DDA_Marshaling_WidthType[OSF_DDA_Marshaling_WidthType["autoFit"]=-1]="autoFit";
})(OSF_DDA_Marshaling_WidthType || (OSF_DDA_Marshaling_WidthType={}));
;
OSF.DDA.Marshaling.WidthType=OSF_DDA_Marshaling_WidthType;
var OSF_DDA_Marshaling_HeightType;
(function (OSF_DDA_Marshaling_HeightType) {
	OSF_DDA_Marshaling_HeightType[OSF_DDA_Marshaling_HeightType["autoFit"]=-1]="autoFit";
})(OSF_DDA_Marshaling_HeightType || (OSF_DDA_Marshaling_HeightType={}));
;
OSF.DDA.Marshaling.HeightType=OSF_DDA_Marshaling_HeightType;
var AgaveFormatAPI;
(function (AgaveFormatAPI) {
	var alignHorizontalType=OSF.DDA.Marshaling.AlignHorizontalType;
	var alignVerticalType=OSF.DDA.Marshaling.AlignVerticalType;
	var borderStyleType=OSF.DDA.Marshaling.BorderStyleType;
	var cellFormatProperties=OSF.DDA.Marshaling.CellFormatProperties;
	var cellProperties=OSF.DDA.Marshaling.CellProperties;
	var colorType=OSF.DDA.Marshaling.ColorType;
	var fontDirectionType=OSF.DDA.Marshaling.FontDirectionType;
	var fontStyleType=OSF.DDA.Marshaling.FontStyleType;
	var fontUnderlineStyleType=OSF.DDA.Marshaling.FontUnderlineStyleType;
	var heightType=OSF.DDA.Marshaling.HeightType;
	var hostKeys=OSF.DDA.Marshaling.FormatKeys;
	var hostParameters=Microsoft.Office.WebExtension.Parameters;
	var ns=OSF.DDA.WAC.Delegate.ParameterMap;
	var tableOptionProperties=OSF.DDA.Marshaling.TableOptionProperties;
	var widthType=OSF.DDA.Marshaling.WidthType;
	Microsoft.Office.WebExtension.Table={
		All: 0,
		Data: 1,
		Headers: 2
	};
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.ClearFormats,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidClearFormatsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.ClearFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.SetFormats,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id },
			{ name: hostParameters.CellFormat, value: hostKeys.CellFormat },
			{ name: hostParameters.TableOptions, value: hostKeys.TableOptions }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetTableOptionsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetFormatsMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetFormats, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.WAC.UniqueArguments.SetData,
		toHost: [
			{ name: hostParameters.Id, value: hostKeys.Id },
			{ name: hostParameters.CoercionType, value: "CoerceType" },
			{ name: hostParameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data },
			{ name: hostParameters.Rows, value: "Rows" },
			{ name: hostParameters.Columns, value: "Columns" },
			{ name: hostParameters.StartRow, value: "StartRow" },
			{ name: hostParameters.StartColumn, value: "StartCol" },
			{ name: hostParameters.CellFormat, value: hostKeys.CellFormat },
			{ name: hostParameters.TableOptions, value: hostKeys.TableOptions }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	ns.define({
		type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
		toHost: [
			{ name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
		]
	});
	var formatProperties={
		alignHorizontal: { text: "alignHorizontal", type: cellFormatProperties.alignHorizontal },
		alignVertical: { text: "alignVertical", type: cellFormatProperties.alignVertical },
		backgroundColor: { text: "backgroundColor", type: cellFormatProperties.backgroundColor },
		borderStyle: { text: "borderStyle", type: cellFormatProperties.borderStyle },
		borderColor: { text: "borderColor", type: cellFormatProperties.borderColor },
		borderTopStyle: { text: "borderTopStyle", type: cellFormatProperties.borderTopStyle },
		borderTopColor: { text: "borderTopColor", type: cellFormatProperties.borderTopColor },
		borderBottomStyle: { text: "borderBottomStyle", type: cellFormatProperties.borderBottomStyle },
		borderBottomColor: { text: "borderBottomColor", type: cellFormatProperties.borderBottomColor },
		borderLeftStyle: { text: "borderLeftStyle", type: cellFormatProperties.borderLeftStyle },
		borderLeftColor: { text: "borderLeftColor", type: cellFormatProperties.borderLeftColor },
		borderRightStyle: { text: "borderRightStyle", type: cellFormatProperties.borderRightStyle },
		borderRightColor: { text: "borderRightColor", type: cellFormatProperties.borderRightColor },
		borderOutlineStyle: { text: "borderOutlineStyle", type: cellFormatProperties.borderOutlineStyle },
		borderOutlineColor: { text: "borderOutlineColor", type: cellFormatProperties.borderOutlineColor },
		borderInlineStyle: { text: "borderInlineStyle", type: cellFormatProperties.borderInlineStyle },
		borderInlineColor: { text: "borderInlineColor", type: cellFormatProperties.borderInlineColor },
		fontFamily: { text: "fontFamily", type: cellFormatProperties.fontFamily },
		fontStyle: { text: "fontStyle", type: cellFormatProperties.fontStyle },
		fontSize: { text: "fontSize", type: cellFormatProperties.fontSize },
		fontUnderlineStyle: { text: "fontUnderlineStyle", type: cellFormatProperties.fontUnderlineStyle },
		fontColor: { text: "fontColor", type: cellFormatProperties.fontColor },
		fontDirection: { text: "fontDirection", type: cellFormatProperties.fontDirection },
		fontStrikethrough: { text: "fontStrikethrough", type: cellFormatProperties.fontStrikethrough },
		fontSuperscript: { text: "fontSuperscript", type: cellFormatProperties.fontSuperscript },
		fontSubscript: { text: "fontSubscript", type: cellFormatProperties.fontSubscript },
		fontNormal: { text: "fontNormal", type: cellFormatProperties.fontNormal },
		indentLeft: { text: "indentLeft", type: cellFormatProperties.indentLeft },
		indentRight: { text: "indentRight", type: cellFormatProperties.indentRight },
		numberFormat: { text: "numberFormat", type: cellFormatProperties.numberFormat },
		width: { text: "width", type: cellFormatProperties.width },
		height: { text: "height", type: cellFormatProperties.height },
		wrapping: { text: "wrapping", type: cellFormatProperties.wrapping }
	};
	var borderStyleSet=[
		{ name: "none", value: borderStyleType.none },
		{ name: "thin", value: borderStyleType.thin },
		{ name: "medium", value: borderStyleType.medium },
		{ name: "dashed", value: borderStyleType.dashed },
		{ name: "dotted", value: borderStyleType.dotted },
		{ name: "thick", value: borderStyleType.thick },
		{ name: "double", value: borderStyleType.double },
		{ name: "hair", value: borderStyleType.hair },
		{ name: "medium dashed", value: borderStyleType.mediumDashed },
		{ name: "dash dot", value: borderStyleType.dashDot },
		{ name: "medium dash dot", value: borderStyleType.mediumDashDot },
		{ name: "dash dot dot", value: borderStyleType.dashDotDot },
		{ name: "medium dash dot dot", value: borderStyleType.mediumDashDotDot },
		{ name: "slant dash dot", value: borderStyleType.slantDashDot },
	];
	var colorSet=[
		{ name: "none", value: colorType.none },
		{ name: "black", value: colorType.black },
		{ name: "blue", value: colorType.blue },
		{ name: "gray", value: colorType.gray },
		{ name: "green", value: colorType.green },
		{ name: "orange", value: colorType.orange },
		{ name: "pink", value: colorType.pink },
		{ name: "purple", value: colorType.purple },
		{ name: "red", value: colorType.red },
		{ name: "teal", value: colorType.teal },
		{ name: "turquoise", value: colorType.turquoise },
		{ name: "violet", value: colorType.violet },
		{ name: "white", value: colorType.white },
		{ name: "yellow", value: colorType.yellow },
		{ name: "automatic", value: colorType.automatic },
	];
	ns.define({
		type: formatProperties.alignHorizontal.text,
		toHost: [
			{ name: "general", value: alignHorizontalType.general },
			{ name: "left", value: alignHorizontalType.left },
			{ name: "center", value: alignHorizontalType.center },
			{ name: "right", value: alignHorizontalType.right },
			{ name: "fill", value: alignHorizontalType.fill },
			{ name: "justify", value: alignHorizontalType.justify },
			{ name: "center across selection", value: alignHorizontalType.centerAcrossSelection },
			{ name: "distributed", value: alignHorizontalType.distributed },
		]
	});
	ns.define({
		type: formatProperties.alignVertical.text,
		toHost: [
			{ name: "top", value: alignVerticalType.top },
			{ name: "center", value: alignVerticalType.center },
			{ name: "bottom", value: alignVerticalType.bottom },
			{ name: "justify", value: alignVerticalType.justify },
			{ name: "distributed", value: alignVerticalType.distributed },
		]
	});
	ns.define({
		type: formatProperties.backgroundColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderTopStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderTopColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderBottomStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderBottomColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderLeftStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderLeftColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderRightStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderRightColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderOutlineStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderOutlineColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.borderInlineStyle.text,
		toHost: borderStyleSet
	});
	ns.define({
		type: formatProperties.borderInlineColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.fontStyle.text,
		toHost: [
			{ name: "regular", value: fontStyleType.regular },
			{ name: "italic", value: fontStyleType.italic },
			{ name: "bold", value: fontStyleType.bold },
			{ name: "bold italic", value: fontStyleType.boldItalic },
		]
	});
	ns.define({
		type: formatProperties.fontUnderlineStyle.text,
		toHost: [
			{ name: "none", value: fontUnderlineStyleType.none },
			{ name: "single", value: fontUnderlineStyleType.single },
			{ name: "double", value: fontUnderlineStyleType.double },
			{ name: "single accounting", value: fontUnderlineStyleType.singleAccounting },
			{ name: "double accounting", value: fontUnderlineStyleType.doubleAccounting },
		]
	});
	ns.define({
		type: formatProperties.fontColor.text,
		toHost: colorSet
	});
	ns.define({
		type: formatProperties.fontDirection.text,
		toHost: [
			{ name: "context", value: fontDirectionType.context },
			{ name: "left-to-right", value: fontDirectionType.leftToRight },
			{ name: "right-to-left", value: fontDirectionType.rightToLeft },
		]
	});
	ns.define({
		type: formatProperties.width.text,
		toHost: [
			{ name: "auto fit", value: widthType.autoFit },
		]
	});
	ns.define({
		type: formatProperties.height.text,
		toHost: [
			{ name: "auto fit", value: heightType.autoFit },
		]
	});
	ns.define({
		type: hostParameters.TableOptions,
		toHost: [
			{ name: "headerRow", value: tableOptionProperties.headerRow },
			{ name: "bandedRows", value: tableOptionProperties.bandedRows },
			{ name: "firstColumn", value: tableOptionProperties.firstColumn },
			{ name: "lastColumn", value: tableOptionProperties.lastColumn },
			{ name: "bandedColumns", value: tableOptionProperties.bandedCoumns },
			{ name: "filterButton", value: tableOptionProperties.filterButton },
			{ name: "style", value: tableOptionProperties.style },
			{ name: "totalRow", value: tableOptionProperties.totalRow }
		]
	});
	ns.dynamicTypes[hostParameters.CellFormat]={
		toHost: function (data) {
			for (var entry in data) {
				if (data[entry].format) {
					data[entry].format=ns.doMapValues(data[entry].format, "toHost");
				}
			}
			return data;
		},
		fromHost: function (args) {
			return args;
		}
	};
	ns.setDynamicType(hostParameters.CellFormat, {
		toHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_CellFormat$toHost(cellFormats) {
			var textCells="cells";
			var textFormat="format";
			var posCells=0;
			var posFormat=1;
			var ret=[];
			for (var index in cellFormats) {
				var cfOld=cellFormats[index];
				var cfNew=[];
				if (typeof (cfOld[textCells]) !=="undefined") {
					var cellsOld=cfOld[textCells];
					var cellsNew;
					if (typeof cfOld[textCells]==="object") {
						cellsNew=[];
						for (var entry in cellsOld) {
							if (typeof (cellProperties[entry]) !=="undefined") {
								cellsNew[cellProperties[entry]]=cellsOld[entry];
							}
						}
					}
					else {
						cellsNew=cellsOld;
					}
					cfNew[posCells]=cellsNew;
				}
				if (cfOld[textFormat]) {
					var formatOld=cfOld[textFormat];
					var formatNew=[];
					for (var entry2 in formatOld) {
						if (typeof (formatProperties[entry2]) !=="undefined") {
							formatNew.push([
								formatProperties[entry2].type,
								formatOld[entry2]
							]);
						}
					}
					cfNew[posFormat]=formatNew;
				}
				ret[index]=cfNew;
			}
			return ret;
		},
		fromHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_CellFormat$fromHost(hostArgs) {
			return hostArgs;
		}
	});
	ns.setDynamicType(hostParameters.TableOptions, {
		toHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_TableOptions$toHost(tableOptions) {
			var ret=[];
			for (var entry in tableOptions) {
				if (typeof (tableOptionProperties[entry]) !="undefined") {
					ret[tableOptionProperties[entry]]=tableOptions[entry];
				}
			}
			return ret;
		},
		fromHost: function OSF_DDA_WAC_Delegate_SpecialProcessor_TableOptions$fromHost(hostArgs) {
			return hostArgs;
		}
	});
	alignHorizontalType=null;
	alignVerticalType=null;
	borderStyleType=null;
	cellFormatProperties=null;
	colorType=null;
	fontDirectionType=null;
	fontStyleType=null;
	fontUnderlineStyleType=null;
	heightType=null;
	hostKeys=null;
	widthType=null;
})(AgaveFormatAPI || (AgaveFormatAPI={}));
OSF.DDA.AsyncMethodNames.addNames({
	ExecuteRichApiRequestAsync: "executeRichApiRequestAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync,
	requiredArguments: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Data,
			types: ["object"]
		}
	],
	supportedOptions: []
});
OSF.OUtil.setNamespace("RichApi", OSF.DDA);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidExecuteRichApiRequestMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.ArrayData }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.FilterType, { OnlyVisible: "onlyVisible" });
var OfficeExt;
(function (OfficeExt) {
	var AppCommand;
	(function (AppCommand) {
		var AppCommandManager=(function () {
			function AppCommandManager() {
				var _this=this;
				this._pseudoDocument=null;
				this._eventDispatch=null;
				this._processAppCommandInvocation=function (args) {
					var verifyResult=_this._verifyManifestCallback(args.callbackName);
					if (verifyResult.errorCode !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						_this._invokeAppCommandCompletedMethod(args.appCommandId, verifyResult.errorCode, "");
						return;
					}
					var eventObj=_this._constructEventObjectForCallback(args);
					if (eventObj) {
						window.setTimeout(function () { verifyResult.callback(eventObj); }, 0);
					}
					else {
						_this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError, "");
					}
				};
			}
			AppCommandManager.initializeOsfDda=function () {
				OSF.DDA.AsyncMethodNames.addNames({
					AppCommandInvocationCompletedAsync: "appCommandInvocationCompletedAsync"
				});
				OSF.DDA.AsyncMethodCalls.define({
					method: OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
					requiredArguments: [{
							"name": Microsoft.Office.WebExtension.Parameters.Id,
							"types": ["string"]
						},
						{
							"name": Microsoft.Office.WebExtension.Parameters.Status,
							"types": ["number"]
						},
						{
							"name": Microsoft.Office.WebExtension.Parameters.Data,
							"types": ["string"]
						}
					]
				});
				OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
					AppCommandInvokedEvent: "AppCommandInvokedEvent"
				});
				OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
					AppCommandInvoked: "appCommandInvoked"
				});
				OSF.OUtil.setNamespace("AppCommand", OSF.DDA);
				OSF.DDA.AppCommand.AppCommandInvokedEventArgs=OfficeExt.AppCommand.AppCommandInvokedEventArgs;
			};
			AppCommandManager.prototype.initializeAndChangeOnce=function (callback) {
				AppCommand.registerDdaFacade();
				this._pseudoDocument={};
				OSF.DDA.DispIdHost.addAsyncMethods(this._pseudoDocument, [
					OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
				]);
				this._eventDispatch=new OSF.EventDispatch([
					Microsoft.Office.WebExtension.EventType.AppCommandInvoked,
				]);
				var onRegisterCompleted=function (result) {
					if (callback) {
						if (result.status=="succeeded") {
							callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
						}
						else {
							callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
						}
					}
				};
				OSF.DDA.DispIdHost.addEventSupport(this._pseudoDocument, this._eventDispatch);
				this._pseudoDocument.addHandlerAsync(Microsoft.Office.WebExtension.EventType.AppCommandInvoked, this._processAppCommandInvocation, onRegisterCompleted);
			};
			AppCommandManager.prototype._verifyManifestCallback=function (callbackName) {
				var defaultResult={ callback: null, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCallback };
				callbackName=callbackName.trim();
				try {
					var callList=callbackName.split(".");
					var parentObject=window;
					for (var i=0; i < callList.length - 1; i++) {
						if (parentObject[callList[i]] && typeof parentObject[callList[i]]=="object") {
							parentObject=parentObject[callList[i]];
						}
						else {
							return defaultResult;
						}
					}
					var callbackFunc=parentObject[callList[callList.length - 1]];
					if (typeof callbackFunc !="function") {
						return defaultResult;
					}
				}
				catch (e) {
					return defaultResult;
				}
				return { callback: callbackFunc, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess };
			};
			AppCommandManager.prototype._invokeAppCommandCompletedMethod=function (appCommandId, resultCode, data) {
				this._pseudoDocument.appCommandInvocationCompletedAsync(appCommandId, resultCode, data);
			};
			AppCommandManager.prototype._constructEventObjectForCallback=function (args) {
				var _this=this;
				var eventObj=new AppCommandCallbackEventArgs();
				try {
					var jsonData=JSON.parse(args.eventObjStr);
					this._translateEventObjectInternal(jsonData, eventObj);
					Object.defineProperty(eventObj, 'completed', {
						value: function () {
							var jsonString=JSON.stringify(eventObj);
							_this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess, jsonString);
						},
						enumerable: true
					});
				}
				catch (e) {
					eventObj=null;
				}
				return eventObj;
			};
			AppCommandManager.prototype._translateEventObjectInternal=function (input, output) {
				for (var key in input) {
					if (!input.hasOwnProperty(key))
						continue;
					var inputChild=input[key];
					if (typeof inputChild=="object" && inputChild !=null) {
						OSF.OUtil.defineEnumerableProperty(output, key, {
							value: {}
						});
						this._translateEventObjectInternal(inputChild, output[key]);
					}
					else {
						Object.defineProperty(output, key, {
							value: inputChild,
							enumerable: true,
							writable: true
						});
					}
				}
			};
			AppCommandManager.prototype._constructObjectByTemplate=function (template, input) {
				var output={};
				if (!template || !input)
					return output;
				for (var key in template) {
					if (template.hasOwnProperty(key)) {
						output[key]=null;
						if (input[key] !=null) {
							var templateChild=template[key];
							var inputChild=input[key];
							var inputChildType=typeof inputChild;
							if (typeof templateChild=="object" && templateChild !=null) {
								output[key]=this._constructObjectByTemplate(templateChild, inputChild);
							}
							else if (inputChildType=="number" || inputChildType=="string" || inputChildType=="boolean") {
								output[key]=inputChild;
							}
						}
					}
				}
				return output;
			};
			AppCommandManager.instance=function () {
				if (AppCommandManager._instance==null) {
					AppCommandManager._instance=new AppCommandManager();
				}
				return AppCommandManager._instance;
			};
			AppCommandManager._instance=null;
			return AppCommandManager;
		})();
		AppCommand.AppCommandManager=AppCommandManager;
		var AppCommandInvokedEventArgs=(function () {
			function AppCommandInvokedEventArgs(appCommandId, callbackName, eventObjStr) {
				this.type=Microsoft.Office.WebExtension.EventType.AppCommandInvoked;
				this.appCommandId=appCommandId;
				this.callbackName=callbackName;
				this.eventObjStr=eventObjStr;
			}
			AppCommandInvokedEventArgs.create=function (eventProperties) {
				return new AppCommandInvokedEventArgs(eventProperties[AppCommand.AppCommandInvokedEventEnums.AppCommandId], eventProperties[AppCommand.AppCommandInvokedEventEnums.CallbackName], eventProperties[AppCommand.AppCommandInvokedEventEnums.EventObjStr]);
			};
			return AppCommandInvokedEventArgs;
		})();
		AppCommand.AppCommandInvokedEventArgs=AppCommandInvokedEventArgs;
		var AppCommandCallbackEventArgs=(function () {
			function AppCommandCallbackEventArgs() {
			}
			return AppCommandCallbackEventArgs;
		})();
		AppCommand.AppCommandCallbackEventArgs=AppCommandCallbackEventArgs;
		AppCommand.AppCommandInvokedEventEnums={
			AppCommandId: "appCommandId",
			CallbackName: "callbackName",
			EventObjStr: "eventObjStr"
		};
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.AppCommand.AppCommandManager.initializeOsfDda();
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("AppCommand", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys) {
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["AppCommandId"]=0]="AppCommandId";
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["CallbackName"]=1]="CallbackName";
	OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["EventObjStr"]=2]="EventObjStr";
})(OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys={}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys=OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
var OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys) {
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Id"]=0]="Id";
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Status"]=1]="Status";
	OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Data"]=2]="Data";
})(OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys={}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys=OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
var OfficeExt;
(function (OfficeExt) {
	var AppCommand;
	(function (AppCommand) {
		function registerDdaFacade() {
			if (OSF.DDA.WAC) {
				var parameterMap=OSF.DDA.WAC.Delegate.ParameterMap;
				parameterMap.define({
					type: OSF.DDA.MethodDispId.dispidAppCommandInvocationCompletedMethod,
					toHost: [
						{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Id },
						{ name: Microsoft.Office.WebExtension.Parameters.Status, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Status },
						{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Data }
					]
				});
				parameterMap.define({
					type: OSF.DDA.EventDispId.dispidAppCommandInvokedEvent,
					fromHost: [
						{ name: OSF.DDA.EventDescriptors.AppCommandInvokedEvent, value: parameterMap.self }
					]
				});
				parameterMap.addComplexType(OSF.DDA.EventDescriptors.AppCommandInvokedEvent);
				parameterMap.define({
					type: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
					fromHost: [
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.AppCommandId, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.AppCommandId },
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.CallbackName, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.CallbackName },
						{ name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.EventObjStr, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.EventObjStr },
					]
				});
			}
		}
		AppCommand.registerDdaFacade=registerDdaFacade;
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}));
})(OfficeExt || (OfficeExt={}));
OSF.DialogShownStatus={ hasDialogShown: false, isWindowDialog: false };
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, { DialogMessageReceivedEvent: "DialogMessageReceivedEvent" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	DialogMessageReceived: "dialogMessageReceived",
	DialogEventReceived: "dialogEventReceived"
});
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	MessageType: "messageType",
	MessageContent: "messageContent"
});
OSF.DDA.DialogEventType={};
OSF.OUtil.augmentList(OSF.DDA.DialogEventType, {
	DialogClosed: "dialogClosed",
	NavigationFailed: "naviationFailed"
});
OSF.DDA.AsyncMethodNames.addNames({
	DisplayDialogAsync: "displayDialogAsync",
	CloseAsync: "close"
});
OSF.DDA.SyncMethodNames.addNames({
	MessageParent: "messageParent",
	AddMessageHandler: "addEventHandler"
});
OSF.DDA.UI.ParentUI=function OSF_DDA_ParentUI() {
	var eventDispatch=new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DialogMessageReceived, Microsoft.Office.WebExtension.EventType.DialogEventReceived]);
	var openDialogName=OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
	var target=this;
	if (!target[openDialogName]) {
		OSF.OUtil.defineEnumerableProperty(target, openDialogName, {
			value: function () {
				var openDialog=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
				openDialog(arguments, eventDispatch, target);
			}
		});
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DDA.UI.ChildUI=function OSF_DDA_ChildUI() {
	var messageParentName=OSF.DDA.SyncMethodNames.MessageParent.displayName;
	var target=this;
	if (!target[messageParentName]) {
		OSF.OUtil.defineEnumerableProperty(target, messageParentName, {
			value: function () {
				var messageParent=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
				return messageParent(arguments, target);
			}
		});
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DialogHandler=function OSF_DialogHandler() { };
OSF.DDA.DialogEventArgs=function OSF_DDA_DialogEventArgs(message) {
	if (message[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogMessageReceived) {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived
			},
			"message": {
				value: message[OSF.DDA.PropertyDescriptors.MessageContent]
			}
		});
	}
	else {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogEventReceived
			},
			"error": {
				value: message[OSF.DDA.PropertyDescriptors.MessageType]
			}
		});
	}
};
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.Url,
			"types": ["string"]
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Width,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.Height,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.RequireHTTPs,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.XFrameDenySafe,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		}
	],
	privateStateCallbacks: [],
	onSucceeded: function (args, caller, callArgs) {
		var targetId=args[Microsoft.Office.WebExtension.Parameters.Id];
		var eventDispatch=args[Microsoft.Office.WebExtension.Parameters.Data];
		var dialog=new OSF.DialogHandler();
		var closeDialog=OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, closeDialog, {
			value: function () {
				var closeDialogfunction=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
				closeDialogfunction(arguments, targetId, eventDispatch, dialog);
			}
		});
		var addHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, addHandler, {
			value: function () {
				var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
				var callArgs=syncMethodCall.verifyAndExtractCall(arguments, dialog, eventDispatch);
				var eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
				var handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
				return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType, handler);
			}
		});
		return dialog;
	},
	checkCallArgs: function (callArgs, caller, stateInfo) {
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=1;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=99;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=1;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=99;
		}
		return callArgs;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.CloseAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.MessageParent,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.MessageToParent,
			"types": ["string", "number", "boolean"]
		}
	],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.AddMessageHandler,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: []
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("Dialog", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys;
(function (OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys) {
	OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys[OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys["MessageType"]=0]="MessageType";
	OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys[OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys["MessageContent"]=1]="MessageContent";
})(OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys || (OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys={}));
;
OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys=OSF_DDA_Marshaling_Dialog_DialogMessageReceivedEventKeys;
OSF.DDA.Marshaling.MessageParentKeys={
	MessageToParent: "messageToParent"
};
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.DialogMessageReceivedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.MessageType, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType },
		{ name: OSF.DDA.PropertyDescriptors.MessageContent, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent }
	]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidMessageParentMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.MessageToParent, value: OSF.DDA.Marshaling.MessageParentKeys.MessageToParent }
	]
});
OSF.DDA.WAC.Delegate.openDialog=function OSF_DDA_WAC_Delegate$OpenDialog(args) {
	var dialogInfo=JSON.parse(args.targetId);
	var callback=OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args);
	function showDialogCallback(status) {
		var payload={ "Error": status };
		callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
	}
	if (OSF.DialogShownStatus.hasDialogShown) {
		showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened);
	}
	else {
		if (dialogInfo["xFrameDenySafe"]) {
			var onComplete=args.onComplete;
			function onEnsureRegistrationForWindowDialog(status) {
				if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserAllow && onComplete !=null) {
					onComplete(status);
				}
			}
			args.onComplete=onEnsureRegistrationForWindowDialog;
			OSF.DialogShownStatus.isWindowDialog=true;
			OfficeExt.AddinNativeAction.Dialog.setHandlerAndShowDialogCallback(function OSF_DDA_WACDelegate$RegisterEventAsync_OnEvent(payload) {
				if (args.onEvent) {
					args.onEvent(payload);
				}
				if (OSF.AppTelemetry) {
					OSF.AppTelemetry.onEventDone(args.dispId);
				}
			}, showDialogCallback);
		}
		else {
			OSF.DialogShownStatus.isWindowDialog=false;
		}
		OSF.DDA.WAC.Delegate.registerEventAsync(args);
	}
};
OSF.DDA.WAC.Delegate.messageParent=function OSF_DDA_WAC_Delegate$MessageParent(args) {
	if (window.opener !=null) {
		OfficeExt.AddinNativeAction.Dialog.messageParent(args);
	}
	else {
		OSF.DDA.WAC.Delegate.executeAsync(args);
	}
};
OSF.DDA.WAC.Delegate.closeDialog=function OSF_DDA_WAC_Delegate$CloseDialog(args) {
	var callback=OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args);
	function closeDialogCallback(status) {
		var payload={ "Error": status };
		callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
	}
	if (!OSF.DialogShownStatus.hasDialogShown) {
		closeDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeWebDialogClosed);
	}
	else {
		if (OSF.DialogShownStatus.isWindowDialog) {
			if (args.onCalling) {
				args.onCalling();
			}
			OfficeExt.AddinNativeAction.Dialog.closeDialog(closeDialogCallback);
		}
		else {
			OSF.DDA.WAC.Delegate.unregisterEventAsync(args);
		}
	}
};
OSF.DDA.WAC.Delegate.ParameterMap.setDynamicType(Microsoft.Office.WebExtension.Parameters.Data, (function () {
	var tableRows="Rows";
	var tableHeaders="Headers";
	return {
		toHost: function OSF_DDA_XLS_Delegate_SpecialProcessor_Data$toHost(data) {
			if (typeof data !="string" && data[OSF.DDA.TableDataProperties.TableRows] !==undefined) {
				var tableData={};
				tableData[tableRows]=data[OSF.DDA.TableDataProperties.TableRows];
				tableData[tableHeaders]=data[OSF.DDA.TableDataProperties.TableHeaders];
				data=tableData;
			}
			else if (OSF.DDA.DataCoercion.determineCoercionType(data)==Microsoft.Office.WebExtension.CoercionType.Text) {
				data=[[data]];
			}
			return data;
		},
		fromHost: function OSF_DDA_XLS_Delegate_SpecialProcessor_Data$fromHost(hostArgs) {
			var ret;
			if (hostArgs[tableRows] !=undefined) {
				ret={};
				ret[OSF.DDA.TableDataProperties.TableRows]=hostArgs[tableRows];
				ret[OSF.DDA.TableDataProperties.TableHeaders]=hostArgs[tableHeaders];
			}
			else {
				ret=hostArgs;
			}
			return ret;
		}
	};
})());
OSF.DDA.ExcelDocument=function Microsoft_Office_WebExtension_ExcelDocument(officeAppContext, settings) {
	var bf=new OSF.DDA.BindingFacade(this);
	OSF.DDA.DispIdHost.addAsyncMethods(bf, [OSF.DDA.AsyncMethodNames.AddFromPromptAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GoToByIdAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync]);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.SyncMethodNames.MessageParent]);
	OSF.DDA.ExcelDocument.uber.constructor.call(this, officeAppContext, bf, settings);
	if (this.mode==OSF.ClientMode.ReadOnly) {
		this.url=document.URL;
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.ExcelDocument, OSF.DDA.JsomDocument);
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM=function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
	OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
	appContext.doc=new OSF.DDA.ExcelDocument(appContext, this._initializeSettings(appContext, true));
	OSF.DDA.DispIdHost.addAsyncMethods(OSF.DDA.RichApi, [OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync]);
	appReady();
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize=function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
	this.prepareApiSurface(appContext);
	Microsoft.Office.WebExtension.initialize(this.getInitializationReason(appContext));
};
OSF.InitializationHelper.prototype.prepareApiSurface=function OSF_InitializationHelper$prepareApiSurfaceAndInitialize(appContext) {
	OSF.WebApp._UpdateLinksForHostAndXdmInfo();
	var license=new OSF.DDA.License(appContext.get_eToken());
	this.initWebDialog(appContext);
	OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license));
	var getDelegateMethods=OSF.DDA.WAC.getDelegateMethods;
	var parameterMap=OSF.DDA.WAC.Delegate.ParameterMap;
	OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods, parameterMap));
	var appCommandHandler=OfficeExt.AppCommand.AppCommandManager.instance();
	appCommandHandler.initializeAndChangeOnce();
};
OSF.InitializationHelper.prototype.getInitializationReason=function (appContext) { return appContext.get_reason(); };

var OfficeExtension;
(function (OfficeExtension) {
	var Action=(function () {
		function Action(actionInfo, isWriteOperation) {
			this.m_actionInfo=actionInfo;
			this.m_isWriteOperation=isWriteOperation;
		}
		Object.defineProperty(Action.prototype, "actionInfo", {
			get: function () {
				return this.m_actionInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Action.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			enumerable: true,
			configurable: true
		});
		return Action;
	})();
	OfficeExtension.Action=Action;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ActionFactory=(function () {
		function ActionFactory() {
		}
		ActionFactory.createSetPropertyAction=function (context, parent, propertyName, value) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 4 ,
				Name: propertyName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var args=[value];
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			var ret=new OfficeExtension.Action(actionInfo, true);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			return ret;
		};
		ActionFactory.createMethodAction=function (context, parent, methodName, operationType, args) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 3 ,
				Name: methodName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			var isWriteOperation=operationType !=1 ;
			var ret=new OfficeExtension.Action(actionInfo, isWriteOperation);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			return ret;
		};
		ActionFactory.createQueryAction=function (context, parent, queryOption) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 2 ,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			actionInfo.QueryInfo=queryOption;
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			return ret;
		};
		ActionFactory.createInstantiateAction=function (context, obj) {
			OfficeExtension.Utility.validateObjectPath(obj);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 1 ,
				Name: "",
				ObjectPathId: obj._objectPath.objectPathInfo.Id
			};
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(obj._objectPath);
			context._pendingRequest.addActionResultHandler(ret, new OfficeExtension.InstantiateActionResultHandler(obj));
			return ret;
		};
		ActionFactory.createTraceAction=function (context, message) {
			var actionInfo={
				Id: context._nextId(),
				ActionType: 5 ,
				Name: "Trace",
				ObjectPathId: 0
			};
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addTrace(actionInfo.Id, message);
			return ret;
		};
		return ActionFactory;
	})();
	OfficeExtension.ActionFactory=ActionFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientObject=(function () {
		function ClientObject(context, objectPath) {
			OfficeExtension.Utility.checkArgumentNull(context, "context");
			this.m_context=context;
			this.m_objectPath=objectPath;
			if (this.m_objectPath) {
				if (!context._processingResult) {
					OfficeExtension.ActionFactory.createInstantiateAction(context, this);
					if ((context._autoCleanup) && (this._KeepReference)) {
						context.trackedObjects._autoAdd(this);
					}
				}
			}
		}
		Object.defineProperty(ClientObject.prototype, "context", {
			get: function () {
				return this.m_context;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_objectPath", {
			get: function () {
				return this.m_objectPath;
			},
			set: function (value) {
				this.m_objectPath=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "isNull", {
			get: function () {
				OfficeExtension.Utility.throwIfNotLoaded("isNull", this._isNull, null, this._isNull);
				return this._isNull;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_isNull", {
			get: function () {
				return this.m_isNull;
			},
			set: function (value) {
				this.m_isNull=value;
				if (value && this.m_objectPath) {
					this.m_objectPath._updateAsNullObject();
				}
			},
			enumerable: true,
			configurable: true
		});
		ClientObject.prototype._handleResult=function (value) {
			this.m_isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			if (this.m_isNull && this.m_objectPath) {
				this.m_objectPath._updateAsNullObject();
			}
		};
		return ClientObject;
	})();
	OfficeExtension.ClientObject=ClientObject;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientRequest=(function () {
		function ClientRequest(context) {
			this.m_context=context;
			this.m_actions=[];
			this.m_actionResultHandler={};
			this.m_referencedObjectPaths={};
			this.m_flags=0 ;
			this.m_traceInfos={};
		}
		Object.defineProperty(ClientRequest.prototype, "flags", {
			get: function () {
				return this.m_flags;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "traceInfos", {
			get: function () {
				return this.m_traceInfos;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype.addAction=function (action) {
			if (action.isWriteOperation) {
				this.m_flags=this.m_flags | 1 ;
			}
			this.m_actions.push(action);
		};
		Object.defineProperty(ClientRequest.prototype, "hasActions", {
			get: function () {
				return this.m_actions.length > 0;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype.addTrace=function (actionId, message) {
			this.m_traceInfos[actionId]=message;
		};
		ClientRequest.prototype.addReferencedObjectPath=function (objectPath) {
			if (this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]) {
				return;
			}
			if (!objectPath.isValid) {
				OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidObjectPath, OfficeExtension.Utility.getObjectPathExpression(objectPath));
			}
			while (objectPath) {
				if (objectPath.isWriteOperation) {
					this.m_flags=this.m_flags | 1 ;
				}
				this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]=objectPath;
				if (objectPath.objectPathInfo.ObjectPathType==3 ) {
					this.addReferencedObjectPaths(objectPath.argumentObjectPaths);
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		ClientRequest.prototype.addReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					this.addReferencedObjectPath(objectPaths[i]);
				}
			}
		};
		ClientRequest.prototype.addActionResultHandler=function (action, resultHandler) {
			this.m_actionResultHandler[action.actionInfo.Id]=resultHandler;
		};
		ClientRequest.prototype.buildRequestMessageBody=function () {
			var objectPaths={};
			for (var i in this.m_referencedObjectPaths) {
				objectPaths[i]=this.m_referencedObjectPaths[i].objectPathInfo;
			}
			var actions=[];
			for (var index=0; index < this.m_actions.length; index++) {
				actions.push(this.m_actions[index].actionInfo);
			}
			var ret={
				Actions: actions,
				ObjectPaths: objectPaths
			};
			return ret;
		};
		ClientRequest.prototype.processResponse=function (msg) {
			if (msg && msg.Results) {
				for (var i=0; i < msg.Results.length; i++) {
					var actionResult=msg.Results[i];
					var handler=this.m_actionResultHandler[actionResult.ActionId];
					if (handler) {
						handler._handleResult(actionResult.Value);
					}
				}
			}
		};
		ClientRequest.prototype.invalidatePendingInvalidObjectPaths=function () {
			for (var i in this.m_referencedObjectPaths) {
				if (this.m_referencedObjectPaths[i].isInvalidAfterRequest) {
					this.m_referencedObjectPaths[i].isValid=false;
				}
			}
		};
		return ClientRequest;
	})();
	OfficeExtension.ClientRequest=ClientRequest;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _requestExecutorFactory=function () { return new OfficeExtension.OfficeJsRequestExecutor(); };
	function _setRequestExecutorFactory(reqExecFactory) {
		_requestExecutorFactory=reqExecFactory;
	}
	OfficeExtension._setRequestExecutorFactory=_setRequestExecutorFactory;
	var ClientRequestContext=(function () {
		function ClientRequestContext(url) {
			this.m_nextId=0;
			this.m_url=url;
			if (OfficeExtension.Utility.isNullOrEmptyString(this.m_url)) {
				this.m_url=OfficeExtension.Constants.localDocument;
			}
			this._processingResult=false;
			this._customData=OfficeExtension.Constants.iterativeExecutor;
			this._requestExecutor=_requestExecutorFactory();
			this.sync=this.sync.bind(this);
		}
		Object.defineProperty(ClientRequestContext.prototype, "_pendingRequest", {
			get: function () {
				if (this.m_pendingRequest==null) {
					this.m_pendingRequest=new OfficeExtension.ClientRequest(this);
				}
				return this.m_pendingRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "trackedObjects", {
			get: function () {
				if (!this.m_trackedObjects) {
					this.m_trackedObjects=new OfficeExtension.TrackedObjects(this);
				}
				return this.m_trackedObjects;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequestContext.prototype.load=function (clientObj, option) {
			OfficeExtension.Utility.validateContext(this, clientObj);
			var queryOption={};
			if (typeof (option)=="string") {
				var select=option;
				queryOption.Select=this.parseSelectExpand(select);
			}
			else if (Array.isArray(option)) {
				queryOption.Select=option;
			}
			else if (typeof (option)=="object") {
				var loadOption=option;
				if (typeof (loadOption.select)=="string") {
					queryOption.Select=this.parseSelectExpand(loadOption.select);
				}
				else if (Array.isArray(loadOption.select)) {
					queryOption.Select=loadOption.select;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.select)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.select");
				}
				if (typeof (loadOption.expand)=="string") {
					queryOption.Expand=this.parseSelectExpand(loadOption.expand);
				}
				else if (Array.isArray(loadOption.expand)) {
					queryOption.Expand=loadOption.expand;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.expand)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.expand");
				}
				if (typeof (loadOption.top)=="number") {
					queryOption.Top=loadOption.top;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.top)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.top");
				}
				if (typeof (loadOption.skip)=="number") {
					queryOption.Skip=loadOption.skip;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.skip)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.skip");
				}
			}
			else if (!OfficeExtension.Utility.isNullOrUndefined(option)) {
				OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option");
			}
			var action=OfficeExtension.ActionFactory.createQueryAction(this, clientObj, queryOption);
			this._pendingRequest.addActionResultHandler(action, clientObj);
		};
		ClientRequestContext.prototype.trace=function (message) {
			OfficeExtension.ActionFactory.createTraceAction(this, message);
		};
		ClientRequestContext.prototype.parseSelectExpand=function (select) {
			var args=[];
			if (!OfficeExtension.Utility.isNullOrEmptyString(select)) {
				var propertyNames=select.split(",");
				for (var i=0; i < propertyNames.length; i++) {
					var propertyName=propertyNames[i];
					propertyName=propertyName.trim();
					args.push(propertyName);
				}
			}
			return args;
		};
		ClientRequestContext.prototype.syncPrivate=function () {
			var _this=this;
			var req=this._pendingRequest;
			if (!req.hasActions) {
				return OfficeExtension.Utility._createPromiseFromResult(null);
			}
			this.m_pendingRequest=null;
			var msgBody=req.buildRequestMessageBody();
			var requestFlags=req.flags;
			var requestExecutor=this._requestExecutor;
			if (!requestExecutor) {
				requestExecutor=new OfficeExtension.OfficeJsRequestExecutor();
			}
			var requestExecutorRequestMessage={
				Url: this.m_url,
				Headers: null,
				Body: msgBody
			};
			req.invalidatePendingInvalidObjectPaths();
			return requestExecutor.executeAsync(this._customData, requestFlags, requestExecutorRequestMessage).then(function (response) {
				_this.processRequestExecutorResponseMessage(req, response);
			});
		};
		ClientRequestContext.prototype.processRequestExecutorResponseMessage=function (req, response) {
			var error;
			var traceMessages=new Array();
			if (!OfficeExtension.Utility.isNullOrEmptyString(response.ErrorCode)) {
				error=new OfficeExtension._Internal.RuntimeError(response.ErrorCode, response.ErrorMessage, traceMessages, {});
			}
			else if (response.Body && response.Body.Error) {
				error=new OfficeExtension._Internal.RuntimeError(response.Body.Error.Code, response.Body.Error.Message, traceMessages, {
					errorLocation: response.Body.Error.Location
				});
			}
			if (response.Body && response.Body.TraceIds) {
				var traceMessageMap=req.traceInfos;
				for (var i=0; i < response.Body.TraceIds.length; i++) {
					var traceId=response.Body.TraceIds[i];
					var message=traceMessageMap[traceId];
					traceMessages.push(message);
				}
			}
			if (error) {
				throw error;
			}
			this._processingResult=true;
			try {
				req.processResponse(response.Body);
			}
			finally {
				this._processingResult=false;
			}
		};
		ClientRequestContext.prototype.sync=function (passThroughValue) {
			return this.syncPrivate().then(function () {
				return passThroughValue;
			});
		};
		ClientRequestContext._run=function (ctxInitializer, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (numCleanupAttempts===void 0) { numCleanupAttempts=3; }
			if (retryDelay===void 0) { retryDelay=5000; }
			var starterPromise=new OfficeExtension['Promise'](function (resolve, reject) {
				resolve();
			});
			var ctx;
			var succeeded=false;
			var resultOrError;
			return starterPromise.then(function () {
				ctx=ctxInitializer();
				ctx._autoCleanup=true;
				var batchResult=batch(ctx);
				if (OfficeExtension.Utility.isNullOrUndefined(batchResult) || (typeof batchResult.then !=='function')) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.runMustReturnPromise);
				}
				return batchResult;
			}).then(function (batchResult) {
				return ctx.sync(batchResult);
			}).then(function (result) {
				succeeded=true;
				resultOrError=result;
			}).catch(function (error) {
				resultOrError=error;
			}).then(function () {
				var itemsToRemove=ctx.trackedObjects._retrieveAndClearAutoCleanupList();
				ctx._autoCleanup=false;
				for (var key in itemsToRemove) {
					itemsToRemove[key]._objectPath.isValid=false;
				}
				var cleanupCounter=0;
				attemptCleanup();
				function attemptCleanup() {
					cleanupCounter++;
					for (var key in itemsToRemove) {
						ctx.trackedObjects.remove(itemsToRemove[key]);
					}
					ctx.sync().then(function () {
						if (onCleanupSuccess) {
							onCleanupSuccess(cleanupCounter);
						}
					}).catch(function () {
						if (onCleanupFailure) {
							onCleanupFailure(cleanupCounter);
						}
						if (cleanupCounter < numCleanupAttempts) {
							setTimeout(function () {
								attemptCleanup();
							}, retryDelay);
						}
					});
				}
			}).then(function () {
				if (succeeded) {
					return resultOrError;
				}
				else {
					throw resultOrError;
				}
			});
		};
		ClientRequestContext.prototype._nextId=function () {
			return++this.m_nextId;
		};
		return ClientRequestContext;
	})();
	OfficeExtension.ClientRequestContext=ClientRequestContext;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	(function (ClientRequestFlags) {
		ClientRequestFlags[ClientRequestFlags["None"]=0]="None";
		ClientRequestFlags[ClientRequestFlags["WriteOperation"]=1]="WriteOperation";
	})(OfficeExtension.ClientRequestFlags || (OfficeExtension.ClientRequestFlags={}));
	var ClientRequestFlags=OfficeExtension.ClientRequestFlags;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientResult=(function () {
		function ClientResult() {
		}
		Object.defineProperty(ClientResult.prototype, "value", {
			get: function () {
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		ClientResult.prototype._handleResult=function (value) {
			if (typeof (value)==="object" && value && value._IsNull) {
				return;
			}
			this.m_value=value;
		};
		return ClientResult;
	})();
	OfficeExtension.ClientResult=ClientResult;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Constants=(function () {
		function Constants() {
		}
		Constants.getItemAt="GetItemAt";
		Constants.id="Id";
		Constants.idPrivate="_Id";
		Constants.index="_Index";
		Constants.items="_Items";
		Constants.iterativeExecutor="IterativeExecutor";
		Constants.localDocument="http://document.localhost/";
		Constants.localDocumentApiPrefix="http://document.localhost/_api/";
		Constants.referenceId="_ReferenceId";
		Constants.isTracked="_IsTracked";
		Constants.sourceLibHeader="X-OfficeExtension-Source";
		return Constants;
	})();
	OfficeExtension.Constants=Constants;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var EmbedRequestExecutor=(function () {
		function EmbedRequestExecutor() {
		}
		EmbedRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, EmbedRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension.Promise(function (resolve, reject) {
				var endpoint=OfficeExtension.Embedded && OfficeExtension.Embedded._getEndpoint();
				if (!endpoint) {
					resolve(OfficeExtension.RichApiMessageUtility.buildResponseOnError(OfficeExtension.Embedded.EmbeddedApiStatus.InternalError, ""));
					return;
				}
				endpoint.invoke("executeMethod", function (status, result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (status==OfficeExtension.Embedded.EmbeddedApiStatus.Success) {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBodyFromSafeArray(result.Data), OfficeExtension.RichApiMessageUtility.getResponseHeadersFromSafeArray(result.Data));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.Code, result.error.Message);
					}
					resolve(response);
				}, EmbedRequestExecutor._transformMessageArrayIntoParams(messageSafearray));
			});
		};
		EmbedRequestExecutor._transformMessageArrayIntoParams=function (msgArray) {
			return {
				ArrayData: msgArray,
				DdaMethod: {
					DispatchId: EmbedRequestExecutor.DispidExecuteRichApiRequestMethod
				}
			};
		};
		EmbedRequestExecutor.DispidExecuteRichApiRequestMethod=93;
		EmbedRequestExecutor.SourceLibHeaderValue="Embedded";
		return EmbedRequestExecutor;
	})();
	OfficeExtension.EmbedRequestExecutor=EmbedRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var __extends=this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	__.prototype=b.prototype;
	d.prototype=new __();
};
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var RuntimeError=(function (_super) {
			__extends(RuntimeError, _super);
			function RuntimeError(code, message, traceMessages, debugInfo) {
				_super.call(this, message);
				this.name="OfficeExtension.Error";
				this.code=code;
				this.message=message;
				this.traceMessages=traceMessages;
				this.debugInfo=debugInfo;
			}
			RuntimeError.prototype.toString=function () {
				return this.code+': '+this.message;
			};
			return RuntimeError;
		})(Error);
		_Internal.RuntimeError=RuntimeError;
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	OfficeExtension.Error=OfficeExtension._Internal.RuntimeError;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ErrorCodes=(function () {
		function ErrorCodes() {
		}
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.activityLimitReached="ActivityLimitReached";
		return ErrorCodes;
	})();
	OfficeExtension.ErrorCodes=ErrorCodes;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var InstantiateActionResultHandler=(function () {
		function InstantiateActionResultHandler(clientObject) {
			this.m_clientObject=clientObject;
		}
		InstantiateActionResultHandler.prototype._handleResult=function (value) {
			this.m_clientObject._isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			OfficeExtension.Utility.fixObjectPathIfNecessary(this.m_clientObject, value);
			if (value && !OfficeExtension.Utility.isNullOrUndefined(value[OfficeExtension.Constants.referenceId]) && this.m_clientObject._initReferenceId) {
				this.m_clientObject._initReferenceId(value[OfficeExtension.Constants.referenceId]);
			}
		};
		return InstantiateActionResultHandler;
	})();
	OfficeExtension.InstantiateActionResultHandler=InstantiateActionResultHandler;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	(function (RichApiRequestMessageIndex) {
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["CustomData"]=0]="CustomData";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["Method"]=1]="Method";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["PathAndQuery"]=2]="PathAndQuery";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["Headers"]=3]="Headers";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["Body"]=4]="Body";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["AppPermission"]=5]="AppPermission";
		RichApiRequestMessageIndex[RichApiRequestMessageIndex["RequestFlags"]=6]="RequestFlags";
	})(OfficeExtension.RichApiRequestMessageIndex || (OfficeExtension.RichApiRequestMessageIndex={}));
	var RichApiRequestMessageIndex=OfficeExtension.RichApiRequestMessageIndex;
	(function (RichApiResponseMessageIndex) {
		RichApiResponseMessageIndex[RichApiResponseMessageIndex["StatusCode"]=0]="StatusCode";
		RichApiResponseMessageIndex[RichApiResponseMessageIndex["Headers"]=1]="Headers";
		RichApiResponseMessageIndex[RichApiResponseMessageIndex["Body"]=2]="Body";
	})(OfficeExtension.RichApiResponseMessageIndex || (OfficeExtension.RichApiResponseMessageIndex={}));
	var RichApiResponseMessageIndex=OfficeExtension.RichApiResponseMessageIndex;
	;
	(function (ActionType) {
		ActionType[ActionType["Instantiate"]=1]="Instantiate";
		ActionType[ActionType["Query"]=2]="Query";
		ActionType[ActionType["Method"]=3]="Method";
		ActionType[ActionType["SetProperty"]=4]="SetProperty";
		ActionType[ActionType["Trace"]=5]="Trace";
	})(OfficeExtension.ActionType || (OfficeExtension.ActionType={}));
	var ActionType=OfficeExtension.ActionType;
	(function (ObjectPathType) {
		ObjectPathType[ObjectPathType["GlobalObject"]=1]="GlobalObject";
		ObjectPathType[ObjectPathType["NewObject"]=2]="NewObject";
		ObjectPathType[ObjectPathType["Method"]=3]="Method";
		ObjectPathType[ObjectPathType["Property"]=4]="Property";
		ObjectPathType[ObjectPathType["Indexer"]=5]="Indexer";
		ObjectPathType[ObjectPathType["ReferenceId"]=6]="ReferenceId";
		ObjectPathType[ObjectPathType["NullObject"]=7]="NullObject";
	})(OfficeExtension.ObjectPathType || (OfficeExtension.ObjectPathType={}));
	var ObjectPathType=OfficeExtension.ObjectPathType;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPath=(function () {
		function ObjectPath(objectPathInfo, parentObjectPath, isCollection, isInvalidAfterRequest) {
			this.m_objectPathInfo=objectPathInfo;
			this.m_parentObjectPath=parentObjectPath;
			this.m_isWriteOperation=false;
			this.m_isCollection=isCollection;
			this.m_isInvalidAfterRequest=isInvalidAfterRequest;
			this.m_isValid=true;
		}
		Object.defineProperty(ObjectPath.prototype, "objectPathInfo", {
			get: function () {
				return this.m_objectPathInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			set: function (value) {
				this.m_isWriteOperation=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isCollection", {
			get: function () {
				return this.m_isCollection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isInvalidAfterRequest", {
			get: function () {
				return this.m_isInvalidAfterRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "parentObjectPath", {
			get: function () {
				return this.m_parentObjectPath;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "argumentObjectPaths", {
			get: function () {
				return this.m_argumentObjectPaths;
			},
			set: function (value) {
				this.m_argumentObjectPaths=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isValid", {
			get: function () {
				return this.m_isValid;
			},
			set: function (value) {
				this.m_isValid=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "getByIdMethodName", {
			get: function () {
				return this.m_getByIdMethodName;
			},
			set: function (value) {
				this.m_getByIdMethodName=value;
			},
			enumerable: true,
			configurable: true
		});
		ObjectPath.prototype._updateAsNullObject=function () {
			this.m_isInvalidAfterRequest=false;
			this.m_isValid=true;
			this.m_objectPathInfo.ObjectPathType=7 ;
			this.m_objectPathInfo.Name="";
			this.m_objectPathInfo.ArgumentInfo={};
			this.m_parentObjectPath=null;
			this.m_argumentObjectPaths=null;
		};
		ObjectPath.prototype.updateUsingObjectData=function (value) {
			var referenceId=value[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				this.m_isInvalidAfterRequest=false;
				this.m_isValid=true;
				this.m_objectPathInfo.ObjectPathType=6 ;
				this.m_objectPathInfo.Name=referenceId;
				this.m_objectPathInfo.ArgumentInfo={};
				this.m_parentObjectPath=null;
				this.m_argumentObjectPaths=null;
				return;
			}
			var parentIsCollection=this.parentObjectPath && this.parentObjectPath.isCollection;
			var getByIdMethodName=this.getByIdMethodName;
			if (parentIsCollection || !OfficeExtension.Utility.isNullOrEmptyString(getByIdMethodName)) {
				var id=value[OfficeExtension.Constants.id];
				if (OfficeExtension.Utility.isNullOrUndefined(id)) {
					id=value[OfficeExtension.Constants.idPrivate];
				}
				if (!OfficeExtension.Utility.isNullOrUndefined(id)) {
					this.m_isInvalidAfterRequest=false;
					this.m_isValid=true;
					if (parentIsCollection) {
						this.m_objectPathInfo.ObjectPathType=5 ;
						this.m_objectPathInfo.Name="";
					}
					else {
						this.m_objectPathInfo.ObjectPathType=3 ;
						this.m_objectPathInfo.Name=getByIdMethodName;
						this.m_getByIdMethodName=null;
					}
					this.isWriteOperation=false;
					this.m_objectPathInfo.ArgumentInfo={};
					this.m_objectPathInfo.ArgumentInfo.Arguments=[id];
					this.m_argumentObjectPaths=null;
					return;
				}
			}
		};
		return ObjectPath;
	})();
	OfficeExtension.ObjectPath=ObjectPath;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPathFactory=(function () {
		function ObjectPathFactory() {
		}
		ObjectPathFactory.createGlobalObjectObjectPath=function (context) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 1 , Name: "" };
			return new OfficeExtension.ObjectPath(objectPathInfo, null, false, false);
		};
		ObjectPathFactory.createNewObjectObjectPath=function (context, typeName, isCollection) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 2 , Name: typeName };
			return new OfficeExtension.ObjectPath(objectPathInfo, null, isCollection, false);
		};
		ObjectPathFactory.createPropertyObjectPath=function (context, parent, propertyName, isCollection, isInvalidAfterRequest) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 4 ,
				Name: propertyName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
		};
		ObjectPathFactory.createIndexerObjectPath=function (context, parent, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5 ,
				Name: "",
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createIndexerObjectPathUsingParentPath=function (context, parentObjectPath, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5 ,
				Name: "",
				ParentObjectPathId: parentObjectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parentObjectPath, false, false);
		};
		ObjectPathFactory.createMethodObjectPath=function (context, parent, methodName, operationType, args, isCollection, isInvalidAfterRequest, getByIdMethodName) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3 ,
				Name: methodName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var argumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, objectPathInfo.ArgumentInfo, args);
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
			ret.argumentObjectPaths=argumentObjectPaths;
			ret.isWriteOperation=(operationType !=1 );
			ret.getByIdMethodName=getByIdMethodName;
			return ret;
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt=function (hasIndexerMethod, context, parent, childItem, index) {
			var id=childItem[OfficeExtension.Constants.id];
			if (OfficeExtension.Utility.isNullOrUndefined(id)) {
				id=childItem[OfficeExtension.Constants.idPrivate];
			}
			if (hasIndexerMethod && !OfficeExtension.Utility.isNullOrUndefined(id)) {
				return ObjectPathFactory.createChildItemObjectPathUsingIndexer(context, parent, childItem);
			}
			else {
				return ObjectPathFactory.createChildItemObjectPathUsingGetItemAt(context, parent, childItem, index);
			}
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexer=function (context, parent, childItem) {
			var id=childItem[OfficeExtension.Constants.id];
			if (OfficeExtension.Utility.isNullOrUndefined(id)) {
				id=childItem[OfficeExtension.Constants.idPrivate];
			}
			var objectPathInfo=objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5 ,
				Name: "",
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=[id];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createChildItemObjectPathUsingGetItemAt=function (context, parent, childItem, index) {
			var indexFromServer=childItem[OfficeExtension.Constants.index];
			if (indexFromServer) {
				index=indexFromServer;
			}
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3 ,
				Name: OfficeExtension.Constants.getItemAt,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=[index];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		return ObjectPathFactory;
	})();
	OfficeExtension.ObjectPathFactory=ObjectPathFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var OfficeJsRequestExecutor=(function () {
		function OfficeJsRequestExecutor() {
		}
		OfficeJsRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, OfficeJsRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension.Promise(function (resolve, reject) {
				OSF.DDA.RichApi.executeRichApiRequestAsync(messageSafearray, function (result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (result.status=="succeeded") {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBody(result), OfficeExtension.RichApiMessageUtility.getResponseHeaders(result));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.code, result.error.message);
					}
					resolve(response);
				});
			});
		};
		OfficeJsRequestExecutor.SourceLibHeaderValue="OfficeJs";
		return OfficeJsRequestExecutor;
	})();
	OfficeExtension.OfficeJsRequestExecutor=OfficeJsRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var OfficeXHRSettings=(function () {
		function OfficeXHRSettings() {
		}
		return OfficeXHRSettings;
	})();
	OfficeExtension.OfficeXHRSettings=OfficeXHRSettings;
	function resetXHRFactory(oldFactory) {
		OfficeXHR.settings.oldxhr=oldFactory;
		return officeXHRFactory;
	}
	OfficeExtension.resetXHRFactory=resetXHRFactory;
	function officeXHRFactory() {
		return new OfficeXHR;
	}
	OfficeExtension.officeXHRFactory=officeXHRFactory;
	var OfficeXHR=(function () {
		function OfficeXHR() {
		}
		OfficeXHR.prototype.open=function (method, url) {
			this.m_method=method;
			this.m_url=url;
			if (this.m_url.toLowerCase().indexOf(OfficeExtension.Constants.localDocumentApiPrefix)==0) {
				this.m_url=this.m_url.substr(OfficeExtension.Constants.localDocumentApiPrefix.length);
			}
			else {
				this.m_innerXhr=OfficeXHR.settings.oldxhr();
				var thisObj=this;
				this.m_innerXhr.onreadystatechange=function () {
					thisObj.innerXhrOnreadystatechage();
				};
				this.m_innerXhr.open(method, this.m_url);
			}
		};
		OfficeXHR.prototype.abort=function () {
			if (this.m_innerXhr) {
				this.m_innerXhr.abort();
			}
		};
		OfficeXHR.prototype.send=function (body) {
			if (this.m_innerXhr) {
				this.m_innerXhr.send(body);
			}
			else {
				var thisObj=this;
				var requestFlags=0 ;
				if (!OfficeExtension.Utility.isReadonlyRestRequest(this.m_method)) {
					requestFlags=1 ;
				}
				var execFunction=OfficeXHR.settings.executeRichApiRequestAsync;
				if (!execFunction) {
					execFunction=OSF.DDA.RichApi.executeRichApiRequestAsync;
				}
				execFunction(OfficeExtension.RichApiMessageUtility.buildRequestMessageSafeArray('', requestFlags, this.m_method, this.m_url, this.m_requestHeaders, body), function (asyncResult) {
					thisObj.officeContextRequestCallback(asyncResult);
				});
			}
		};
		OfficeXHR.prototype.setRequestHeader=function (header, value) {
			if (this.m_innerXhr) {
				this.m_innerXhr.setRequestHeader(header, value);
			}
			else {
				if (!this.m_requestHeaders) {
					this.m_requestHeaders={};
				}
				this.m_requestHeaders[header]=value;
			}
		};
		OfficeXHR.prototype.getResponseHeader=function (header) {
			if (this.m_responseHeaders) {
				return this.m_responseHeaders[header.toUpperCase()];
			}
			return null;
		};
		OfficeXHR.prototype.getAllResponseHeaders=function () {
			return this.m_allResponseHeaders;
		};
		OfficeXHR.prototype.overrideMimeType=function (mimeType) {
			if (this.m_innerXhr) {
				this.m_innerXhr.overrideMimeType(mimeType);
			}
		};
		OfficeXHR.prototype.innerXhrOnreadystatechage=function () {
			this.readyState=this.m_innerXhr.readyState;
			if (this.readyState==OfficeXHR.DONE) {
				this.status=this.m_innerXhr.status;
				this.statusText=this.m_innerXhr.statusText;
				this.responseText=this.m_innerXhr.responseText;
				this.response=this.m_innerXhr.response;
				this.responseType=this.m_innerXhr.responseType;
				this.setAllResponseHeaders(this.m_innerXhr.getAllResponseHeaders());
			}
			if (this.onreadystatechange) {
				this.onreadystatechange();
			}
		};
		OfficeXHR.prototype.officeContextRequestCallback=function (result) {
			this.readyState=OfficeXHR.DONE;
			if (result.status=="succeeded") {
				this.status=OfficeExtension.RichApiMessageUtility.getResponseStatusCode(result);
				this.m_responseHeaders=OfficeExtension.RichApiMessageUtility.getResponseHeaders(result);
				console.debug("ResponseHeaders="+JSON.stringify(this.m_responseHeaders));
				this.responseText=OfficeExtension.RichApiMessageUtility.getResponseBody(result);
				console.debug("ResponseText="+this.responseText);
				this.response=this.responseText;
			}
			else {
				this.status=500;
				this.statusText="Internal Error";
			}
			if (this.onreadystatechange) {
				this.onreadystatechange();
			}
		};
		OfficeXHR.prototype.setAllResponseHeaders=function (allResponseHeaders) {
			this.m_allResponseHeaders=allResponseHeaders;
			this.m_responseHeaders={};
			if (this.m_allResponseHeaders !=null) {
				var regex=new RegExp("\r?\n");
				var entries=this.m_allResponseHeaders.split(regex);
				for (var i=0; i < entries.length; i++) {
					var entry=entries[i];
					if (entry !=null) {
						var index=entry.indexOf(':');
						if (index > 0) {
							var key=entry.substr(0, index);
							var value=entry.substr(index+1);
							key=OfficeExtension.Utility.trim(key);
							value=OfficeExtension.Utility.trim(value);
							this.m_responseHeaders[key.toUpperCase()]=value;
						}
					}
				}
			}
		};
		OfficeXHR.UNSENT=0;
		OfficeXHR.OPENED=1;
		OfficeXHR.DONE=4;
		OfficeXHR.settings=new OfficeXHRSettings();
		return OfficeXHR;
	})();
	OfficeExtension.OfficeXHR=OfficeXHR;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var PromiseImpl;
		(function (PromiseImpl) {
			function Init() {
				(function () {
					"use strict";
					function lib$es6$promise$utils$$objectOrFunction(x) {
						return typeof x==='function' || (typeof x==='object' && x !==null);
					}
					function lib$es6$promise$utils$$isFunction(x) {
						return typeof x==='function';
					}
					function lib$es6$promise$utils$$isMaybeThenable(x) {
						return typeof x==='object' && x !==null;
					}
					var lib$es6$promise$utils$$_isArray;
					if (!Array.isArray) {
						lib$es6$promise$utils$$_isArray=function (x) {
							return Object.prototype.toString.call(x)==='[object Array]';
						};
					}
					else {
						lib$es6$promise$utils$$_isArray=Array.isArray;
					}
					var lib$es6$promise$utils$$isArray=lib$es6$promise$utils$$_isArray;
					var lib$es6$promise$asap$$len=0;
					var lib$es6$promise$asap$$toString={}.toString;
					var lib$es6$promise$asap$$vertxNext;
					var lib$es6$promise$asap$$customSchedulerFn;
					var lib$es6$promise$asap$$asap=function asap(callback, arg) {
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len]=callback;
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len+1]=arg;
						lib$es6$promise$asap$$len+=2;
						if (lib$es6$promise$asap$$len===2) {
							if (lib$es6$promise$asap$$customSchedulerFn) {
								lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
							}
							else {
								lib$es6$promise$asap$$scheduleFlush();
							}
						}
					};
					function lib$es6$promise$asap$$setScheduler(scheduleFn) {
						lib$es6$promise$asap$$customSchedulerFn=scheduleFn;
					}
					function lib$es6$promise$asap$$setAsap(asapFn) {
						lib$es6$promise$asap$$asap=asapFn;
					}
					var lib$es6$promise$asap$$browserWindow=(typeof window !=='undefined') ? window : undefined;
					var lib$es6$promise$asap$$browserGlobal=lib$es6$promise$asap$$browserWindow || {};
					var lib$es6$promise$asap$$BrowserMutationObserver=lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
					var lib$es6$promise$asap$$isNode=typeof process !=='undefined' && {}.toString.call(process)==='[object process]';
					var lib$es6$promise$asap$$isWorker=typeof Uint8ClampedArray !=='undefined' && typeof importScripts !=='undefined' && typeof MessageChannel !=='undefined';
					function lib$es6$promise$asap$$useNextTick() {
						var nextTick=process.nextTick;
						var version=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
						if (Array.isArray(version) && version[1]==='0' && version[2]==='10') {
							nextTick=setImmediate;
						}
						return function () {
							nextTick(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useVertxTimer() {
						return function () {
							lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useMutationObserver() {
						var iterations=0;
						var observer=new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
						var node=document.createTextNode('');
						observer.observe(node, { characterData: true });
						return function () {
							node.data=(iterations=++iterations % 2);
						};
					}
					function lib$es6$promise$asap$$useMessageChannel() {
						var channel=new MessageChannel();
						channel.port1.onmessage=lib$es6$promise$asap$$flush;
						return function () {
							channel.port2.postMessage(0);
						};
					}
					function lib$es6$promise$asap$$useSetTimeout() {
						return function () {
							setTimeout(lib$es6$promise$asap$$flush, 1);
						};
					}
					var lib$es6$promise$asap$$queue=new Array(1000);
					function lib$es6$promise$asap$$flush() {
						for (var i=0; i < lib$es6$promise$asap$$len; i+=2) {
							var callback=lib$es6$promise$asap$$queue[i];
							var arg=lib$es6$promise$asap$$queue[i+1];
							callback(arg);
							lib$es6$promise$asap$$queue[i]=undefined;
							lib$es6$promise$asap$$queue[i+1]=undefined;
						}
						lib$es6$promise$asap$$len=0;
					}
					function lib$es6$promise$asap$$attemptVertex() {
						try {
							var r=require;
							var vertx=r('vertx');
							lib$es6$promise$asap$$vertxNext=vertx.runOnLoop || vertx.runOnContext;
							return lib$es6$promise$asap$$useVertxTimer();
						}
						catch (e) {
							return lib$es6$promise$asap$$useSetTimeout();
						}
					}
					var lib$es6$promise$asap$$scheduleFlush;
					if (lib$es6$promise$asap$$isNode) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useNextTick();
					}
					else if (lib$es6$promise$asap$$BrowserMutationObserver) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMutationObserver();
					}
					else if (lib$es6$promise$asap$$isWorker) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMessageChannel();
					}
					else if (lib$es6$promise$asap$$browserWindow===undefined && typeof require==='function') {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$attemptVertex();
					}
					else {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useSetTimeout();
					}
					function lib$es6$promise$$internal$$noop() {
					}
					var lib$es6$promise$$internal$$PENDING=void 0;
					var lib$es6$promise$$internal$$FULFILLED=1;
					var lib$es6$promise$$internal$$REJECTED=2;
					var lib$es6$promise$$internal$$GET_THEN_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$selfFullfillment() {
						return new TypeError("You cannot resolve a promise with itself");
					}
					function lib$es6$promise$$internal$$cannotReturnOwn() {
						return new TypeError('A promises callback cannot return that same promise.');
					}
					function lib$es6$promise$$internal$$getThen(promise) {
						try {
							return promise.then;
						}
						catch (error) {
							lib$es6$promise$$internal$$GET_THEN_ERROR.error=error;
							return lib$es6$promise$$internal$$GET_THEN_ERROR;
						}
					}
					function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
						try {
							then.call(value, fulfillmentHandler, rejectionHandler);
						}
						catch (e) {
							return e;
						}
					}
					function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
						lib$es6$promise$asap$$asap(function (promise) {
							var sealed=false;
							var error=lib$es6$promise$$internal$$tryThen(then, thenable, function (value) {
								if (sealed) {
									return;
								}
								sealed=true;
								if (thenable !==value) {
									lib$es6$promise$$internal$$resolve(promise, value);
								}
								else {
									lib$es6$promise$$internal$$fulfill(promise, value);
								}
							}, function (reason) {
								if (sealed) {
									return;
								}
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, reason);
							}, 'Settle: '+(promise._label || ' unknown promise'));
							if (!sealed && error) {
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, error);
							}
						}, promise);
					}
					function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
						if (thenable._state===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, thenable._result);
						}
						else if (thenable._state===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, thenable._result);
						}
						else {
							lib$es6$promise$$internal$$subscribe(thenable, undefined, function (value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function (reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
					}
					function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
						if (maybeThenable.constructor===promise.constructor) {
							lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
						}
						else {
							var then=lib$es6$promise$$internal$$getThen(maybeThenable);
							if (then===lib$es6$promise$$internal$$GET_THEN_ERROR) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
							}
							else if (then===undefined) {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
							else if (lib$es6$promise$utils$$isFunction(then)) {
								lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
							}
							else {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
						}
					}
					function lib$es6$promise$$internal$$resolve(promise, value) {
						if (promise===value) {
							lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
						}
						else if (lib$es6$promise$utils$$objectOrFunction(value)) {
							lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
						}
						else {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
					}
					function lib$es6$promise$$internal$$publishRejection(promise) {
						if (promise._onerror) {
							promise._onerror(promise._result);
						}
						lib$es6$promise$$internal$$publish(promise);
					}
					function lib$es6$promise$$internal$$fulfill(promise, value) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._result=value;
						promise._state=lib$es6$promise$$internal$$FULFILLED;
						if (promise._subscribers.length !==0) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
						}
					}
					function lib$es6$promise$$internal$$reject(promise, reason) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._state=lib$es6$promise$$internal$$REJECTED;
						promise._result=reason;
						lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
					}
					function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
						var subscribers=parent._subscribers;
						var length=subscribers.length;
						parent._onerror=null;
						subscribers[length]=child;
						subscribers[length+lib$es6$promise$$internal$$FULFILLED]=onFulfillment;
						subscribers[length+lib$es6$promise$$internal$$REJECTED]=onRejection;
						if (length===0 && parent._state) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
						}
					}
					function lib$es6$promise$$internal$$publish(promise) {
						var subscribers=promise._subscribers;
						var settled=promise._state;
						if (subscribers.length===0) {
							return;
						}
						var child, callback, detail=promise._result;
						for (var i=0; i < subscribers.length; i+=3) {
							child=subscribers[i];
							callback=subscribers[i+settled];
							if (child) {
								lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
							}
							else {
								callback(detail);
							}
						}
						promise._subscribers.length=0;
					}
					function lib$es6$promise$$internal$$ErrorObject() {
						this.error=null;
					}
					var lib$es6$promise$$internal$$TRY_CATCH_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$tryCatch(callback, detail) {
						try {
							return callback(detail);
						}
						catch (e) {
							lib$es6$promise$$internal$$TRY_CATCH_ERROR.error=e;
							return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
						}
					}
					function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
						var hasCallback=lib$es6$promise$utils$$isFunction(callback), value, error, succeeded, failed;
						if (hasCallback) {
							value=lib$es6$promise$$internal$$tryCatch(callback, detail);
							if (value===lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
								failed=true;
								error=value.error;
								value=null;
							}
							else {
								succeeded=true;
							}
							if (promise===value) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
								return;
							}
						}
						else {
							value=detail;
							succeeded=true;
						}
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
						}
						else if (hasCallback && succeeded) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						else if (failed) {
							lib$es6$promise$$internal$$reject(promise, error);
						}
						else if (settled===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
						else if (settled===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, value);
						}
					}
					function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
						try {
							resolver(function resolvePromise(value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function rejectPromise(reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
						catch (e) {
							lib$es6$promise$$internal$$reject(promise, e);
						}
					}
					function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
						var enumerator=this;
						enumerator._instanceConstructor=Constructor;
						enumerator.promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (enumerator._validateInput(input)) {
							enumerator._input=input;
							enumerator.length=input.length;
							enumerator._remaining=input.length;
							enumerator._init();
							if (enumerator.length===0) {
								lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
							}
							else {
								enumerator.length=enumerator.length || 0;
								enumerator._enumerate();
								if (enumerator._remaining===0) {
									lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
								}
							}
						}
						else {
							lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
						}
					}
					lib$es6$promise$enumerator$$Enumerator.prototype._validateInput=function (input) {
						return lib$es6$promise$utils$$isArray(input);
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._validationError=function () {
						return new _Internal.Error('Array Methods must be provided an Array');
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._init=function () {
						this._result=new Array(this.length);
					};
					var lib$es6$promise$enumerator$$default=lib$es6$promise$enumerator$$Enumerator;
					lib$es6$promise$enumerator$$Enumerator.prototype._enumerate=function () {
						var enumerator=this;
						var length=enumerator.length;
						var promise=enumerator.promise;
						var input=enumerator._input;
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							enumerator._eachEntry(input[i], i);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry=function (entry, i) {
						var enumerator=this;
						var c=enumerator._instanceConstructor;
						if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
							if (entry.constructor===c && entry._state !==lib$es6$promise$$internal$$PENDING) {
								entry._onerror=null;
								enumerator._settledAt(entry._state, i, entry._result);
							}
							else {
								enumerator._willSettleAt(c.resolve(entry), i);
							}
						}
						else {
							enumerator._remaining--;
							enumerator._result[i]=entry;
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._settledAt=function (state, i, value) {
						var enumerator=this;
						var promise=enumerator.promise;
						if (promise._state===lib$es6$promise$$internal$$PENDING) {
							enumerator._remaining--;
							if (state===lib$es6$promise$$internal$$REJECTED) {
								lib$es6$promise$$internal$$reject(promise, value);
							}
							else {
								enumerator._result[i]=value;
							}
						}
						if (enumerator._remaining===0) {
							lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt=function (promise, i) {
						var enumerator=this;
						lib$es6$promise$$internal$$subscribe(promise, undefined, function (value) {
							enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
						}, function (reason) {
							enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
						});
					};
					function lib$es6$promise$promise$all$$all(entries) {
						return new lib$es6$promise$enumerator$$default(this, entries).promise;
					}
					var lib$es6$promise$promise$all$$default=lib$es6$promise$promise$all$$all;
					function lib$es6$promise$promise$race$$race(entries) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (!lib$es6$promise$utils$$isArray(entries)) {
							lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
							return promise;
						}
						var length=entries.length;
						function onFulfillment(value) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						function onRejection(reason) {
							lib$es6$promise$$internal$$reject(promise, reason);
						}
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
						}
						return promise;
					}
					var lib$es6$promise$promise$race$$default=lib$es6$promise$promise$race$$race;
					function lib$es6$promise$promise$resolve$$resolve(object) {
						var Constructor=this;
						if (object && typeof object==='object' && object.constructor===Constructor) {
							return object;
						}
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$resolve(promise, object);
						return promise;
					}
					var lib$es6$promise$promise$resolve$$default=lib$es6$promise$promise$resolve$$resolve;
					function lib$es6$promise$promise$reject$$reject(reason) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$reject(promise, reason);
						return promise;
					}
					var lib$es6$promise$promise$reject$$default=lib$es6$promise$promise$reject$$reject;
					var lib$es6$promise$promise$$counter=0;
					function lib$es6$promise$promise$$needsResolver() {
						throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
					}
					function lib$es6$promise$promise$$needsNew() {
						throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
					}
					var lib$es6$promise$promise$$default=lib$es6$promise$promise$$Promise;
					function lib$es6$promise$promise$$Promise(resolver) {
						this._id=lib$es6$promise$promise$$counter++;
						this._state=undefined;
						this._result=undefined;
						this._subscribers=[];
						if (lib$es6$promise$$internal$$noop !==resolver) {
							if (!lib$es6$promise$utils$$isFunction(resolver)) {
								lib$es6$promise$promise$$needsResolver();
							}
							if (!(this instanceof lib$es6$promise$promise$$Promise)) {
								lib$es6$promise$promise$$needsNew();
							}
							lib$es6$promise$$internal$$initializePromise(this, resolver);
						}
					}
					lib$es6$promise$promise$$Promise.all=lib$es6$promise$promise$all$$default;
					lib$es6$promise$promise$$Promise.race=lib$es6$promise$promise$race$$default;
					lib$es6$promise$promise$$Promise.resolve=lib$es6$promise$promise$resolve$$default;
					lib$es6$promise$promise$$Promise.reject=lib$es6$promise$promise$reject$$default;
					lib$es6$promise$promise$$Promise._setScheduler=lib$es6$promise$asap$$setScheduler;
					lib$es6$promise$promise$$Promise._setAsap=lib$es6$promise$asap$$setAsap;
					lib$es6$promise$promise$$Promise._asap=lib$es6$promise$asap$$asap;
					lib$es6$promise$promise$$Promise.prototype={
						constructor: lib$es6$promise$promise$$Promise,
						then: function (onFulfillment, onRejection) {
							var parent=this;
							var state=parent._state;
							if (state===lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state===lib$es6$promise$$internal$$REJECTED && !onRejection) {
								return this;
							}
							var child=new this.constructor(lib$es6$promise$$internal$$noop);
							var result=parent._result;
							if (state) {
								var callback=arguments[state - 1];
								lib$es6$promise$asap$$asap(function () {
									lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
								});
							}
							else {
								lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
							}
							return child;
						},
						'catch': function (onRejection) {
							return this.then(null, onRejection);
						}
					};
					OfficeExtension.Promise=lib$es6$promise$promise$$default;
				}).call(this);
			}
			PromiseImpl.Init=Init;
		})(PromiseImpl=_Internal.PromiseImpl || (_Internal.PromiseImpl={}));
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	if (!OfficeExtension["Promise"]) {
		if (window.Promise) {
			OfficeExtension.Promise=window.Promise;
		}
		else {
			_Internal.PromiseImpl.Init();
		}
	}
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	(function (OperationType) {
		OperationType[OperationType["Default"]=0]="Default";
		OperationType[OperationType["Read"]=1]="Read";
	})(OfficeExtension.OperationType || (OfficeExtension.OperationType={}));
	var OperationType=OfficeExtension.OperationType;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var TrackedObjects=(function () {
		function TrackedObjects(context) {
			this._autoCleanupList={};
			this.m_context=context;
		}
		TrackedObjects.prototype.add=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._addCommon(item, true); });
			}
			else {
				this._addCommon(param, true);
			}
		};
		TrackedObjects.prototype._autoAdd=function (object) {
			this._addCommon(object, false);
			this._autoCleanupList[object._objectPath.objectPathInfo.Id]=object;
		};
		TrackedObjects.prototype._addCommon=function (object, isExplicitlyAdded) {
			if (object[OfficeExtension.Constants.isTracked]) {
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				return;
			}
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (OfficeExtension.Utility.isNullOrEmptyString(referenceId) && object._KeepReference) {
				object._KeepReference();
				OfficeExtension.ActionFactory.createInstantiateAction(this.m_context, object);
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				object[OfficeExtension.Constants.isTracked]=true;
			}
		};
		TrackedObjects.prototype.remove=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._removeCommon(item); });
			}
			else {
				this._removeCommon(param);
			}
		};
		TrackedObjects.prototype._removeCommon=function (object) {
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				var rootObject=this.m_context._rootObject;
				if (rootObject._RemoveReference) {
					rootObject._RemoveReference(referenceId);
				}
				delete object[OfficeExtension.Constants.isTracked];
			}
		};
		TrackedObjects.prototype._retrieveAndClearAutoCleanupList=function () {
			var list=this._autoCleanupList;
			this._autoCleanupList={};
			return list;
		};
		return TrackedObjects;
	})();
	OfficeExtension.TrackedObjects=TrackedObjects;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ResourceStrings=(function () {
		function ResourceStrings() {
		}
		ResourceStrings.invalidObjectPath="InvalidObjectPath";
		ResourceStrings.propertyNotLoaded="PropertyNotLoaded";
		ResourceStrings.invalidRequestContext="InvalidRequestContext";
		ResourceStrings.invalidArgument="InvalidArgument";
		ResourceStrings.runMustReturnPromise="RunMustReturnPromise";
		return ResourceStrings;
	})();
	OfficeExtension.ResourceStrings=ResourceStrings;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var RichApiMessageUtility=(function () {
		function RichApiMessageUtility() {
		}
		RichApiMessageUtility.buildMessageArrayForIRequestExecutor=function (customData, requestFlags, requestMessage, sourceLibHeaderValue) {
			var requestMessageText=JSON.stringify(requestMessage.Body);
			OfficeExtension.Utility.log("Request:");
			OfficeExtension.Utility.log(requestMessageText);
			var headers={};
			headers[OfficeExtension.Constants.sourceLibHeader]=sourceLibHeaderValue;
			var messageSafearray=RichApiMessageUtility.buildRequestMessageSafeArray(customData, requestFlags, "POST", "ProcessQuery", headers, requestMessageText);
			return messageSafearray;
		};
		RichApiMessageUtility.buildResponseOnSuccess=function (responseBody, responseHeaders) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.Body=JSON.parse(responseBody);
			response.Headers=responseHeaders;
			return response;
		};
		RichApiMessageUtility.buildResponseOnError=function (errorCode, message) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.ErrorCode=OfficeExtension.ErrorCodes.generalException;
			if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability) {
				response.ErrorCode=OfficeExtension.ErrorCodes.accessDenied;
			}
			else if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached) {
				response.ErrorCode=OfficeExtension.ErrorCodes.activityLimitReached;
			}
			response.ErrorMessage=message;
			return response;
		};
		RichApiMessageUtility.buildRequestMessageSafeArray=function (customData, requestFlags, method, path, headers, body) {
			var headerArray=[];
			if (headers) {
				for (var headerName in headers) {
					headerArray.push(headerName);
					headerArray.push(headers[headerName]);
				}
			}
			var appPermission=0;
			var solutionId="";
			var instanceId="";
			var marketplaceType="";
			return [
				customData,
				method,
				path,
				headerArray,
				body,
				appPermission,
				requestFlags,
				solutionId,
				instanceId,
				marketplaceType
			];
		};
		RichApiMessageUtility.getResponseBody=function (result) {
			return RichApiMessageUtility.getResponseBodyFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseHeaders=function (result) {
			return RichApiMessageUtility.getResponseHeadersFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseBodyFromSafeArray=function (data) {
			var ret=data[2 ];
			if (typeof (ret)==="string") {
				return ret;
			}
			var arr=ret;
			return arr.join("");
		};
		RichApiMessageUtility.getResponseHeadersFromSafeArray=function (data) {
			var arrayHeader=data[1 ];
			if (!arrayHeader) {
				return null;
			}
			var headers={};
			for (var i=0; i < arrayHeader.length - 1; i+=2) {
				headers[arrayHeader[i]]=arrayHeader[i+1];
			}
			return headers;
		};
		RichApiMessageUtility.getResponseStatusCode=function (result) {
			return RichApiMessageUtility.getResponseStatusCodeFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseStatusCodeFromSafeArray=function (data) {
			return data[0 ];
		};
		RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability=7000;
		RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached=5102;
		return RichApiMessageUtility;
	})();
	OfficeExtension.RichApiMessageUtility=RichApiMessageUtility;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Utility=(function () {
		function Utility() {
		}
		Utility.checkArgumentNull=function (value, name) {
			if (Utility.isNullOrUndefined(value)) {
				Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, name);
			}
		};
		Utility.isNullOrUndefined=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isUndefined=function (value) {
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isNullOrEmptyString=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			if (value.length==0) {
				return true;
			}
			return false;
		};
		Utility.trim=function (str) {
			return str.replace(new RegExp("^\\s+|\\s+$", "g"), "");
		};
		Utility.caseInsensitiveCompareString=function (str1, str2) {
			if (Utility.isNullOrUndefined(str1)) {
				return Utility.isNullOrUndefined(str2);
			}
			else {
				if (Utility.isNullOrUndefined(str2)) {
					return false;
				}
				else {
					return str1.toUpperCase()==str2.toUpperCase();
				}
			}
		};
		Utility.isReadonlyRestRequest=function (method) {
			return Utility.caseInsensitiveCompareString(method, "GET");
		};
		Utility.setMethodArguments=function (context, argumentInfo, args) {
			if (Utility.isNullOrUndefined(args)) {
				return null;
			}
			var referencedObjectPaths=new Array();
			var referencedObjectPathIds=new Array();
			var hasOne=Utility.collectObjectPathInfos(context, args, referencedObjectPaths, referencedObjectPathIds);
			argumentInfo.Arguments=args;
			if (hasOne) {
				argumentInfo.ReferencedObjectPathIds=referencedObjectPathIds;
				return referencedObjectPaths;
			}
			return null;
		};
		Utility.collectObjectPathInfos=function (context, args, referencedObjectPaths, referencedObjectPathIds) {
			var hasOne=false;
			for (var i=0; i < args.length; i++) {
				if (args[i] instanceof OfficeExtension.ClientObject) {
					var clientObject=args[i];
					Utility.validateContext(context, clientObject);
					args[i]=clientObject._objectPath.objectPathInfo.Id;
					referencedObjectPathIds.push(clientObject._objectPath.objectPathInfo.Id);
					referencedObjectPaths.push(clientObject._objectPath);
					hasOne=true;
				}
				else if (Array.isArray(args[i])) {
					var childArrayObjectPathIds=new Array();
					var childArrayHasOne=Utility.collectObjectPathInfos(context, args[i], referencedObjectPaths, childArrayObjectPathIds);
					if (childArrayHasOne) {
						referencedObjectPathIds.push(childArrayObjectPathIds);
						hasOne=true;
					}
					else {
						referencedObjectPathIds.push(0);
					}
				}
				else {
					referencedObjectPathIds.push(0);
				}
			}
			return hasOne;
		};
		Utility.fixObjectPathIfNecessary=function (clientObject, value) {
			if (clientObject && clientObject._objectPath && value) {
				clientObject._objectPath.updateUsingObjectData(value);
			}
		};
		Utility.validateObjectPath=function (clientObject) {
			var objectPath=clientObject._objectPath;
			while (objectPath) {
				if (!objectPath.isValid) {
					var pathExpression=Utility.getObjectPathExpression(objectPath);
					Utility.throwError(OfficeExtension.ResourceStrings.invalidObjectPath, pathExpression);
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		Utility.validateReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					var objectPath=objectPaths[i];
					while (objectPath) {
						if (!objectPath.isValid) {
							var pathExpression=Utility.getObjectPathExpression(objectPath);
							Utility.throwError(OfficeExtension.ResourceStrings.invalidObjectPath, pathExpression);
						}
						objectPath=objectPath.parentObjectPath;
					}
				}
			}
		};
		Utility.validateContext=function (context, obj) {
			if (obj && obj.context !==context) {
				Utility.throwError(OfficeExtension.ResourceStrings.invalidRequestContext);
			}
		};
		Utility.log=function (message) {
			if (Utility._logEnabled && window.console && window.console.log) {
				window.console.log(message);
			}
		};
		Utility.load=function (clientObj, option) {
			clientObj.context.load(clientObj, option);
		};
		Utility.throwError=function (resourceId, arg, errorLocation) {
			throw new OfficeExtension._Internal.RuntimeError(resourceId, Utility._getResourceString(resourceId, arg), new Array(), errorLocation ? { errorLocation: errorLocation } : {});
		};
		Utility.createRuntimeError=function (code, message, location) {
			return new OfficeExtension._Internal.RuntimeError(code, message, [], { errorLocation: location });
		};
		Utility._getResourceString=function (resourceId, arg) {
			var ret=resourceId;
			if (window.Strings && window.Strings.OfficeOM) {
				var stringName="L_"+resourceId;
				var stringValue=window.Strings.OfficeOM[stringName];
				if (stringValue) {
					ret=stringValue;
				}
			}
			if (!Utility.isNullOrUndefined(arg)) {
				ret=ret.replace("{0}", arg);
			}
			return ret;
		};
		Utility.throwIfNotLoaded=function (propertyName, fieldValue, entityName, isNull) {
			if (!isNull && Utility.isUndefined(fieldValue) && propertyName.charCodeAt(0) !=Utility.s_underscoreCharCode) {
				Utility.throwError(OfficeExtension.ResourceStrings.propertyNotLoaded, propertyName, (entityName ? entityName+"."+propertyName : null));
			}
		};
		Utility.getObjectPathExpression=function (objectPath) {
			var ret="";
			while (objectPath) {
				switch (objectPath.objectPathInfo.ObjectPathType) {
					case 1 :
						ret=ret;
						break;
					case 2 :
						ret="new()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 3 :
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+"()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 4 :
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+(ret.length > 0 ? "." : "")+ret;
						break;
					case 5 :
						ret="getItem()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 6 :
						ret="_reference()"+(ret.length > 0 ? "." : "")+ret;
						break;
				}
				objectPath=objectPath.parentObjectPath;
			}
			return ret;
		};
		Utility._createPromiseFromResult=function (value) {
			return new OfficeExtension['Promise'](function (resolve, reject) {
				resolve(value);
			});
		};
		Utility._addActionResultHandler=function (clientObj, action, resultHandler) {
			clientObj.context._pendingRequest.addActionResultHandler(action, resultHandler);
		};
		Utility._handleNavigationPropertyResults=function (clientObj, objectValue, propertyNames) {
			for (var i=0; i < propertyNames.length - 1; i+=2) {
				if (!Utility.isUndefined(objectValue[propertyNames[i+1]])) {
					clientObj[propertyNames[i]]._handleResult(objectValue[propertyNames[i+1]]);
				}
			}
		};
		Utility.normalizeName=function (name) {
			return name.substr(0, 1).toLowerCase()+name.substr(1);
		};
		Utility._logEnabled=false;
		Utility.s_underscoreCharCode="_".charCodeAt(0);
		return Utility;
	})();
	OfficeExtension.Utility=Utility;
})(OfficeExtension || (OfficeExtension={}));

var __extends=this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	__.prototype=b.prototype;
	d.prototype=new __();
};
var Excel;
(function (Excel) {
	function lowerCaseFirst(str) {
		return str[0].toLowerCase()+str.slice(1);
	}
	var iconSets=["ThreeArrows", "ThreeArrowsGray", "ThreeFlags", "ThreeTrafficLights1", "ThreeTrafficLights2", "ThreeSigns", "ThreeSymbols", "ThreeSymbols2", "FourArrows", "FourArrowsGray", "FourRedToBlack", "FourRating", "FourTrafficLights", "FiveArrows", "FiveArrowsGray", "FiveRating", "FiveQuarters", "ThreeStars", "ThreeTriangles", "FiveBoxes"];
	var iconNames=[["RedDownArrow", "YellowSideArrow", "GreenUpArrow"], ["GrayDownArrow", "GraySideArrow", "GrayUpArrow"], ["RedFlag", "YellowFlag", "GreenFlag"], ["RedCircleWithBorder", "YellowCircle", "GreenCircle"], ["RedTrafficLight", "YellowTrafficLight", "GreenTrafficLight"], ["RedDiamond", "YellowTriangle", "GreenCircle"], ["RedCrossSymbol", "YellowExclamationSymbol", "GreenCheckSymbol"], ["RedCross", "YellowExclamation", "GreenCheck"], ["RedDownArrow", "YellowDownInclineArrow", "YellowUpInclineArrow", "GreenUpArrow"], ["GrayDownArrow", "GrayDownInclineArrow", "GrayUpInclineArrow", "GrayUpArrow"], ["BlackCircle", "GrayCircle", "PinkCircle", "RedCircle"], ["OneBar", "TwoBars", "ThreeBars", "FourBars"], ["BlackCircleWithBorder", "RedCircleWithBorder", "YellowCircle", "GreenCircle"], ["RedDownArrow", "YellowDownInclineArrow", "YellowSideArrow", "YellowUpInclineArrow", "GreenUpArrow"], ["GrayDownArrow", "GrayDownInclineArrow", "GraySideArrow", "GrayUpInclineArrow", "GrayUpArrow"], ["NoBars", "OneBar", "TwoBars", "ThreeBars", "FourBars"], ["WhiteCircleAllWhiteQuarters", "CircleWithThreeWhiteQuarters", "CircleWithTwoWhiteQuarters", "CircleWithOneWhiteQuarter", "BlackCircle"], ["SilverStar", "HalfGoldStar", "GoldStar"], ["RedDownTriangle", "YellowDash", "GreenUpTriangle"], ["NoFilledBoxes", "OneFilledBox", "TwoFilledBoxes", "ThreeFilledBoxes", "FourFilledBoxes"],];
	Excel.icons={};
	iconSets.map(function (title, i) {
		var camelTitle=lowerCaseFirst(title);
		Excel.icons[camelTitle]=[];
		iconNames[i].map(function (iconName, j) {
			iconName=lowerCaseFirst(iconName);
			var obj={ set: title, index: j };
			Excel.icons[camelTitle].push(obj);
			Excel.icons[camelTitle][iconName]=obj;
		});
	});
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _load=OfficeExtension.Utility.load;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var Application=(function (_super) {
		__extends(Application, _super);
		function Application() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Application.prototype, "calculationMode", {
			get: function () {
				_throwIfNotLoaded("calculationMode", this.m_calculationMode, "Application", this._isNull);
				return this.m_calculationMode;
			},
			enumerable: true,
			configurable: true
		});
		Application.prototype.calculate=function (calculationType) {
			_createMethodAction(this.context, this, "Calculate", 0 , [calculationType]);
		};
		Application.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["CalculationMode"])) {
				this.m_calculationMode=obj["CalculationMode"];
			}
		};
		Application.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Application;
	})(OfficeExtension.ClientObject);
	Excel.Application=Application;
	var Workbook=(function (_super) {
		__extends(Workbook, _super);
		function Workbook() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Workbook.prototype, "application", {
			get: function () {
				if (!this.m_application) {
					this.m_application=new Excel.Application(this.context, _createPropertyObjectPath(this.context, this, "Application", false, false));
				}
				return this.m_application;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "bindings", {
			get: function () {
				if (!this.m_bindings) {
					this.m_bindings=new Excel.BindingCollection(this.context, _createPropertyObjectPath(this.context, this, "Bindings", true, false));
				}
				return this.m_bindings;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "functions", {
			get: function () {
				if (!this.m_functions) {
					this.m_functions=new Excel.Functions(this.context, _createPropertyObjectPath(this.context, this, "Functions", false, false));
				}
				return this.m_functions;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "names", {
			get: function () {
				if (!this.m_names) {
					this.m_names=new Excel.NamedItemCollection(this.context, _createPropertyObjectPath(this.context, this, "Names", true, false));
				}
				return this.m_names;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Excel.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Workbook.prototype, "worksheets", {
			get: function () {
				if (!this.m_worksheets) {
					this.m_worksheets=new Excel.WorksheetCollection(this.context, _createPropertyObjectPath(this.context, this, "Worksheets", true, false));
				}
				return this.m_worksheets;
			},
			enumerable: true,
			configurable: true
		});
		Workbook.prototype.getSelectedRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetSelectedRange", 1 , [], false, true));
		};
		Workbook.prototype._GetObjectByReferenceId=function (bstrReferenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectByReferenceId", 1 , [bstrReferenceId]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._GetObjectTypeNameByReferenceId=function (bstrReferenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectTypeNameByReferenceId", 1 , [bstrReferenceId]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._GetReferenceCount=function () {
			var action=_createMethodAction(this.context, this, "_GetReferenceCount", 1 , []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Workbook.prototype._RemoveAllReferences=function () {
			_createMethodAction(this.context, this, "_RemoveAllReferences", 1 , []);
		};
		Workbook.prototype._RemoveReference=function (bstrReferenceId) {
			_createMethodAction(this.context, this, "_RemoveReference", 1 , [bstrReferenceId]);
		};
		Workbook.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["application", "Application", "bindings", "Bindings", "functions", "Functions", "names", "Names", "tables", "Tables", "worksheets", "Worksheets"]);
		};
		Workbook.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Workbook;
	})(OfficeExtension.ClientObject);
	Excel.Workbook=Workbook;
	var Worksheet=(function (_super) {
		__extends(Worksheet, _super);
		function Worksheet() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Worksheet.prototype, "charts", {
			get: function () {
				if (!this.m_charts) {
					this.m_charts=new Excel.ChartCollection(this.context, _createPropertyObjectPath(this.context, this, "Charts", true, false));
				}
				return this.m_charts;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "protection", {
			get: function () {
				if (!this.m_protection) {
					this.m_protection=new Excel.WorksheetProtection(this.context, _createPropertyObjectPath(this.context, this, "Protection", false, false));
				}
				return this.m_protection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Excel.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "Worksheet", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "Worksheet", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "position", {
			get: function () {
				_throwIfNotLoaded("position", this.m_position, "Worksheet", this._isNull);
				return this.m_position;
			},
			set: function (value) {
				this.m_position=value;
				_createSetPropertyAction(this.context, this, "Position", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Worksheet.prototype, "visibility", {
			get: function () {
				_throwIfNotLoaded("visibility", this.m_visibility, "Worksheet", this._isNull);
				return this.m_visibility;
			},
			set: function (value) {
				this.m_visibility=value;
				_createSetPropertyAction(this.context, this, "Visibility", value);
			},
			enumerable: true,
			configurable: true
		});
		Worksheet.prototype.activate=function () {
			_createMethodAction(this.context, this, "Activate", 1 , []);
		};
		Worksheet.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0 , []);
		};
		Worksheet.prototype.getCell=function (row, column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetCell", 1 , [row, column], false, true));
		};
		Worksheet.prototype.getRange=function (address) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [address], false, true));
		};
		Worksheet.prototype.getUsedRange=function (valuesOnly) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRange", 1 , [valuesOnly], false, true));
		};
		Worksheet.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Position"])) {
				this.m_position=obj["Position"];
			}
			if (!_isUndefined(obj["Visibility"])) {
				this.m_visibility=obj["Visibility"];
			}
			_handleNavigationPropertyResults(this, obj, ["charts", "Charts", "protection", "Protection", "tables", "Tables"]);
		};
		Worksheet.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Worksheet;
	})(OfficeExtension.ClientObject);
	Excel.Worksheet=Worksheet;
	var WorksheetCollection=(function (_super) {
		__extends(WorksheetCollection, _super);
		function WorksheetCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(WorksheetCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "WorksheetCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		WorksheetCollection.prototype.add=function (name) {
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "Add", 0 , [name], false, true));
		};
		WorksheetCollection.prototype.getActiveWorksheet=function () {
			return new Excel.Worksheet(this.context, _createMethodObjectPath(this.context, this, "GetActiveWorksheet", 1 , [], false, false));
		};
		WorksheetCollection.prototype.getItem=function (key) {
			return new Excel.Worksheet(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		WorksheetCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.Worksheet(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		WorksheetCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return WorksheetCollection;
	})(OfficeExtension.ClientObject);
	Excel.WorksheetCollection=WorksheetCollection;
	var WorksheetProtection=(function (_super) {
		__extends(WorksheetProtection, _super);
		function WorksheetProtection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(WorksheetProtection.prototype, "options", {
			get: function () {
				_throwIfNotLoaded("options", this.m_options, "WorksheetProtection", this._isNull);
				return this.m_options;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(WorksheetProtection.prototype, "protected", {
			get: function () {
				_throwIfNotLoaded("protected", this.m_protected, "WorksheetProtection", this._isNull);
				return this.m_protected;
			},
			enumerable: true,
			configurable: true
		});
		WorksheetProtection.prototype.protect=function (options) {
			_createMethodAction(this.context, this, "Protect", 0 , [options]);
		};
		WorksheetProtection.prototype.unprotect=function () {
			_createMethodAction(this.context, this, "Unprotect", 0 , []);
		};
		WorksheetProtection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Options"])) {
				this.m_options=obj["Options"];
			}
			if (!_isUndefined(obj["Protected"])) {
				this.m_protected=obj["Protected"];
			}
		};
		WorksheetProtection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return WorksheetProtection;
	})(OfficeExtension.ClientObject);
	Excel.WorksheetProtection=WorksheetProtection;
	var Range=(function (_super) {
		__extends(Range, _super);
		function Range() {
			_super.apply(this, arguments);
		}
		Range.prototype._ensureInteger=function (num, methodName) {
			if (!(typeof num==="number" && isFinite(num) && Math.floor(num)===num)) {
				throw new OfficeExtension.Utility.throwError(Excel.ErrorCodes.invalidArgument, num, methodName);
			}
		};
		Range.prototype._getAdjacentRange=function (functionName, count, referenceRange, rowDirection, columnDirection) {
			if (count==null) {
				count=1;
			}
			this._ensureInteger(count, functionName);
			var startRange;
			var rowOffset=0;
			var columnOffset=0;
			if (count > 0) {
				startRange=referenceRange.getOffsetRange(rowDirection, columnDirection);
			}
			else {
				startRange=referenceRange;
				rowOffset=rowDirection;
				columnOffset=columnDirection;
			}
			if (Math.abs(count)==1) {
				return startRange;
			}
			return startRange.getBoundingRect(referenceRange.getOffsetRange(rowDirection * count+rowOffset, columnDirection * count+columnOffset));
		};
		Range.prototype.getRowsAbove=function (count) {
			return this._getAdjacentRange("getRowsAbove", count, this.getRow(0), -1, 0);
		};
		Range.prototype.getRowsBelow=function (count) {
			return this._getAdjacentRange("getRowsBelow", count, this.getLastRow(), 1, 0);
		};
		Range.prototype.getColumnsBefore=function (count) {
			return this._getAdjacentRange("getColumnsBefore", count, this.getColumn(0), 0, -1);
		};
		Range.prototype.getColumnsAfter=function (count) {
			return this._getAdjacentRange("getColumnsAfter", count, this.getLastColumn(), 0, 1);
		};
		Range.prototype.getResizedRange=function (deltaRows, deltaColumns) {
			this._ensureInteger(deltaRows, "getResizedRange");
			this._ensureInteger(deltaColumns, "getResizedRange");
			var referenceRange=(deltaRows >=0 && deltaColumns >=0) ? this : this.getCell(0, 0);
			return referenceRange.getBoundingRect(this.getLastCell().getOffsetRange(deltaRows, deltaColumns));
		};
		Object.defineProperty(Range.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.RangeFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "sort", {
			get: function () {
				if (!this.m_sort) {
					this.m_sort=new Excel.RangeSort(this.context, _createPropertyObjectPath(this.context, this, "Sort", false, false));
				}
				return this.m_sort;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "worksheet", {
			get: function () {
				if (!this.m_worksheet) {
					this.m_worksheet=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false));
				}
				return this.m_worksheet;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "address", {
			get: function () {
				_throwIfNotLoaded("address", this.m_address, "Range", this._isNull);
				return this.m_address;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "addressLocal", {
			get: function () {
				_throwIfNotLoaded("addressLocal", this.m_addressLocal, "Range", this._isNull);
				return this.m_addressLocal;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "cellCount", {
			get: function () {
				_throwIfNotLoaded("cellCount", this.m_cellCount, "Range", this._isNull);
				return this.m_cellCount;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "columnCount", {
			get: function () {
				_throwIfNotLoaded("columnCount", this.m_columnCount, "Range", this._isNull);
				return this.m_columnCount;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "columnHidden", {
			get: function () {
				_throwIfNotLoaded("columnHidden", this.m_columnHidden, "Range", this._isNull);
				return this.m_columnHidden;
			},
			set: function (value) {
				this.m_columnHidden=value;
				_createSetPropertyAction(this.context, this, "ColumnHidden", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "columnIndex", {
			get: function () {
				_throwIfNotLoaded("columnIndex", this.m_columnIndex, "Range", this._isNull);
				return this.m_columnIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "formulas", {
			get: function () {
				_throwIfNotLoaded("formulas", this.m_formulas, "Range", this._isNull);
				return this.m_formulas;
			},
			set: function (value) {
				this.m_formulas=value;
				_createSetPropertyAction(this.context, this, "Formulas", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "formulasLocal", {
			get: function () {
				_throwIfNotLoaded("formulasLocal", this.m_formulasLocal, "Range", this._isNull);
				return this.m_formulasLocal;
			},
			set: function (value) {
				this.m_formulasLocal=value;
				_createSetPropertyAction(this.context, this, "FormulasLocal", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "formulasR1C1", {
			get: function () {
				_throwIfNotLoaded("formulasR1C1", this.m_formulasR1C1, "Range", this._isNull);
				return this.m_formulasR1C1;
			},
			set: function (value) {
				this.m_formulasR1C1=value;
				_createSetPropertyAction(this.context, this, "FormulasR1C1", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "hidden", {
			get: function () {
				_throwIfNotLoaded("hidden", this.m_hidden, "Range", this._isNull);
				return this.m_hidden;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "numberFormat", {
			get: function () {
				_throwIfNotLoaded("numberFormat", this.m_numberFormat, "Range", this._isNull);
				return this.m_numberFormat;
			},
			set: function (value) {
				this.m_numberFormat=value;
				_createSetPropertyAction(this.context, this, "NumberFormat", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "rowCount", {
			get: function () {
				_throwIfNotLoaded("rowCount", this.m_rowCount, "Range", this._isNull);
				return this.m_rowCount;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "rowHidden", {
			get: function () {
				_throwIfNotLoaded("rowHidden", this.m_rowHidden, "Range", this._isNull);
				return this.m_rowHidden;
			},
			set: function (value) {
				this.m_rowHidden=value;
				_createSetPropertyAction(this.context, this, "RowHidden", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "rowIndex", {
			get: function () {
				_throwIfNotLoaded("rowIndex", this.m_rowIndex, "Range", this._isNull);
				return this.m_rowIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "Range", this._isNull);
				return this.m_text;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "valueTypes", {
			get: function () {
				_throwIfNotLoaded("valueTypes", this.m_valueTypes, "Range", this._isNull);
				return this.m_valueTypes;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "values", {
			get: function () {
				_throwIfNotLoaded("values", this.m_values, "Range", this._isNull);
				return this.m_values;
			},
			set: function (value) {
				this.m_values=value;
				_createSetPropertyAction(this.context, this, "Values", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Range", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Range.prototype.clear=function (applyTo) {
			_createMethodAction(this.context, this, "Clear", 0 , [applyTo]);
		};
		Range.prototype.delete=function (shift) {
			_createMethodAction(this.context, this, "Delete", 0 , [shift]);
		};
		Range.prototype.getBoundingRect=function (anotherRange) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetBoundingRect", 1 , [anotherRange], false, true));
		};
		Range.prototype.getCell=function (row, column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetCell", 1 , [row, column], false, true));
		};
		Range.prototype.getColumn=function (column) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetColumn", 1 , [column], false, true));
		};
		Range.prototype.getEntireColumn=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetEntireColumn", 1 , [], false, true));
		};
		Range.prototype.getEntireRow=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetEntireRow", 1 , [], false, true));
		};
		Range.prototype.getIntersection=function (anotherRange) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetIntersection", 1 , [anotherRange], false, true));
		};
		Range.prototype.getLastCell=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastCell", 1 , [], false, true));
		};
		Range.prototype.getLastColumn=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastColumn", 1 , [], false, true));
		};
		Range.prototype.getLastRow=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetLastRow", 1 , [], false, true));
		};
		Range.prototype.getOffsetRange=function (rowOffset, columnOffset) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetOffsetRange", 1 , [rowOffset, columnOffset], false, true));
		};
		Range.prototype.getRow=function (row) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRow", 1 , [row], false, true));
		};
		Range.prototype.getUsedRange=function (valuesOnly) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetUsedRange", 1 , [valuesOnly], false, true));
		};
		Range.prototype.insert=function (shift) {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "Insert", 0 , [shift], false, true));
		};
		Range.prototype.merge=function (across) {
			_createMethodAction(this.context, this, "Merge", 0 , [across]);
		};
		Range.prototype.select=function () {
			_createMethodAction(this.context, this, "Select", 1 , []);
		};
		Range.prototype.unmerge=function () {
			_createMethodAction(this.context, this, "Unmerge", 0 , []);
		};
		Range.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1 , []);
		};
		Range.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Address"])) {
				this.m_address=obj["Address"];
			}
			if (!_isUndefined(obj["AddressLocal"])) {
				this.m_addressLocal=obj["AddressLocal"];
			}
			if (!_isUndefined(obj["CellCount"])) {
				this.m_cellCount=obj["CellCount"];
			}
			if (!_isUndefined(obj["ColumnCount"])) {
				this.m_columnCount=obj["ColumnCount"];
			}
			if (!_isUndefined(obj["ColumnHidden"])) {
				this.m_columnHidden=obj["ColumnHidden"];
			}
			if (!_isUndefined(obj["ColumnIndex"])) {
				this.m_columnIndex=obj["ColumnIndex"];
			}
			if (!_isUndefined(obj["Formulas"])) {
				this.m_formulas=obj["Formulas"];
			}
			if (!_isUndefined(obj["FormulasLocal"])) {
				this.m_formulasLocal=obj["FormulasLocal"];
			}
			if (!_isUndefined(obj["FormulasR1C1"])) {
				this.m_formulasR1C1=obj["FormulasR1C1"];
			}
			if (!_isUndefined(obj["Hidden"])) {
				this.m_hidden=obj["Hidden"];
			}
			if (!_isUndefined(obj["NumberFormat"])) {
				this.m_numberFormat=obj["NumberFormat"];
			}
			if (!_isUndefined(obj["RowCount"])) {
				this.m_rowCount=obj["RowCount"];
			}
			if (!_isUndefined(obj["RowHidden"])) {
				this.m_rowHidden=obj["RowHidden"];
			}
			if (!_isUndefined(obj["RowIndex"])) {
				this.m_rowIndex=obj["RowIndex"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["ValueTypes"])) {
				this.m_valueTypes=obj["ValueTypes"];
			}
			if (!_isUndefined(obj["Values"])) {
				this.m_values=obj["Values"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format", "sort", "Sort", "worksheet", "Worksheet"]);
		};
		Range.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Range.prototype._initReferenceId=function (value) {
			this.m__ReferenceId=value;
		};
		return Range;
	})(OfficeExtension.ClientObject);
	Excel.Range=Range;
	var NamedItemCollection=(function (_super) {
		__extends(NamedItemCollection, _super);
		function NamedItemCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(NamedItemCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "NamedItemCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		NamedItemCollection.prototype.getItem=function (name) {
			return new Excel.NamedItem(this.context, _createIndexerObjectPath(this.context, this, [name]));
		};
		NamedItemCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.NamedItem(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		NamedItemCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return NamedItemCollection;
	})(OfficeExtension.ClientObject);
	Excel.NamedItemCollection=NamedItemCollection;
	var NamedItem=(function (_super) {
		__extends(NamedItem, _super);
		function NamedItem() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(NamedItem.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "NamedItem", this._isNull);
				return this.m_name;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "NamedItem", this._isNull);
				return this.m_type;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("value", this.m_value, "NamedItem", this._isNull);
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "visible", {
			get: function () {
				_throwIfNotLoaded("visible", this.m_visible, "NamedItem", this._isNull);
				return this.m_visible;
			},
			set: function (value) {
				this.m_visible=value;
				_createSetPropertyAction(this.context, this, "Visible", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(NamedItem.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "NamedItem", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		NamedItem.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [], false, true));
		};
		NamedItem.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
			if (!_isUndefined(obj["Visible"])) {
				this.m_visible=obj["Visible"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
		};
		NamedItem.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return NamedItem;
	})(OfficeExtension.ClientObject);
	Excel.NamedItem=NamedItem;
	var Binding=(function (_super) {
		__extends(Binding, _super);
		function Binding() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Binding.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "Binding", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Binding.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "Binding", this._isNull);
				return this.m_type;
			},
			enumerable: true,
			configurable: true
		});
		Binding.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [], false, false));
		};
		Binding.prototype.getTable=function () {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "GetTable", 1 , [], false, false));
		};
		Binding.prototype.getText=function () {
			var action=_createMethodAction(this.context, this, "GetText", 1 , []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Binding.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
		};
		Binding.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Binding;
	})(OfficeExtension.ClientObject);
	Excel.Binding=Binding;
	var BindingCollection=(function (_super) {
		__extends(BindingCollection, _super);
		function BindingCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(BindingCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "BindingCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BindingCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "BindingCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		BindingCollection.prototype.getItem=function (id) {
			return new Excel.Binding(this.context, _createIndexerObjectPath(this.context, this, [id]));
		};
		BindingCollection.prototype.getItemAt=function (index) {
			return new Excel.Binding(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		BindingCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.Binding(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		BindingCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return BindingCollection;
	})(OfficeExtension.ClientObject);
	Excel.BindingCollection=BindingCollection;
	var TableCollection=(function (_super) {
		__extends(TableCollection, _super);
		function TableCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "TableCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		TableCollection.prototype.add=function (address, hasHeaders) {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "Add", 0 , [address, hasHeaders], false, true));
		};
		TableCollection.prototype.getItem=function (key) {
			return new Excel.Table(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		TableCollection.prototype.getItemAt=function (index) {
			return new Excel.Table(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		TableCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.Table(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableCollection;
	})(OfficeExtension.ClientObject);
	Excel.TableCollection=TableCollection;
	var Table=(function (_super) {
		__extends(Table, _super);
		function Table() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Table.prototype, "columns", {
			get: function () {
				if (!this.m_columns) {
					this.m_columns=new Excel.TableColumnCollection(this.context, _createPropertyObjectPath(this.context, this, "Columns", true, false));
				}
				return this.m_columns;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "rows", {
			get: function () {
				if (!this.m_rows) {
					this.m_rows=new Excel.TableRowCollection(this.context, _createPropertyObjectPath(this.context, this, "Rows", true, false));
				}
				return this.m_rows;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "sort", {
			get: function () {
				if (!this.m_sort) {
					this.m_sort=new Excel.TableSort(this.context, _createPropertyObjectPath(this.context, this, "Sort", false, false));
				}
				return this.m_sort;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "worksheet", {
			get: function () {
				if (!this.m_worksheet) {
					this.m_worksheet=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false));
				}
				return this.m_worksheet;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "Table", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "Table", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "showHeaders", {
			get: function () {
				_throwIfNotLoaded("showHeaders", this.m_showHeaders, "Table", this._isNull);
				return this.m_showHeaders;
			},
			set: function (value) {
				this.m_showHeaders=value;
				_createSetPropertyAction(this.context, this, "ShowHeaders", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "showTotals", {
			get: function () {
				_throwIfNotLoaded("showTotals", this.m_showTotals, "Table", this._isNull);
				return this.m_showTotals;
			},
			set: function (value) {
				this.m_showTotals=value;
				_createSetPropertyAction(this.context, this, "ShowTotals", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "Table", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Table.prototype.clearFilters=function () {
			_createMethodAction(this.context, this, "ClearFilters", 0 , []);
		};
		Table.prototype.convertToRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "ConvertToRange", 0 , [], false, true));
		};
		Table.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0 , []);
		};
		Table.prototype.getDataBodyRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetDataBodyRange", 1 , [], false, true));
		};
		Table.prototype.getHeaderRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetHeaderRowRange", 1 , [], false, true));
		};
		Table.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [], false, true));
		};
		Table.prototype.getTotalRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetTotalRowRange", 1 , [], false, true));
		};
		Table.prototype.reapplyFilters=function () {
			_createMethodAction(this.context, this, "ReapplyFilters", 0 , []);
		};
		Table.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["ShowHeaders"])) {
				this.m_showHeaders=obj["ShowHeaders"];
			}
			if (!_isUndefined(obj["ShowTotals"])) {
				this.m_showTotals=obj["ShowTotals"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			_handleNavigationPropertyResults(this, obj, ["columns", "Columns", "rows", "Rows", "sort", "Sort", "worksheet", "Worksheet"]);
		};
		Table.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Table;
	})(OfficeExtension.ClientObject);
	Excel.Table=Table;
	var TableColumnCollection=(function (_super) {
		__extends(TableColumnCollection, _super);
		function TableColumnCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableColumnCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableColumnCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumnCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "TableColumnCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		TableColumnCollection.prototype.add=function (index, values) {
			return new Excel.TableColumn(this.context, _createMethodObjectPath(this.context, this, "Add", 0 , [index, values], false, true));
		};
		TableColumnCollection.prototype.getItem=function (key) {
			return new Excel.TableColumn(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		TableColumnCollection.prototype.getItemAt=function (index) {
			return new Excel.TableColumn(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		TableColumnCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.TableColumn(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableColumnCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableColumnCollection;
	})(OfficeExtension.ClientObject);
	Excel.TableColumnCollection=TableColumnCollection;
	var TableColumn=(function (_super) {
		__extends(TableColumn, _super);
		function TableColumn() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableColumn.prototype, "filter", {
			get: function () {
				if (!this.m_filter) {
					this.m_filter=new Excel.Filter(this.context, _createPropertyObjectPath(this.context, this, "Filter", false, false));
				}
				return this.m_filter;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "TableColumn", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "index", {
			get: function () {
				_throwIfNotLoaded("index", this.m_index, "TableColumn", this._isNull);
				return this.m_index;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "TableColumn", this._isNull);
				return this.m_name;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableColumn.prototype, "values", {
			get: function () {
				_throwIfNotLoaded("values", this.m_values, "TableColumn", this._isNull);
				return this.m_values;
			},
			set: function (value) {
				this.m_values=value;
				_createSetPropertyAction(this.context, this, "Values", value);
			},
			enumerable: true,
			configurable: true
		});
		TableColumn.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0 , []);
		};
		TableColumn.prototype.getDataBodyRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetDataBodyRange", 1 , [], false, true));
		};
		TableColumn.prototype.getHeaderRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetHeaderRowRange", 1 , [], false, true));
		};
		TableColumn.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [], false, true));
		};
		TableColumn.prototype.getTotalRowRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetTotalRowRange", 1 , [], false, true));
		};
		TableColumn.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["Index"])) {
				this.m_index=obj["Index"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Values"])) {
				this.m_values=obj["Values"];
			}
			_handleNavigationPropertyResults(this, obj, ["filter", "Filter"]);
		};
		TableColumn.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableColumn;
	})(OfficeExtension.ClientObject);
	Excel.TableColumn=TableColumn;
	var TableRowCollection=(function (_super) {
		__extends(TableRowCollection, _super);
		function TableRowCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableRowCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableRowCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "TableRowCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		TableRowCollection.prototype.add=function (index, values) {
			return new Excel.TableRow(this.context, _createMethodObjectPath(this.context, this, "Add", 0 , [index, values], false, true));
		};
		TableRowCollection.prototype.getItemAt=function (index) {
			return new Excel.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		TableRowCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.TableRow(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableRowCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableRowCollection;
	})(OfficeExtension.ClientObject);
	Excel.TableRowCollection=TableRowCollection;
	var TableRow=(function (_super) {
		__extends(TableRow, _super);
		function TableRow() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableRow.prototype, "index", {
			get: function () {
				_throwIfNotLoaded("index", this.m_index, "TableRow", this._isNull);
				return this.m_index;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "values", {
			get: function () {
				_throwIfNotLoaded("values", this.m_values, "TableRow", this._isNull);
				return this.m_values;
			},
			set: function (value) {
				this.m_values=value;
				_createSetPropertyAction(this.context, this, "Values", value);
			},
			enumerable: true,
			configurable: true
		});
		TableRow.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0 , []);
		};
		TableRow.prototype.getRange=function () {
			return new Excel.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1 , [], false, true));
		};
		TableRow.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Index"])) {
				this.m_index=obj["Index"];
			}
			if (!_isUndefined(obj["Values"])) {
				this.m_values=obj["Values"];
			}
		};
		TableRow.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableRow;
	})(OfficeExtension.ClientObject);
	Excel.TableRow=TableRow;
	var RangeFormat=(function (_super) {
		__extends(RangeFormat, _super);
		function RangeFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeFormat.prototype, "borders", {
			get: function () {
				if (!this.m_borders) {
					this.m_borders=new Excel.RangeBorderCollection(this.context, _createPropertyObjectPath(this.context, this, "Borders", true, false));
				}
				return this.m_borders;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.RangeFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.RangeFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "protection", {
			get: function () {
				if (!this.m_protection) {
					this.m_protection=new Excel.FormatProtection(this.context, _createPropertyObjectPath(this.context, this, "Protection", false, false));
				}
				return this.m_protection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "columnWidth", {
			get: function () {
				_throwIfNotLoaded("columnWidth", this.m_columnWidth, "RangeFormat", this._isNull);
				return this.m_columnWidth;
			},
			set: function (value) {
				this.m_columnWidth=value;
				_createSetPropertyAction(this.context, this, "ColumnWidth", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "horizontalAlignment", {
			get: function () {
				_throwIfNotLoaded("horizontalAlignment", this.m_horizontalAlignment, "RangeFormat", this._isNull);
				return this.m_horizontalAlignment;
			},
			set: function (value) {
				this.m_horizontalAlignment=value;
				_createSetPropertyAction(this.context, this, "HorizontalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "rowHeight", {
			get: function () {
				_throwIfNotLoaded("rowHeight", this.m_rowHeight, "RangeFormat", this._isNull);
				return this.m_rowHeight;
			},
			set: function (value) {
				this.m_rowHeight=value;
				_createSetPropertyAction(this.context, this, "RowHeight", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "verticalAlignment", {
			get: function () {
				_throwIfNotLoaded("verticalAlignment", this.m_verticalAlignment, "RangeFormat", this._isNull);
				return this.m_verticalAlignment;
			},
			set: function (value) {
				this.m_verticalAlignment=value;
				_createSetPropertyAction(this.context, this, "VerticalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFormat.prototype, "wrapText", {
			get: function () {
				_throwIfNotLoaded("wrapText", this.m_wrapText, "RangeFormat", this._isNull);
				return this.m_wrapText;
			},
			set: function (value) {
				this.m_wrapText=value;
				_createSetPropertyAction(this.context, this, "WrapText", value);
			},
			enumerable: true,
			configurable: true
		});
		RangeFormat.prototype.autofitColumns=function () {
			_createMethodAction(this.context, this, "AutofitColumns", 0 , []);
		};
		RangeFormat.prototype.autofitRows=function () {
			_createMethodAction(this.context, this, "AutofitRows", 0 , []);
		};
		RangeFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["ColumnWidth"])) {
				this.m_columnWidth=obj["ColumnWidth"];
			}
			if (!_isUndefined(obj["HorizontalAlignment"])) {
				this.m_horizontalAlignment=obj["HorizontalAlignment"];
			}
			if (!_isUndefined(obj["RowHeight"])) {
				this.m_rowHeight=obj["RowHeight"];
			}
			if (!_isUndefined(obj["VerticalAlignment"])) {
				this.m_verticalAlignment=obj["VerticalAlignment"];
			}
			if (!_isUndefined(obj["WrapText"])) {
				this.m_wrapText=obj["WrapText"];
			}
			_handleNavigationPropertyResults(this, obj, ["borders", "Borders", "fill", "Fill", "font", "Font", "protection", "Protection"]);
		};
		RangeFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return RangeFormat;
	})(OfficeExtension.ClientObject);
	Excel.RangeFormat=RangeFormat;
	var FormatProtection=(function (_super) {
		__extends(FormatProtection, _super);
		function FormatProtection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(FormatProtection.prototype, "formulaHidden", {
			get: function () {
				_throwIfNotLoaded("formulaHidden", this.m_formulaHidden, "FormatProtection", this._isNull);
				return this.m_formulaHidden;
			},
			set: function (value) {
				this.m_formulaHidden=value;
				_createSetPropertyAction(this.context, this, "FormulaHidden", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FormatProtection.prototype, "locked", {
			get: function () {
				_throwIfNotLoaded("locked", this.m_locked, "FormatProtection", this._isNull);
				return this.m_locked;
			},
			set: function (value) {
				this.m_locked=value;
				_createSetPropertyAction(this.context, this, "Locked", value);
			},
			enumerable: true,
			configurable: true
		});
		FormatProtection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["FormulaHidden"])) {
				this.m_formulaHidden=obj["FormulaHidden"];
			}
			if (!_isUndefined(obj["Locked"])) {
				this.m_locked=obj["Locked"];
			}
		};
		FormatProtection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return FormatProtection;
	})(OfficeExtension.ClientObject);
	Excel.FormatProtection=FormatProtection;
	var RangeFill=(function (_super) {
		__extends(RangeFill, _super);
		function RangeFill() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeFill.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "RangeFill", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		RangeFill.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0 , []);
		};
		RangeFill.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
		};
		RangeFill.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return RangeFill;
	})(OfficeExtension.ClientObject);
	Excel.RangeFill=RangeFill;
	var RangeBorder=(function (_super) {
		__extends(RangeBorder, _super);
		function RangeBorder() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeBorder.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "RangeBorder", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorder.prototype, "sideIndex", {
			get: function () {
				_throwIfNotLoaded("sideIndex", this.m_sideIndex, "RangeBorder", this._isNull);
				return this.m_sideIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorder.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "RangeBorder", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorder.prototype, "weight", {
			get: function () {
				_throwIfNotLoaded("weight", this.m_weight, "RangeBorder", this._isNull);
				return this.m_weight;
			},
			set: function (value) {
				this.m_weight=value;
				_createSetPropertyAction(this.context, this, "Weight", value);
			},
			enumerable: true,
			configurable: true
		});
		RangeBorder.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["SideIndex"])) {
				this.m_sideIndex=obj["SideIndex"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["Weight"])) {
				this.m_weight=obj["Weight"];
			}
		};
		RangeBorder.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return RangeBorder;
	})(OfficeExtension.ClientObject);
	Excel.RangeBorder=RangeBorder;
	var RangeBorderCollection=(function (_super) {
		__extends(RangeBorderCollection, _super);
		function RangeBorderCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeBorderCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "RangeBorderCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeBorderCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "RangeBorderCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		RangeBorderCollection.prototype.getItem=function (index) {
			return new Excel.RangeBorder(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		RangeBorderCollection.prototype.getItemAt=function (index) {
			return new Excel.RangeBorder(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		RangeBorderCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.RangeBorder(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		RangeBorderCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return RangeBorderCollection;
	})(OfficeExtension.ClientObject);
	Excel.RangeBorderCollection=RangeBorderCollection;
	var RangeFont=(function (_super) {
		__extends(RangeFont, _super);
		function RangeFont() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeFont.prototype, "bold", {
			get: function () {
				_throwIfNotLoaded("bold", this.m_bold, "RangeFont", this._isNull);
				return this.m_bold;
			},
			set: function (value) {
				this.m_bold=value;
				_createSetPropertyAction(this.context, this, "Bold", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "RangeFont", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "italic", {
			get: function () {
				_throwIfNotLoaded("italic", this.m_italic, "RangeFont", this._isNull);
				return this.m_italic;
			},
			set: function (value) {
				this.m_italic=value;
				_createSetPropertyAction(this.context, this, "Italic", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "RangeFont", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "size", {
			get: function () {
				_throwIfNotLoaded("size", this.m_size, "RangeFont", this._isNull);
				return this.m_size;
			},
			set: function (value) {
				this.m_size=value;
				_createSetPropertyAction(this.context, this, "Size", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeFont.prototype, "underline", {
			get: function () {
				_throwIfNotLoaded("underline", this.m_underline, "RangeFont", this._isNull);
				return this.m_underline;
			},
			set: function (value) {
				this.m_underline=value;
				_createSetPropertyAction(this.context, this, "Underline", value);
			},
			enumerable: true,
			configurable: true
		});
		RangeFont.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Bold"])) {
				this.m_bold=obj["Bold"];
			}
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["Italic"])) {
				this.m_italic=obj["Italic"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Size"])) {
				this.m_size=obj["Size"];
			}
			if (!_isUndefined(obj["Underline"])) {
				this.m_underline=obj["Underline"];
			}
		};
		RangeFont.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return RangeFont;
	})(OfficeExtension.ClientObject);
	Excel.RangeFont=RangeFont;
	var ChartCollection=(function (_super) {
		__extends(ChartCollection, _super);
		function ChartCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ChartCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "ChartCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		ChartCollection.prototype.add=function (type, sourceData, seriesBy) {
			if (!(sourceData instanceof Range)) {
				throw OfficeExtension.Utility.createRuntimeError(OfficeExtension.ResourceStrings.invalidArgument, "sourceData", "Charts.Add");
			}
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "Add", 0 , [type, sourceData, seriesBy], false, true));
		};
		ChartCollection.prototype.getItem=function (name) {
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "GetItem", 1 , [name], false, false));
		};
		ChartCollection.prototype.getItemAt=function (index) {
			return new Excel.Chart(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		ChartCollection.prototype._GetItem=function (key) {
			return new Excel.Chart(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		ChartCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.Chart(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ChartCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartCollection;
	})(OfficeExtension.ClientObject);
	Excel.ChartCollection=ChartCollection;
	var Chart=(function (_super) {
		__extends(Chart, _super);
		function Chart() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Chart.prototype, "axes", {
			get: function () {
				if (!this.m_axes) {
					this.m_axes=new Excel.ChartAxes(this.context, _createPropertyObjectPath(this.context, this, "Axes", false, false));
				}
				return this.m_axes;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "dataLabels", {
			get: function () {
				if (!this.m_dataLabels) {
					this.m_dataLabels=new Excel.ChartDataLabels(this.context, _createPropertyObjectPath(this.context, this, "DataLabels", false, false));
				}
				return this.m_dataLabels;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartAreaFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "legend", {
			get: function () {
				if (!this.m_legend) {
					this.m_legend=new Excel.ChartLegend(this.context, _createPropertyObjectPath(this.context, this, "Legend", false, false));
				}
				return this.m_legend;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "series", {
			get: function () {
				if (!this.m_series) {
					this.m_series=new Excel.ChartSeriesCollection(this.context, _createPropertyObjectPath(this.context, this, "Series", true, false));
				}
				return this.m_series;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "title", {
			get: function () {
				if (!this.m_title) {
					this.m_title=new Excel.ChartTitle(this.context, _createPropertyObjectPath(this.context, this, "Title", false, false));
				}
				return this.m_title;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "worksheet", {
			get: function () {
				if (!this.m_worksheet) {
					this.m_worksheet=new Excel.Worksheet(this.context, _createPropertyObjectPath(this.context, this, "Worksheet", false, false));
				}
				return this.m_worksheet;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "height", {
			get: function () {
				_throwIfNotLoaded("height", this.m_height, "Chart", this._isNull);
				return this.m_height;
			},
			set: function (value) {
				this.m_height=value;
				_createSetPropertyAction(this.context, this, "Height", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "left", {
			get: function () {
				_throwIfNotLoaded("left", this.m_left, "Chart", this._isNull);
				return this.m_left;
			},
			set: function (value) {
				this.m_left=value;
				_createSetPropertyAction(this.context, this, "Left", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "Chart", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "top", {
			get: function () {
				_throwIfNotLoaded("top", this.m_top, "Chart", this._isNull);
				return this.m_top;
			},
			set: function (value) {
				this.m_top=value;
				_createSetPropertyAction(this.context, this, "Top", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Chart.prototype, "width", {
			get: function () {
				_throwIfNotLoaded("width", this.m_width, "Chart", this._isNull);
				return this.m_width;
			},
			set: function (value) {
				this.m_width=value;
				_createSetPropertyAction(this.context, this, "Width", value);
			},
			enumerable: true,
			configurable: true
		});
		Chart.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0 , []);
		};
		Chart.prototype.getImage=function (width, height, fittingMode) {
			var action=_createMethodAction(this.context, this, "GetImage", 1 , [width, height, fittingMode]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Chart.prototype.setData=function (sourceData, seriesBy) {
			if (!(sourceData instanceof Range)) {
				throw OfficeExtension.Utility.createRuntimeError(OfficeExtension.ResourceStrings.invalidArgument, "sourceData", "Chart.setData");
			}
			_createMethodAction(this.context, this, "SetData", 0 , [sourceData, seriesBy]);
		};
		Chart.prototype.setPosition=function (startCell, endCell) {
			_createMethodAction(this.context, this, "SetPosition", 0 , [startCell, endCell]);
		};
		Chart.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Height"])) {
				this.m_height=obj["Height"];
			}
			if (!_isUndefined(obj["Left"])) {
				this.m_left=obj["Left"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Top"])) {
				this.m_top=obj["Top"];
			}
			if (!_isUndefined(obj["Width"])) {
				this.m_width=obj["Width"];
			}
			_handleNavigationPropertyResults(this, obj, ["axes", "Axes", "dataLabels", "DataLabels", "format", "Format", "legend", "Legend", "series", "Series", "title", "Title", "worksheet", "Worksheet"]);
		};
		Chart.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Chart;
	})(OfficeExtension.ClientObject);
	Excel.Chart=Chart;
	var ChartAreaFormat=(function (_super) {
		__extends(ChartAreaFormat, _super);
		function ChartAreaFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAreaFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAreaFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		ChartAreaFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill", "font", "Font"]);
		};
		ChartAreaFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAreaFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartAreaFormat=ChartAreaFormat;
	var ChartSeriesCollection=(function (_super) {
		__extends(ChartSeriesCollection, _super);
		function ChartSeriesCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartSeriesCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ChartSeriesCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "ChartSeriesCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		ChartSeriesCollection.prototype.getItemAt=function (index) {
			return new Excel.ChartSeries(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		ChartSeriesCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.ChartSeries(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ChartSeriesCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartSeriesCollection;
	})(OfficeExtension.ClientObject);
	Excel.ChartSeriesCollection=ChartSeriesCollection;
	var ChartSeries=(function (_super) {
		__extends(ChartSeries, _super);
		function ChartSeries() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartSeries.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartSeriesFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "points", {
			get: function () {
				if (!this.m_points) {
					this.m_points=new Excel.ChartPointsCollection(this.context, _createPropertyObjectPath(this.context, this, "Points", true, false));
				}
				return this.m_points;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeries.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "ChartSeries", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartSeries.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format", "points", "Points"]);
		};
		ChartSeries.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartSeries;
	})(OfficeExtension.ClientObject);
	Excel.ChartSeries=ChartSeries;
	var ChartSeriesFormat=(function (_super) {
		__extends(ChartSeriesFormat, _super);
		function ChartSeriesFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartSeriesFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartSeriesFormat.prototype, "line", {
			get: function () {
				if (!this.m_line) {
					this.m_line=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false));
				}
				return this.m_line;
			},
			enumerable: true,
			configurable: true
		});
		ChartSeriesFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill", "line", "Line"]);
		};
		ChartSeriesFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartSeriesFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartSeriesFormat=ChartSeriesFormat;
	var ChartPointsCollection=(function (_super) {
		__extends(ChartPointsCollection, _super);
		function ChartPointsCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartPointsCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ChartPointsCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPointsCollection.prototype, "count", {
			get: function () {
				_throwIfNotLoaded("count", this.m_count, "ChartPointsCollection", this._isNull);
				return this.m_count;
			},
			enumerable: true,
			configurable: true
		});
		ChartPointsCollection.prototype.getItemAt=function (index) {
			return new Excel.ChartPoint(this.context, _createMethodObjectPath(this.context, this, "GetItemAt", 1 , [index], false, false));
		};
		ChartPointsCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Count"])) {
				this.m_count=obj["Count"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Excel.ChartPoint(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(false, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ChartPointsCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartPointsCollection;
	})(OfficeExtension.ClientObject);
	Excel.ChartPointsCollection=ChartPointsCollection;
	var ChartPoint=(function (_super) {
		__extends(ChartPoint, _super);
		function ChartPoint() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartPoint.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartPointFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartPoint.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("value", this.m_value, "ChartPoint", this._isNull);
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		ChartPoint.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartPoint.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartPoint;
	})(OfficeExtension.ClientObject);
	Excel.ChartPoint=ChartPoint;
	var ChartPointFormat=(function (_super) {
		__extends(ChartPointFormat, _super);
		function ChartPointFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartPointFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		ChartPointFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill"]);
		};
		ChartPointFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartPointFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartPointFormat=ChartPointFormat;
	var ChartAxes=(function (_super) {
		__extends(ChartAxes, _super);
		function ChartAxes() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAxes.prototype, "categoryAxis", {
			get: function () {
				if (!this.m_categoryAxis) {
					this.m_categoryAxis=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "CategoryAxis", false, false));
				}
				return this.m_categoryAxis;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "seriesAxis", {
			get: function () {
				if (!this.m_seriesAxis) {
					this.m_seriesAxis=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "SeriesAxis", false, false));
				}
				return this.m_seriesAxis;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxes.prototype, "valueAxis", {
			get: function () {
				if (!this.m_valueAxis) {
					this.m_valueAxis=new Excel.ChartAxis(this.context, _createPropertyObjectPath(this.context, this, "ValueAxis", false, false));
				}
				return this.m_valueAxis;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxes.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["categoryAxis", "CategoryAxis", "seriesAxis", "SeriesAxis", "valueAxis", "ValueAxis"]);
		};
		ChartAxes.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAxes;
	})(OfficeExtension.ClientObject);
	Excel.ChartAxes=ChartAxes;
	var ChartAxis=(function (_super) {
		__extends(ChartAxis, _super);
		function ChartAxis() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAxis.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartAxisFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "majorGridlines", {
			get: function () {
				if (!this.m_majorGridlines) {
					this.m_majorGridlines=new Excel.ChartGridlines(this.context, _createPropertyObjectPath(this.context, this, "MajorGridlines", false, false));
				}
				return this.m_majorGridlines;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "minorGridlines", {
			get: function () {
				if (!this.m_minorGridlines) {
					this.m_minorGridlines=new Excel.ChartGridlines(this.context, _createPropertyObjectPath(this.context, this, "MinorGridlines", false, false));
				}
				return this.m_minorGridlines;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "title", {
			get: function () {
				if (!this.m_title) {
					this.m_title=new Excel.ChartAxisTitle(this.context, _createPropertyObjectPath(this.context, this, "Title", false, false));
				}
				return this.m_title;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "majorUnit", {
			get: function () {
				_throwIfNotLoaded("majorUnit", this.m_majorUnit, "ChartAxis", this._isNull);
				return this.m_majorUnit;
			},
			set: function (value) {
				this.m_majorUnit=value;
				_createSetPropertyAction(this.context, this, "MajorUnit", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "maximum", {
			get: function () {
				_throwIfNotLoaded("maximum", this.m_maximum, "ChartAxis", this._isNull);
				return this.m_maximum;
			},
			set: function (value) {
				this.m_maximum=value;
				_createSetPropertyAction(this.context, this, "Maximum", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "minimum", {
			get: function () {
				_throwIfNotLoaded("minimum", this.m_minimum, "ChartAxis", this._isNull);
				return this.m_minimum;
			},
			set: function (value) {
				this.m_minimum=value;
				_createSetPropertyAction(this.context, this, "Minimum", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxis.prototype, "minorUnit", {
			get: function () {
				_throwIfNotLoaded("minorUnit", this.m_minorUnit, "ChartAxis", this._isNull);
				return this.m_minorUnit;
			},
			set: function (value) {
				this.m_minorUnit=value;
				_createSetPropertyAction(this.context, this, "MinorUnit", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartAxis.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["MajorUnit"])) {
				this.m_majorUnit=obj["MajorUnit"];
			}
			if (!_isUndefined(obj["Maximum"])) {
				this.m_maximum=obj["Maximum"];
			}
			if (!_isUndefined(obj["Minimum"])) {
				this.m_minimum=obj["Minimum"];
			}
			if (!_isUndefined(obj["MinorUnit"])) {
				this.m_minorUnit=obj["MinorUnit"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format", "majorGridlines", "MajorGridlines", "minorGridlines", "MinorGridlines", "title", "Title"]);
		};
		ChartAxis.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAxis;
	})(OfficeExtension.ClientObject);
	Excel.ChartAxis=ChartAxis;
	var ChartAxisFormat=(function (_super) {
		__extends(ChartAxisFormat, _super);
		function ChartAxisFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAxisFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisFormat.prototype, "line", {
			get: function () {
				if (!this.m_line) {
					this.m_line=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false));
				}
				return this.m_line;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["font", "Font", "line", "Line"]);
		};
		ChartAxisFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAxisFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartAxisFormat=ChartAxisFormat;
	var ChartAxisTitle=(function (_super) {
		__extends(ChartAxisTitle, _super);
		function ChartAxisTitle() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAxisTitle.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartAxisTitleFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "ChartAxisTitle", this._isNull);
				return this.m_text;
			},
			set: function (value) {
				this.m_text=value;
				_createSetPropertyAction(this.context, this, "Text", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartAxisTitle.prototype, "visible", {
			get: function () {
				_throwIfNotLoaded("visible", this.m_visible, "ChartAxisTitle", this._isNull);
				return this.m_visible;
			},
			set: function (value) {
				this.m_visible=value;
				_createSetPropertyAction(this.context, this, "Visible", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisTitle.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["Visible"])) {
				this.m_visible=obj["Visible"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartAxisTitle.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAxisTitle;
	})(OfficeExtension.ClientObject);
	Excel.ChartAxisTitle=ChartAxisTitle;
	var ChartAxisTitleFormat=(function (_super) {
		__extends(ChartAxisTitleFormat, _super);
		function ChartAxisTitleFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartAxisTitleFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		ChartAxisTitleFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["font", "Font"]);
		};
		ChartAxisTitleFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartAxisTitleFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartAxisTitleFormat=ChartAxisTitleFormat;
	var ChartDataLabels=(function (_super) {
		__extends(ChartDataLabels, _super);
		function ChartDataLabels() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartDataLabels.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartDataLabelFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "position", {
			get: function () {
				_throwIfNotLoaded("position", this.m_position, "ChartDataLabels", this._isNull);
				return this.m_position;
			},
			set: function (value) {
				this.m_position=value;
				_createSetPropertyAction(this.context, this, "Position", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "separator", {
			get: function () {
				_throwIfNotLoaded("separator", this.m_separator, "ChartDataLabels", this._isNull);
				return this.m_separator;
			},
			set: function (value) {
				this.m_separator=value;
				_createSetPropertyAction(this.context, this, "Separator", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showBubbleSize", {
			get: function () {
				_throwIfNotLoaded("showBubbleSize", this.m_showBubbleSize, "ChartDataLabels", this._isNull);
				return this.m_showBubbleSize;
			},
			set: function (value) {
				this.m_showBubbleSize=value;
				_createSetPropertyAction(this.context, this, "ShowBubbleSize", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showCategoryName", {
			get: function () {
				_throwIfNotLoaded("showCategoryName", this.m_showCategoryName, "ChartDataLabels", this._isNull);
				return this.m_showCategoryName;
			},
			set: function (value) {
				this.m_showCategoryName=value;
				_createSetPropertyAction(this.context, this, "ShowCategoryName", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showLegendKey", {
			get: function () {
				_throwIfNotLoaded("showLegendKey", this.m_showLegendKey, "ChartDataLabels", this._isNull);
				return this.m_showLegendKey;
			},
			set: function (value) {
				this.m_showLegendKey=value;
				_createSetPropertyAction(this.context, this, "ShowLegendKey", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showPercentage", {
			get: function () {
				_throwIfNotLoaded("showPercentage", this.m_showPercentage, "ChartDataLabels", this._isNull);
				return this.m_showPercentage;
			},
			set: function (value) {
				this.m_showPercentage=value;
				_createSetPropertyAction(this.context, this, "ShowPercentage", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showSeriesName", {
			get: function () {
				_throwIfNotLoaded("showSeriesName", this.m_showSeriesName, "ChartDataLabels", this._isNull);
				return this.m_showSeriesName;
			},
			set: function (value) {
				this.m_showSeriesName=value;
				_createSetPropertyAction(this.context, this, "ShowSeriesName", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabels.prototype, "showValue", {
			get: function () {
				_throwIfNotLoaded("showValue", this.m_showValue, "ChartDataLabels", this._isNull);
				return this.m_showValue;
			},
			set: function (value) {
				this.m_showValue=value;
				_createSetPropertyAction(this.context, this, "ShowValue", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartDataLabels.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Position"])) {
				this.m_position=obj["Position"];
			}
			if (!_isUndefined(obj["Separator"])) {
				this.m_separator=obj["Separator"];
			}
			if (!_isUndefined(obj["ShowBubbleSize"])) {
				this.m_showBubbleSize=obj["ShowBubbleSize"];
			}
			if (!_isUndefined(obj["ShowCategoryName"])) {
				this.m_showCategoryName=obj["ShowCategoryName"];
			}
			if (!_isUndefined(obj["ShowLegendKey"])) {
				this.m_showLegendKey=obj["ShowLegendKey"];
			}
			if (!_isUndefined(obj["ShowPercentage"])) {
				this.m_showPercentage=obj["ShowPercentage"];
			}
			if (!_isUndefined(obj["ShowSeriesName"])) {
				this.m_showSeriesName=obj["ShowSeriesName"];
			}
			if (!_isUndefined(obj["ShowValue"])) {
				this.m_showValue=obj["ShowValue"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartDataLabels.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartDataLabels;
	})(OfficeExtension.ClientObject);
	Excel.ChartDataLabels=ChartDataLabels;
	var ChartDataLabelFormat=(function (_super) {
		__extends(ChartDataLabelFormat, _super);
		function ChartDataLabelFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartDataLabelFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartDataLabelFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		ChartDataLabelFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill", "font", "Font"]);
		};
		ChartDataLabelFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartDataLabelFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartDataLabelFormat=ChartDataLabelFormat;
	var ChartGridlines=(function (_super) {
		__extends(ChartGridlines, _super);
		function ChartGridlines() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartGridlines.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartGridlinesFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartGridlines.prototype, "visible", {
			get: function () {
				_throwIfNotLoaded("visible", this.m_visible, "ChartGridlines", this._isNull);
				return this.m_visible;
			},
			set: function (value) {
				this.m_visible=value;
				_createSetPropertyAction(this.context, this, "Visible", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartGridlines.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Visible"])) {
				this.m_visible=obj["Visible"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartGridlines.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartGridlines;
	})(OfficeExtension.ClientObject);
	Excel.ChartGridlines=ChartGridlines;
	var ChartGridlinesFormat=(function (_super) {
		__extends(ChartGridlinesFormat, _super);
		function ChartGridlinesFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartGridlinesFormat.prototype, "line", {
			get: function () {
				if (!this.m_line) {
					this.m_line=new Excel.ChartLineFormat(this.context, _createPropertyObjectPath(this.context, this, "Line", false, false));
				}
				return this.m_line;
			},
			enumerable: true,
			configurable: true
		});
		ChartGridlinesFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["line", "Line"]);
		};
		ChartGridlinesFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartGridlinesFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartGridlinesFormat=ChartGridlinesFormat;
	var ChartLegend=(function (_super) {
		__extends(ChartLegend, _super);
		function ChartLegend() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartLegend.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartLegendFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "overlay", {
			get: function () {
				_throwIfNotLoaded("overlay", this.m_overlay, "ChartLegend", this._isNull);
				return this.m_overlay;
			},
			set: function (value) {
				this.m_overlay=value;
				_createSetPropertyAction(this.context, this, "Overlay", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "position", {
			get: function () {
				_throwIfNotLoaded("position", this.m_position, "ChartLegend", this._isNull);
				return this.m_position;
			},
			set: function (value) {
				this.m_position=value;
				_createSetPropertyAction(this.context, this, "Position", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegend.prototype, "visible", {
			get: function () {
				_throwIfNotLoaded("visible", this.m_visible, "ChartLegend", this._isNull);
				return this.m_visible;
			},
			set: function (value) {
				this.m_visible=value;
				_createSetPropertyAction(this.context, this, "Visible", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartLegend.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Overlay"])) {
				this.m_overlay=obj["Overlay"];
			}
			if (!_isUndefined(obj["Position"])) {
				this.m_position=obj["Position"];
			}
			if (!_isUndefined(obj["Visible"])) {
				this.m_visible=obj["Visible"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartLegend.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartLegend;
	})(OfficeExtension.ClientObject);
	Excel.ChartLegend=ChartLegend;
	var ChartLegendFormat=(function (_super) {
		__extends(ChartLegendFormat, _super);
		function ChartLegendFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartLegendFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartLegendFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		ChartLegendFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill", "font", "Font"]);
		};
		ChartLegendFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartLegendFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartLegendFormat=ChartLegendFormat;
	var ChartTitle=(function (_super) {
		__extends(ChartTitle, _super);
		function ChartTitle() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartTitle.prototype, "format", {
			get: function () {
				if (!this.m_format) {
					this.m_format=new Excel.ChartTitleFormat(this.context, _createPropertyObjectPath(this.context, this, "Format", false, false));
				}
				return this.m_format;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "overlay", {
			get: function () {
				_throwIfNotLoaded("overlay", this.m_overlay, "ChartTitle", this._isNull);
				return this.m_overlay;
			},
			set: function (value) {
				this.m_overlay=value;
				_createSetPropertyAction(this.context, this, "Overlay", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "ChartTitle", this._isNull);
				return this.m_text;
			},
			set: function (value) {
				this.m_text=value;
				_createSetPropertyAction(this.context, this, "Text", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitle.prototype, "visible", {
			get: function () {
				_throwIfNotLoaded("visible", this.m_visible, "ChartTitle", this._isNull);
				return this.m_visible;
			},
			set: function (value) {
				this.m_visible=value;
				_createSetPropertyAction(this.context, this, "Visible", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartTitle.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Overlay"])) {
				this.m_overlay=obj["Overlay"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["Visible"])) {
				this.m_visible=obj["Visible"];
			}
			_handleNavigationPropertyResults(this, obj, ["format", "Format"]);
		};
		ChartTitle.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartTitle;
	})(OfficeExtension.ClientObject);
	Excel.ChartTitle=ChartTitle;
	var ChartTitleFormat=(function (_super) {
		__extends(ChartTitleFormat, _super);
		function ChartTitleFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartTitleFormat.prototype, "fill", {
			get: function () {
				if (!this.m_fill) {
					this.m_fill=new Excel.ChartFill(this.context, _createPropertyObjectPath(this.context, this, "Fill", false, false));
				}
				return this.m_fill;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartTitleFormat.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Excel.ChartFont(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		ChartTitleFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			_handleNavigationPropertyResults(this, obj, ["fill", "Fill", "font", "Font"]);
		};
		ChartTitleFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartTitleFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartTitleFormat=ChartTitleFormat;
	var ChartFill=(function (_super) {
		__extends(ChartFill, _super);
		function ChartFill() {
			_super.apply(this, arguments);
		}
		ChartFill.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ChartFill.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0 , []);
		};
		ChartFill.prototype.setSolidColor=function (color) {
			_createMethodAction(this.context, this, "SetSolidColor", 0 , [color]);
		};
		ChartFill.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		return ChartFill;
	})(OfficeExtension.ClientObject);
	Excel.ChartFill=ChartFill;
	var ChartLineFormat=(function (_super) {
		__extends(ChartLineFormat, _super);
		function ChartLineFormat() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartLineFormat.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "ChartLineFormat", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartLineFormat.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0 , []);
		};
		ChartLineFormat.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
		};
		ChartLineFormat.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartLineFormat;
	})(OfficeExtension.ClientObject);
	Excel.ChartLineFormat=ChartLineFormat;
	var ChartFont=(function (_super) {
		__extends(ChartFont, _super);
		function ChartFont() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ChartFont.prototype, "bold", {
			get: function () {
				_throwIfNotLoaded("bold", this.m_bold, "ChartFont", this._isNull);
				return this.m_bold;
			},
			set: function (value) {
				this.m_bold=value;
				_createSetPropertyAction(this.context, this, "Bold", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "ChartFont", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "italic", {
			get: function () {
				_throwIfNotLoaded("italic", this.m_italic, "ChartFont", this._isNull);
				return this.m_italic;
			},
			set: function (value) {
				this.m_italic=value;
				_createSetPropertyAction(this.context, this, "Italic", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "ChartFont", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "size", {
			get: function () {
				_throwIfNotLoaded("size", this.m_size, "ChartFont", this._isNull);
				return this.m_size;
			},
			set: function (value) {
				this.m_size=value;
				_createSetPropertyAction(this.context, this, "Size", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ChartFont.prototype, "underline", {
			get: function () {
				_throwIfNotLoaded("underline", this.m_underline, "ChartFont", this._isNull);
				return this.m_underline;
			},
			set: function (value) {
				this.m_underline=value;
				_createSetPropertyAction(this.context, this, "Underline", value);
			},
			enumerable: true,
			configurable: true
		});
		ChartFont.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Bold"])) {
				this.m_bold=obj["Bold"];
			}
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["Italic"])) {
				this.m_italic=obj["Italic"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Size"])) {
				this.m_size=obj["Size"];
			}
			if (!_isUndefined(obj["Underline"])) {
				this.m_underline=obj["Underline"];
			}
		};
		ChartFont.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return ChartFont;
	})(OfficeExtension.ClientObject);
	Excel.ChartFont=ChartFont;
	var RangeSort=(function (_super) {
		__extends(RangeSort, _super);
		function RangeSort() {
			_super.apply(this, arguments);
		}
		RangeSort.prototype.apply=function (fields, matchCase, hasHeaders, orientation, method) {
			_createMethodAction(this.context, this, "Apply", 0 , [fields, matchCase, hasHeaders, orientation, method]);
		};
		RangeSort.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		return RangeSort;
	})(OfficeExtension.ClientObject);
	Excel.RangeSort=RangeSort;
	var TableSort=(function (_super) {
		__extends(TableSort, _super);
		function TableSort() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableSort.prototype, "fields", {
			get: function () {
				_throwIfNotLoaded("fields", this.m_fields, "TableSort", this._isNull);
				return this.m_fields;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableSort.prototype, "matchCase", {
			get: function () {
				_throwIfNotLoaded("matchCase", this.m_matchCase, "TableSort", this._isNull);
				return this.m_matchCase;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableSort.prototype, "method", {
			get: function () {
				_throwIfNotLoaded("method", this.m_method, "TableSort", this._isNull);
				return this.m_method;
			},
			enumerable: true,
			configurable: true
		});
		TableSort.prototype.apply=function (fields, matchCase, method) {
			_createMethodAction(this.context, this, "Apply", 0 , [fields, matchCase, method]);
		};
		TableSort.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0 , []);
		};
		TableSort.prototype.reapply=function () {
			_createMethodAction(this.context, this, "Reapply", 0 , []);
		};
		TableSort.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Fields"])) {
				this.m_fields=obj["Fields"];
			}
			if (!_isUndefined(obj["MatchCase"])) {
				this.m_matchCase=obj["MatchCase"];
			}
			if (!_isUndefined(obj["Method"])) {
				this.m_method=obj["Method"];
			}
		};
		TableSort.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return TableSort;
	})(OfficeExtension.ClientObject);
	Excel.TableSort=TableSort;
	var Filter=(function (_super) {
		__extends(Filter, _super);
		function Filter() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Filter.prototype, "criteria", {
			get: function () {
				_throwIfNotLoaded("criteria", this.m_criteria, "Filter", this._isNull);
				return this.m_criteria;
			},
			enumerable: true,
			configurable: true
		});
		Filter.prototype.apply=function (criteria) {
			_createMethodAction(this.context, this, "Apply", 0 , [criteria]);
		};
		Filter.prototype.applyBottomItemsFilter=function (count) {
			_createMethodAction(this.context, this, "ApplyBottomItemsFilter", 0 , [count]);
		};
		Filter.prototype.applyBottomPercentFilter=function (percent) {
			_createMethodAction(this.context, this, "ApplyBottomPercentFilter", 0 , [percent]);
		};
		Filter.prototype.applyCellColorFilter=function (color) {
			_createMethodAction(this.context, this, "ApplyCellColorFilter", 0 , [color]);
		};
		Filter.prototype.applyCustomFilter=function (criteria1, criteria2, oper) {
			_createMethodAction(this.context, this, "ApplyCustomFilter", 0 , [criteria1, criteria2, oper]);
		};
		Filter.prototype.applyDynamicFilter=function (criteria) {
			_createMethodAction(this.context, this, "ApplyDynamicFilter", 0 , [criteria]);
		};
		Filter.prototype.applyFontColorFilter=function (color) {
			_createMethodAction(this.context, this, "ApplyFontColorFilter", 0 , [color]);
		};
		Filter.prototype.applyIconFilter=function (icon) {
			_createMethodAction(this.context, this, "ApplyIconFilter", 0 , [icon]);
		};
		Filter.prototype.applyTopItemsFilter=function (count) {
			_createMethodAction(this.context, this, "ApplyTopItemsFilter", 0 , [count]);
		};
		Filter.prototype.applyTopPercentFilter=function (percent) {
			_createMethodAction(this.context, this, "ApplyTopPercentFilter", 0 , [percent]);
		};
		Filter.prototype.applyValuesFilter=function (values) {
			_createMethodAction(this.context, this, "ApplyValuesFilter", 0 , [values]);
		};
		Filter.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0 , []);
		};
		Filter.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Criteria"])) {
				this.m_criteria=obj["Criteria"];
			}
		};
		Filter.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return Filter;
	})(OfficeExtension.ClientObject);
	Excel.Filter=Filter;
	var BindingType;
	(function (BindingType) {
		BindingType.range="Range";
		BindingType.table="Table";
		BindingType.text="Text";
	})(BindingType=Excel.BindingType || (Excel.BindingType={}));
	var BorderIndex;
	(function (BorderIndex) {
		BorderIndex.edgeTop="EdgeTop";
		BorderIndex.edgeBottom="EdgeBottom";
		BorderIndex.edgeLeft="EdgeLeft";
		BorderIndex.edgeRight="EdgeRight";
		BorderIndex.insideVertical="InsideVertical";
		BorderIndex.insideHorizontal="InsideHorizontal";
		BorderIndex.diagonalDown="DiagonalDown";
		BorderIndex.diagonalUp="DiagonalUp";
	})(BorderIndex=Excel.BorderIndex || (Excel.BorderIndex={}));
	var BorderLineStyle;
	(function (BorderLineStyle) {
		BorderLineStyle.none="None";
		BorderLineStyle.continuous="Continuous";
		BorderLineStyle.dash="Dash";
		BorderLineStyle.dashDot="DashDot";
		BorderLineStyle.dashDotDot="DashDotDot";
		BorderLineStyle.dot="Dot";
		BorderLineStyle.double="Double";
		BorderLineStyle.slantDashDot="SlantDashDot";
	})(BorderLineStyle=Excel.BorderLineStyle || (Excel.BorderLineStyle={}));
	var BorderWeight;
	(function (BorderWeight) {
		BorderWeight.hairline="Hairline";
		BorderWeight.thin="Thin";
		BorderWeight.medium="Medium";
		BorderWeight.thick="Thick";
	})(BorderWeight=Excel.BorderWeight || (Excel.BorderWeight={}));
	var CalculationMode;
	(function (CalculationMode) {
		CalculationMode.automatic="Automatic";
		CalculationMode.automaticExceptTables="AutomaticExceptTables";
		CalculationMode.manual="Manual";
	})(CalculationMode=Excel.CalculationMode || (Excel.CalculationMode={}));
	var CalculationType;
	(function (CalculationType) {
		CalculationType.recalculate="Recalculate";
		CalculationType.full="Full";
		CalculationType.fullRebuild="FullRebuild";
	})(CalculationType=Excel.CalculationType || (Excel.CalculationType={}));
	var ClearApplyTo;
	(function (ClearApplyTo) {
		ClearApplyTo.all="All";
		ClearApplyTo.formats="Formats";
		ClearApplyTo.contents="Contents";
	})(ClearApplyTo=Excel.ClearApplyTo || (Excel.ClearApplyTo={}));
	var ChartDataLabelPosition;
	(function (ChartDataLabelPosition) {
		ChartDataLabelPosition.invalid="Invalid";
		ChartDataLabelPosition.none="None";
		ChartDataLabelPosition.center="Center";
		ChartDataLabelPosition.insideEnd="InsideEnd";
		ChartDataLabelPosition.insideBase="InsideBase";
		ChartDataLabelPosition.outsideEnd="OutsideEnd";
		ChartDataLabelPosition.left="Left";
		ChartDataLabelPosition.right="Right";
		ChartDataLabelPosition.top="Top";
		ChartDataLabelPosition.bottom="Bottom";
		ChartDataLabelPosition.bestFit="BestFit";
		ChartDataLabelPosition.callout="Callout";
	})(ChartDataLabelPosition=Excel.ChartDataLabelPosition || (Excel.ChartDataLabelPosition={}));
	var ChartLegendPosition;
	(function (ChartLegendPosition) {
		ChartLegendPosition.invalid="Invalid";
		ChartLegendPosition.top="Top";
		ChartLegendPosition.bottom="Bottom";
		ChartLegendPosition.left="Left";
		ChartLegendPosition.right="Right";
		ChartLegendPosition.corner="Corner";
		ChartLegendPosition.custom="Custom";
	})(ChartLegendPosition=Excel.ChartLegendPosition || (Excel.ChartLegendPosition={}));
	var ChartSeriesBy;
	(function (ChartSeriesBy) {
		ChartSeriesBy.auto="Auto";
		ChartSeriesBy.columns="Columns";
		ChartSeriesBy.rows="Rows";
	})(ChartSeriesBy=Excel.ChartSeriesBy || (Excel.ChartSeriesBy={}));
	var ChartType;
	(function (ChartType) {
		ChartType.invalid="Invalid";
		ChartType.columnClustered="ColumnClustered";
		ChartType.columnStacked="ColumnStacked";
		ChartType.columnStacked100="ColumnStacked100";
		ChartType._3DColumnClustered="3DColumnClustered";
		ChartType._3DColumnStacked="3DColumnStacked";
		ChartType._3DColumnStacked100="3DColumnStacked100";
		ChartType.barClustered="BarClustered";
		ChartType.barStacked="BarStacked";
		ChartType.barStacked100="BarStacked100";
		ChartType._3DBarClustered="3DBarClustered";
		ChartType._3DBarStacked="3DBarStacked";
		ChartType._3DBarStacked100="3DBarStacked100";
		ChartType.lineStacked="LineStacked";
		ChartType.lineStacked100="LineStacked100";
		ChartType.lineMarkers="LineMarkers";
		ChartType.lineMarkersStacked="LineMarkersStacked";
		ChartType.lineMarkersStacked100="LineMarkersStacked100";
		ChartType.pieOfPie="PieOfPie";
		ChartType.pieExploded="PieExploded";
		ChartType._3DPieExploded="3DPieExploded";
		ChartType.barOfPie="BarOfPie";
		ChartType.xyscatterSmooth="XYScatterSmooth";
		ChartType.xyscatterSmoothNoMarkers="XYScatterSmoothNoMarkers";
		ChartType.xyscatterLines="XYScatterLines";
		ChartType.xyscatterLinesNoMarkers="XYScatterLinesNoMarkers";
		ChartType.areaStacked="AreaStacked";
		ChartType.areaStacked100="AreaStacked100";
		ChartType._3DAreaStacked="3DAreaStacked";
		ChartType._3DAreaStacked100="3DAreaStacked100";
		ChartType.doughnutExploded="DoughnutExploded";
		ChartType.radarMarkers="RadarMarkers";
		ChartType.radarFilled="RadarFilled";
		ChartType.surface="Surface";
		ChartType.surfaceWireframe="SurfaceWireframe";
		ChartType.surfaceTopView="SurfaceTopView";
		ChartType.surfaceTopViewWireframe="SurfaceTopViewWireframe";
		ChartType.bubble="Bubble";
		ChartType.bubble3DEffect="Bubble3DEffect";
		ChartType.stockHLC="StockHLC";
		ChartType.stockOHLC="StockOHLC";
		ChartType.stockVHLC="StockVHLC";
		ChartType.stockVOHLC="StockVOHLC";
		ChartType.cylinderColClustered="CylinderColClustered";
		ChartType.cylinderColStacked="CylinderColStacked";
		ChartType.cylinderColStacked100="CylinderColStacked100";
		ChartType.cylinderBarClustered="CylinderBarClustered";
		ChartType.cylinderBarStacked="CylinderBarStacked";
		ChartType.cylinderBarStacked100="CylinderBarStacked100";
		ChartType.cylinderCol="CylinderCol";
		ChartType.coneColClustered="ConeColClustered";
		ChartType.coneColStacked="ConeColStacked";
		ChartType.coneColStacked100="ConeColStacked100";
		ChartType.coneBarClustered="ConeBarClustered";
		ChartType.coneBarStacked="ConeBarStacked";
		ChartType.coneBarStacked100="ConeBarStacked100";
		ChartType.coneCol="ConeCol";
		ChartType.pyramidColClustered="PyramidColClustered";
		ChartType.pyramidColStacked="PyramidColStacked";
		ChartType.pyramidColStacked100="PyramidColStacked100";
		ChartType.pyramidBarClustered="PyramidBarClustered";
		ChartType.pyramidBarStacked="PyramidBarStacked";
		ChartType.pyramidBarStacked100="PyramidBarStacked100";
		ChartType.pyramidCol="PyramidCol";
		ChartType._3DColumn="3DColumn";
		ChartType.line="Line";
		ChartType._3DLine="3DLine";
		ChartType._3DPie="3DPie";
		ChartType.pie="Pie";
		ChartType.xyscatter="XYScatter";
		ChartType._3DArea="3DArea";
		ChartType.area="Area";
		ChartType.doughnut="Doughnut";
		ChartType.radar="Radar";
	})(ChartType=Excel.ChartType || (Excel.ChartType={}));
	var ChartUnderlineStyle;
	(function (ChartUnderlineStyle) {
		ChartUnderlineStyle.none="None";
		ChartUnderlineStyle.single="Single";
	})(ChartUnderlineStyle=Excel.ChartUnderlineStyle || (Excel.ChartUnderlineStyle={}));
	var DeleteShiftDirection;
	(function (DeleteShiftDirection) {
		DeleteShiftDirection.up="Up";
		DeleteShiftDirection.left="Left";
	})(DeleteShiftDirection=Excel.DeleteShiftDirection || (Excel.DeleteShiftDirection={}));
	var DynamicFilterCriteria;
	(function (DynamicFilterCriteria) {
		DynamicFilterCriteria.unknown="Unknown";
		DynamicFilterCriteria.aboveAverage="AboveAverage";
		DynamicFilterCriteria.allDatesInPeriodApril="AllDatesInPeriodApril";
		DynamicFilterCriteria.allDatesInPeriodAugust="AllDatesInPeriodAugust";
		DynamicFilterCriteria.allDatesInPeriodDecember="AllDatesInPeriodDecember";
		DynamicFilterCriteria.allDatesInPeriodFebruray="AllDatesInPeriodFebruray";
		DynamicFilterCriteria.allDatesInPeriodJanuary="AllDatesInPeriodJanuary";
		DynamicFilterCriteria.allDatesInPeriodJuly="AllDatesInPeriodJuly";
		DynamicFilterCriteria.allDatesInPeriodJune="AllDatesInPeriodJune";
		DynamicFilterCriteria.allDatesInPeriodMarch="AllDatesInPeriodMarch";
		DynamicFilterCriteria.allDatesInPeriodMay="AllDatesInPeriodMay";
		DynamicFilterCriteria.allDatesInPeriodNovember="AllDatesInPeriodNovember";
		DynamicFilterCriteria.allDatesInPeriodOctober="AllDatesInPeriodOctober";
		DynamicFilterCriteria.allDatesInPeriodQuarter1="AllDatesInPeriodQuarter1";
		DynamicFilterCriteria.allDatesInPeriodQuarter2="AllDatesInPeriodQuarter2";
		DynamicFilterCriteria.allDatesInPeriodQuarter3="AllDatesInPeriodQuarter3";
		DynamicFilterCriteria.allDatesInPeriodQuarter4="AllDatesInPeriodQuarter4";
		DynamicFilterCriteria.allDatesInPeriodSeptember="AllDatesInPeriodSeptember";
		DynamicFilterCriteria.belowAverage="BelowAverage";
		DynamicFilterCriteria.lastMonth="LastMonth";
		DynamicFilterCriteria.lastQuarter="LastQuarter";
		DynamicFilterCriteria.lastWeek="LastWeek";
		DynamicFilterCriteria.lastYear="LastYear";
		DynamicFilterCriteria.nextMonth="NextMonth";
		DynamicFilterCriteria.nextQuarter="NextQuarter";
		DynamicFilterCriteria.nextWeek="NextWeek";
		DynamicFilterCriteria.nextYear="NextYear";
		DynamicFilterCriteria.thisMonth="ThisMonth";
		DynamicFilterCriteria.thisQuarter="ThisQuarter";
		DynamicFilterCriteria.thisWeek="ThisWeek";
		DynamicFilterCriteria.thisYear="ThisYear";
		DynamicFilterCriteria.today="Today";
		DynamicFilterCriteria.tomorrow="Tomorrow";
		DynamicFilterCriteria.yearToDate="YearToDate";
		DynamicFilterCriteria.yesterday="Yesterday";
	})(DynamicFilterCriteria=Excel.DynamicFilterCriteria || (Excel.DynamicFilterCriteria={}));
	var FilterDatetimeSpecificity;
	(function (FilterDatetimeSpecificity) {
		FilterDatetimeSpecificity.year="Year";
		FilterDatetimeSpecificity.month="Month";
		FilterDatetimeSpecificity.day="Day";
		FilterDatetimeSpecificity.hour="Hour";
		FilterDatetimeSpecificity.minute="Minute";
		FilterDatetimeSpecificity.second="Second";
	})(FilterDatetimeSpecificity=Excel.FilterDatetimeSpecificity || (Excel.FilterDatetimeSpecificity={}));
	var FilterOn;
	(function (FilterOn) {
		FilterOn.bottomItems="BottomItems";
		FilterOn.bottomPercent="BottomPercent";
		FilterOn.cellColor="CellColor";
		FilterOn.dynamic="Dynamic";
		FilterOn.fontColor="FontColor";
		FilterOn.values="Values";
		FilterOn.topItems="TopItems";
		FilterOn.topPercent="TopPercent";
		FilterOn.icon="Icon";
		FilterOn.custom="Custom";
	})(FilterOn=Excel.FilterOn || (Excel.FilterOn={}));
	var FilterOperator;
	(function (FilterOperator) {
		FilterOperator.and="And";
		FilterOperator.or="Or";
	})(FilterOperator=Excel.FilterOperator || (Excel.FilterOperator={}));
	var HorizontalAlignment;
	(function (HorizontalAlignment) {
		HorizontalAlignment.general="General";
		HorizontalAlignment.left="Left";
		HorizontalAlignment.center="Center";
		HorizontalAlignment.right="Right";
		HorizontalAlignment.fill="Fill";
		HorizontalAlignment.justify="Justify";
		HorizontalAlignment.centerAcrossSelection="CenterAcrossSelection";
		HorizontalAlignment.distributed="Distributed";
	})(HorizontalAlignment=Excel.HorizontalAlignment || (Excel.HorizontalAlignment={}));
	var IconSet;
	(function (IconSet) {
		IconSet.invalid="Invalid";
		IconSet.threeArrows="ThreeArrows";
		IconSet.threeArrowsGray="ThreeArrowsGray";
		IconSet.threeFlags="ThreeFlags";
		IconSet.threeTrafficLights1="ThreeTrafficLights1";
		IconSet.threeTrafficLights2="ThreeTrafficLights2";
		IconSet.threeSigns="ThreeSigns";
		IconSet.threeSymbols="ThreeSymbols";
		IconSet.threeSymbols2="ThreeSymbols2";
		IconSet.fourArrows="FourArrows";
		IconSet.fourArrowsGray="FourArrowsGray";
		IconSet.fourRedToBlack="FourRedToBlack";
		IconSet.fourRating="FourRating";
		IconSet.fourTrafficLights="FourTrafficLights";
		IconSet.fiveArrows="FiveArrows";
		IconSet.fiveArrowsGray="FiveArrowsGray";
		IconSet.fiveRating="FiveRating";
		IconSet.fiveQuarters="FiveQuarters";
		IconSet.threeStars="ThreeStars";
		IconSet.threeTriangles="ThreeTriangles";
		IconSet.fiveBoxes="FiveBoxes";
	})(IconSet=Excel.IconSet || (Excel.IconSet={}));
	var ImageFittingMode;
	(function (ImageFittingMode) {
		ImageFittingMode.fit="Fit";
		ImageFittingMode.fitAndCenter="FitAndCenter";
		ImageFittingMode.fill="Fill";
	})(ImageFittingMode=Excel.ImageFittingMode || (Excel.ImageFittingMode={}));
	var InsertShiftDirection;
	(function (InsertShiftDirection) {
		InsertShiftDirection.down="Down";
		InsertShiftDirection.right="Right";
	})(InsertShiftDirection=Excel.InsertShiftDirection || (Excel.InsertShiftDirection={}));
	var NamedItemType;
	(function (NamedItemType) {
		NamedItemType.string="String";
		NamedItemType.integer="Integer";
		NamedItemType.double="Double";
		NamedItemType.boolean="Boolean";
		NamedItemType.range="Range";
	})(NamedItemType=Excel.NamedItemType || (Excel.NamedItemType={}));
	var RangeUnderlineStyle;
	(function (RangeUnderlineStyle) {
		RangeUnderlineStyle.none="None";
		RangeUnderlineStyle.single="Single";
		RangeUnderlineStyle.double="Double";
		RangeUnderlineStyle.singleAccountant="SingleAccountant";
		RangeUnderlineStyle.doubleAccountant="DoubleAccountant";
	})(RangeUnderlineStyle=Excel.RangeUnderlineStyle || (Excel.RangeUnderlineStyle={}));
	var SheetVisibility;
	(function (SheetVisibility) {
		SheetVisibility.visible="Visible";
		SheetVisibility.hidden="Hidden";
		SheetVisibility.veryHidden="VeryHidden";
	})(SheetVisibility=Excel.SheetVisibility || (Excel.SheetVisibility={}));
	var RangeValueType;
	(function (RangeValueType) {
		RangeValueType.unknown="Unknown";
		RangeValueType.empty="Empty";
		RangeValueType.string="String";
		RangeValueType.integer="Integer";
		RangeValueType.double="Double";
		RangeValueType.boolean="Boolean";
		RangeValueType.error="Error";
	})(RangeValueType=Excel.RangeValueType || (Excel.RangeValueType={}));
	var SortOrientation;
	(function (SortOrientation) {
		SortOrientation.rows="Rows";
		SortOrientation.columns="Columns";
	})(SortOrientation=Excel.SortOrientation || (Excel.SortOrientation={}));
	var SortOn;
	(function (SortOn) {
		SortOn.value="Value";
		SortOn.cellColor="CellColor";
		SortOn.fontColor="FontColor";
		SortOn.icon="Icon";
	})(SortOn=Excel.SortOn || (Excel.SortOn={}));
	var SortDataOption;
	(function (SortDataOption) {
		SortDataOption.normal="Normal";
		SortDataOption.textAsNumber="TextAsNumber";
	})(SortDataOption=Excel.SortDataOption || (Excel.SortDataOption={}));
	var SortMethod;
	(function (SortMethod) {
		SortMethod.pinYin="PinYin";
		SortMethod.strokeCount="StrokeCount";
	})(SortMethod=Excel.SortMethod || (Excel.SortMethod={}));
	var VerticalAlignment;
	(function (VerticalAlignment) {
		VerticalAlignment.top="Top";
		VerticalAlignment.center="Center";
		VerticalAlignment.bottom="Bottom";
		VerticalAlignment.justify="Justify";
		VerticalAlignment.distributed="Distributed";
	})(VerticalAlignment=Excel.VerticalAlignment || (Excel.VerticalAlignment={}));
	var FunctionResult=(function (_super) {
		__extends(FunctionResult, _super);
		function FunctionResult() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(FunctionResult.prototype, "error", {
			get: function () {
				_throwIfNotLoaded("error", this.m_error, "FunctionResult", this._isNull);
				return this.m_error;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FunctionResult.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("value", this.m_value, "FunctionResult", this._isNull);
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		FunctionResult.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Error"])) {
				this.m_error=obj["Error"];
			}
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
		};
		FunctionResult.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		return FunctionResult;
	})(OfficeExtension.ClientObject);
	Excel.FunctionResult=FunctionResult;
	var Functions=(function (_super) {
		__extends(Functions, _super);
		function Functions() {
			_super.apply(this, arguments);
		}
		Functions.prototype.abs=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Abs", 0 , [number], false, true));
		};
		Functions.prototype.accrInt=function (issue, firstInterest, settlement, rate, par, frequency, basis, calcMethod) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AccrInt", 0 , [issue, firstInterest, settlement, rate, par, frequency, basis, calcMethod], false, true));
		};
		Functions.prototype.accrIntM=function (issue, settlement, rate, par, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AccrIntM", 0 , [issue, settlement, rate, par, basis], false, true));
		};
		Functions.prototype.acos=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acos", 0 , [number], false, true));
		};
		Functions.prototype.acosh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acosh", 0 , [number], false, true));
		};
		Functions.prototype.acot=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acot", 0 , [number], false, true));
		};
		Functions.prototype.acoth=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Acoth", 0 , [number], false, true));
		};
		Functions.prototype.amorDegrc=function (cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AmorDegrc", 0 , [cost, datePurchased, firstPeriod, salvage, period, rate, basis], false, true));
		};
		Functions.prototype.amorLinc=function (cost, datePurchased, firstPeriod, salvage, period, rate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AmorLinc", 0 , [cost, datePurchased, firstPeriod, salvage, period, rate, basis], false, true));
		};
		Functions.prototype.and=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "And", 0 , [values], false, true));
		};
		Functions.prototype.arabic=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Arabic", 0 , [text], false, true));
		};
		Functions.prototype.areas=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Areas", 0 , [reference], false, true));
		};
		Functions.prototype.asc=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asc", 0 , [text], false, true));
		};
		Functions.prototype.asin=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asin", 0 , [number], false, true));
		};
		Functions.prototype.asinh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Asinh", 0 , [number], false, true));
		};
		Functions.prototype.atan=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atan", 0 , [number], false, true));
		};
		Functions.prototype.atan2=function (xNum, yNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atan2", 0 , [xNum, yNum], false, true));
		};
		Functions.prototype.atanh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Atanh", 0 , [number], false, true));
		};
		Functions.prototype.aveDev=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AveDev", 0 , [values], false, true));
		};
		Functions.prototype.average=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Average", 0 , [values], false, true));
		};
		Functions.prototype.averageA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageA", 0 , [values], false, true));
		};
		Functions.prototype.averageIf=function (range, criteria, averageRange) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageIf", 0 , [range, criteria, averageRange], false, true));
		};
		Functions.prototype.averageIfs=function (averageRange) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "AverageIfs", 0 , [averageRange, values], false, true));
		};
		Functions.prototype.bahtText=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BahtText", 0 , [number], false, true));
		};
		Functions.prototype.base=function (number, radix, minLength) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Base", 0 , [number, radix, minLength], false, true));
		};
		Functions.prototype.besselI=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselI", 0 , [x, n], false, true));
		};
		Functions.prototype.besselJ=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselJ", 0 , [x, n], false, true));
		};
		Functions.prototype.besselK=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselK", 0 , [x, n], false, true));
		};
		Functions.prototype.besselY=function (x, n) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "BesselY", 0 , [x, n], false, true));
		};
		Functions.prototype.beta_Dist=function (x, alpha, beta, cumulative, A, B) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Beta_Dist", 0 , [x, alpha, beta, cumulative, A, B], false, true));
		};
		Functions.prototype.beta_Inv=function (probability, alpha, beta, A, B) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Beta_Inv", 0 , [probability, alpha, beta, A, B], false, true));
		};
		Functions.prototype.bin2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Dec", 0 , [number], false, true));
		};
		Functions.prototype.bin2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Hex", 0 , [number, places], false, true));
		};
		Functions.prototype.bin2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bin2Oct", 0 , [number, places], false, true));
		};
		Functions.prototype.binom_Dist=function (numberS, trials, probabilityS, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Dist", 0 , [numberS, trials, probabilityS, cumulative], false, true));
		};
		Functions.prototype.binom_Dist_Range=function (trials, probabilityS, numberS, numberS2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Dist_Range", 0 , [trials, probabilityS, numberS, numberS2], false, true));
		};
		Functions.prototype.binom_Inv=function (trials, probabilityS, alpha) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Binom_Inv", 0 , [trials, probabilityS, alpha], false, true));
		};
		Functions.prototype.bitand=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitand", 0 , [number1, number2], false, true));
		};
		Functions.prototype.bitlshift=function (number, shiftAmount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitlshift", 0 , [number, shiftAmount], false, true));
		};
		Functions.prototype.bitor=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitor", 0 , [number1, number2], false, true));
		};
		Functions.prototype.bitrshift=function (number, shiftAmount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitrshift", 0 , [number, shiftAmount], false, true));
		};
		Functions.prototype.bitxor=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Bitxor", 0 , [number1, number2], false, true));
		};
		Functions.prototype.ceiling_Math=function (number, significance, mode) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ceiling_Math", 0 , [number, significance, mode], false, true));
		};
		Functions.prototype.ceiling_Precise=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ceiling_Precise", 0 , [number, significance], false, true));
		};
		Functions.prototype.char=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Char", 0 , [number], false, true));
		};
		Functions.prototype.chiSq_Dist=function (x, degFreedom, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Dist", 0 , [x, degFreedom, cumulative], false, true));
		};
		Functions.prototype.chiSq_Dist_RT=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Dist_RT", 0 , [x, degFreedom], false, true));
		};
		Functions.prototype.chiSq_Inv=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Inv", 0 , [probability, degFreedom], false, true));
		};
		Functions.prototype.chiSq_Inv_RT=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ChiSq_Inv_RT", 0 , [probability, degFreedom], false, true));
		};
		Functions.prototype.choose=function (indexNum) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Choose", 0 , [indexNum, values], false, true));
		};
		Functions.prototype.clean=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Clean", 0 , [text], false, true));
		};
		Functions.prototype.code=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Code", 0 , [text], false, true));
		};
		Functions.prototype.columns=function (array) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Columns", 0 , [array], false, true));
		};
		Functions.prototype.combin=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Combin", 0 , [number, numberChosen], false, true));
		};
		Functions.prototype.combina=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Combina", 0 , [number, numberChosen], false, true));
		};
		Functions.prototype.complex=function (realNum, iNum, suffix) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Complex", 0 , [realNum, iNum, suffix], false, true));
		};
		Functions.prototype.concatenate=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Concatenate", 0 , [values], false, true));
		};
		Functions.prototype.confidence_Norm=function (alpha, standardDev, size) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Confidence_Norm", 0 , [alpha, standardDev, size], false, true));
		};
		Functions.prototype.confidence_T=function (alpha, standardDev, size) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Confidence_T", 0 , [alpha, standardDev, size], false, true));
		};
		Functions.prototype.convert=function (number, fromUnit, toUnit) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Convert", 0 , [number, fromUnit, toUnit], false, true));
		};
		Functions.prototype.cos=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cos", 0 , [number], false, true));
		};
		Functions.prototype.cosh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cosh", 0 , [number], false, true));
		};
		Functions.prototype.cot=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Cot", 0 , [number], false, true));
		};
		Functions.prototype.coth=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Coth", 0 , [number], false, true));
		};
		Functions.prototype.count=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Count", 0 , [values], false, true));
		};
		Functions.prototype.countA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountA", 0 , [values], false, true));
		};
		Functions.prototype.countBlank=function (range) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountBlank", 0 , [range], false, true));
		};
		Functions.prototype.countIf=function (range, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountIf", 0 , [range, criteria], false, true));
		};
		Functions.prototype.countIfs=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CountIfs", 0 , [values], false, true));
		};
		Functions.prototype.coupDayBs=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDayBs", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.coupDays=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDays", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.coupDaysNc=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupDaysNc", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.coupNcd=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupNcd", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.coupNum=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupNum", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.coupPcd=function (settlement, maturity, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CoupPcd", 0 , [settlement, maturity, frequency, basis], false, true));
		};
		Functions.prototype.csc=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Csc", 0 , [number], false, true));
		};
		Functions.prototype.csch=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Csch", 0 , [number], false, true));
		};
		Functions.prototype.cumIPmt=function (rate, nper, pv, startPeriod, endPeriod, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CumIPmt", 0 , [rate, nper, pv, startPeriod, endPeriod, type], false, true));
		};
		Functions.prototype.cumPrinc=function (rate, nper, pv, startPeriod, endPeriod, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "CumPrinc", 0 , [rate, nper, pv, startPeriod, endPeriod, type], false, true));
		};
		Functions.prototype.daverage=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DAverage", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dcount=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DCount", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dcountA=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DCountA", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dget=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DGet", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dmax=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DMax", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dmin=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DMin", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dproduct=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DProduct", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dstDev=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DStDev", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dstDevP=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DStDevP", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dsum=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DSum", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dvar=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DVar", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.dvarP=function (database, field, criteria) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DVarP", 0 , [database, field, criteria], false, true));
		};
		Functions.prototype.date=function (year, month, day) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Date", 0 , [year, month, day], false, true));
		};
		Functions.prototype.datevalue=function (dateText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Datevalue", 0 , [dateText], false, true));
		};
		Functions.prototype.day=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Day", 0 , [serialNumber], false, true));
		};
		Functions.prototype.days=function (endDate, startDate) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Days", 0 , [endDate, startDate], false, true));
		};
		Functions.prototype.days360=function (startDate, endDate, method) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Days360", 0 , [startDate, endDate, method], false, true));
		};
		Functions.prototype.db=function (cost, salvage, life, period, month) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Db", 0 , [cost, salvage, life, period, month], false, true));
		};
		Functions.prototype.dbcs=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dbcs", 0 , [text], false, true));
		};
		Functions.prototype.ddb=function (cost, salvage, life, period, factor) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ddb", 0 , [cost, salvage, life, period, factor], false, true));
		};
		Functions.prototype.dec2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Bin", 0 , [number, places], false, true));
		};
		Functions.prototype.dec2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Hex", 0 , [number, places], false, true));
		};
		Functions.prototype.dec2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dec2Oct", 0 , [number, places], false, true));
		};
		Functions.prototype.decimal=function (number, radix) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Decimal", 0 , [number, radix], false, true));
		};
		Functions.prototype.degrees=function (angle) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Degrees", 0 , [angle], false, true));
		};
		Functions.prototype.delta=function (number1, number2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Delta", 0 , [number1, number2], false, true));
		};
		Functions.prototype.devSq=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DevSq", 0 , [values], false, true));
		};
		Functions.prototype.disc=function (settlement, maturity, pr, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Disc", 0 , [settlement, maturity, pr, redemption, basis], false, true));
		};
		Functions.prototype.dollar=function (number, decimals) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Dollar", 0 , [number, decimals], false, true));
		};
		Functions.prototype.dollarDe=function (fractionalDollar, fraction) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DollarDe", 0 , [fractionalDollar, fraction], false, true));
		};
		Functions.prototype.dollarFr=function (decimalDollar, fraction) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "DollarFr", 0 , [decimalDollar, fraction], false, true));
		};
		Functions.prototype.duration=function (settlement, maturity, coupon, yld, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Duration", 0 , [settlement, maturity, coupon, yld, frequency, basis], false, true));
		};
		Functions.prototype.ecma_Ceiling=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ECMA_Ceiling", 0 , [number, significance], false, true));
		};
		Functions.prototype.edate=function (startDate, months) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "EDate", 0 , [startDate, months], false, true));
		};
		Functions.prototype.effect=function (nominalRate, npery) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Effect", 0 , [nominalRate, npery], false, true));
		};
		Functions.prototype.eoMonth=function (startDate, months) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "EoMonth", 0 , [startDate, months], false, true));
		};
		Functions.prototype.erf=function (lowerLimit, upperLimit) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Erf", 0 , [lowerLimit, upperLimit], false, true));
		};
		Functions.prototype.erfC=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ErfC", 0 , [x], false, true));
		};
		Functions.prototype.erfC_Precise=function (X) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ErfC_Precise", 0 , [X], false, true));
		};
		Functions.prototype.erf_Precise=function (X) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Erf_Precise", 0 , [X], false, true));
		};
		Functions.prototype.error_Type=function (errorVal) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Error_Type", 0 , [errorVal], false, true));
		};
		Functions.prototype.even=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Even", 0 , [number], false, true));
		};
		Functions.prototype.exact=function (text1, text2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Exact", 0 , [text1, text2], false, true));
		};
		Functions.prototype.exp=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Exp", 0 , [number], false, true));
		};
		Functions.prototype.expon_Dist=function (x, lambda, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Expon_Dist", 0 , [x, lambda, cumulative], false, true));
		};
		Functions.prototype.fvschedule=function (principal, schedule) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FVSchedule", 0 , [principal, schedule], false, true));
		};
		Functions.prototype.f_Dist=function (x, degFreedom1, degFreedom2, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Dist", 0 , [x, degFreedom1, degFreedom2, cumulative], false, true));
		};
		Functions.prototype.f_Dist_RT=function (x, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Dist_RT", 0 , [x, degFreedom1, degFreedom2], false, true));
		};
		Functions.prototype.f_Inv=function (probability, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Inv", 0 , [probability, degFreedom1, degFreedom2], false, true));
		};
		Functions.prototype.f_Inv_RT=function (probability, degFreedom1, degFreedom2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "F_Inv_RT", 0 , [probability, degFreedom1, degFreedom2], false, true));
		};
		Functions.prototype.fact=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fact", 0 , [number], false, true));
		};
		Functions.prototype.factDouble=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FactDouble", 0 , [number], false, true));
		};
		Functions.prototype.false=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "False", 0 , [], false, true));
		};
		Functions.prototype.find=function (findText, withinText, startNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Find", 0 , [findText, withinText, startNum], false, true));
		};
		Functions.prototype.findB=function (findText, withinText, startNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FindB", 0 , [findText, withinText, startNum], false, true));
		};
		Functions.prototype.fisher=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fisher", 0 , [x], false, true));
		};
		Functions.prototype.fisherInv=function (y) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "FisherInv", 0 , [y], false, true));
		};
		Functions.prototype.fixed=function (number, decimals, noCommas) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fixed", 0 , [number, decimals, noCommas], false, true));
		};
		Functions.prototype.floor_Math=function (number, significance, mode) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Floor_Math", 0 , [number, significance, mode], false, true));
		};
		Functions.prototype.floor_Precise=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Floor_Precise", 0 , [number, significance], false, true));
		};
		Functions.prototype.fv=function (rate, nper, pmt, pv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Fv", 0 , [rate, nper, pmt, pv, type], false, true));
		};
		Functions.prototype.gamma=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma", 0 , [x], false, true));
		};
		Functions.prototype.gammaLn=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GammaLn", 0 , [x], false, true));
		};
		Functions.prototype.gammaLn_Precise=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GammaLn_Precise", 0 , [x], false, true));
		};
		Functions.prototype.gamma_Dist=function (x, alpha, beta, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma_Dist", 0 , [x, alpha, beta, cumulative], false, true));
		};
		Functions.prototype.gamma_Inv=function (probability, alpha, beta) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gamma_Inv", 0 , [probability, alpha, beta], false, true));
		};
		Functions.prototype.gauss=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gauss", 0 , [x], false, true));
		};
		Functions.prototype.gcd=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Gcd", 0 , [values], false, true));
		};
		Functions.prototype.geStep=function (number, step) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GeStep", 0 , [number, step], false, true));
		};
		Functions.prototype.geoMean=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "GeoMean", 0 , [values], false, true));
		};
		Functions.prototype.hlookup=function (lookupValue, tableArray, rowIndexNum, rangeLookup) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HLookup", 0 , [lookupValue, tableArray, rowIndexNum, rangeLookup], false, true));
		};
		Functions.prototype.harMean=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HarMean", 0 , [values], false, true));
		};
		Functions.prototype.hex2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Bin", 0 , [number, places], false, true));
		};
		Functions.prototype.hex2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Dec", 0 , [number], false, true));
		};
		Functions.prototype.hex2Oct=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hex2Oct", 0 , [number, places], false, true));
		};
		Functions.prototype.hour=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hour", 0 , [serialNumber], false, true));
		};
		Functions.prototype.hypGeom_Dist=function (sampleS, numberSample, populationS, numberPop, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "HypGeom_Dist", 0 , [sampleS, numberSample, populationS, numberPop, cumulative], false, true));
		};
		Functions.prototype.hyperlink=function (linkLocation, friendlyName) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Hyperlink", 0 , [linkLocation, friendlyName], false, true));
		};
		Functions.prototype.iso_Ceiling=function (number, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ISO_Ceiling", 0 , [number, significance], false, true));
		};
		Functions.prototype.if=function (logicalTest, valueIfTrue, valueIfFalse) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "If", 0 , [logicalTest, valueIfTrue, valueIfFalse], false, true));
		};
		Functions.prototype.imAbs=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImAbs", 0 , [inumber], false, true));
		};
		Functions.prototype.imArgument=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImArgument", 0 , [inumber], false, true));
		};
		Functions.prototype.imConjugate=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImConjugate", 0 , [inumber], false, true));
		};
		Functions.prototype.imCos=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCos", 0 , [inumber], false, true));
		};
		Functions.prototype.imCosh=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCosh", 0 , [inumber], false, true));
		};
		Functions.prototype.imCot=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCot", 0 , [inumber], false, true));
		};
		Functions.prototype.imCsc=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCsc", 0 , [inumber], false, true));
		};
		Functions.prototype.imCsch=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImCsch", 0 , [inumber], false, true));
		};
		Functions.prototype.imDiv=function (inumber1, inumber2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImDiv", 0 , [inumber1, inumber2], false, true));
		};
		Functions.prototype.imExp=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImExp", 0 , [inumber], false, true));
		};
		Functions.prototype.imLn=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLn", 0 , [inumber], false, true));
		};
		Functions.prototype.imLog10=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLog10", 0 , [inumber], false, true));
		};
		Functions.prototype.imLog2=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImLog2", 0 , [inumber], false, true));
		};
		Functions.prototype.imPower=function (inumber, number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImPower", 0 , [inumber, number], false, true));
		};
		Functions.prototype.imProduct=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImProduct", 0 , [values], false, true));
		};
		Functions.prototype.imReal=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImReal", 0 , [inumber], false, true));
		};
		Functions.prototype.imSec=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSec", 0 , [inumber], false, true));
		};
		Functions.prototype.imSech=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSech", 0 , [inumber], false, true));
		};
		Functions.prototype.imSin=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSin", 0 , [inumber], false, true));
		};
		Functions.prototype.imSinh=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSinh", 0 , [inumber], false, true));
		};
		Functions.prototype.imSqrt=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSqrt", 0 , [inumber], false, true));
		};
		Functions.prototype.imSub=function (inumber1, inumber2) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSub", 0 , [inumber1, inumber2], false, true));
		};
		Functions.prototype.imSum=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImSum", 0 , [values], false, true));
		};
		Functions.prototype.imTan=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ImTan", 0 , [inumber], false, true));
		};
		Functions.prototype.imaginary=function (inumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Imaginary", 0 , [inumber], false, true));
		};
		Functions.prototype.int=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Int", 0 , [number], false, true));
		};
		Functions.prototype.intRate=function (settlement, maturity, investment, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IntRate", 0 , [settlement, maturity, investment, redemption, basis], false, true));
		};
		Functions.prototype.ipmt=function (rate, per, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ipmt", 0 , [rate, per, nper, pv, fv, type], false, true));
		};
		Functions.prototype.irr=function (values, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Irr", 0 , [values, guess], false, true));
		};
		Functions.prototype.isErr=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsErr", 0 , [value], false, true));
		};
		Functions.prototype.isError=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsError", 0 , [value], false, true));
		};
		Functions.prototype.isEven=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsEven", 0 , [number], false, true));
		};
		Functions.prototype.isFormula=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsFormula", 0 , [reference], false, true));
		};
		Functions.prototype.isLogical=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsLogical", 0 , [value], false, true));
		};
		Functions.prototype.isNA=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNA", 0 , [value], false, true));
		};
		Functions.prototype.isNonText=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNonText", 0 , [value], false, true));
		};
		Functions.prototype.isNumber=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsNumber", 0 , [value], false, true));
		};
		Functions.prototype.isOdd=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsOdd", 0 , [number], false, true));
		};
		Functions.prototype.isText=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsText", 0 , [value], false, true));
		};
		Functions.prototype.isoWeekNum=function (date) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "IsoWeekNum", 0 , [date], false, true));
		};
		Functions.prototype.ispmt=function (rate, per, nper, pv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ispmt", 0 , [rate, per, nper, pv], false, true));
		};
		Functions.prototype.isref=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Isref", 0 , [value], false, true));
		};
		Functions.prototype.kurt=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Kurt", 0 , [values], false, true));
		};
		Functions.prototype.large=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Large", 0 , [array, k], false, true));
		};
		Functions.prototype.lcm=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lcm", 0 , [values], false, true));
		};
		Functions.prototype.left=function (text, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Left", 0 , [text, numChars], false, true));
		};
		Functions.prototype.leftb=function (text, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Leftb", 0 , [text, numBytes], false, true));
		};
		Functions.prototype.len=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Len", 0 , [text], false, true));
		};
		Functions.prototype.lenb=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lenb", 0 , [text], false, true));
		};
		Functions.prototype.ln=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ln", 0 , [number], false, true));
		};
		Functions.prototype.log=function (number, base) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Log", 0 , [number, base], false, true));
		};
		Functions.prototype.log10=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Log10", 0 , [number], false, true));
		};
		Functions.prototype.logNorm_Dist=function (x, mean, standardDev, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "LogNorm_Dist", 0 , [x, mean, standardDev, cumulative], false, true));
		};
		Functions.prototype.logNorm_Inv=function (probability, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "LogNorm_Inv", 0 , [probability, mean, standardDev], false, true));
		};
		Functions.prototype.lookup=function (lookupValue, lookupVector, resultVector) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lookup", 0 , [lookupValue, lookupVector, resultVector], false, true));
		};
		Functions.prototype.lower=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Lower", 0 , [text], false, true));
		};
		Functions.prototype.mduration=function (settlement, maturity, coupon, yld, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MDuration", 0 , [settlement, maturity, coupon, yld, frequency, basis], false, true));
		};
		Functions.prototype.mirr=function (values, financeRate, reinvestRate) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MIrr", 0 , [values, financeRate, reinvestRate], false, true));
		};
		Functions.prototype.mround=function (number, multiple) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MRound", 0 , [number, multiple], false, true));
		};
		Functions.prototype.match=function (lookupValue, lookupArray, matchType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Match", 0 , [lookupValue, lookupArray, matchType], false, true));
		};
		Functions.prototype.max=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Max", 0 , [values], false, true));
		};
		Functions.prototype.maxA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MaxA", 0 , [values], false, true));
		};
		Functions.prototype.median=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Median", 0 , [values], false, true));
		};
		Functions.prototype.mid=function (text, startNum, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Mid", 0 , [text, startNum, numChars], false, true));
		};
		Functions.prototype.midb=function (text, startNum, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Midb", 0 , [text, startNum, numBytes], false, true));
		};
		Functions.prototype.min=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Min", 0 , [values], false, true));
		};
		Functions.prototype.minA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MinA", 0 , [values], false, true));
		};
		Functions.prototype.minute=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Minute", 0 , [serialNumber], false, true));
		};
		Functions.prototype.mod=function (number, divisor) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Mod", 0 , [number, divisor], false, true));
		};
		Functions.prototype.month=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Month", 0 , [serialNumber], false, true));
		};
		Functions.prototype.multiNomial=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "MultiNomial", 0 , [values], false, true));
		};
		Functions.prototype.n=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "N", 0 , [value], false, true));
		};
		Functions.prototype.nper=function (rate, pmt, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NPer", 0 , [rate, pmt, pv, fv, type], false, true));
		};
		Functions.prototype.na=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Na", 0 , [], false, true));
		};
		Functions.prototype.negBinom_Dist=function (numberF, numberS, probabilityS, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NegBinom_Dist", 0 , [numberF, numberS, probabilityS, cumulative], false, true));
		};
		Functions.prototype.networkDays=function (startDate, endDate, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NetworkDays", 0 , [startDate, endDate, holidays], false, true));
		};
		Functions.prototype.networkDays_Intl=function (startDate, endDate, weekend, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NetworkDays_Intl", 0 , [startDate, endDate, weekend, holidays], false, true));
		};
		Functions.prototype.nominal=function (effectRate, npery) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Nominal", 0 , [effectRate, npery], false, true));
		};
		Functions.prototype.norm_Dist=function (x, mean, standardDev, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_Dist", 0 , [x, mean, standardDev, cumulative], false, true));
		};
		Functions.prototype.norm_Inv=function (probability, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_Inv", 0 , [probability, mean, standardDev], false, true));
		};
		Functions.prototype.norm_S_Dist=function (z, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_S_Dist", 0 , [z, cumulative], false, true));
		};
		Functions.prototype.norm_S_Inv=function (probability) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Norm_S_Inv", 0 , [probability], false, true));
		};
		Functions.prototype.not=function (logical) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Not", 0 , [logical], false, true));
		};
		Functions.prototype.now=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Now", 0 , [], false, true));
		};
		Functions.prototype.npv=function (rate) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Npv", 0 , [rate, values], false, true));
		};
		Functions.prototype.numberValue=function (text, decimalSeparator, groupSeparator) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "NumberValue", 0 , [text, decimalSeparator, groupSeparator], false, true));
		};
		Functions.prototype.oct2Bin=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Bin", 0 , [number, places], false, true));
		};
		Functions.prototype.oct2Dec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Dec", 0 , [number], false, true));
		};
		Functions.prototype.oct2Hex=function (number, places) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Oct2Hex", 0 , [number, places], false, true));
		};
		Functions.prototype.odd=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Odd", 0 , [number], false, true));
		};
		Functions.prototype.oddFPrice=function (settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddFPrice", 0 , [settlement, maturity, issue, firstCoupon, rate, yld, redemption, frequency, basis], false, true));
		};
		Functions.prototype.oddFYield=function (settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddFYield", 0 , [settlement, maturity, issue, firstCoupon, rate, pr, redemption, frequency, basis], false, true));
		};
		Functions.prototype.oddLPrice=function (settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddLPrice", 0 , [settlement, maturity, lastInterest, rate, yld, redemption, frequency, basis], false, true));
		};
		Functions.prototype.oddLYield=function (settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "OddLYield", 0 , [settlement, maturity, lastInterest, rate, pr, redemption, frequency, basis], false, true));
		};
		Functions.prototype.or=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Or", 0 , [values], false, true));
		};
		Functions.prototype.pduration=function (rate, pv, fv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PDuration", 0 , [rate, pv, fv], false, true));
		};
		Functions.prototype.percentRank_Exc=function (array, x, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PercentRank_Exc", 0 , [array, x, significance], false, true));
		};
		Functions.prototype.percentRank_Inc=function (array, x, significance) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PercentRank_Inc", 0 , [array, x, significance], false, true));
		};
		Functions.prototype.percentile_Exc=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Percentile_Exc", 0 , [array, k], false, true));
		};
		Functions.prototype.percentile_Inc=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Percentile_Inc", 0 , [array, k], false, true));
		};
		Functions.prototype.permut=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Permut", 0 , [number, numberChosen], false, true));
		};
		Functions.prototype.permutationa=function (number, numberChosen) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Permutationa", 0 , [number, numberChosen], false, true));
		};
		Functions.prototype.phi=function (x) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Phi", 0 , [x], false, true));
		};
		Functions.prototype.pi=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pi", 0 , [], false, true));
		};
		Functions.prototype.pmt=function (rate, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pmt", 0 , [rate, nper, pv, fv, type], false, true));
		};
		Functions.prototype.poisson_Dist=function (x, mean, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Poisson_Dist", 0 , [x, mean, cumulative], false, true));
		};
		Functions.prototype.power=function (number, power) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Power", 0 , [number, power], false, true));
		};
		Functions.prototype.ppmt=function (rate, per, nper, pv, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Ppmt", 0 , [rate, per, nper, pv, fv, type], false, true));
		};
		Functions.prototype.price=function (settlement, maturity, rate, yld, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Price", 0 , [settlement, maturity, rate, yld, redemption, frequency, basis], false, true));
		};
		Functions.prototype.priceDisc=function (settlement, maturity, discount, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PriceDisc", 0 , [settlement, maturity, discount, redemption, basis], false, true));
		};
		Functions.prototype.priceMat=function (settlement, maturity, issue, rate, yld, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "PriceMat", 0 , [settlement, maturity, issue, rate, yld, basis], false, true));
		};
		Functions.prototype.product=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Product", 0 , [values], false, true));
		};
		Functions.prototype.proper=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Proper", 0 , [text], false, true));
		};
		Functions.prototype.pv=function (rate, nper, pmt, fv, type) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Pv", 0 , [rate, nper, pmt, fv, type], false, true));
		};
		Functions.prototype.quartile_Exc=function (array, quart) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quartile_Exc", 0 , [array, quart], false, true));
		};
		Functions.prototype.quartile_Inc=function (array, quart) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quartile_Inc", 0 , [array, quart], false, true));
		};
		Functions.prototype.quotient=function (numerator, denominator) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Quotient", 0 , [numerator, denominator], false, true));
		};
		Functions.prototype.radians=function (angle) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Radians", 0 , [angle], false, true));
		};
		Functions.prototype.rand=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rand", 0 , [], false, true));
		};
		Functions.prototype.randBetween=function (bottom, top) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RandBetween", 0 , [bottom, top], false, true));
		};
		Functions.prototype.rank_Avg=function (number, ref, order) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rank_Avg", 0 , [number, ref, order], false, true));
		};
		Functions.prototype.rank_Eq=function (number, ref, order) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rank_Eq", 0 , [number, ref, order], false, true));
		};
		Functions.prototype.rate=function (nper, pmt, pv, fv, type, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rate", 0 , [nper, pmt, pv, fv, type, guess], false, true));
		};
		Functions.prototype.received=function (settlement, maturity, investment, discount, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Received", 0 , [settlement, maturity, investment, discount, basis], false, true));
		};
		Functions.prototype.replace=function (oldText, startNum, numChars, newText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Replace", 0 , [oldText, startNum, numChars, newText], false, true));
		};
		Functions.prototype.replaceB=function (oldText, startNum, numBytes, newText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "ReplaceB", 0 , [oldText, startNum, numBytes, newText], false, true));
		};
		Functions.prototype.rept=function (text, numberTimes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rept", 0 , [text, numberTimes], false, true));
		};
		Functions.prototype.right=function (text, numChars) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Right", 0 , [text, numChars], false, true));
		};
		Functions.prototype.rightb=function (text, numBytes) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rightb", 0 , [text, numBytes], false, true));
		};
		Functions.prototype.roman=function (number, form) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Roman", 0 , [number, form], false, true));
		};
		Functions.prototype.round=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Round", 0 , [number, numDigits], false, true));
		};
		Functions.prototype.roundDown=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RoundDown", 0 , [number, numDigits], false, true));
		};
		Functions.prototype.roundUp=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "RoundUp", 0 , [number, numDigits], false, true));
		};
		Functions.prototype.rows=function (array) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rows", 0 , [array], false, true));
		};
		Functions.prototype.rri=function (nper, pv, fv) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Rri", 0 , [nper, pv, fv], false, true));
		};
		Functions.prototype.sec=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sec", 0 , [number], false, true));
		};
		Functions.prototype.sech=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sech", 0 , [number], false, true));
		};
		Functions.prototype.second=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Second", 0 , [serialNumber], false, true));
		};
		Functions.prototype.seriesSum=function (x, n, m, coefficients) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SeriesSum", 0 , [x, n, m, coefficients], false, true));
		};
		Functions.prototype.sheet=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sheet", 0 , [value], false, true));
		};
		Functions.prototype.sheets=function (reference) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sheets", 0 , [reference], false, true));
		};
		Functions.prototype.sign=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sign", 0 , [number], false, true));
		};
		Functions.prototype.sin=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sin", 0 , [number], false, true));
		};
		Functions.prototype.sinh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sinh", 0 , [number], false, true));
		};
		Functions.prototype.skew=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Skew", 0 , [values], false, true));
		};
		Functions.prototype.skew_p=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Skew_p", 0 , [values], false, true));
		};
		Functions.prototype.sln=function (cost, salvage, life) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sln", 0 , [cost, salvage, life], false, true));
		};
		Functions.prototype.small=function (array, k) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Small", 0 , [array, k], false, true));
		};
		Functions.prototype.sqrt=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sqrt", 0 , [number], false, true));
		};
		Functions.prototype.sqrtPi=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SqrtPi", 0 , [number], false, true));
		};
		Functions.prototype.stDevA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDevA", 0 , [values], false, true));
		};
		Functions.prototype.stDevPA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDevPA", 0 , [values], false, true));
		};
		Functions.prototype.stDev_P=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDev_P", 0 , [values], false, true));
		};
		Functions.prototype.stDev_S=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "StDev_S", 0 , [values], false, true));
		};
		Functions.prototype.standardize=function (x, mean, standardDev) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Standardize", 0 , [x, mean, standardDev], false, true));
		};
		Functions.prototype.substitute=function (text, oldText, newText, instanceNum) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Substitute", 0 , [text, oldText, newText, instanceNum], false, true));
		};
		Functions.prototype.subtotal=function (functionNum) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Subtotal", 0 , [functionNum, values], false, true));
		};
		Functions.prototype.sum=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Sum", 0 , [values], false, true));
		};
		Functions.prototype.sumIf=function (range, criteria, sumRange) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumIf", 0 , [range, criteria, sumRange], false, true));
		};
		Functions.prototype.sumIfs=function (sumRange) {
			var values=[];
			for (var _i=1; _i < arguments.length; _i++) {
				values[_i - 1]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumIfs", 0 , [sumRange, values], false, true));
		};
		Functions.prototype.sumSq=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "SumSq", 0 , [values], false, true));
		};
		Functions.prototype.syd=function (cost, salvage, life, per) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Syd", 0 , [cost, salvage, life, per], false, true));
		};
		Functions.prototype.t=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T", 0 , [value], false, true));
		};
		Functions.prototype.tbillEq=function (settlement, maturity, discount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillEq", 0 , [settlement, maturity, discount], false, true));
		};
		Functions.prototype.tbillPrice=function (settlement, maturity, discount) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillPrice", 0 , [settlement, maturity, discount], false, true));
		};
		Functions.prototype.tbillYield=function (settlement, maturity, pr) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TBillYield", 0 , [settlement, maturity, pr], false, true));
		};
		Functions.prototype.t_Dist=function (x, degFreedom, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist", 0 , [x, degFreedom, cumulative], false, true));
		};
		Functions.prototype.t_Dist_2T=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist_2T", 0 , [x, degFreedom], false, true));
		};
		Functions.prototype.t_Dist_RT=function (x, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Dist_RT", 0 , [x, degFreedom], false, true));
		};
		Functions.prototype.t_Inv=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Inv", 0 , [probability, degFreedom], false, true));
		};
		Functions.prototype.t_Inv_2T=function (probability, degFreedom) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "T_Inv_2T", 0 , [probability, degFreedom], false, true));
		};
		Functions.prototype.tan=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Tan", 0 , [number], false, true));
		};
		Functions.prototype.tanh=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Tanh", 0 , [number], false, true));
		};
		Functions.prototype.text=function (value, formatText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Text", 0 , [value, formatText], false, true));
		};
		Functions.prototype.time=function (hour, minute, second) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Time", 0 , [hour, minute, second], false, true));
		};
		Functions.prototype.timevalue=function (timeText) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Timevalue", 0 , [timeText], false, true));
		};
		Functions.prototype.today=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Today", 0 , [], false, true));
		};
		Functions.prototype.trim=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Trim", 0 , [text], false, true));
		};
		Functions.prototype.trimMean=function (array, percent) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "TrimMean", 0 , [array, percent], false, true));
		};
		Functions.prototype.true=function () {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "True", 0 , [], false, true));
		};
		Functions.prototype.trunc=function (number, numDigits) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Trunc", 0 , [number, numDigits], false, true));
		};
		Functions.prototype.type=function (value) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Type", 0 , [value], false, true));
		};
		Functions.prototype.usdollar=function (number, decimals) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "USDollar", 0 , [number, decimals], false, true));
		};
		Functions.prototype.unichar=function (number) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Unichar", 0 , [number], false, true));
		};
		Functions.prototype.unicode=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Unicode", 0 , [text], false, true));
		};
		Functions.prototype.upper=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Upper", 0 , [text], false, true));
		};
		Functions.prototype.vlookup=function (lookupValue, tableArray, colIndexNum, rangeLookup) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VLookup", 0 , [lookupValue, tableArray, colIndexNum, rangeLookup], false, true));
		};
		Functions.prototype.value=function (text) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Value", 0 , [text], false, true));
		};
		Functions.prototype.varA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VarA", 0 , [values], false, true));
		};
		Functions.prototype.varPA=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "VarPA", 0 , [values], false, true));
		};
		Functions.prototype.var_P=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Var_P", 0 , [values], false, true));
		};
		Functions.prototype.var_S=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Var_S", 0 , [values], false, true));
		};
		Functions.prototype.vdb=function (cost, salvage, life, startPeriod, endPeriod, factor, noSwitch) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Vdb", 0 , [cost, salvage, life, startPeriod, endPeriod, factor, noSwitch], false, true));
		};
		Functions.prototype.weekNum=function (serialNumber, returnType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WeekNum", 0 , [serialNumber, returnType], false, true));
		};
		Functions.prototype.weekday=function (serialNumber, returnType) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Weekday", 0 , [serialNumber, returnType], false, true));
		};
		Functions.prototype.weibull_Dist=function (x, alpha, beta, cumulative) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Weibull_Dist", 0 , [x, alpha, beta, cumulative], false, true));
		};
		Functions.prototype.workDay=function (startDate, days, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WorkDay", 0 , [startDate, days, holidays], false, true));
		};
		Functions.prototype.workDay_Intl=function (startDate, days, weekend, holidays) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "WorkDay_Intl", 0 , [startDate, days, weekend, holidays], false, true));
		};
		Functions.prototype.xirr=function (values, dates, guess) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xirr", 0 , [values, dates, guess], false, true));
		};
		Functions.prototype.xnpv=function (rate, values, dates) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xnpv", 0 , [rate, values, dates], false, true));
		};
		Functions.prototype.xor=function () {
			var values=[];
			for (var _i=0; _i < arguments.length; _i++) {
				values[_i - 0]=arguments[_i];
			}
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Xor", 0 , [values], false, true));
		};
		Functions.prototype.year=function (serialNumber) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Year", 0 , [serialNumber], false, true));
		};
		Functions.prototype.yearFrac=function (startDate, endDate, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YearFrac", 0 , [startDate, endDate, basis], false, true));
		};
		Functions.prototype.yield=function (settlement, maturity, rate, pr, redemption, frequency, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Yield", 0 , [settlement, maturity, rate, pr, redemption, frequency, basis], false, true));
		};
		Functions.prototype.yieldDisc=function (settlement, maturity, pr, redemption, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YieldDisc", 0 , [settlement, maturity, pr, redemption, basis], false, true));
		};
		Functions.prototype.yieldMat=function (settlement, maturity, issue, rate, pr, basis) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "YieldMat", 0 , [settlement, maturity, issue, rate, pr, basis], false, true));
		};
		Functions.prototype.z_Test=function (array, x, sigma) {
			return new FunctionResult(this.context, _createMethodObjectPath(this.context, this, "Z_Test", 0 , [array, x, sigma], false, true));
		};
		Functions.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
		};
		return Functions;
	})(OfficeExtension.ClientObject);
	Excel.Functions=Functions;
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.insertDeleteConflict="InsertDeleteConflict";
		ErrorCodes.invalidArgument="InvalidArgument";
		ErrorCodes.invalidBinding="InvalidBinding";
		ErrorCodes.invalidOperation="InvalidOperation";
		ErrorCodes.invalidReference="InvalidReference";
		ErrorCodes.invalidSelection="InvalidSelection";
		ErrorCodes.itemAlreadyExists="ItemAlreadyExists";
		ErrorCodes.itemNotFound="ItemNotFound";
		ErrorCodes.notImplemented="NotImplemented";
		ErrorCodes.unsupportedOperation="UnsupportedOperation";
	})(ErrorCodes=Excel.ErrorCodes || (Excel.ErrorCodes={}));
})(Excel || (Excel={}));
var Excel;
(function (Excel) {
	var RequestContext=(function (_super) {
		__extends(RequestContext, _super);
		function RequestContext(url) {
			_super.call(this, url);
			this.m_workbook=new Excel.Workbook(this, OfficeExtension.ObjectPathFactory.createGlobalObjectObjectPath(this));
			this._rootObject=this.m_workbook;
		}
		Object.defineProperty(RequestContext.prototype, "workbook", {
			get: function () {
				return this.m_workbook;
			},
			enumerable: true,
			configurable: true
		});
		return RequestContext;
	})(OfficeExtension.ClientRequestContext);
	Excel.RequestContext=RequestContext;
	function run(batch) {
		return OfficeExtension.ClientRequestContext._run(function () { return new Excel.RequestContext(); }, batch);
	}
	Excel.run=run;
})(Excel || (Excel={}));


