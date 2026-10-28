import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [state, setState] = useState({ on: {}, seen: {}, armed: false });

  useEffect(() => {
    const t = setTimeout(() => observe(), 60);
    return () => {
      clearTimeout(t);
      if (spy) spy.disconnect();
      if (rv) rv.disconnect();
    };
  }, []);

  let spy: IntersectionObserver | undefined;
  let rv: IntersectionObserver | undefined;

  const observe = () => {
    const els = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    spy = new IntersectionObserver(
      (entries) => {
        const on = Object.assign({}, state.on);
        let changed = false;
        entries.forEach((e) => {
          if (on[e.target.id] !== e.isIntersecting) {
            on[e.target.id] = e.isIntersecting;
            changed = true;
          }
        });
        if (changed) setState((s) => ({ ...s, on }));
      },
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 }
    );
    els.forEach((el) => spy!.observe(el));

    if (!reduce) {
      rv = new IntersectionObserver(
        (entries) => {
          const seen = Object.assign({}, state.seen);
          let changed = false;
          entries.forEach((e) => {
            if (e.isIntersecting && !seen[e.target.id]) {
              seen[e.target.id] = true;
              changed = true;
              rv!.unobserve(e.target);
            }
          });
          if (changed) setState((s) => ({ ...s, seen }));
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 }
      );
      els.forEach((el) => rv!.observe(el));
      setState((s) => ({ ...s, armed: true }));
    }
  };

  const dot = {};
  const rv_obj = {};
  ["workflow", "integrations", "features", "backlog"].forEach((id) => {
    dot[id] = state.on[id] ? "dot on" : "dot";
    rv_obj[id] = state.seen[id] ? "in" : "";
  });

  return (
    <div
      className={state.armed ? "page armed" : "page"}
      style={{
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: "#0F1B2D",
        background: "#FFFFFF",
        width: "100%",
        lineHeight: 1.5,
      }}
    >
      <style>{`
        body{margin:0;background:#FFFFFF}
        a{color:#0F1B2D}a:hover{color:#0F1B2D}

        .btn-p{position:relative;overflow:hidden;background:linear-gradient(180deg,#FFB240 0%,#FF9900 100%);box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 6px 16px -6px rgba(255,153,0,.55);transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
        .btn-p::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-130%);pointer-events:none}
        .btn-p:hover{background:linear-gradient(180deg,#FFA51F 0%,#F08C00 100%);transform:translateY(-2px);box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 14px 28px -8px rgba(255,153,0,.7)}
        .btn-p:hover::after{transform:translateX(130%);transition:transform .9s ease}
        .btn-p:active{transform:translateY(0) scale(.98);box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 3px 8px -4px rgba(255,153,0,.6)}
        .btn-s{transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease;background:rgba(255,255,255,.7);box-shadow:0 0 0 1px #E3E8F0}
        .btn-s:hover{background:#FFFFFF;color:#13315C;transform:translateY(-2px);box-shadow:0 0 0 1px #C9D3E3,0 10px 22px -10px rgba(15,27,45,.3)}
        .btn-s:active{transform:translateY(0) scale(.98);box-shadow:0 0 0 1px #C9D3E3}

        .ul{position:relative}
        .ul::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;border-radius:2px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .25s ease}
        .ul:hover::after{transform:scaleX(1)}

        @keyframes rde-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        .float{animation:rde-float 4s ease-in-out infinite}

        @keyframes rde-fadein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .fadein{animation:rde-fadein .7s ease-out both}
        .fadein-2{animation:rde-fadein .7s ease-out .12s both}
        .fadein-3{animation:rde-fadein .7s ease-out .24s both}

        @keyframes rde-dot{0%{box-shadow:0 0 0 0 rgba(255,153,0,.55);transform:scale(1)}40%{transform:scale(1.35)}100%{box-shadow:0 0 0 9px rgba(255,153,0,0);transform:scale(1)}}
        .dot{display:inline-block;width:7px;height:7px;border-radius:99px;background:#1D2B45;transition:background .3s ease}
        .dot.on{background:#FF9900;animation:rde-dot .9s ease-out 1}

        .armed .rv{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
        .armed .rv.in{opacity:1;transform:none}

        .card{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
        .card:hover{transform:translateY(-6px);box-shadow:0 2px 4px rgba(15,27,45,.05),0 24px 48px -16px rgba(15,27,45,.24) !important}
        .itile{transition:transform .22s ease}
        .card:hover .itile{transform:scale(1.05)}

        .tool{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
        .tool .logo{transition:transform .22s ease}
        .tool:hover{transform:translateY(-5px);box-shadow:0 20px 40px -18px rgba(15,27,45,.25) !important}
        .tool:hover .logo{transform:scale(1.08)}
        .t-zen:hover{border-color:#0E9384 !important}
        .t-mix:hover{border-color:#2F6FED !important}
        .t-gs:hover{border-color:#16A34A !important}
        .t-jira:hover{border-color:#1D5FD6 !important}
        @keyframes rde-soft{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.96)}}
        .slack:hover .planned{animation:rde-soft 1.6s ease-in-out infinite}

        @media (max-width: 760px){.navlinks{display:none !important}.brandname{display:none}}
        @media (max-width: 640px){.btn{width:100%;justify-content:center;box-sizing:border-box}.cta-row{flex-direction:column;align-items:stretch !important}.navcta{padding:0 14px !important;font-size:14px !important;min-height:42px !important}}
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{animation:none !important;transition:none !important}
          .armed .rv{opacity:1 !important;transform:none !important}
          .card:hover,.tool:hover,.btn-p:hover,.btn-s:hover{transform:none !important}
          .card:hover .itile,.tool:hover .logo{transform:none !important}
        }
      `}</style>

      {/* NAV (sticky) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #F1E7DA",
          padding: "0 clamp(16px, 5vw, 80px)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            height: "72px",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.01em",
              flex: "1 1 0",
              minWidth: 0,
              textDecoration: "none",
              color: "#0F1B2D",
            }}
          >
            <img
              className="float"
              src="/rde-logo.png"
              alt="RDE logo"
              width="40"
              height="40"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "block",
              }}
            />
            <span
              className="brandname"
              style={{ whiteSpace: "nowrap" }}
            >
              Revenue Discovery Engine
            </span>
          </a>
          <div
            className="navlinks"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <a
              className="ul"
              href="#workflow"
              style={{ color: "#1D2B45", textDecoration: "none" }}
            >
              Workflow
            </a>
            <a
              className="ul"
              href="#integrations"
              style={{ color: "#1D2B45", textDecoration: "none" }}
            >
              Integrations
            </a>
            <a
              className="ul"
              href="#features"
              style={{ color: "#1D2B45", textDecoration: "none" }}
            >
              Features
            </a>
          </div>
          <div
            style={{
              flex: "1 1 0",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link
              className="btn-p navcta"
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                padding: "0 20px",
                color: "#0F1B2D",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View the dashboard
            </Link>
          </div>
        </nav>
      </div>

      {/* 1. HERO */}
      <header
        style={{
          background:
            "radial-gradient(70% 70% at 50% 0%, #FFE9CC 0%, #FFF5E8 38%, #FFFFFF 78%)",
          padding:
            "clamp(96px, 13vw, 184px) clamp(16px, 5vw, 80px) clamp(104px, 13vw, 184px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "28px",
          }}
        >
          <span
            className="fadein"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#FFFFFF",
              border: "1px solid #F3DEC2",
              boxShadow: "0 1px 3px rgba(194,94,0,.08)",
              borderRadius: "999px",
              padding: "7px 16px 7px 12px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#7A3E00",
            }}
          >
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#C25E00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 1.5l1.6 4.9L14.5 8l-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6z"></path>
            </svg>
            AI product discovery
          </span>
          <h1
            className="fadein-2"
            style={{
              margin: 0,
              fontSize: "clamp(44px, 7.2vw, 100px)",
              lineHeight: 1.0,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              maxWidth: "1060px",
              color: "#0F1B2D",
            }}
          >
            Find the customer problems that cost the most.
          </h1>
          <p
            className="fadein-3"
            style={{
              margin: 0,
              fontSize: "clamp(17px, 1.8vw, 21px)",
              lineHeight: 1.5,
              color: "#3B4A63",
              maxWidth: "620px",
            }}
          >
            Connects customer feedback to revenue impact, so product teams fix what matters first.
          </p>
          <div
            className="cta-row fadein-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px 16px",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <Link
              className="btn btn-p"
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "56px",
                padding: "0 30px",
                color: "#0F1B2D",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "17px",
                textDecoration: "none",
              }}
            >
              View the dashboard
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10h12M11 5l5 5-5 5"></path>
              </svg>
            </Link>
            <a
              className="btn btn-s"
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "56px",
                padding: "0 26px",
                color: "#0F1B2D",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "17px",
                textDecoration: "none",
              }}
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M10 8.5v7l5.5-3.5z"></path>
              </svg>
              Watch the walkthrough
            </a>
          </div>
        </div>
      </header>

      {/* 2. WORKFLOW */}
      <section
        id="workflow"
        style={{
          background: "#FFFFFF",
          padding: "clamp(80px, 10vw, 136px) clamp(16px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div
            className={`rv ${rv_obj["workflow"]}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1D2B45",
                background: "#F4F7FB",
                border: "1px solid #DDE4EE",
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              <span aria-hidden="true" className={dot["workflow"]}></span>
              WORKFLOW
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(34px, 4.6vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                maxWidth: "760px",
              }}
            >
              From raw feedback to a ranked backlog.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              { num: "01", title: "Ingest", desc: "Pull in customer complaints and support tickets.", bg: "#E3F5F2", color: "#0B6B61" },
              { num: "02", title: "Protect", desc: "Mask personal data before any model reads the text.", bg: "#E6ECF6", color: "#0F1B2D" },
              { num: "03", title: "Quantify", desc: "Calculate revenue at risk in code, never by the model.", bg: "#FEF0D7", color: "#93470A" },
              { num: "04", title: "Prioritise", desc: "Rank problem themes by revenue at risk.", bg: "#FDE8E6", color: "#A8261B" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rv ${rv_obj["workflow"]}`}
                style={{ transitionDelay: `${80 + idx * 80}ms` }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    background: "#FFFFFF",
                    border: "1px solid #E3E8F0",
                    borderRadius: "22px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    boxShadow:
                      "0 1px 2px rgba(15,27,45,.04), 0 10px 28px -14px rgba(15,27,45,.16)",
                  }}
                >
                  <span
                    className="itile"
                    style={{
                      alignSelf: "flex-start",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "15px",
                      fontWeight: 600,
                      background: item.bg,
                      color: item.color,
                      borderRadius: "12px",
                      padding: "8px 12px",
                    }}
                  >
                    {item.num}
                  </span>
                  <h3
                    style={{
                      margin: "6px 0 0",
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      lineHeight: 1.5,
                      color: "#3B4A63",
                      maxWidth: "230px",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTEGRATIONS */}
      <section
        id="integrations"
        style={{
          background: "#FFF8EF",
          padding: "clamp(80px, 10vw, 136px) clamp(16px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <div
            className={`rv ${rv_obj["integrations"]}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1D2B45",
                background: "#FFFFFF",
                border: "1px solid #F1E2CE",
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              <span aria-hidden="true" className={dot["integrations"]}></span>
              INTEGRATIONS
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(34px, 4.6vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                maxWidth: "820px",
              }}
            >
              Built to plug into the tools PMs already use.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { name: "Zendesk", type: "Support tickets", cls: "t-zen", color: "#0E9384", bg: "#E3F5F2", icon: "M4 12a8 8 0 0 1 16 0M2.5 12h4v6a1.5 1.5 0 0 0 3 0M17.5 12h4v6a1.5 1.5 0 0 0-3 0" },
              { name: "Mixpanel", type: "Product analytics", cls: "t-mix", color: "#2F6FED", bg: "#E7EFFD", icon: "M3 3v18h18M7 15l4-4 3 3 5-6" },
              { name: "Google Sheets", type: "Data source", cls: "t-gs", color: "#16A34A", bg: "#E5F6EA", icon: "M3 3h18v18a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 21zM3 9h18M3 15h18M9 9v12" },
              { name: "Jira", type: "Backlog handoff", cls: "t-jira", color: "#1D5FD6", bg: "#E6EEFC", icon: "M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4zM9 6v12" },
              { name: "Slack", type: "Weekly summary", cls: "slack", color: "#C2185B", bg: "#FCE8EF", icon: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 10h6M9 13.5h4", isPlanned: true },
            ].map((tool, idx) => (
              <div
                key={idx}
                className={`rv ${rv_obj["integrations"]}`}
                style={{ transitionDelay: `${80 + idx * 80}ms` }}
              >
                <div
                  className={`tool ${tool.cls}`}
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    background: tool.isPlanned ? "#FFFCF8" : "#FFFFFF",
                    border: "1.5px solid #EFE6DA",
                    borderRadius: "22px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    boxShadow: tool.isPlanned
                      ? "none"
                      : "0 1px 2px rgba(15,27,45,.04), 0 10px 28px -16px rgba(15,27,45,.14)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <div
                      className="logo"
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "15px",
                        background: tool.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={tool.color}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={tool.icon}></path>
                      </svg>
                    </div>
                    {tool.isPlanned && (
                      <span
                        className="planned"
                        style={{
                          display: "inline-block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#475467",
                          background: "#F2F4F7",
                          border: "1px solid #E4E7EC",
                          borderRadius: "999px",
                          padding: "3px 10px",
                        }}
                      >
                        Planned
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: tool.isPlanned ? "#3B4A63" : "inherit" }}>
                      {tool.name}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        color: tool.color,
                      }}
                    >
                      {tool.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p
            className={`rv ${rv_obj["integrations"]}`}
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: "15px",
              color: "#7A3E00",
              transitionDelay: "480ms",
            }}
          >
            Support tickets are imported from Zendesk's JSON export today.
          </p>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section
        id="features"
        style={{
          background: "#FFFFFF",
          padding: "clamp(80px, 10vw, 136px) clamp(16px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div
            className={`rv ${rv_obj["features"]}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1D2B45",
                background: "#F4F7FB",
                border: "1px solid #DDE4EE",
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              <span aria-hidden="true" className={dot["features"]}></span>
              FEATURES
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(34px, 4.6vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                maxWidth: "860px",
              }}
            >
              Every ranking can be traced back to its source.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                title: "Revenue-ranked triage",
                desc: "Themes sorted by revenue at risk, not volume.",
                color: "#8A4300",
                iconBg: "#FFF0DB",
                iconColor: "#C25E00",
                icon: "M3 20h18M5 4h3.5v13a1 1 0 0 0 2 0V4h3.5v9a1 1 0 0 0 2 0V4h3.5v4a1 1 0 0 0 2 0V4h3.5",
                hasChart: true,
              },
              {
                title: "Transparent formula",
                desc: "Each figure shows its traffic, conversion drop, and order value inputs.",
                color: "#0B5E55",
                iconBg: "#E3F5F2",
                iconColor: "#0E7C70",
                icon: "M8 4H6a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-2M9.5 10h5M9.5 14h5",
              },
              {
                title: "Customer evidence",
                desc: "Real quotes from the feedback sit beside every theme.",
                color: "#9B241A",
                iconBg: "#FDE8E6",
                iconColor: "#C0362C",
                icon: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 10.5h.01M9 10.5c0 1.5-.5 2.5-1.5 3M14 10.5h.01M14 10.5c0 1.5-.5 2.5-1.5 3",
              },
              {
                title: "Local AI model",
                desc: "Theme grouping runs on Llama 3 through Ollama, so text stays on your machine.",
                color: "#0F1B2D",
                iconBg: "#E6ECF6",
                iconColor: "#0F1B2D",
                icon: "M4 10.5V7a4 4 0 0 1 8 0v3.5M8 10.5a4 4 0 0 0 8 0v6.5a2.5 2.5 0 0 1-5 0V14M12 14.5v2.5",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`rv ${rv_obj["features"]}`}
                style={{ transitionDelay: `${80 + idx * 80}ms` }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    background: "#FFFFFF",
                    border: "1px solid #E3E8F0",
                    borderRadius: "24px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    boxShadow:
                      "0 1px 2px rgba(15,27,45,.04), 0 10px 28px -14px rgba(15,27,45,.16)",
                  }}
                >
                  <div
                    className="itile"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "15px",
                      background: feature.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={feature.iconColor}
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={feature.icon}></path>
                    </svg>
                  </div>
                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "21px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: feature.color,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      lineHeight: 1.5,
                      color: "#3B4A63",
                    }}
                  >
                    {feature.desc}
                  </p>
                  {feature.hasChart && (
                    <div
                      aria-hidden="true"
                      style={{
                        marginTop: "auto",
                        background: "#FFF8EF",
                        border: "1px solid #F6E6D0",
                        borderRadius: "14px",
                        padding: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "99px",
                            background: "#D92D20",
                          }}
                        ></span>
                        <div
                          style={{
                            height: "7px",
                            width: "90%",
                            background: "#F04438",
                            borderRadius: "99px",
                          }}
                        ></div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "99px",
                            background: "#DC6803",
                          }}
                        ></span>
                        <div
                          style={{
                            height: "7px",
                            width: "56%",
                            background: "#F79009",
                            borderRadius: "99px",
                          }}
                        ></div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "99px",
                            background: "#98A2B3",
                          }}
                        ></span>
                        <div
                          style={{
                            height: "7px",
                            width: "22%",
                            background: "#D0D5DD",
                            borderRadius: "99px",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. JIRA HANDOFF */}
      <section
        id="backlog"
        style={{
          background: "#FFF8EF",
          padding: "clamp(80px, 10vw, 136px) clamp(16px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "56px",
            alignItems: "center",
          }}
        >
          <div
            className={`rv ${rv_obj["backlog"]}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1D2B45",
                background: "#FFFFFF",
                border: "1px solid #F1E2CE",
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              <span aria-hidden="true" className={dot["backlog"]}></span>
              BACKLOG
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(34px, 4.4vw, 52px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              From insight to a ready-to-paste ticket.
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(17px, 1.6vw, 19px)",
                lineHeight: 1.5,
                color: "#3B4A63",
                maxWidth: "460px",
              }}
            >
              One click copies a structured draft: summary, business value, and description.
            </p>
          </div>
          <div className={`rv ${rv_obj["backlog"]}`} style={{ transitionDelay: "80ms" }}>
            <div
              role="img"
              aria-label="Ticket draft layout with summary, business value and description fields"
              className="card"
              style={{
                background: "#FFFFFF",
                border: "1px solid #F1E6D8",
                borderRadius: "24px",
                padding: "clamp(20px, 3vw, 32px)",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                boxShadow:
                  "0 2px 4px rgba(15,27,45,.04), 0 24px 48px -20px rgba(15,27,45,.22)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #F1EDE7",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    className="itile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "#E6EEFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1D5FD6"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"></path>
                    </svg>
                  </div>
                  <div
                    style={{
                      height: "10px",
                      width: "90px",
                      background: "#D6E2FA",
                      borderRadius: "99px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#F4F7FB",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1D2B45"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="8" y="8" width="13" height="13" rx="2"></rect>
                    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#1A52BA",
                  }}
                >
                  SUMMARY
                </div>
                <div
                  style={{
                    height: "14px",
                    width: "80%",
                    background: "#D6E2FA",
                    borderRadius: "99px",
                  }}
                ></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#93470A",
                  }}
                >
                  BUSINESS VALUE
                </div>
                <div
                  style={{
                    height: "12px",
                    width: "60%",
                    background: "#FDE7C2",
                    borderRadius: "99px",
                  }}
                ></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#0B6B61",
                  }}
                >
                  DESCRIPTION
                </div>
                <div
                  style={{
                    height: "10px",
                    width: "100%",
                    background: "#D5F0EB",
                    borderRadius: "99px",
                  }}
                ></div>
                <div
                  style={{
                    height: "10px",
                    width: "94%",
                    background: "#D5F0EB",
                    borderRadius: "99px",
                  }}
                ></div>
                <div
                  style={{
                    height: "10px",
                    width: "70%",
                    background: "#D5F0EB",
                    borderRadius: "99px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer
        style={{
          background: "#0F1B2D",
          color: "#FFFFFF",
          padding: "clamp(48px, 6vw, 72px) clamp(16px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: 700,
              fontSize: "19px",
            }}
          >
            <img
              src="/rde-logo.png"
              alt="RDE logo"
              width="44"
              height="44"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "11px",
                display: "block",
              }}
            />
            Revenue Discovery Engine
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 32px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            <a
              className="ul"
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Walkthrough
            </a>
            <a
              className="ul"
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              PRD
            </a>
            <a
              className="ul"
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              GitHub repository
            </a>
            <a
              className="ul"
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
