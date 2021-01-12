/*
 * @Author: your name
 * @Date: 2019-12-31 15:28:26
 * @LastEditTime : 2020-01-15 15:31:53
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /contract_admin_console/src/settings.js
 */
module.exports = {
  title: 'Vue Element Admin',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  api_url: 'https://contract-api.zhonganonline.com', // 'http://51963-za-napoleon.test.za.biz''https://contract-api.zhonganonline.com'
  ws_host: 'ws://55850-za-napoleon.test.za.biz', // 55850-za-napoleon.test.za.biz 127.0.0.1:8080 ws://127.0.0.1:8080
  engine_host: 'http://za-quality-contract-engine.pub.za.biz' // 'http://55850-za-quality-contract-engine.test.za.biz'
}
