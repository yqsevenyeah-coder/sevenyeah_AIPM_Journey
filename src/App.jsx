import { useEffect, useRef, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;

const heroImages = [
  asset("hero-1.jpg"),
  asset("hero-2.jpg"),
  asset("hero-3.jpg"),
  asset("hero-4.jpg"),
  asset("hero-5.jpg"),
];

function parseExperience(experience) {
  const match = experience.match(/^([^：:]+)[：:]\s*(.+)$/);
  if (!match) {
    return { title: experience, description: "" };
  }

  return {
    title: match[1].trim(),
    description: match[2].trim(),
  };
}

const timelineData = [
  {
    time: "2022.09–2025.06",
    year: "2022",
    type: "Industry",
    experience: "基于大语言模型的语文作文评阅系统：构建作文评分与反馈系统，建立多维评测体系并验证效果",
    abilities: ["Evaluation", "EdTech", "Research"],
    mediaLayout: "single",
    mediaSrc: asset("8-1.png"),
  },
  {
    time: "2023.06–2023.08",
    year: "2023",
    type: "Industry",
    experience:
      "Langchain私域问答机器人：搭建“问答库→向量检索→匹配回复”完整链路，实现客服自动化闭环",
    abilities: ["LLM", "RAG", "System Design"],
    mediaLayout: "single",
    mediaSrc: asset("9-1.png"),
  },
  {
    time: "2023.07–2023.08",
    year: "2023",
    type: "Industry",
    experience:
      "AI-agent小镇游戏：设计12个AI角色及记忆机制，构建多Agent互动系统与Prompt体系",
    abilities: ["Agent", "Persona", "Memory"],
    mediaLayout: "single",
    mediaSrc: asset("5-1.png"),
  },
  {
    time: "2024.04–2024.09",
    year: "2024",
    type: "Industry",
    experience:
      "永劫无间手游：AI队友：设计AI指令回传机制与行为反馈逻辑，优化人机协同体验与可感知性",
    abilities: ["Interaction", "LLM", "Behavior Design"],
    projectLink:
      "https://www.bilibili.com/video/BV13M4m1U7wW/?spm_id_from=333.337.search-card.all.click",
    mediaLayout: "single",
    mediaSrc: asset("6-1.png"),
  },
  {
    time: "2025.03–2025.09",
    year: "2025",
    type: "Industry",
    experience: "设计并推动AI音乐分析应用落地；参与古籍数字化AI平台设计与实施",
    abilities: ["Product", "B2B", "Deployment"],
    mediaLayout: "dual",
    mediaSize: "feature-left",
    mediaFit: "contain",
    mediaItems: [
      { src: asset("10-1.png"), alt: "AI音乐分析应用项目展示" },
      { src: asset("9-2.png"), alt: "古籍数字化AI平台项目展示" },
    ],
  },
  {
    time: "2026.02.13",
    year: "2026",
    type: "Personal",
    experience: "OpenClaw部署：实现文件整理自动化，探索Agent在真实生活场景中的实用价值",
    abilities: ["Agent", "Tooling", "Automation"],
    mediaLayout: "dual",
    mediaSize: "compact",
    mediaItems: [
      { src: asset("4-1.jpg"), alt: "OpenClaw project image 1" },
      { src: asset("4-2.jpg"), alt: "OpenClaw project image 2" },
    ],
  },
  {
    time: "2026.02.20",
    year: "2026",
    type: "Personal",
    experience:
      "Coze部署项目级工作流：获取某公众号最近文章→总结→飞书自动化流程，并结合OpenClaw实现定时触发",
    abilities: ["Workflow", "Orchestration", "Automation"],
    mediaLayout: "dual",
    mediaItems: [
      { src: asset("image2-1.png"), alt: "Workflow project image 1" },
      { src: asset("image2-2.png"), alt: "Workflow project image 2" },
    ],
  },
  {
    time: "2026.03.03",
    year: "2026",
    type: "Personal",
    experience:
      "Codex Vibe Coding：玄学命理网站，输入生辰进行八字排盘，生成建议并支持咨询",
    abilities: ["Prototyping", "Prompt", "Product Thinking"],
    projectLink: "https://github.com/yqsevenyeah-coder/sevenyeah_bazi.git",
    mediaLayout: "triple",
    mediaItems: [
      { src: asset("7-1.jpg"), alt: "Mystic project image 1" },
      { src: asset("7-2.jpg"), alt: "Mystic project image 2" },
      { src: asset("7-3.jpg"), alt: "Mystic project image 3" },
    ],
  },
  {
    time: "2026.03.13",
    year: "2026",
    type: "Personal",
    experience: "AI家教Agent：搭建教育Agent系统，设计学生分层、辅导、测试等流程",
    abilities: ["Agent", "EdTech", "Interaction"],
    projectLink: "https://github.com/yqsevenyeah-coder/PLETutor_agent",
    mediaLayout: "single",
    mediaSrc: asset("3-1.png"),
  },
  {
    time: "2026.03.28",
    year: "2026",
    type: "Personal",
    experience:
      "Codex Vibe Coding：视频学习工具，实现上传视频→逐字稿→脑图→时间锚点评论的多模态学习产品",
    abilities: ["Multimodal", "Product", "Interaction"],
    projectLink: "https://github.com/yqsevenyeah-coder/video_aistu",
    mediaLayout: "single",
    mediaSrc: asset("image1.png"),
  },
];

const timelineEntries = [...timelineData].reverse();

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function TimelineCard({ item, index, activeIndex, setActiveIndex, setPreviewImage }) {
  const [ref, visible] = useReveal();
  const isActive = activeIndex === index;
  const sideClass = index % 2 === 0 ? "timeline-item left" : "timeline-item right";
  const dotClass = item.type === "Personal" ? "lime" : "blue";
  const { title, description } = parseExperience(item.experience);

  return (
    <article ref={ref} className={sideClass} onMouseEnter={() => setActiveIndex(index)}>
      <div className={`timeline-year ${visible ? "revealed" : ""}`}>{item.year}</div>
      <div className={`timeline-dot ${dotClass} ${isActive ? "active" : ""}`} />
      <div className={`timeline-card group ${visible ? "revealed" : ""} ${isActive ? "active" : ""}`}>
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="timeline-type">{item.type}</span>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-stone-400">
              {item.time}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="timeline-experience text-[24px] font-semibold leading-[1.5] text-stone-900">
              {title}
            </h3>
            {description ? (
              <p className="timeline-description text-[16px] leading-7 text-stone-600">
                {description}
              </p>
            ) : null}
          </div>

          {item.mediaLayout === "single" ? (
            <button
              type="button"
              className="timeline-media-single"
              onClick={() => setPreviewImage({ kind: "image", src: item.mediaSrc, alt: title })}
            >
              <img src={item.mediaSrc} alt={title} className="timeline-media-single-image" />
            </button>
          ) : item.mediaLayout === "dual" ? (
            <div
              className={`timeline-media-dual ${item.mediaSize ? item.mediaSize : ""} ${
                item.mediaFit === "contain" ? "contain-fit" : ""
              }`}
            >
              {item.mediaItems.map((media, mediaIndex) => (
                <button
                  key={media.src}
                  type="button"
                  className={`timeline-media-dual-card ${mediaIndex === 0 ? "wide" : "tall"}`}
                  onClick={() => setPreviewImage({ kind: "image", src: media.src, alt: media.alt })}
                >
                  <img
                    src={media.src}
                    alt={media.alt}
                    className={`timeline-media-dual-image ${
                      item.mediaFit === "contain" ? "contain" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : item.mediaLayout === "triple" ? (
            <div className="timeline-media-gallery-real">
              <button
                type="button"
                className="timeline-media-card-real primary"
                onClick={() =>
                  setPreviewImage({ kind: "image", src: item.mediaItems[0].src, alt: item.mediaItems[0].alt })
                }
              >
                <img
                  src={item.mediaItems[0].src}
                  alt={item.mediaItems[0].alt}
                  className="timeline-media-real-image"
                />
              </button>
              <div className="timeline-media-stack">
                {item.mediaItems.slice(1).map((media) => (
                  <button
                    key={media.src}
                    type="button"
                    className="timeline-media-card-real secondary"
                    onClick={() => setPreviewImage({ kind: "image", src: media.src, alt: media.alt })}
                  >
                    <img src={media.src} alt={media.alt} className="timeline-media-real-image" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="timeline-media-gallery">
              <button
                type="button"
                className="timeline-media-card primary"
                onClick={() => setPreviewImage({ kind: "placeholder", variant: "primary" })}
              >
                <div className="timeline-media-grid">
                  <span className="timeline-media-pill" />
                  <span className="timeline-media-pill short" />
                </div>
              </button>
              <div className="timeline-media-stack">
                <button
                  type="button"
                  className="timeline-media-card secondary"
                  onClick={() => setPreviewImage({ kind: "placeholder", variant: "secondary" })}
                >
                  <div className="timeline-media-orb" />
                </button>
                <button
                  type="button"
                  className="timeline-media-card tertiary"
                  onClick={() => setPreviewImage({ kind: "placeholder", variant: "tertiary" })}
                >
                  <div className="timeline-media-grid compact">
                    <span className="timeline-media-pill" />
                    <span className="timeline-media-pill short" />
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5">
            {item.abilities.map((keyword) => (
              <span key={keyword} className="chip">
                {keyword}
              </span>
            ))}
          </div>

          {item.projectLink ? (
            <div className="timeline-link-row">
              <span className="timeline-link-label">项目链接</span>
              <a
                href={item.projectLink}
                target="_blank"
                rel="noreferrer"
                className="timeline-link"
              >
                <span className="timeline-link-text">View Project</span>
                <span className="timeline-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-timeline-index]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveIndex(Number(visibleEntries[0].target.dataset.timelineIndex));
        }
      },
      {
        threshold: [0.35, 0.5, 0.7],
        rootMargin: "-10% 0px -20% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isContactOpen && !previewImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContactOpen, previewImage]);

  const previewStyles = {
    primary: "preview-visual primary",
    secondary: "preview-visual secondary",
    tertiary: "preview-visual tertiary",
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-stone-900">
      <div className="page-shell">
        <section className="hero-grid">
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-stone-500 md:text-sm">
                Personal Portfolio
              </p>
              <div className="space-y-2">
                <h1 className="max-w-4xl text-[58px] font-semibold leading-[0.92] tracking-[-0.06em] text-stone-950 md:text-[72px]">
                  Hi, I&apos;m
                </h1>
                <h2 className="max-w-4xl text-[58px] font-semibold leading-[0.92] tracking-[-0.06em] text-[#1d4ed8] md:text-[72px]">
                  sevenyeah.
                </h2>
              </div>
              <p className="max-w-3xl text-[16px] leading-8 text-stone-600 md:text-[18px]">
                AIPM : 好未来➡️网易➡️超星 / 南邮教育技术硕士专业第一 / 电商创业 / 游戏爱好者 / 玄学爱好者
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#ai-journey-timeline"
                className="rounded-2xl bg-stone-950 px-6 py-4 text-[14px] font-medium text-white shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
              >
                See My Journey
              </a>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="rounded-2xl border border-stone-300/80 bg-white/80 px-6 py-4 text-[14px] font-medium text-stone-700 backdrop-blur"
              >
                Get in touch
              </button>
            </div>
          </div>

          <div className="hero-collage">
            <div className="floating-card floating-image-card col-span-7 row-span-4 text-white">
              <img src={heroImages[3]} alt="Portfolio snapshot 4" className="hero-card-image" />
            </div>
            <div className="floating-card floating-image-card col-span-5 row-span-4 bg-white">
              <img src={heroImages[0]} alt="Portfolio snapshot 1" className="hero-card-image" />
            </div>
            <div className="floating-card floating-image-card col-span-6 row-start-5 row-span-3">
              <img src={heroImages[4]} alt="Portfolio snapshot 5" className="hero-card-image" />
            </div>
            <div className="floating-card floating-image-card col-start-7 col-span-6 row-start-5 row-span-3 overflow-hidden">
              <img src={heroImages[2]} alt="Portfolio snapshot 3" className="hero-card-image" />
            </div>
          </div>
        </section>

        <section id="ai-journey-timeline" className="timeline-section">
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
                Timeline
              </p>
              <h2 className="mt-3 text-[48px] font-semibold tracking-[-0.04em] leading-none text-stone-950">
                我的 AI 产品之路
              </h2>
              <p className="mt-4 text-[18px] text-stone-500">
                My AI Product Journey
              </p>
            </div>
          </div>

          <div className="timeline-shell">
            <div className="timeline-line">
              <div
                className="timeline-line-active"
                style={{
                  height: `${((activeIndex + 1) / timelineEntries.length) * 100}%`,
                }}
              />
            </div>

            <div className="timeline-grid">
              {timelineEntries.map((item, index) => (
                <div key={`${item.time}-${item.experience}`} data-timeline-index={index}>
                  <TimelineCard
                    item={item}
                    index={index}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    setPreviewImage={setPreviewImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {isContactOpen ? (
        <div className="contact-modal-backdrop" onClick={() => setIsContactOpen(false)}>
          <div
            className="contact-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              type="button"
              className="contact-close"
              onClick={() => setIsContactOpen(false)}
              aria-label="Close contact dialog"
            >
              ×
            </button>

            <div className="contact-modal-header">
              <p className="contact-kicker">Get in touch</p>
              <h3 id="contact-modal-title" className="contact-title">
                很高兴认识你
              </h3>
              <p className="contact-subtitle">
                欢迎通过微信或邮箱联系我，聊 AI 产品、Agent、工作流，或者任何有意思的想法。
              </p>
            </div>

            <div className="contact-cards">
              <div className="contact-card">
                <p className="contact-label">微信</p>
                <p className="contact-value">15208140835</p>
              </div>
              <div className="contact-card">
                <p className="contact-label">邮箱</p>
                <p className="contact-value">1034072604@qq.com</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div className="contact-modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div
            className="image-preview-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              type="button"
              className="contact-close"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
            >
              ×
            </button>
            {previewImage.kind === "image" ? (
              <img
                src={previewImage.src}
                alt={previewImage.alt || "Preview image"}
                className="image-preview-asset"
              />
            ) : (
              <div className={previewStyles[previewImage.variant]}>
                <div className="timeline-media-grid">
                  <span className="timeline-media-pill" />
                  <span className="timeline-media-pill short" />
                </div>
                <div className="timeline-media-orb" />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
