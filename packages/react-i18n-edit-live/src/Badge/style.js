/**
 * @file: style
 * @author: Cuttle Cong
 * @date: 2017/12/19
 * @description: 
 */

module.exports = `
i18n, .i18n-badge {
  transition: box-shadow ease .4s;
  outline: 1px #ff3d3d dotted!important;
  outline-offset: -1px;
  position: relative;
}
.i18n-active {
  outline: 2px #ff3d3d solid;
  box-shadow: 0 0 7px rgba(255,61,61,.4),inset 0 0 0 1px rgba(255,61,61,.7),0 0 0 1px rgba(255,61,61,.7);
  outline-color: transparent;  
}
.i18n-badge-inner {
  position: absolute;
  display: inline-block;
  top: -8px;
  left: -10px;
  cursor: pointer;
  opacity: .8;
  width: 18px;
  height: 18px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMjVFQTRDNkUwMDcxMUUzQTMzNEYxNDRBQzVCQzMzNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMjVFQTRDN0UwMDcxMUUzQTMzNEYxNDRBQzVCQzMzNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNjQwQjA5RERDMzExRTNBMzM0RjE0NEFDNUJDMzM0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNjQwQjBBRERDMzExRTNBMzM0RjE0NEFDNUJDMzM0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aPulCwAAALlJREFUeNrsmDEOwCAIRYur9z+qs00Hk8ZIBRTQVOaq78OXqpBzvlYKWBnImwz2AAIAU4rX+psBpZRUQWKMB+gnQGWgNDBhGFDwaDhfIs1LVsO4eqiVGTMP1YKweVw8xBGlXrIejKmHKJlR8xDVM+Vb0z7UgzH1EBXG5F/GyYw6ELdMqh56JscEcIWFmQauF5eUPczeWQVCuimGPdTyDmWsWR8a7fDnTC0GOjfXbR4bVgI6L2ituAUYAGv9EaLCVOCXAAAAAElFTkSuQmCC);
  background-size: 18px 18px;
}

.i18n-modal-body-info {
  padding: 0 0 12px;
  font-size: 14px;
}
.i18n-modal-body {
  position: relative;
}
.i18n-lang-context {
  position: absolute;
  left: 15px;
  top: 12px;
}
.i18n-modal-body-key, .i18n-modal-body-logo {
  color: #999;
  margin: 0;
  text-align: right;
  padding: 10px 0;
}
.i18n-modal-body-key {
  text-align: right;
  font-size: 12px;
  padding-top: 0;
  max-width: 100%;
  overflow: auto;
  padding-bottom: 4px;
}
.i18n-modal-body-key > div {
  display: inline-block;
}
.i18n-modal-body {
  font-size: 14px;
  font-weight: 400;
}

.i18n-modal-wrap {
  max-width: 70%;
}
.i18n-modal-body-edit {
  outline: 0;
  outline-offset: 0;
  
  margin-left: 10px;
  min-height: 100px;
  display: block;
  width: 100%;
  max-height: 264px;
  overflow: hidden;
  resize: none;
  word-wrap: break-word;
  
  background: 0 0;
  padding: 12px 0px;
  border: 0;
  box-shadow: none;
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  margin: 0;
}

.i18n-modal-btn {
  padding: 6px 15px;
  display: inline-block;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  text-shadow: none;
  outline: none;

  color: #555;  
  background-color: #f5f4f0;
  background-image: none;
  box-shadow: 0 1px 0 rgba(255,255,255,.4);
  /* border: 1px solid rgba(0, 0, 0, 0.23); */
  cursor: pointer;
  
}

.i18n-modal-btn  + .i18n-modal-btn  {
  margin-left: 10px;
}

.i18n-modal-btn:hover {
  opacity: .8;
}
.i18n-modal-btn.sm {
  padding: 4px;
  font-size: 13px;
}
.i18n-modal-btn[disabled] {
  cursor: not-allowed;
  opacity: .5;
}
.i18n-left {
  text-align: left;
  float: left;
}
.i18n-right {
  float: right;
}
.i18n-right > span {
  margin-right: 12px;
  font-size: 13px;
  vertical-align: middle;
  color: #999;  
}
.i18n-modal-header {
  font-size: 15px;
}
.i18n-modal-footer::after {
  display: table;
  content: ' ';
  clear: both;
}
`