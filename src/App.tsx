import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function App() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [clicks, setClicks] = useState(0);
  const [loveMeter, setLoveMeter] = useState(0);
  const [showMeow, setShowMeow] = useState(false);
  const [meowText, setMeowText] = useState('');
  const [petCount, setPetCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoveMusicPlaying, setIsLoveMusicPlaying] = useState(false);
  const [isMeowMusicPlaying, setIsMeowMusicPlaying] = useState(false);
  const [mouseScore, setMouseScore] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [loveMessage, setLoveMessage] = useState('');
  const [floatingCats, setFloatingCats] = useState<{ id: number; x: number; y: number }[]>([]);
  const [birthdayWishes, setBirthdayWishes] = useState<string[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const nextHeartId = useRef(0);
  const nextCatId = useRef(0);
  const loveMusicRef = useRef<HTMLAudioElement | null>(null);
  const meowMusicRef = useRef<HTMLAudioElement | null>(null);
  const catPetRef = useRef<HTMLDivElement>(null);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const quoteTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const loveQuotes = [
    "Every day with you is my favorite day. ❤️",
    "You make my heart smile like a happy kitten. 😊🐱",
    "Meeting you was fate... but falling in love with you was beyond my control. 💕",
    "In a sea of people, my eyes will always search only for you. 🌊",
    "I love you more than all the stars in the sky. ✨",
    "You're the purr-fect girlfriend! 🐱💕",
    "Every Meow from you makes my day brighter! 🎀",
    "I'm feline lucky to have you! 🐾",
    "Your love is my favorite adventure. 🗺️🐱",
    "You + Me = Endless cuddles and meows 💖",
    "Your smile is my favorite view. 😊",
    "You make my world complete. 🌍",
    "I fall in love with you more every single day. 💘",
    "You're my sunshine on cloudy days. ☀️",
    "Being with you is my favorite place to be. 🏠",
    "You're the beat in my heart. 💓",
    "Every love story is beautiful, but ours is my favorite. 📖",
    "You're the best thing that ever happened to me. 🎁",
    "My love for you grows stronger every moment. 📈",
    "You're my happily ever after. 👸",
    "I love you more than words can express. 💌",
    "You're the reason I believe in magic. ✨",
    "Your love is my greatest treasure. 💎",
    "I'm so grateful for every moment with you. 🙏",
    "You make everything better just by being you. 🌟"
  ];

  const loveMessages = [
    "💖 Sending you a thousand kisses! 💖",
    "🐱 Meow! I love you to the moon and back! 🐱",
    "💕 You're the best thing that ever happened to me! 💕",
    "🎀 Every day with you is a blessing! 🎀",
    "😻 You make my heart purr with joy! 😻",
    "💗 You're my everything! 💗"
  ];

  const meowSounds = ["Meow! 🐱", "Purrrr... 💕", "Mew! 🎀", "Mrrow! 😻", "Meow meow! 💖", "Nyaa~ 😺", "Purr purr~ 🐱"];

  // Function to play cute kitten meow sound using Web Audio API
  const playCuteKittenMeow = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      filter.Q.value = 5;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      
      oscillator.start();
      oscillator.stop(now + 0.35);
      
      setTimeout(() => {
        const purrOsc = audioCtx.createOscillator();
        const purrGain = audioCtx.createGain();
        purrOsc.connect(purrGain);
        purrGain.connect(audioCtx.destination);
        purrOsc.type = 'triangle';
        purrOsc.frequency.value = 150;
        purrGain.gain.setValueAtTime(0, audioCtx.currentTime);
        purrGain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.02);
        purrGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        purrOsc.start();
        purrOsc.stop(audioCtx.currentTime + 0.3);
      }, 250);
      
    } catch (error) {
      console.log("Audio error:", error);
    }
  }, []);

  // Alternative simple meow sound
  const playSimpleMeow = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      
      oscillator.start();
      oscillator.stop(now + 0.3);
    } catch (error) {
      console.log("Audio error:", error);
    }
  }, []);

  // Play kiss sound
  const playKissSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, now);
      oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.1);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      
      oscillator.start();
      oscillator.stop(now + 0.15);
    } catch (error) {
      console.log("Audio error:", error);
    }
  }, []);

  // Play magic sound
  const playMagicSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      
      for (let i = 0; i < 3; i++) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800 + (i * 200);
        
        gainNode.gain.setValueAtTime(0, now + i * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.2);
        
        oscillator.start(now + i * 0.1);
        oscillator.stop(now + i * 0.1 + 0.2);
      }
    } catch (error) {
      console.log("Audio error:", error);
    }
  }, []);

  const playMeowSound = useCallback(() => {
    if (Math.random() > 0.5) {
      playCuteKittenMeow();
    } else {
      playSimpleMeow();
    }
  }, [playCuteKittenMeow, playSimpleMeow]);

  // Initialize audio on first user interaction
  const initAudio = useCallback(() => {
    if (!audioInitialized) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtx.resume().then(() => {
        setAudioInitialized(true);
        console.log("Audio initialized!");
      }).catch(() => {});
    }
  }, [audioInitialized]);

  const triggerBigCelebration = useCallback(() => {
    setShowConfetti(true);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playMeowSound(), i * 200);
    }
    setTimeout(() => setShowConfetti(false), 8000);
    
    const wishes = [
      "🎂 Happy Birthday! 🎂",
      "🎉 You're amazing! 🎉",
      "💖 Best day ever! 💖",
      "🐱 Meow! Celebrate! 🐱"
    ];
    setBirthdayWishes(wishes);
    setTimeout(() => setBirthdayWishes([]), 5000);
  }, [playMeowSound]);

  useEffect(() => {
    const target = new Date(new Date().getFullYear(), 5, 18);
    const today = new Date();
    if (today > target) target.setFullYear(target.getFullYear() + 1);
    setTargetDate(target);

    // Love background music
    loveMusicRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
    if (loveMusicRef.current) {
      loveMusicRef.current.loop = true;
      loveMusicRef.current.volume = 0.2;
    }

    // Meow music
    meowMusicRef.current = new Audio("/meow.mp3");
    if (meowMusicRef.current) {
      meowMusicRef.current.loop = true;
      meowMusicRef.current.volume = 0.3;
    }

    // Generate floating cats
    const catInterval = setInterval(() => {
      const id = nextCatId.current++;
      setFloatingCats(prev => [...prev, { 
        id, 
        x: Math.random() * 100, 
        y: -10 
      }]);
      setTimeout(() => {
        setFloatingCats(prev => prev.filter(cat => cat.id !== id));
      }, 8000);
    }, 3000);

    return () => {
      clearInterval(catInterval);
      if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    };
  }, []);

  // Countdown
  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference <= 0) {
        setIsBirthday(true);
        triggerBigCelebration();
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, triggerBigCelebration]);

  const moveMouse = useCallback(() => {
    const newX = Math.random() * 90 + 5;
    const newY = Math.random() * 80 + 10;
    setMousePosition({ x: newX, y: newY });
    
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    mouseTimeoutRef.current = setTimeout(() => moveMouse(), 800 + Math.random() * 500);
  }, []);

  useEffect(() => {
    moveMouse();
    return () => {
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    };
  }, [moveMouse]);

  const catchMouse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    setMouseScore(prev => prev + 1);
    playMeowSound();
    setLoveMeter(prev => Math.min(100, prev + 2));
    
    const catcher = document.querySelector('.mouse-catcher');
    if (catcher) {
      catcher.classList.add('catch-flash');
      setTimeout(() => catcher.classList.remove('catch-flash'), 300);
    }
    
    const newX = Math.random() * 90 + 5;
    const newY = Math.random() * 80 + 10;
    setMousePosition({ x: newX, y: newY });
    
    if (Math.random() > 0.7) {
      const randomLove = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      setLoveMessage(randomLove);
      setShowLoveMessage(true);
      setTimeout(() => setShowLoveMessage(false), 2000);
    }
  }, [initAudio, playMeowSound, loveMessages]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    initAudio();
    
    const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    setCurrentQuote(randomQuote);
    setShowQuote(true);
    playKissSound();

    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    const newMeter = Math.min(100, loveMeter + 3);
    setLoveMeter(newMeter);

    if (newClicks % 10 === 0) {
      triggerBigCelebration();
    }

    if (Math.random() > 0.6) {
      const randomMeow = meowSounds[Math.floor(Math.random() * meowSounds.length)];
      setMeowText(randomMeow);
      setShowMeow(true);
      playMeowSound();
      setTimeout(() => setShowMeow(false), 900);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 5; i++) {
      const newHeart = {
        id: nextHeartId.current++,
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 80,
      };
      setHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, 1500 + i * 100);
    }

    if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    quoteTimeoutRef.current = setTimeout(() => setShowQuote(false), 6000);
  }, [clicks, loveMeter, loveQuotes, initAudio, playKissSound, playMeowSound, triggerBigCelebration, meowSounds]);

  const petTheCat = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    setPetCount(prev => prev + 1);
    playMeowSound();
    
    const newMeow = meowSounds[Math.floor(Math.random() * meowSounds.length)];
    setMeowText(newMeow);
    setShowMeow(true);
    setTimeout(() => setShowMeow(false), 700);

    if (catPetRef.current) {
      catPetRef.current.style.transform = 'scale(1.3) rotate(10deg)';
      setTimeout(() => {
        if (catPetRef.current) catPetRef.current.style.transform = 'scale(1) rotate(0deg)';
      }, 200);
    }

    setPetCount(prev => {
      const newCount = prev + 1;
      if (newCount % 5 === 0) {
        setLoveMeter(prevMeter => Math.min(100, prevMeter + 8));
        playMagicSound();
      }
      return newCount;
    });
  }, [initAudio, playMeowSound, playMagicSound, meowSounds]);

  const toggleLoveMusic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    if (loveMusicRef.current) {
      if (isLoveMusicPlaying) {
        loveMusicRef.current.pause();
        setIsLoveMusicPlaying(false);
      } else {
        loveMusicRef.current.play().catch(() => {});
        setIsLoveMusicPlaying(true);
      }
    }
  }, [isLoveMusicPlaying, initAudio]);

  const toggleMeowMusic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    if (meowMusicRef.current) {
      if (isMeowMusicPlaying) {
        meowMusicRef.current.pause();
        setIsMeowMusicPlaying(false);
      } else {
        meowMusicRef.current.play().catch(() => {});
        setIsMeowMusicPlaying(true);
      }
    }
  }, [isMeowMusicPlaying, initAudio]);

  const createFloatingHearts = useCallback(() => {
    const interval = setInterval(() => {
      const id = nextHeartId.current++;
      setHearts(prev => [...prev, { 
        id, 
        x: Math.random() * 100, 
        y: 100 
      }]);
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== id));
      }, 4500);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = createFloatingHearts();
    return cleanup;
  }, [createFloatingHearts]);

  useEffect(() => {
    if (showConfetti && (window as any).confetti) {
      const confetti = (window as any).confetti;
      const duration = 6000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 }
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 }
        });
        confetti({
          particleCount: 8,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [showConfetti]);

  return (
    <div className="App" onClick={handleClick} style={{ cursor: 'pointer', minHeight: '100vh' }}>
      {/* Music Control Buttons */}
      <div className="music-controls">
        <button 
          onClick={toggleLoveMusic}
          className="music-toggle love-music-btn"
        >
          {isLoveMusicPlaying ? '🎵 Stop Love Music' : '🎵 Play Love Music'}
        </button>
        
        <button 
          onClick={toggleMeowMusic}
          className="music-toggle meow-music-btn"
        >
          {isMeowMusicPlaying ? '🐱 Stop Meow Music' : '🐱 Play Meow Music'}
        </button>
      </div>

      <div className="hearts-container">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.x}%`,
              bottom: `${heart.y}px`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              fontSize: `${Math.random() * 28 + 18}px`,
            }}
          >
            {Math.random() > 0.5 ? '❤️' : '💖'}
          </div>
        ))}
      </div>

      <div className="floating-cats">
        {floatingCats.map(cat => (
          <div 
            key={cat.id} 
            className="floating-cat-item"
            style={{ 
              left: `${cat.x}%`,
              top: `${cat.y}%`,
              animation: `catFloat 6s linear forwards`
            }}
          >
            {Math.random() > 0.5 ? '🐱' : '😺'}
          </div>
        ))}
      </div>

      {showMeow && (
        <div className="meow-popup">
          {meowText}
        </div>
      )}

      {showLoveMessage && (
        <div className="love-message-popup">
          {loveMessage}
        </div>
      )}

      {birthdayWishes.map((wish, index) => (
        <div key={index} className="birthday-wish">
          {wish}
        </div>
      ))}

      <div className="main-content">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>

        <div className="paw-print paw-1">🐾</div>
        <div className="paw-print paw-2">🐾</div>
        <div className="paw-print paw-3">🐾</div>
        <div className="paw-print paw-4">🐾</div>
        <div className="paw-print paw-5">🐾</div>
        <div className="paw-print paw-6">🐾</div>

        <div className="title-section">
          <h1 className="birthday-title">
            Happy Birthday My Sweet Meow! 🎉🐾😻
          </h1>
          <p className="subtitle">To the love of my life, xyz 💕🐱</p>
          <div className="cat-emoji">😻🎀🐾💖</div>
        </div>

        {!isBirthday ? (
          <div className="countdown-card">
            <h2 className="countdown-title">✨ Countdown to Your Special Day ✨</h2>
            <div className="countdown-timer">
              <div className="time-box">
                <div className="time-number">{timeLeft.days}</div>
                <div className="time-label">Days</div>
              </div>
              <div className="time-box">
                <div className="time-number">{timeLeft.hours}</div>
                <div className="time-label">Hours</div>
              </div>
              <div className="time-box">
                <div className="time-number">{timeLeft.minutes}</div>
                <div className="time-label">Minutes</div>
              </div>
              <div className="time-box">
                <div className="time-number">{timeLeft.seconds}</div>
                <div className="time-label">Seconds</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="birthday-card">
            <h2 className="birthday-alert">🎂 IT'S YOUR BIRTHDAY, MY LOVE! 🎂</h2>
            <p className="birthday-message">Happy Birthday my beautiful kitten! You make every day magical 🐱💖</p>
          </div>
        )}

        <div className="love-meter-container">
          <div className="love-meter-label">💕 Our Love Meter 💕</div>
          <div className="love-meter">
            <div className="love-meter-fill" style={{ width: `${loveMeter}%` }}>
              <span className="love-meter-percent">{loveMeter}%</span>
            </div>
          </div>
          <div className="love-meter-text">
            {loveMeter < 30 && "🐱 Let's fill this with love!"}
            {loveMeter >= 30 && loveMeter < 70 && "💕 Getting warmer! Keep clicking! 💕"}
            {loveMeter >= 70 && loveMeter < 100 && "🎀 Almost full! So much love! 🎀"}
            {loveMeter >= 100 && "💖 LOVE OVERFLOW! You're amazing! 💖"}
          </div>
        </div>

        <div className="mouse-game-container">
          <div className="mouse-game-header">
            <h3>🐭 Catch the Playful Mouse! 🐭</h3>
            <p className="mouse-score">Score: <strong>{mouseScore}</strong> 🎯</p>
          </div>
          <div 
            className="mouse-catcher"
            onClick={catchMouse}
          >
            <div 
              className="running-mouse"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
              }}
            >
              🐭✨
            </div>
          </div>
          <p className="game-instruction-full">✨ Click on the mouse to catch it! It moves around the screen! ✨</p>
        </div>

        <div className="pet-cat-game">
          <h3>🐱 Pet Your Kitty! (Click me!) 🐱</h3>
          <div 
            ref={catPetRef}
            className="big-cat" 
            onClick={petTheCat}
          >
            🐱
          </div>
          <p className="pet-count">Pets given: <strong>{petCount}</strong> 🐾</p>
          <p className="pet-hint">💕 Every 5 pets fills the love meter! 💕</p>
        </div>

        <div className="love-card">
          <p className="click-instruction">
            ✨ Click/Tap anywhere for sweet messages &amp; hearts! ✨
            <span className="quote-timer-hint">💖 Quotes stay for 6 seconds! 💖</span>
          </p>
          
          <div className="love-counter">
            <div className="cat-icon">🐱</div>
            <div className="love-clicks">
              Love Clicks: <span className="click-count">{clicks}</span>
            </div>
            <div className="cat-icon">😻</div>
          </div>

          {showQuote && (
            <div className="quote-popup">
              <div className="quote-icon">💖</div>
              <p className="quote-text">"{currentQuote}"</p>
              <div className="quote-author">— Forever yours, xyz 💕🐾</div>
            </div>
          )}

          <div className="tap-instruction">
            ❤️ Keep clicking for more love and fill the meter! ❤️
          </div>
        </div>

        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
        <div className="blur-circle circle-3"></div>
      </div>

      <div className="footer-note">
        Made with endless love and lots of meows for my favorite girl 🐱💖
      </div>
    </div>
  );
}

export default App;
