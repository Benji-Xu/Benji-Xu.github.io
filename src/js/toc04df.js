document.addEventListener("DOMContentLoaded", function() {
  const tocContainer = document.querySelector(".toc-container");
  const tocToggle = document.querySelector(".toc-toggle");
  const tocContent = document.querySelector(".toc-content");
  const tocToggleIcon = document.querySelector(".toc-toggle-icon");

  // 获取所有标题
  const sections = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));

  // 如果标题数量大于 3，则显示 TOC
  if (sections.length > 3) {
    tocContainer.style.display = "block"; // 显示 TOC
  } else {
    return; // 如果标题不足，退出后续逻辑
  }

  let hasScrolled = false; // 标记是否已经滚动过

  // 检查设备类型
  const isMobile = window.innerWidth <= 768;

  // 设置初始状态
  if (isMobile) {
    tocContent.style.display = "none";
    tocToggleIcon.textContent = "▶️"; // 移动端默认折叠
  } else {
    tocContent.style.display = "block";
    tocToggleIcon.textContent = "🔽"; // PC端默认展开
  }

  // 点击事件
  tocToggle.addEventListener("click", function() {
    if (tocContent.style.display === "none") {
      tocContent.style.display = "block";
      tocToggleIcon.textContent = "🔽"; // 展开时三角形向下
    } else {
      tocContent.style.display = "none";
      tocToggleIcon.textContent = "▶️"; // 折叠时三角形向右
    }
  });

  const tocLinks = Array.from(document.querySelectorAll(".toc-container a"));

  function activateTocLink() {
    let activeSectionIndex = -1; // 默认没有任何section被激活

    // 遍历所有section，找到当前应该高亮的section
    for (let i = 0; i < sections.length; i++) {
      const sectionTop = sections[i].getBoundingClientRect().top;

      // 如果 section 在视口顶部上方，且其下一个section在视口顶部下方或其下一个section不存在
      if (sectionTop <= 100) {
        activeSectionIndex = i;
      } else {
        break; // 一旦找到一个section超出了视口顶部，后续的都不用再检查了
      }
    }

    // 去除所有链接的高亮
    tocLinks.forEach(link => {
      link.parentElement.classList.remove("toc-item-active");
      link.parentElement.style.backgroundColor = "transparent";
    });

    // 只有当找到有效的 activeSectionIndex 时才高亮
    if (activeSectionIndex !== -1) {
      const activeLink = tocLinks[activeSectionIndex];
      if (activeLink) {
        activeLink.parentElement.classList.add("toc-item-active");
        activeLink.parentElement.style.backgroundColor = "rgb(224 0 0 / 30%)"; // 高亮色块
      }
    }
  }

  // 监听滚动事件
  window.addEventListener("scroll", function() {
    if (!hasScrolled) {
      hasScrolled = true;
    }
    activateTocLink();
  });
});
