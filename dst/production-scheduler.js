if(typeof exports === 'undefined' && typeof window !== 'undefined') var exports = window;
'use strict';

dhtmlxEvent(window, 'load', function () {
  //window.onload = function(){
  window.dhx4.skin = 'dhx_web';
  var main_layout = new dhtmlXLayoutObject(document.body, '2E');

  var event_calender = main_layout.cells('a');
  //event_calender.hideHeader();
  var scheduler = event_calender.attachScheduler();
  scheduler.config.day_date = '%D, %F %j';
  scheduler.config.default_date = '%j %M %Y';
  scheduler.config.hour_date = '%H:%i';
  scheduler.config.details_on_create = true;
  scheduler.config.show_loading = true;
  scheduler.config.details_on_dblclick = true;
  //  scheduler.load('./data/scheduler.xml');

  var cell_2 = main_layout.cells('b');
  var form_1 = cell_2.attachForm();
  //form_1.loadStruct('./data/form.xml');

  var toolbar_1 = main_layout.attachToolbar();
  //  toolbar_1.setIconsPath('./codebase/imgs/');

  //  toolbar_1.loadStruct('./data/toolbar.xml', function() {});
  //  */
  var ribbon_1 = main_layout.attachRibbon({
    icons_path: "./imgs/"
  });
  //};
});