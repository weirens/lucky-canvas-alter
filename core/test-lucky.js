const Lucky = require('./dist/index.umd.js');

// 1. 打印导出对象结构
console.log('导出对象键名:', Object.keys(Lucky));

// 2. 准备完整配置
const config = {
  width: 600,
  height: 600,
  rows: 3,
  cols: 3,
  prizes: [
    { x: 0, y: 0, fonts: [{ text: "奖品1" }] },
    { x: 1, y: 0, fonts: [{ text: "奖品2" }] },
    { x: 2, y: 0, fonts: [{ text: "奖品3" }] }
  ],
  blocks: [{ padding: "10px", background: "#f5f5f5" }],
  buttons: [{ radius: "40%" }]
};

// 3. 尝试三种初始化方式
try {
  // 方式1：作为命名导出
  const grid1 = new Lucky.LuckyGrid(config);
  console.log('命名导出方式成功');
} catch (e) {
  console.log('命名导出方式失败:', e.message);
  
  try {
    // 方式2：作为默认导出
    const grid2 = new Lucky.default(config);
    console.log('默认导出方式成功');
  } catch (e) {
    console.log('默认导出方式失败:', e.message);
    
    try {
      // 方式3：直接调用
      const grid3 = new Lucky(config);
      console.log('直接调用方式成功');
    } catch (e) {
      console.log('所有初始化方式均失败，请检查构建输出');
      console.error(e);
    }
  }
}