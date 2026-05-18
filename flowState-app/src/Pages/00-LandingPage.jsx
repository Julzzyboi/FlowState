import React, { useState } from "react";
import "./CSS/LandingPage.css";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navContainer">
          <div className="navLogo">
            <i className="fas fa-droplet logoIcon"></i>
            <span className="logoText">FlowState</span>
          </div>
          <ul className="navLinks">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#sanitation">Sanitation</a></li>
          </ul>
          <div className="navActions">
            <button className="btnPrimary">Get Started</button>
          </div>
          <button
            className="hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <i className={menuOpen ? "fas fa-xmark" : "fas fa-bars"}></i>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`mobileOverlay${menuOpen ? " mobileOverlayOpen" : ""}`}
        onClick={closeMenu}
      />

      {/* Mobile drawer */}
      <div className={`mobileDrawer${menuOpen ? " mobileDrawerOpen" : ""}`}>
        <ul className="mobileNavLinks">
          <li><a href="#features" onClick={closeMenu}>Features</a></li>
          <li><a href="#how-it-works" onClick={closeMenu}>How It Works</a></li>
          <li><a href="#sanitation" onClick={closeMenu}>Sanitation</a></li>
        </ul>
        <button className="btnPrimary mobileGetStarted" onClick={closeMenu}>
          Get Started
        </button>
      </div>
    </>
  );
};


const Hero = () => (
  <section className="hero">
    <div className="heroBgBlobs">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
    </div>
    <div className="heroContent">

      <h1 className="heroTitle">
        Stay Hydrated,<br />
        <span className="gradientText">Stay in Flow.</span>
      </h1>
      <p className="heroSubtitle">
        FlowState is the intelligent water tracker that syncs with your body's needs,
        reminds you to drink at the perfect moment, and transforms hydration into a habit you'll love.
      </p>
      <div className="heroCta">
        <button className="btnPrimary btnLarge">
          <i className="fas fa-droplet"></i> Start Tracking Now!
        </button>

      </div>
      <div className="heroStats">
        <div className="stat">
          <span className="statValue">500K+</span>
          <span className="statLabel">Active Users</span>
        </div>
        <div className="statDivider"></div>
        <div className="stat">
          <span className="statValue">67%</span>
          <span className="statLabel">Satisfaction Rate</span>
        </div>
        <div className="statDivider"></div>
        <div className="stat">
          <span className="statValue">4.9 ★</span>
          <span className="statLabel">Overall Score</span>
        </div>
      </div>
    </div>
    <div className="heroVisual">
      <div className="phoneMockup">
        <div className="phoneScreen">
          <div className="phoneHeader">
            <span className="phoneTime">9:41</span>
            <div className="phoneIcons">
              <i className="fas fa-signal"></i>
              <i className="fas fa-wifi"></i>
              <i className="fas fa-battery-full"></i>
            </div>
          </div>
          <div className="phoneApp">
            <div className="appGreeting">Good morning, Yao!</div>
            <div className="waterCircleWrap">
              <div className="waterCircle">
                <div className="waterFill"></div>
                <div className="waterText">
                  <span className="waterAmount">1.2L</span>
                  <span className="waterGoal">of 2.5L</span>
                </div>
              </div>
            </div>
            <div className="appProgressLabel">
              <span>Daily Goal</span>
              <span className="progressPct">48%</span>
            </div>
            <div className="appProgressBar">
              <div className="appProgressFill"></div>
            </div>
            <div className="appLogBtns">
              <button className="logBtn"><i className="fas fa-glass-water"></i> 250ml</button>
              <button className="logBtn"><i className="fas fa-glass-water"></i> 500ml</button>
              <button className="logBtn logBtnActive"><i className="fas fa-plus"></i> Custom</button>
            </div>
            <div className="appReminder">
              <i className="fas fa-bell"></i>
              <span>Reminder in 45 min</span>
            </div>
          </div>
        </div>
        <div className="phoneGlow"></div>
      </div>
    </div>
    <div className="heroWave">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,60 C360,100 1080,20 1440,60 L1440,100 L0,100 Z" fill="white" />
      </svg>
    </div>
  </section>
);


const features = [
  {
    icon: "fas fa-brain", title: "AI-Powered Goals", color: "featureBlue",
    description: "Our smart engine analyzes your weight, activity level, climate, and lifestyle to set a hydration target that's uniquely yours."
  },
  {
    icon: "fas fa-bell", title: "Smart Reminders", color: "featureCyan",
    description: "No more forgetting. FlowState learns when you're most likely to skip a drink and nudges you at exactly the right moment."
  },
  {
    icon: "fas fa-chart-line", title: "Detailed Analytics", color: "featureTeal",
    description: "Visualize your hydration trends over days, weeks, and months. See how water intake correlates with your energy and mood."
  },
  {
    icon: "fas fa-trophy", title: "Streaks & Rewards", color: "featureBlue",
    description: "Hit your daily goal and earn badges, unlock themes, and climb leaderboards with friends. Hydration has never been this fun."
  },
  {
    icon: "fas fa-heart-pulse", title: "Health Integrations", color: "featureCyan",
    description: "Seamlessly syncs with Apple Health, Google Fit, Fitbit, and Garmin so all your wellness data lives in one place."
  },
  {
    icon: "fas fa-moon", title: "Night Mode & Quiet Hours", color: "featureTeal",
    description: "Set quiet hours so reminders pause while you sleep, then gently resume in the morning to kickstart your hydration."
  },
];

const Features = () => (
  <section className="features" id="features">
    <div className="sectionContainer">
      <div className="sectionHeader">
        <span className="sectionTag">Why FlowState?</span>
        <h2 className="sectionTitle">Everything you need to stay <span className="gradientText">perfectly hydrated</span></h2>
        <p className="sectionSubtitle">Powerful features crafted to make drinking water the easiest healthy habit you'll ever build.</p>
      </div>
      <div className="featuresGrid">
        {features.map((f, i) => (
          <div className={`featureCard ${f.color}`} key={i}>
            <div className="featureIconWrap">
              <i className={f.icon}></i>
            </div>
            <h3 className="featureTitle">{f.title}</h3>
            <p className="featureDesc">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);



const steps = [
  {
    icon: "fas fa-user-plus", step: "01", title: "Create your profile",
    desc: "Tell us a bit about yourself — your weight, activity level, and daily goals. Setup takes under two minutes."
  },
  {
    icon: "fas fa-sliders", step: "02", title: "Customize your plan",
    desc: "FlowState generates a personalized hydration target and lets you pick your reminder style and schedule."
  },
  {
    icon: "fas fa-droplet", step: "03", title: "Log every sip",
    desc: "Tap once to log a drink from presets, or enter a custom amount. It's so fast you'll never skip a log again."
  },
  {
    icon: "fas fa-chart-bar", step: "04", title: "Track your progress",
    desc: "Watch your streak grow, earn rewards, and uncover insights that help you drink smarter every day."
  },
];

const HowItWorks = () => (
  <section className="howItWorks" id="how-it-works">
    <div className="sectionContainer">
      <div className="sectionHeader">
        <span className="sectionTag">Simple Process</span>
        <h2 className="sectionTitle">Up and running in <span className="gradientText">4 easy steps</span></h2>
        <p className="sectionSubtitle">FlowState is built for real life. No complicated setup, no subscriptions required to get started.</p>
      </div>
      <div className="stepsGrid">
        {steps.map((s, i) => (
          <div className="stepCard" key={i}>
            <div className="stepNumber">{s.step}</div>
            <div className="stepIconWrap">
              <i className={s.icon}></i>
            </div>
            <h3 className="stepTitle">{s.title}</h3>
            <p className="stepDesc">{s.desc}</p>

          </div>
        ))}
      </div>
    </div>
  </section>
);


const sanitationPillars = [
  {
    icon: "fas fa-hand-sparkles", title: "Clean Water Standards",
    desc: "Every drop you log is pure. FlowState only counts water that meets WHO drinking-water guidelines filtered, purified, or certified tap."
  },
  {
    icon: "fas fa-shield-halved", title: "Contaminant Alerts",
    desc: "Connect your region's water-quality feed and receive real-time alerts when local contaminant levels exceed safe thresholds."
  },
  {
    icon: "fas fa-recycle", title: "Eco-Conscious Tracking",
    desc: "See your estimated plastic bottle savings each month and how switching to reusable alternatives reduces your environmental footprint."
  },
  {
    icon: "fas fa-microscope", title: "Source Quality Log",
    desc: "Tag each intake by source tap, filtered, spring, or infused and FlowState builds a quality report so you know exactly what you're drinking."
  },
];

const sanitationStats = [
  { value: "2.2B", label: "People lack safe drinking water globally", icon: "fas fa-earth-americas" },
  { value: "80%", label: "Of illnesses in developing countries are water-related", icon: "fas fa-virus" },
  { value: "1,000+", label: "Contaminants FlowState monitors in your region", icon: "fas fa-flask" },
  { value: "12M", label: "Plastic bottles saved by our community this year", icon: "fas fa-bottle-water" },
];

const Sanitation = () => (
  <section className="sanitation" id="sanitation">
    <div className="sectionContainer">
      <div className="sectionHeader">
        <span className="sectionTag sanitationTag">Sanitation &amp; Purity</span>
        <h2 className="sectionTitle">
          Not just <em>how much</em>, but <span className="gradientGreen">how clean.</span>
        </h2>
        <p className="sectionSubtitle">
          FlowState goes beyond counting cups. We help you understand the quality,
          source, and safety of every drop you consume.
        </p>
      </div>

      <div className="sanitationStatsBanner">
        {sanitationStats.map((s, i) => (
          <div className="sanitationStat" key={i}>
            <div className="sanitationStatIcon"><i className={s.icon}></i></div>
            <span className="sanitationStatValue">{s.value}</span>
            <span className="sanitationStatLabel">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="sanitationGrid">
        {sanitationPillars.map((p, i) => (
          <div className="sanitationCard" key={i}>
            <div className="sanitationIconWrap"><i className={p.icon}></i></div>
            <h3 className="sanitationCardTitle">{p.title}</h3>
            <p className="sanitationCardDesc">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="sanitationCallout">
        <div className="sanitationCalloutLeft">
          <i className="fas fa-droplet sanitationCalloutIcon"></i>
          <div>
            <h3 className="sanitationCalloutTitle">Water is life, protect it.</h3>
            <p className="sanitationCalloutText">
              FlowState partners with WaterAid and local NGOs to surface clean-water initiatives
              near you. Every Pro subscription contributes $0.50/month to global sanitation projects.
            </p>
          </div>
        </div>
        <button className="btnGreen">
          <i className="fas fa-seedling"></i> Learn More
        </button>
      </div>
    </div>
  </section>
);


const CTA = () => (
  <section className="ctaSection" id="download">
    <div className="ctaBgBlobs">
      <div className="ctaBlob ctaBlob1"></div>
      <div className="ctaBlob ctaBlob2"></div>
    </div>
    <div className="ctaContent">
      <i className="fas fa-droplet ctaIcon"></i>
      <h2 className="ctaTitle">
        Ready to find your<br /><span className="gradientTextLight">FlowState?</span>
      </h2>
      <p className="ctaSubtitle">Track yours now and stay hydrated!</p>
    </div>
  </section>
);


const Footer = () => (
  <footer className="footer">
    <div className="footerContainer">
      <div className="footerBrand">
        <div className="footerLogo">
          <i className="fas fa-droplet"></i>
          <span>FlowState</span>
        </div>
        <p className="footerTagline">Hydration intelligence for a healthier you.</p>
        <div className="footerSocial">
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
        </div>
      </div>
      <div className="footerLinks">
        <div className="footerCol">
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Sanitation</a>
          <a href="#">Changelog</a>
          <a href="#">Roadmap</a>
        </div>
        <div className="footerCol">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Press Kit</a>
        </div>
        <div className="footerCol">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
    <div className="footerBottom">
      <span>© 2025 FlowState. All rights reserved.</span>
    </div>
  </footer>
);


export default function LandingOfficial() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Sanitation />
      <CTA />
      <Footer />
    </div>
  );
}