import { useEffect, useRef, useState } from "react";
import timelineDataRaw from "./data/timeline.json";
import qaDialoguesRaw from "./data/qa-dialogues.json";

const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;

const heroImages = [
  asset("hero-1.jpg"),
  asset("hero-2.jpg"),
  asset("hero-3.jpg"),
  asset("hero-4.jpg"),
  asset("hero-5.jpg"),
];

const timelineData = timelineDataRaw.map((item) => ({
  ...item,
  mediaSrc: item.mediaSrc ? asset(item.mediaSrc) : undefined,
  mediaItems: item.mediaItems?.map((media) => ({
    ...media,
    src: asset(media.src),
  })),
}));

const qaDialogues = qaDialoguesRaw.filter((group) => Array.isArray(group.messages) && group.messages.length > 0);

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
            <h3 className="timeline-experience text-[22px] font-semibold leading-[1.5] text-stone-900">
              {item.title}
            </h3>
            {item.description ? (
              <p className="timeline-description text-[16px] leading-7 text-stone-600">
                {item.description}
              </p>
            ) : null}
          </div>

          {item.mediaLayout === "single" ? (
            <button
              type="button"
              className="timeline-media-single"
              onClick={() => setPreviewImage({ kind: "image", src: item.mediaSrc, alt: item.title })}
            >
              <img src={item.mediaSrc} alt={item.title} className="timeline-media-single-image" />
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

function AskSection() {
  if (qaDialogues.length === 0) return null;

  return (
    <section className="qa-section" aria-labelledby="ask-section-title">
      <div className="qa-section-header">
        <h2 id="ask-section-title" className="qa-section-title">
          You might want to ask
        </h2>
        <p className="qa-section-subtitle">你可能想问</p>
      </div>

      <div className="qa-dialogue-groups">
        {qaDialogues.map((group) => (
          <div key={group.id} className="qa-dialogue-group">
            {group.messages.map((message, index) => {
              const isQuestion = message.role === "q";

              return (
                <div
                  key={`${group.id}-${message.role}-${index}`}
                  className={`qa-message-row ${isQuestion ? "question" : "answer"}`}
                >
                  <div className={`qa-bubble ${isQuestion ? "question" : "answer"}`}>
                    <p className="qa-message-text">{message.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
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
                <h1 className="max-w-4xl font-['Inter'] text-[72px] font-extrabold leading-[0.92] tracking-[-0.06em] text-stone-950">
                  Hi, I&apos;m
                </h1>
                <h2 className="max-w-4xl font-['Inter'] text-[80px] font-extrabold leading-[0.92] tracking-[-0.06em] text-[#1d4ed8]">
                  SevenYeah.
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
                <div key={`${item.time}-${item.title}`} data-timeline-index={index}>
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

        <AskSection />
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
