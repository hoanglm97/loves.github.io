import { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { gsap } from 'gsap';
import Confetti from 'react-confetti';
import './index.css';

const App = () => {
    const [page, setPage] = useState(0);
    const [showEnvelope, setShowEnvelope] = useState(true);
    const [showBigEnvelope, setShowBigEnvelope] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const envelopeRef = useRef(null);
    const flapRef = useRef(null);
    const bigEnvelopeRef = useRef(null);
    const bigFlapRef = useRef(null);
    const storyRef = useRef(null);
    const noButtonRef = useRef(null);
    const typedRef = useRef(null);
    const [disagreeText, setDisagreeText] = useState("Không đồng ý")
    const stories = [
        "Từ ngày gặp em, anh biết thế nào là yêu. Em như ánh nắng làm trái tim anh ấm áp mỗi ngày.",
        "Nụ cười của em là thứ anh muốn thấy mỗi sáng, như cách hoa hướng dương luôn hướng về mặt trời.",
        "Anh không hứa cho em cả thế giới, nhưng anh hứa sẽ dành cả trái tim để yêu thương và che chở cho em."
    ];

    // Animate hearts
    useEffect(() => {
        gsap.utils.toArray('.heart').forEach((heart, i) => {
            gsap.to(heart, {
                y: -30,
                opacity: 0.2,
                duration: 3 + i,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.5
            });
        });
    }, []);

    // Animate small envelope flap on open
    useEffect(() => {
        if (page === 1 && envelopeRef.current && flapRef.current) {
            gsap.to(flapRef.current, {
                rotateX: 180,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to(envelopeRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 0.8,
                onComplete: () => {
                    setShowEnvelope(false);
                    setShowBigEnvelope(true);
                }
            });
        }
    }, [page]);

    // Animate big envelope flap on open
    useEffect(() => {
        if (showBigEnvelope && bigEnvelopeRef.current && bigFlapRef.current) {
            gsap.to(bigFlapRef.current, {
                rotateX: 180,
                duration: 1.5,
                ease: 'power2.out'
            });
            gsap.to(bigEnvelopeRef.current, {
                scale: 1,
                opacity: 1,
                duration: 1,
                delay: 0.5,
                onComplete: () => setPage(2)
            });
        }
    }, [showBigEnvelope]);

    // Typing effect for story
    useEffect(() => {
        if (page >= 2 && page <= 4 && storyRef.current) {
            if (typedRef.current) {
                typedRef.current.destroy();
            }
            typedRef.current = new Typed(storyRef.current, {
                strings: [stories[page - 2]],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    gsap.to(storyRef.current, { opacity: 1, duration: 0.5 });
                }
            });
        }

        return () => {
            if (typedRef.current) {
                typedRef.current.destroy();
            }
        };
    }, [page]);

    // Handle button jump on hover
    const handleHover = () => {
        if (noButtonRef.current) {
            const envelopeWidth = 600;
            const envelopeHeight = 400;
            const buttonWidth = 160;
            const buttonHeight = 60;

            const maxX = envelopeWidth - buttonWidth - 40;
            const maxY = envelopeHeight - buttonHeight - 40;
            const newX = Math.random() * maxX - maxX / 2;
            const newY = Math.random() * maxY - maxY / 2;

            gsap.to(noButtonRef.current, {
                x: newX,
                y: newY,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    const handleAgree = () => {
        setShowConfetti(true);
        setTimeout(() => {
            alert("Yay! Em đồng ý rồi, anh hạnh phúc nhất luôn! ❤️");
            setShowBigEnvelope(false);
            setShowFinalMessage(true);
        }, 500);
    };
    const handleDisAgree = () => {
        setDisagreeText("Tada làm gì có chuyện từ chốiiii, hehe em phải đồng ý")
        setShowConfetti(true);
        setTimeout(() => {
            alert("Yay! Em đồng ý rồi, anh hạnh phúc nhất luôn! ❤️");
            setShowBigEnvelope(false);
            setShowFinalMessage(true);
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            {showConfetti && !showFinalMessage && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.2}
                    colors={['#ff4d4f', '#ff99cc', '#ffffff', '#ffd700']}
                />
            )}
            {showEnvelope && (
                <div ref={envelopeRef} className="envelope">
                    <div ref={flapRef} className="envelope-flap"></div>
                    <button
                        onClick={handleNext}
                        className="heart-button bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 hover:scale-110 animate-pulse"
                    >
                        ❤️ Mở thư
                    </button>
                </div>
            )}
            {showBigEnvelope && (
                <div ref={bigEnvelopeRef} className="big-envelope">
                    <div ref={bigFlapRef} className="big-envelope-flap"></div>
                    <div className="big-envelope-content">
                        {page >= 2 && page <= 4 && (
                            <>
                                <p ref={storyRef} className="story-text text-xl text-pink-800 mb-10 font-handwritten leading-relaxed"></p>
                                <button
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-pink-600 hover:to-rose-600 transition transform hover:scale-110"
                                >
                                    Tiếp tục
                                </button>
                            </>
                        )}
                        {page === 5 && (
                            <>

                                <p className="text-4xl text-red-600 mb-10 font-handwritten font-bold animate-bounce">
                                    MinhHoang ❤️ MyLinh
                                </p>
                                <button
                                        onClick={handleAgree}
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-10 py-5 rounded-full shadow-lg hover:from-green-500 hover:to-emerald-600 transition transform hover:scale-110 animate-pulse text-center"
                                    >
                                        Đồng ý đi mà 🥺
                                        </button>

                                <div className="relative w-full flex justify-center">
                                    <button
                                            onClick={handleDisAgree}
                                            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-10 py-5 rounded-full shadow-lg hover:from-green-500 hover:to-emerald-600 transition transform hover:scale-110 animate-pulse text-center"
                                        >
                                            {disagreeText}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {showFinalMessage && (
                <div className="final-message">
                    <p className="text-5xl text-red-600 font-handwritten font-bold">
                        Lê Minh Hoàng ❤️ Nguyễn Thị Mỹ Linh
                    </p>
                </div>
            )}
        </div>
    );
};

export default App;