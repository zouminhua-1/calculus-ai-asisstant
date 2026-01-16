export const introPanelHtml = `
  <div class="deep-chat-temporary-message" style="
    padding: 24px 16px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ">
    <div style="margin-bottom: 20px;">
      <div style="
        width: 56px;
        height: 56px;
        background: #e6f4ff;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px auto;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1677ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </div>
      <h3 style="margin: 0; color: #1a1a1a; font-size: 1.2rem; font-weight: 700; text-align: center;">
        AI 影像分析助手
      </h3>
      <p style="margin: 4px 0 0 0; color: #8c8c8c; font-size: 12px; text-align: center; letter-spacing: 0.5px;">
        MEDICAL AI ANALYST
      </p>
    </div>

    <div style="
      background: #f8fafc;
      border-radius: 16px;
      padding: 16px;
      text-align: left;
    ">
      <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
        <span style="background: #1677ff; color: white; width: 20px; height: 20px; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0; margin-top: 2px;">1</span>
        <p style="margin: 0; color: #434343; font-size: 14px; line-height: 1.5;">
          点击下方 图片按钮
        </p>
      </div>
      <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
        <span style="background: #1677ff; color: white; width: 20px; height: 20px; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0; margin-top: 2px;">2</span>
        <p style="margin: 0; color: #434343; font-size: 14px; line-height: 1.5;">
          上传您的 <b>超声/CT 检查报告</b> 照片
        </p>
      </div>
    </div>

    <div style="margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 6px;">
      <span style="width: 6px; height: 6px; background: #52c41a; border-radius: 50%;"></span>
      <span style="color: #8c8c8c; font-size: 11px;">隐私加密处理 · 结果仅供参考</span>
    </div>
  </div>
`;
