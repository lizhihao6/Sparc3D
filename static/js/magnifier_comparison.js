// magnifier-comparison-per-video.js

// —— 全局错误捕获 ——
window.addEventListener('error', (e) => {
  console.error('[Global Error]', e.message, 'at', `${e.filename}:${e.lineno}`, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Promise Rejection]', e.reason);
});

class MagnifierComparison {
  constructor() {
    this.zoom = 3;
    this.isActive = false;
    this.enabled = false;              // 是否启用放大镜
    this.currentObjectGroup = null;
    this.activePrimary = null;
    this.methods = ['gt', 'ours_1024', 'ours_512', 'dora', 'trellis'];
    this.lastMouseEvent = null;         // 存储最后一次鼠标事件
  }

  init() {
    this.bindKeyEvents();
    this.bindMouseEvents();
  }

  bindKeyEvents() {
    // 按住 z 键时启用
    window.addEventListener('keydown', e => {
      if ((e.key === 'z' || e.key === 'Z') && !this.enabled) {
        this.enabled = true;
        // 如果鼠标已在 video 上，立即激活
        const ev = this.lastMouseEvent;
        if (ev) {
          const container = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.vidContainer');
          if (container && this.hasCompleteObjectGroup(container)) {
            this.activateMagnifier(container, ev);
          }
        }
      }
    });
    // 松开 z 键时禁用并隐藏放大镜
    window.addEventListener('keyup', e => {
      if (e.key === 'z' || e.key === 'Z') {
        this.enabled = false;
        if (this.isActive) this.deactivateMagnifier();
      }
    });
  }

  bindMouseEvents() {
    // 始终监听，更新 lastMouseEvent
    document.addEventListener('mousemove', e => {
      this.lastMouseEvent = e;
    });

    // 鼠标移入触发
    document.addEventListener('mouseover', e => {
      if (!this.enabled) return;
      const container = e.target.closest('.vidContainer');
      if (container && this.hasCompleteObjectGroup(container)) {
        this.activateMagnifier(container, e);
      }
    });

    // 鼠标移动更新或关闭
    document.addEventListener('mousemove', e => {
      if (!this.enabled || !this.isActive) return;
      const rect = this.activePrimary.getBoundingClientRect();
      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom
      ) {
        this.deactivateMagnifier();
      } else {
        this.updateMagnifier(e);
      }
    });

    // 鼠标移出也关闭
    document.addEventListener('mouseout', e => {
      if (!this.enabled || !this.isActive) return;
      const related = e.relatedTarget;
      if (!related || !related.closest || !related.closest('.vidContainer')) {
        this.deactivateMagnifier();
      }
    });
  }

  hasCompleteObjectGroup(container) {
    const video = container.querySelector('video');
    if (!video) return false;
    const baseSrc = video.src;
    return this.methods.every(method => {
      const url = baseSrc.replace(/\/(gt|ours_1024|ours_512|dora|trellis)\//, `/${method}/`);
      return this.videoExists(url);
    });
  }

  videoExists(src) {
    return videosAttributes.some(attr => src.endsWith(attr.src));
  }

  getObjectGroup(container) {
    const primary = container.querySelector('video');
    this.activePrimary = primary;
    const baseSrc = primary.src;
    const group = {};
    this.methods.forEach(method => {
      const url = baseSrc.replace(/\/(gt|ours_1024|ours_512|dora|trellis)\//, `/${method}/`);
      const vid = Array.from(document.querySelectorAll('video')).find(v => v.src === url);
      if (vid) {
        const canvas = vid.parentElement.querySelector('.videoMerge');
        vid.parentElement.style.position = 'relative';
        Object.assign(canvas.style, {
          position: 'absolute',
          display: 'none',
          border: '2px solid #000',
          borderRadius: '50%',
          overflow: 'hidden'
        });
        group[method] = { video: vid, canvas };
      }
    });
    return group;
  }

  activateMagnifier(container, event) {
    this.isActive = true;
    this.currentObjectGroup = this.getObjectGroup(container);
    // 同步并暂停所有
    const ref = this.currentObjectGroup[this.methods[0]]?.video;
    if (ref) {
      const t = ref.currentTime;
      Object.values(this.currentObjectGroup).forEach(({ video }) => {
        video.currentTime = t;
        video.pause();
      });
    }
    this.updateMagnifier(event);
  }

  updateMagnifier(event) {
    const rectPrimary = this.activePrimary.getBoundingClientRect();
    const rx = (event.clientX - rectPrimary.left) / rectPrimary.width;
    const ry = (event.clientY - rectPrimary.top) / rectPrimary.height;
    const size = 150;

    Object.values(this.currentObjectGroup).forEach(({ video, canvas }) => {
      const rectVid = video.getBoundingClientRect();
      const cx = rectVid.left + rx * rectVid.width;
      const cy = rectVid.top + ry * rectVid.height;

      Object.assign(canvas.style, {
        left: `${cx - size/2 - rectVid.left}px`,
        top: `${cy - size/2 - rectVid.top}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'block'
      });

      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      const vx = rx * video.videoWidth;
      const vy = ry * video.videoHeight;
      const srcSize = Math.min(video.videoWidth, video.videoHeight) / (this.zoom * 2);
      const sx = Math.max(0, Math.min(vx - srcSize/2, video.videoWidth - srcSize));
      const sy = Math.max(0, Math.min(vy - srcSize/2, video.videoHeight - srcSize));

      ctx.save();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(video, sx, sy, srcSize, srcSize, 0, 0, size, size);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    });
  }

  deactivateMagnifier() {
    this.isActive = false;
    if (this.currentObjectGroup) {
      Object.values(this.currentObjectGroup).forEach(({ video, canvas }) => {
        video.play().catch(() => {});
        canvas.style.display = 'none';
      });
    }
    this.currentObjectGroup = null;
    this.activePrimary = null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MagnifierComparison().init();
});
