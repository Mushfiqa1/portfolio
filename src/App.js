import { useState, useEffect, useRef, useCallback } from "react";
// IMPORT YOUR IMAGES
import profilePic from './assets/images/profile.png'; 
import ride1 from './assets/images/ridecompare1.png';
import ride2 from './assets/images/ridecompare2.png';
import ride3 from './assets/images/ridecompare3.png';
// TELEMEDIXAI SCREENSHOT IMPORTS
import medix1 from './assets/images/medix1.png';
import medix2 from './assets/images/medix2.png';
import medix3 from './assets/images/medix3.png';
// CIBC FLOW SCREENSHOT IMPORT
import cibc1 from './assets/images/cibc1.png';

// ─── Particle Canvas Background ────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.r = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(240,192,64,${0.5 * (1 - dist / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0, pointerEvents: "none"
      }}
    />
  );
}

// ─── 3D Tilt Card ───────────────────────────────────────────────────────────
function TiltCard({ children, style, className }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 22;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  }, []);
  const onLeave = useCallback(() => {
    ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.15s ease", ...style }}
    >
      {children}
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ active, onNav }) {
  const links = ["home", "skills", "projects", "contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 100, display: "flex", justifyContent: "center",
      padding: "1.2rem 2rem", gap: "2.5rem",
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>
      <span style={{
        position: "absolute", left: "2rem", top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Courier New', monospace",
        color: "#f0c040", fontWeight: 700, fontSize: "1rem",
        letterSpacing: 2
      }}>MB</span>
      {links.map(l => (
        <button
          key={l}
          onClick={() => onNav(l)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: active === l ? "#f0c040" : "rgba(255,255,255,0.65)",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.85rem", letterSpacing: "0.12em",
            textTransform: "uppercase",
            borderBottom: active === l ? "2px solid #f0c040" : "2px solid transparent",
            paddingBottom: "2px",
            transition: "all 0.25s"
          }}
        >
          {l}
        </button>
      ))}
    </nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────
function Hero({ onNav }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      textAlign: "center", padding: "2rem",
      position: "relative", zIndex: 1
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 1s ease"
      }}>
        {/* Profile Border Container */}
        <div style={{
          width: 164, 
          height: 164, 
          borderRadius: "50%",
          margin: "0 auto 2rem",
          background: "transparent",
          border: "4px solid #141923",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "100%", 
            height: "100%", 
            borderRadius: "50%",
            overflow: "hidden", 
            background: "#111",
            display: "flex"
          }}>
            <img 
                src={profilePic} 
                alt="Mushfiqa Bhuiyan" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                }} 
            />
          </div>
        </div>

        <p style={{
          fontFamily: "'Courier New', monospace",
          color: "#f0c040", fontSize: "0.9rem",
          letterSpacing: "0.25em", marginBottom: "1rem",
          textTransform: "uppercase"
        }}>AI, Robotics & Full Stack Engineering</p>

        {/* MODIFIED TO KEEP NAME ON ONE LINE WITH FLUID SCALE */}
        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
          fontWeight: 400, margin: "0 0 1.5rem",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          background: "linear-gradient(135deg, #ffffff 40%, #f0c040 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Mushfiqa Bhuiyan
        </h1>

        {/* UPDATED BIO DESCRIPTION */}
        <p style={{
          color: "rgba(255,255,255,0.65)", fontSize: "1.1rem",
          maxWidth: 620, margin: "0 auto 2.5rem", lineHeight: 1.7
        }}>
          Software engineer with a passion for UI/UX and AI/ML, skilled in full stack development, SQL, and testing.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "GitHub", href: "https://github.com/Mushfiqa1" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/mushfiqa-bhuiyan/" },
            { label: "Projects", onClick: () => onNav("projects") },
            { label: "Skills", onClick: () => onNav("skills") },
          ].map(btn => (
            <a
              key={btn.label}
              href={btn.href}
              target={btn.href ? "_blank" : undefined}
              rel="noreferrer"
              onClick={btn.onClick}
              style={{
                padding: "0.7rem 1.8rem",
                background: btn.label === "Projects" ? "#f0c040" : "rgba(255,255,255,0.08)",
                color: btn.label === "Projects" ? "#000" : "#fff",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 30, cursor: "pointer",
                textDecoration: "none", fontWeight: 600,
                fontFamily: "'Courier New', monospace",
                fontSize: "0.85rem", letterSpacing: "0.08em",
                transition: "all 0.25s",
                backdropFilter: "blur(6px)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f0c040";
                e.currentTarget.style.color = "#000";
                e.currentTarget.style.borderColor = "#f0c040";
              }}
              onMouseLeave={e => {
                if (btn.label !== "Projects") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                }
              }}
            >
              {btn.label}
            </a>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: "4rem", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)",
          fontSize: "0.75rem", letterSpacing: "0.15em",
          fontFamily: "'Courier New', monospace"
        }}>
          <span>SCROLL</span>
          <div style={{
            width: 1, height: 40,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)"
          }} />
        </div>
      </div>
    </section>
  );
}

// ─── Skills Section ─────────────────────────────────────────────────────────
const SKILLS = [
  { group: "Languages", color: "#4CAF50", items: ["C#", "Java", "JavaScript", "Python", "PL/SQL", "PowerShell"] },
  { group: "Frontend", color: "#F57C00", items: ["HTML5", "CSS3", "React", "Angular", "React Native"] },
  { group: "Backend", color: "#2196F3", items: ["Node.js", "Express.js", "FastAPI", "NestJS", ".NET"] },
  { group: "Robotics & AI", color: "#E91E63", items: ["ROS 2", "Gazebo", "MoveIt 2", "Nav2", "Behavior Trees", "URDF", "Kinematics"] },
  { group: "MLOps & Data", color: "#7E57C2", items: ["TFX", "Apache Airflow", "MLflow", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy"] },
  { group: "Databases", color: "#E53935", items: ["MongoDB", "Oracle 12c", "MySQL", "Firebase", "Aggregation Framework"] },
  { group: "Testing & DevOps", color: "#009688", items: ["Wireshark", "Socket Programming", "CI/CD", "Git", "Docker", "Jira", "Postman", "Netlify"] },
  { group: "Creative", color: "#F9A825", items: ["Three.js", "Figma", "Adobe", "Canva"] },
];

function Skills() {
  return (
    <section style={{
      minHeight: "100vh", padding: "6rem 2rem", position: "relative", zIndex: 1
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{
          fontFamily: "'Courier New', monospace", color: "#f0c040",
          fontSize: "0.8rem", letterSpacing: "0.3em",
          textTransform: "uppercase", marginBottom: "0.8rem", textAlign: "center"
        }}>What I work with</p>
        <h2 style={{
          fontFamily: "'Georgia', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)",
          fontWeight: 400, textAlign: "center", marginBottom: "3.5rem",
          color: "#fff"
        }}>Tech Stack</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {SKILLS.map(({ group, color, items }) => (
            <div key={group}>
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                marginBottom: "1rem"
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  color: "rgba(255,255,255,0.4)", fontSize: "0.75rem",
                  letterSpacing: "0.2em", textTransform: "uppercase"
                }}>{group}</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", paddingLeft: "1.5rem" }}>
                {items.map(item => (
                  <span
                    key={item}
                    style={{
                      padding: "0.35rem 0.9rem",
                      borderRadius: 20,
                      border: `1px solid ${color}55`,
                      background: `${color}18`,
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontFamily: "'Courier New', monospace",
                      cursor: "default",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${color}40`;
                      e.currentTarget.style.borderColor = color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${color}18`;
                      e.currentTarget.style.borderColor = `${color}55`;
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Project Modal ───────────────────────────────────────────────────────────
function Modal({ project, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(15,15,20,0.95)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20, maxWidth: 860,
          width: "100%", maxHeight: "90vh",
          overflow: "auto", padding: "2.5rem",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <span style={{
              fontFamily: "'Courier New', monospace",
              color: "#f0c040", fontSize: "0.75rem",
              letterSpacing: "0.25em", textTransform: "uppercase"
            }}>{project.status}</span>
            <h2 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "2rem", fontWeight: 400,
              margin: "0.3rem 0 0", color: "#fff"
            }}>{project.title}</h2>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none",
            color: "#fff", width: 36, height: 36,
            borderRadius: "50%", cursor: "pointer", fontSize: "1.1rem",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
          {project.longDesc}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          {project.tags.map(t => (
            <span key={t} style={{
              padding: "0.3rem 0.8rem",
              border: "1px solid rgba(240,192,64,0.4)",
              background: "rgba(240,192,64,0.08)",
              color: "#f0c040", borderRadius: 15,
              fontFamily: "'Courier New', monospace", fontSize: "0.75rem"
            }}>{t}</span>
          ))}
        </div>

        {/* COMPACT RESPONSIVE GALLERY STRIP */}
        {project.images && project.images.length > 0 && (
          <div style={{
            display: "flex", 
            gap: "1.5rem", 
            flexWrap: "wrap",
            justifyContent: "center", 
            alignItems: "center",
            marginBottom: "2rem",
            padding: "1rem 0"
          }}>
            {project.images.map((src, i) => (
              <img key={i} src={src} alt={`${project.title} mockup ${i + 1}`}
                style={{
                  width: project.id === "cibc" ? "540px" : "230px", 
                  height: project.id === "cibc" ? "auto" : "460px",
                  maxWidth: "95%", 
                  borderRadius: "16px",
                  objectFit: "cover", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.08)",
                  transition: "transform 0.3s ease",
                  cursor: "default"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            ))}
          </div>
        )}

        {project.inProgress && (
          <div style={{
            background: "rgba(240,192,64,0.08)",
            border: "1px solid rgba(240,192,64,0.25)",
            borderRadius: 12, padding: "1rem 1.2rem",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.8rem"
          }}>
            <span>🚧</span>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {project.inProgressNote}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
              padding: "0.7rem 1.8rem",
              background: "#f0c040", color: "#000",
              borderRadius: 30, textDecoration: "none",
              fontWeight: 700, fontFamily: "'Courier New', monospace",
              fontSize: "0.85rem", letterSpacing: "0.08em",
              transition: "all 0.2s"
            }}>
              View Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
              padding: "0.7rem 1.8rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#fff", borderRadius: 30, textDecoration: "none",
              fontWeight: 600, fontFamily: "'Courier New', monospace",
              fontSize: "0.85rem", letterSpacing: "0.08em"
            }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Projects Data ───────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "telemedix",
    title: "TeleMedixAI",
    short: "AI-powered healthcare app with automated MLOps pipelines and real-time doctor availability.",
    longDesc: "A React Native mobile app connecting patients with AI medical assistants. I integrated MLOps principles using Apache Airflow for pipeline orchestration and TFX for automated model validation. The backend uses FastAPI with a robust Oracle 12c database, utilizing PL/SQL procedures for secure, high-performance data handling.",
    status: "Completed",
    tags: ["React Native", "MLOps", "Apache Airflow", "FastAPI", "PL/SQL", "Oracle 12c"],
    images: [medix1, medix2, medix3],
    liveUrl: null,
    githubUrl: "https://github.com/Mushfiqa1",
    inProgress: false,
    featured: true,
    accent: "#40c4ff"
  },
  {
    id: "ridecompare",
    title: "RideCompare",
    short: "iOS app comparing real-time fares with advanced data structures for optimized search.",
    longDesc: "A cross-platform app that pulls live pricing from multiple rideshare APIs. I implemented advanced data structures (Heaps and Priority Queues) to optimize the fare-sorting algorithm and used Big-O analysis to ensure low-latency performance during high-frequency API polling.",
    status: "Completed",
    tags: ["React Native", "Algorithms", "Data Structures", "REST APIs", "iOS"],
    images: [ride1, ride2, ride3],
    liveUrl: null,
    githubUrl: "https://github.com/Mushfiqa1",
    inProgress: false,
    featured: true,
    accent: "#69f0ae"
  },
  {
    id: "timeless",
    title: "Timeless Photobooth",
    short: "A live photobooth web app with MongoDB aggregation for real-time analytics.",
    longDesc: "A browser-based photobooth experience. Beyond the frontend, I built a backend analytics dashboard using the MongoDB Aggregation Framework to track event engagement and image-processing trends in real-time. Features custom frames and instant downloads via Canvas API.",
    status: "Live",
    tags: ["React", "MongoDB Aggregation", "Web Camera API", "Canvas API"],
    images: [],
    liveUrl: "https://timeless-photobooth.vercel.app/",
    githubUrl: null,
    inProgress: false,
    featured: true,
    accent: "#f0c040"
  },
  {
    id: "cibc",
    title: "CIBC Flow",
    short: "A reimagined mobile banking UX—integrating proactive AI agents and secure socket networking.",
    longDesc: "A conceptual redesign of CIBC's mobile banking app. This version explores proactive AI banking co-pilots and incorporates secure socket programming for encrypted real-time notifications. The architecture focuses on reducing legacy backend friction through high-performance data structures and modern UI principles.",
    status: "In Progress",
    tags: ["Figma", "AI Agents", "Socket Programming", "React Native", "Fintech"],
    images: [cibc1],
    liveUrl: null,
    githubUrl: null,
    inProgress: true,
    inProgressNote: "This project is currently in active development. The screenshots shown are early-stage design explorations and may not reflect the final product.",
    featured: true,
    accent: "#ff6b6b"
  },
];

// ─── Projects Section ────────────────────────────────────────────────────────
function Projects({ onOpenProject }) {
  const featured = PROJECTS.filter(p => p.featured);
  const rest = PROJECTS.filter(p => !p.featured);

  return (
    <section style={{
      minHeight: "100vh", padding: "6rem 2rem",
      position: "relative", zIndex: 1
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{
          fontFamily: "'Courier New', monospace", color: "#f0c040",
          fontSize: "0.8rem", letterSpacing: "0.3em",
          textTransform: "uppercase", marginBottom: "0.8rem", textAlign: "center"
        }}>What I've built</p>
        <h2 style={{
          fontFamily: "'Georgia', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)",
          fontWeight: 400, textAlign: "center", marginBottom: "0.8rem", color: "#fff"
        }}>Projects</h2>
        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.4)",
          fontSize: "0.9rem", marginBottom: "3.5rem",
          fontFamily: "'Courier New', monospace"
        }}>Click any card to explore</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem", marginBottom: "1.5rem"
        }}>
          {featured.map(p => (
            <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />
          ))}
        </div>

        {rest.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem"
          }}>
            {rest.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={onOpenProject} small />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, onOpen, small }) {
  const statusColors = {
    "Completed": "#69f0ae",
    "Live": "#f0c040",
    "In Progress": "#ff6b6b"
  };

  return (
    <TiltCard>
      <div
        onClick={() => onOpen(project)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid rgba(255,255,255,0.09)`,
          borderRadius: 18, padding: small ? "1.5rem" : "2rem",
          cursor: "pointer", height: "100%",
          position: "relative", overflow: "hidden",
          transition: "border-color 0.3s"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${project.accent}66`;
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle, ${project.accent}22 0%, transparent 70%)`,
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.72rem", letterSpacing: "0.2em",
            color: statusColors[project.status] || "#fff",
            textTransform: "uppercase",
            border: `1px solid ${statusColors[project.status]}44`,
            padding: "0.2rem 0.6rem", borderRadius: 20,
            background: `${statusColors[project.status]}11`
          }}>{project.status}</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "1.2rem" }}>↗</span>
        </div>

        <h3 style={{
          fontFamily: "'Georgia', serif",
          fontSize: small ? "1.3rem" : "1.6rem",
          fontWeight: 400, margin: "0 0 0.8rem",
          color: "#fff"
        }}>{project.title}</h3>

        <p style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.9rem", lineHeight: 1.7,
          margin: "0 0 1.5rem"
        }}>{project.short}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {project.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              padding: "0.2rem 0.6rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.72rem",
              fontFamily: "'Courier New', monospace"
            }}>{t}</span>
          ))}
          {project.tags.length > 3 && (
            <span style={{
              fontSize: "0.72rem", color: "rgba(255,255,255,0.3)",
              fontFamily: "'Courier New', monospace",
              padding: "0.2rem 0.4rem"
            }}>+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

// ─── Contact Section ─────────────────────────────────────────────────────────
function Contact() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      padding: "6rem 2rem", position: "relative", zIndex: 1,
      textAlign: "center"
    }}>
      <p style={{
        fontFamily: "'Courier New', monospace", color: "#f0c040",
        fontSize: "0.8rem", letterSpacing: "0.3em",
        textTransform: "uppercase", marginBottom: "0.8rem"
      }}>Let's connect</p>
      <h2 style={{
        fontFamily: "'Georgia', serif",
        fontSize: "clamp(2.5rem, 6vw, 4rem)",
        fontWeight: 400, marginBottom: "1.5rem", color: "#fff",
        lineHeight: 1.15
      }}>Open to<br />opportunities.</h2>
      <p style={{
        color: "rgba(255,255,255,0.5)",
        maxWidth: 480, lineHeight: 1.8,
        marginBottom: "3rem", fontSize: "1rem"
      }}>
        Whether you're hiring, collaborating, or just want to chat about tech and design —
        my inbox is always open.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="https://www.linkedin.com/in/mushfiqa-bhuiyan/"
          target="_blank" rel="noreferrer"
          style={{
            padding: "0.9rem 2.4rem",
            background: "#f0c040", color: "#000",
            borderRadius: 40, textDecoration: "none",
            fontWeight: 700, fontFamily: "'Courier New', monospace",
            fontSize: "0.9rem", letterSpacing: "0.1em",
            transition: "all 0.25s"
          }}
        >
          LinkedIn ↗
        </a>
      </div>

      <div style={{
        marginTop: "6rem",
        fontFamily: "'Courier New', monospace",
        color: "rgba(255,255,255,0.2)", fontSize: "0.75rem",
        letterSpacing: "0.15em"
      }}>
        © {new Date().getFullYear()} Mushfiqa Bhuiyan
      </div>
    </section>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");
  const [modalProject, setModalProject] = useState(null);
  const refs = {
    home: useRef(null), skills: useRef(null),
    projects: useRef(null), contact: useRef(null)
  };

  const navTo = useCallback((s) => {
    setSection(s);
    refs[s]?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setSection(e.target.dataset.section);
        });
      },
      { threshold: 0.4 }
    );
    Object.entries(refs).forEach(([k, r]) => {
      if (r.current) {
        r.current.dataset.section = k;
        observer.observe(r.current);
      }
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <ParticleCanvas />
      <Nav active={section} onNav={navTo} />

      <div ref={refs.home}><Hero onNav={navTo} /></div>
      <div ref={refs.skills}><Skills /></div>
      <div ref={refs.projects}><Projects onOpenProject={setModalProject} /></div>
      <div ref={refs.contact}><Contact /></div>

      {modalProject && <Modal project={modalProject} onClose={() => setModalProject(null)} />}
    </div>
  );
}