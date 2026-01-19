'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Info,
    Layout,
    Hourglass,
    ArrowLeft,
    Sparkles,
    Blocks,
    Navigation,
    Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const FloatingShape = ({ className, delay = 0, duration = 20 }: { className: string, delay?: number, duration?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 45, 0]
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className={className}
    />
);

export function FeatureComingSoon({ title = "Feature Coming Soon", description = "We're currently architecting a sophisticated experience for this part of the event. Unparalleled insights and premium content are on the horizon." }: { title?: string, description?: string }) {
    const router = useRouter();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="h-full min-h-[80vh] w-full bg-[#000514] flex items-center justify-center p-4 md:p-8 xl:p-12 overflow-hidden relative rounded-3xl">
            {/* Immersive Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <FloatingShape
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[160px]"
                    duration={25}
                />
                <FloatingShape
                    className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[160px]"
                    delay={2}
                    duration={30}
                />
                <FloatingShape
                    className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]"
                    delay={5}
                    duration={20}
                />

                {/* Particle Overlay (CSS Stars) */}
                <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{
                                x: Math.random() * 100 + '%',
                                y: Math.random() * 100 + '%',
                                opacity: Math.random()
                            }}
                            animate={{
                                opacity: [0.1, 0.8, 0.1],
                                scale: [0.5, 1.5, 0.5]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl w-full relative z-10"
            >
                <Card className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(30,58,138,0.2)] overflow-hidden rounded-[2.5rem]">
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-500 to-emerald-400" />

                    <CardContent className="p-8 md:p-16 flex flex-col items-center">
                        {/* Header Icon Section */}
                        <motion.div variants={itemVariants} className="relative mb-12">
                            <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Blocks className="w-14 h-14 md:w-16 md:h-16 text-blue-400 group-hover:rotate-12 transition-transform duration-500" />
                                <motion.div
                                    className="absolute -top-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg border border-emerald-400"
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Status Batch */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-blue-300 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Under Reconstruction
                        </motion.div>

                        {/* Title Section */}
                        <motion.div variants={itemVariants} className="max-w-2xl text-center space-y-6">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                                {title.split(' ').slice(0, -1).join(' ')} <br />
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                                    {title.split(' ').slice(-1)}
                                </span>
                            </h1>

                            <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium mx-auto max-w-lg">
                                {description}
                            </p>
                        </motion.div>

                        {/* Feature Grid */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-16"
                        >
                            {[
                                { icon: Navigation, title: 'Smart Sync', desc: 'Real-time routing', color: 'blue' },
                                { icon: Globe, title: 'Global Live', desc: 'Cross-platform', color: 'emerald' },
                                { icon: Info, title: 'Deep Insights', desc: 'Data intelligence', color: 'indigo' }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-[1.5rem] p-6 text-center group transition-all duration-500 cursor-default flex flex-col items-center"
                                >
                                    <div className={`w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20`}>
                                        <feature.icon className={`w-6 h-6 text-blue-400`} />
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{feature.desc}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Action Section */}
                        <motion.div variants={itemVariants} className="mt-16 w-full flex flex-col items-center gap-4">
                            <Button
                                onClick={() => router.back()}
                                size="lg"
                                className="group relative h-16 px-10 rounded-[1.25rem] bg-white text-slate-950 hover:bg-slate-200 font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex items-center gap-3">
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                    Go Back
                                </div>
                            </Button>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                                Secure Transmission • Argyle Global
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Glassy Floating Nav (Mock) */}
            <div className="absolute bottom-8 flex gap-3 z-10 scale-90 md:scale-100">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-3 h-3 rounded-full bg-white/10 border border-white/5" />
                ))}
            </div>
        </div>
    );
}
