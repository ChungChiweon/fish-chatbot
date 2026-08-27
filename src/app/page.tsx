import { AICaptainWidget } from "@/components/ai-captain/AICaptainWidget";

export default function Home() {
  return (
    <main className="ocean-stage">
      <div className="ocean-light ocean-light-one" />
      <div className="ocean-light ocean-light-two" />
      <div className="surface-lines" aria-hidden="true" />

      <section className="hero-copy">
        <p className="brand-kicker"><span /> BLUE MARINA</p>
        <h1>Meet your<br /><em>AI Captain.</em></h1>
        <p className="hero-description">
          항해의 순간마다 곁에 머무는 새로운 바다 안내자.<br className="desktop-break" />
          화면을 유영하는 Captain을 눌러 대화를 시작해 보세요.
        </p>
        <div className="prototype-label">
          <span>01</span>
          <p>INDEPENDENT UI PROTOTYPE<br /><small>NO LIVE MARINE DATA CONNECTED</small></p>
        </div>
      </section>

      <section className="depth-copy" aria-label="프로토타입 안내">
        <p>SCROLL TO TEST VIEWPORT OVERLAY</p>
        <div className="depth-rule" />
        <h2>Always within reach.<br />Never fixed in place.</h2>
      </section>

      <AICaptainWidget />
    </main>
  );
}
