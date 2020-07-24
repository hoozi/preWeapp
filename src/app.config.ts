export default {
  pages: [
    'pages/Apply/index',
    'pages/Invoice/index',
    'pages/Camera/index',
    'pages/Service/index',
    'pages/ApplyInfo/index'
  ],
  tabBar: {
    custom: true,
    color: '#bbb',
    selectedColor: '#6190e8',
    borderStyle: 'white',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/Apply/index',
        iconPath: 'assets/images/0.png',
        selectedIconPath: 'assets/images/0_a.png',
        text: '预提申请'
      },
      {
        pagePath: 'pages/Invoice/index',
        iconPath: 'assets/images/1.png',
        selectedIconPath: 'assets/images/1_a.png',
        text: '发票管理'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    backgroundColor: '#efefef',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
