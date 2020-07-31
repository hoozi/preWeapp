export default {
  pages: [
    'pages/Apply/index',
    'pages/MyOrder/index'
  ],
  subpackages: [
    {
      root: 'pages/Service',
      pages: [
        'index'
      ]
    },
    {
      root: 'pages/ApplyInfo',
      pages: [
        'index'
      ]
    },
    {
      root: 'pages/InvoiceApply',
      pages: [
        'index'
      ]
    },
    {
      root: 'pages/Company',
      pages: [
        'index'
      ]
    }
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
        pagePath: 'pages/MyOrder/index',
        iconPath: 'assets/images/1.png',
        selectedIconPath: 'assets/images/1_a.png',
        text: '我的订单'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    backgroundColor: '#efefef',
    navigationBarBackgroundColor: '#2d75ff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  }
}
