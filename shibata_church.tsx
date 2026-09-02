import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Clock, MapPin, Coffee, 
  Heart, BookOpen, Car, DoorOpen, Quote,
  ChevronRight, Menu, X, AlertCircle,
  Youtube, PlayCircle, Users, HelpCircle, Baby
} from 'lucide-react';

// スクロール時にフワッと表示させるためのカスタムフック
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-stone-800 selection:bg-amber-100 selection:text-amber-900">
      
      {/* 導線ナビゲーション */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="font-serif font-bold text-lg tracking-wider flex items-center gap-2 text-stone-800">
              <span className="text-amber-700 text-xl">🍞</span> 
              <span className="hidden sm:inline">新発田いのちのパンチャーチ</span>
              <span className="sm:hidden">いのちのパンチャーチ</span>
            </div>
            {isScrolled && (
               <span className="hidden md:block text-[10px] text-stone-500 mt-0.5 tracking-widest font-medium">
                 パン屋じゃない。でも、心が空腹な人のための場所。
               </span>
            )}
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-stone-600">
            <button onClick={() => scrollTo('empathy')} className="hover:text-amber-700 transition-colors">今の悩みから探す</button>
            <button onClick={() => scrollTo('first-timers')} className="hover:text-amber-700 transition-colors">初めての方へ</button>
            <button onClick={() => scrollTo('philosophy')} className="hover:text-amber-700 transition-colors">いのちのパンとは</button>
            <button onClick={() => scrollTo('steps')} className="px-4 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors">一歩を踏み出す</button>
          </div>

          <button 
            className="md:hidden text-stone-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-lg py-4 px-4 flex flex-col gap-4">
            <button onClick={() => scrollTo('empathy')} className="text-left py-2 text-stone-600 font-medium">今の悩みから探す</button>
            <button onClick={() => scrollTo('first-timers')} className="text-left py-2 text-stone-600 font-medium">初めての方へ</button>
            <button onClick={() => scrollTo('philosophy')} className="text-left py-2 text-stone-600 font-medium">いのちのパンとは</button>
            <button onClick={() => scrollTo('steps')} className="text-left py-2 text-amber-700 font-bold">一歩を踏み出す</button>
          </div>
        )}
      </nav>

      {/* Hero: 圧倒的な受容 */}
      <header className="relative min-h-[90vh] flex items-center pt-20 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000" 
            alt="温かいコーヒーと食卓" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <FadeInSection>
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-stone-100/80 backdrop-blur border border-stone-200 text-stone-600 text-sm font-medium tracking-wider mb-6">
                パン屋じゃない。でも、心が空腹な人のための場所。
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-900 leading-[1.2] mb-8 tracking-wide">
                信じる前に、<br />来ていい。
              </h1>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-10 font-serif">
                聖書を知らなくても。教会が初めてでも。<br className="hidden md:block" />
                まだ神様を信じていなくても、大丈夫です。<br className="hidden md:block" />
                ひと息つける場所が、ここにあります。
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button 
                  onClick={() => scrollTo('empathy')}
                  className="w-full sm:w-auto px-8 py-4 bg-amber-700 text-white rounded-full font-medium tracking-wide hover:bg-amber-800 transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  まずは、少し知ってみる
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </header>

      {/* 追加①：「来ない理由」を先回りする（共感） */}
      <section id="empathy" className="py-20 px-4 bg-stone-900 text-stone-100">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">もしかして、こんな風に思っていませんか？</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {[
                "「クリスチャンじゃないと浮きそう…」",
                "「強引に勧誘されそうで怖い」",
                "「聖書なんて一度も読んだことがない」",
                "「自分には関係ない場所な気がする」",
                "「行ったら何をするのか分からなくて不安」"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
                  <CheckCircle2 className="w-5 h-5 text-stone-500 shrink-0" />
                  <span className="text-stone-300 font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="text-center bg-amber-900/20 border border-amber-700/30 p-8 rounded-2xl max-w-3xl mx-auto">
              <p className="text-lg md:text-xl font-serif leading-relaxed text-amber-50">
                実は、<span className="text-amber-400 font-bold">初めて来る方のほとんどが、その状態</span>です。<br/><br/>
                ここは「すでに信じている人」だけが集まる場所ではありません。<br/>
                人生の途中でふと立ち止まりたくなった人、<br/>
                心が少し空腹を感じている人のための場所です。
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 追加②：人ではなく「人生課題」を見せる */}
      <section className="py-24 px-4 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-amber-600 font-bold tracking-wider text-sm mb-2 block">FOR YOUR LIFE</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">今のあなたに必要なものは？</h2>
              <p className="text-stone-500">私たちは、あなたの「人生の今の季節」に寄り添います。</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Baby,
                title: "子育てに疲れている",
                desc: "同じように子育て奮闘中の親たちがいます。泣いても大丈夫なスペースがあり、親がひと息つける時間を大切にしています。"
              },
              {
                icon: Users,
                title: "孤独を感じている",
                desc: "無理に話さなくても大丈夫。でも、美味しいコーヒーを飲みながら、同じ空間を共有する温かさがここにはあります。"
              },
              {
                icon: BookOpen,
                title: "将来が不安・意味を探している",
                desc: "2000年前から読み継がれてきた聖書。そこには、流行り廃りのない、あなたの人生の土台となる変わらない言葉があります。"
              },
              {
                icon: Heart,
                title: "ただ、誰かに祈ってほしい",
                desc: "上手く言葉にならなくても大丈夫です。抱えている重荷を一緒に担い、あなたのために祈る人たちがいます。"
              }
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-stone-100 h-full hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-6 border border-stone-100 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-stone-800">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4つの安心（既存・不安解消） */}
      <section id="first-timers" className="py-24 px-4 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">初めての方へ（4つの安心）</h2>
              <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
                それでも知らない場所に行くのは緊張するものです。<br/>
                少しでも安心していただけるよう、教会のリアルをお伝えします。
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeInSection delay={100}>
              <div className="bg-white p-8 rounded-2xl border border-stone-100 flex gap-6 items-start shadow-sm">
                <div className="bg-amber-100 p-3 rounded-full shrink-0"><CheckCircle2 className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <h3 className="font-bold text-xl mb-2">服装は自由です</h3>
                  <p className="text-stone-600 leading-relaxed">スーツを着る必要は全くありません。買い物に行くような普段着で、リラックスしてお越しください。</p>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection delay={200}>
              <div className="bg-white p-8 rounded-2xl border border-stone-100 flex gap-6 items-start shadow-sm">
                <div className="bg-amber-100 p-3 rounded-full shrink-0"><CheckCircle2 className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <h3 className="font-bold text-xl mb-2">献金は完全自由（入場無料）</h3>
                  <p className="text-stone-600 leading-relaxed">入場料はありません。礼拝中に献金カゴが回ってきても、初めての方はそのまま隣へ回していただいてOKです。</p>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection delay={300}>
              <div className="bg-white p-8 rounded-2xl border border-stone-100 flex gap-6 items-start shadow-sm">
                <div className="bg-amber-100 p-3 rounded-full shrink-0"><CheckCircle2 className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <h3 className="font-bold text-xl mb-2">手ぶらでOK</h3>
                  <p className="text-stone-600 leading-relaxed">聖書や歌集など、必要なものはすべて教会でお貸しします。事前の知識や準備は一切不要です。</p>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection delay={400}>
              <div className="bg-white p-8 rounded-2xl border border-stone-100 flex gap-6 items-start shadow-sm">
                <div className="bg-amber-100 p-3 rounded-full shrink-0"><CheckCircle2 className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <h3 className="font-bold text-xl mb-2">途中で帰っても大丈夫</h3>
                  <p className="text-stone-600 leading-relaxed">体調がすぐれない時や、予定がある時は、礼拝の途中でも自由に退席いただけます。</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* いのちのパンとは（Philosophy） */}
      <section id="philosophy" className="py-32 px-4 bg-stone-900 text-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=2000" 
            alt="Dark bread texture" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/90 to-stone-900" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <FadeInSection>
            <h2 className="text-amber-500 font-bold tracking-widest text-sm mb-6 uppercase">Philosophy</h2>
            <h3 className="text-2xl md:text-4xl font-serif leading-relaxed mb-12">
              パン屋じゃない。<br/>でも、心が空腹な人のための場所。
            </h3>
            
            <div className="space-y-8 text-lg md:text-xl font-serif leading-loose text-stone-300">
              <p>人は、お腹が空けば食べ物を探します。</p>
              <p>では、心やたましいが空腹になったときは、<br className="hidden md:block"/>どこへ行けばよいのでしょうか。</p>
              <p className="pt-4 text-white">私たちは、イエス・キリストの言葉の中に、<br className="hidden md:block"/>本当の満たしがあると信じています。</p>
            </div>

            <blockquote className="mt-20 text-xl md:text-3xl font-serif text-amber-100/90 leading-relaxed border-l-2 border-amber-500/50 pl-8 py-2 text-left max-w-2xl mx-auto">
              「わたしがいのちのパンです。わたしに来る者は決して飢えることがなく、わたしを信じる者はどんなときにも、決して渇くことがありません。」
              <footer className="text-base mt-6 text-stone-400 font-sans">— ヨハネの福音書 6章35節（新改訳2017）</footer>
            </blockquote>
          </FadeInSection>
        </div>
      </section>

      {/* アクセス情報（短めに） */}
      <section id="access" className="py-24 px-4 bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <FadeInSection>
             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">アクセス</h2>
             <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                <div>
                  <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                  <p className="font-bold text-lg mb-2">新潟県新発田市〇〇町 1-2-3</p>
                  <p className="text-stone-500">駐車場10台完備 / 新発田駅から車でX分</p>
                </div>
                <div>
                  <Clock className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                  <p className="font-bold text-lg mb-2">日曜礼拝</p>
                  <p className="text-stone-500">毎週日曜日 10:30 〜 12:00</p>
                </div>
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* 追加③：CTA 3段階化（来訪以外の指標・選択肢） */}
      <section id="steps" className="py-24 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">あなたのペースで、一歩ずつ。</h2>
              <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
                いきなり教会に来る必要はありません。<br/>
                今のあなたに合った方法で、少しだけ触れてみませんか。
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1 */}
            <FadeInSection delay={100}>
              <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-sm h-full flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-6">
                  <span className="font-bold text-lg">1</span>
                </div>
                <h3 className="font-bold text-xl mb-4">雰囲気を知る</h3>
                <p className="text-stone-500 text-sm mb-8 flex-grow">
                  「どんな話をしているの？」<br/>まずはYouTubeで、牧師のメッセージや教会の雰囲気をご覧ください。
                </p>
                <a href="#" className="w-full py-3 px-4 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" /> YouTubeを見る
                </a>
              </div>
            </FadeInSection>

            {/* Level 2 */}
            <FadeInSection delay={200}>
              <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-sm h-full flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-6">
                  <span className="font-bold text-lg">2</span>
                </div>
                <h3 className="font-bold text-xl mb-4">関心を持つ</h3>
                <p className="text-stone-500 text-sm mb-8 flex-grow">
                  「行ってみようかな…」<br/>でも不安がある方は、よくある質問を読んだり、公式LINEからお気軽にご質問ください。
                </p>
                <a href="#" className="w-full py-3 px-4 bg-[#06C755]/10 text-[#06C755] hover:bg-[#06C755]/20 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                  <HelpCircle className="w-4 h-4" /> LINEで質問する
                </a>
              </div>
            </FadeInSection>

            {/* Level 3 */}
            <FadeInSection delay={300}>
              <div className="bg-white p-8 rounded-2xl border-2 border-amber-600 shadow-md h-full flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  おすすめ
                </div>
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mb-6">
                  <span className="font-bold text-lg">3</span>
                </div>
                <h3 className="font-bold text-xl mb-4">礼拝に行ってみる</h3>
                <p className="text-stone-500 text-sm mb-8 flex-grow">
                  「心が空腹かもしれない」<br/>そう感じたら、次の日曜日に、そのままのあなたで足を運んでみてください。
                </p>
                <button onClick={() => scrollTo('access')} className="w-full py-3 px-4 bg-amber-600 text-white hover:bg-amber-700 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" /> 礼拝の案内を見る
                </button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 text-center border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="font-serif text-xl text-white mb-2 flex justify-center items-center gap-2">
            <span>🍞</span> 新発田いのちのパンチャーチ
          </div>
          <p className="text-sm text-stone-400 mb-8 tracking-widest">パン屋じゃない。でも、心が空腹な人のための場所。</p>
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Shibata Bread of Life Church. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        .font-serif { font-family: 'Noto Serif JP', serif; }
        .font-sans { font-family: 'Noto Sans JP', sans-serif; }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
};

export default App;