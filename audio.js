/* GRINGOFFX - Custom Web Audio Synthesizer */

class CyberSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.droneOsc = null;
    this.droneGain = null;
    this.dronePlaying = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser.", e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopDrone();
    } else {
      this.startDrone();
    }
    return this.muted;
  }

  // Synthesize a sci-fi click beep
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime); // High frequency beep
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Synthesize a digital toggle switch click
  playToggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Synthesize a cyberpunk sweep scanner sound
  playScan() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 1.2);

    // Apply bandpass filter to make it sound "cyber"
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1000, this.ctx.currentTime + 1.2);
    filter.Q.value = 5;

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Synthesize a cyberpunk success alert sound (two rising high-tech notes)
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // First note
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second note (offset)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
    gain2.gain.setValueAtTime(0.08, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
    
    // Third note (resolving high pitch)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1046.50, now + 0.16); // C6
    gain3.gain.setValueAtTime(0.08, now + 0.16);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc3.connect(gain3);
    gain3.connect(this.ctx.destination);
    osc3.start(now + 0.16);
    osc3.stop(now + 0.5);
  }

  // Synthesize a digital alert error buzz
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, now); // Low buzz
    osc.frequency.linearRampToValueAtTime(70, now + 0.3);

    // Filter to muddy it up
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.3);
  }

  // Ambient synthesized sci-fi background drone
  startDrone() {
    if (this.muted || this.dronePlaying) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      this.droneOsc.type = "triangle";
      this.droneOsc.frequency.setValueAtTime(65, this.ctx.currentTime); // Low C2 drone

      // Add a slow LFO to sweep the volume and filter frequency for a futuristic pulsing ambient effect
      this.droneGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, this.ctx.currentTime);

      // Connect LFO for sweeping frequency
      const lfo = this.ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.15; // Extremely slow LFO 0.15 Hz

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 50; // Sweeps from 100Hz to 200Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      lfo.start();
      this.droneOsc.start();
      this.dronePlaying = true;
    } catch (e) {
      console.warn("Could not start ambient drone synthesizer", e);
    }
  }

  stopDrone() {
    if (!this.dronePlaying) return;
    try {
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      }
      if (this.droneGain) {
        this.droneGain.disconnect();
      }
    } catch (e) {
      // Ignored
    }
    this.dronePlaying = false;
  }
}

const synth = new CyberSynth();
window.cyberSynth = synth; // Expose globally
