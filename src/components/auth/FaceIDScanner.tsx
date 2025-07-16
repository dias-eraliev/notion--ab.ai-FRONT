import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Обращение к глобальной переменной face-api, которая добавлена через CDN
declare const faceapi: any;

interface FaceIDScannerProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const FaceIDScanner: React.FC<FaceIDScannerProps> = ({ onSuccess, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    // Загрузка моделей и запуск камеры
    useEffect(() => {
        const loadModelsAndStartVideo = async () => {
            try {
                // Пути к моделям через CDN
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);

                setModelsLoaded(true);
                startVideo();
            } catch (error) {
                console.error('Error loading models:', error);
            }
        };

        loadModelsAndStartVideo();

        // Очистка при размонтировании
        return () => {
            stopVideoStream();
        };
    }, []);

    // Функция запуска видео
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error('Error accessing camera:', err));
    };

    // Функция остановки видеопотока
    const stopVideoStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();

            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            console.log('Camera stopped');
        }
    };

    // Обработчики успеха и отмены с остановкой видео
    const handleSuccess = () => {
        stopVideoStream();
        onSuccess();
    };

    const handleCancel = () => {
        stopVideoStream();
        onCancel();
    };

    // Функция распознавания лица
    useEffect(() => {
        if (!modelsLoaded || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        let recognitionInterval: number | null = null;
        let progressInterval: number | null = null;

        const setupRecognition = () => {
            // Установка размеров canvas для соответствия видео
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            // Настройка прогресс-бара для демонстрации
            let progress = 0;
            progressInterval = window.setInterval(() => {
                progress += 2;
                setScanProgress(Math.min(progress, 100));

                // После заполнения прогресс-бара вызываем onSuccess
                if (progress >= 100) {
                    if (progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = null;
                    }
                    setTimeout(() => {
                        handleSuccess();
                    }, 500);
                }
            }, 100);

            // Запуск распознавания
            recognitionInterval = window.setInterval(async () => {
                // Обнаружение лица и его характеристик
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                // Отрисовка результатов на canvas
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Отрисовка обрамления лица, точек и эмоций
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

                    // Добавление прямоугольника для глаз
                    if (resizedDetections && resizedDetections.length > 0) {
                        const landmarks = resizedDetections[0].landmarks;
                        const eyePositions = landmarks.getLeftEye();

                        ctx.strokeStyle = '#00FF00';
                        ctx.lineWidth = 2;

                        // Выделение области глаз
                        if (eyePositions.length > 0) {
                            const leftMostPoint = Math.min(...eyePositions.map(p => p.x));
                            const rightMostPoint = Math.max(...eyePositions.map(p => p.x));
                            const topMostPoint = Math.min(...eyePositions.map(p => p.y));
                            const bottomMostPoint = Math.max(...eyePositions.map(p => p.y));

                            ctx.strokeRect(
                                leftMostPoint - 10,
                                topMostPoint - 10,
                                rightMostPoint - leftMostPoint + 20,
                                bottomMostPoint - topMostPoint + 20
                            );

                            // Добавление текста "Сканирование глаз"
                            ctx.font = '16px Arial';
                            ctx.fillStyle = '#00FF00';
                            ctx.fillText('Сканирование глаз', leftMostPoint - 10, topMostPoint - 15);
                        }

                        // Выделение области рта
                        const mouthPositions = landmarks.getMouth();
                        if (mouthPositions.length > 0) {
                            const leftMostPoint = Math.min(...mouthPositions.map(p => p.x));
                            const rightMostPoint = Math.max(...mouthPositions.map(p => p.x));
                            const topMostPoint = Math.min(...mouthPositions.map(p => p.y));
                            const bottomMostPoint = Math.max(...mouthPositions.map(p => p.y));

                            ctx.strokeStyle = '#FFFF00';
                            ctx.strokeRect(
                                leftMostPoint - 10,
                                topMostPoint - 10,
                                rightMostPoint - leftMostPoint + 20,
                                bottomMostPoint - topMostPoint + 20
                            );

                            // Добавление текста "Анализ улыбки"
                            ctx.font = '16px Arial';
                            ctx.fillStyle = '#FFFF00';
                            ctx.fillText('Анализ улыбки', leftMostPoint - 10, bottomMostPoint + 25);
                        }
                    }
                }
            }, 100);
        };

        // Настраиваем распознавание когда видео начинает воспроизводиться
        video.addEventListener('play', setupRecognition);

        // Очистка при размонтировании компонента
        return () => {
            if (recognitionInterval) {
                clearInterval(recognitionInterval);
            }
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            stopVideoStream();
        };
    }, [modelsLoaded, onSuccess]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white rounded-xl overflow-hidden shadow-xl p-2 max-w-xl w-full"
            >
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto rounded-lg"
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                    />

                    {/* Прогресс-бар сканирования */}
                    <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-2">
                        <motion.div
                            className="bg-corporate-primary h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold text-center text-corporate-primary">
                        Сканирование лица
                    </h3>
                    <p className="text-center text-gray-600">
                        Пожалуйста, смотрите прямо в камеру для завершения аутентификации
                    </p>

                    <div className="flex justify-center mt-4 space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="px-6 py-2 text-corporate-primary border border-corporate-primary rounded-lg"
                        >
                            Отмена
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FaceIDScanner;