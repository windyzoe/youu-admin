import { createFromIconfontCN } from '@ant-design/icons';

// 从Iconfont的项目里拿js哦
const IconPro = createFromIconfontCN({
  scriptUrl: `//at.alicdn.com/t/font_2297611_u3c8naxov5p.js`,
  // scriptUrl: `${process.env.PUBLIC_URL}/iconfont.js`, // 在 iconfont.cn 上生成
});

export default IconPro;
