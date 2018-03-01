/**
 * @file: style
 * @author: Cuttle Cong
 * @date: 2017/12/19
 * @description: 
 */

module.exports = `
.i18n-modal-wrap {
  position: fixed;
  top: 60px;
  /*bottom: 20px;*/
  box-shadow: 0 25px 50px rgba(0,0,0,.3), 0 0 30px rgba(0,0,0,.25);
  border: 1px solid rgba(0,0,0,.15);
  border-bottom-color: rgba(0,0,0,.18);
  overflow-y: auto;
  background-color: #fff;
  z-index: 10000;
  
  min-width: 500px;
  margin-left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
}

@media screen and (max-width: 600px) {
    .i18n-modal-wrap {
        min-width: 95%;
    }
}

.i18n-modal-container {
}
.i18n-modal-sep {
  margin-left: -20px;
  margin-right: -20px;
  height: 1px;
  background-color: #d2d2d2;
}
.i18n-modal-body {
  padding: 15px 20px 20px;
}
.i18n-modal-footer {
  border-top: 1px solid #f0f0f0;
  padding: 6px 20px 8px;
}
.i18n-modal-header {
  position: relative;
  background-color: #e6e6e6;
  border-bottom: 1px solid #d2d2d2;
  background-color: #eee;
  padding: 10px 70px 10px 20px;
}
.i18n-modal-header-buttons {
  position: absolute;
  right: 12px;
  top: 0;
  bottom: 0;
}
.i18n-modal-header-btn {
  cursor: pointer;
  display: block;
  height: 100%;
  text-align: center;
  text-decoration: none;
  vertical-align: top;
  color: #999;
  padding: 0px 10px;
}
.i18n-modal-header-btn:hover {
  color: #333;
  text-decoration: none;
}
.i18n-modal-header-btn:last-child {
  padding-right: 0;
}
.i18n-modal-header-btn.close-btn {
 font-size: 24px;
 font-weight: 400;
}
`